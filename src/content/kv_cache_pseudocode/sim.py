"""Run the toy serving loop and emit the frames used by the illustration.

    cd src/content && python3 -m kv_cache_pseudocode.sim > kv-cache-frames.json
"""

from __future__ import annotations

import asyncio
import json
from math import ceil

from .core_objects import KVBlock, Sequence, TOKENS_PER_BLOCK
from .radix_attention import PrefixCache


class PagedBlockPool:
    """Concrete physical pool with a FIFO free list and reference counts."""

    def __init__(self, size: int = 8) -> None:
        self.blocks = [
            KVBlock(block_id=i, refs=0, slots=[None] * TOKENS_PER_BLOCK)
            for i in range(size)
        ]
        self.free = list(range(size))

    def __getitem__(self, block_id: int) -> KVBlock:
        return self.blocks[block_id]

    def allocate_block(self) -> int:
        if not self.free:
            raise MemoryError("KV pool exhausted")
        block_id = self.free.pop(0)
        block = self.blocks[block_id]
        block.refs = 1
        block.slots = [None] * TOKENS_PER_BLOCK
        return block_id

    def retain_blocks(self, block_ids: list[int]) -> None:
        for block_id in block_ids:
            self.blocks[block_id].refs += 1

    def free_block(self, block_id: int) -> None:
        block = self.blocks[block_id]
        block.refs -= 1
        if block.refs == 0:
            block.slots = [None] * TOKENS_PER_BLOCK
            self.free.append(block_id)

    def free_sequence(self, sequence: Sequence) -> None:
        for block_id in dict.fromkeys(sequence.block_table):
            self.free_block(block_id)
        sequence.block_table = []

    def can_allocate(self, sequence: Sequence) -> bool:
        needed = ceil(len(sequence.tokens) / TOKENS_PER_BLOCK)
        return len(self.free) >= max(0, needed - len(sequence.block_table))


def snapshot(
    pool: PagedBlockPool,
    sequences: list[Sequence],
    log: list[str],
) -> dict:
    owners: dict[int, list[str]] = {block.block_id: [] for block in pool.blocks}
    for sequence in sequences:
        for block_id in dict.fromkeys(sequence.block_table):
            owners[block_id].append(sequence.request_id)

    return {
        "blocks": [
            {
                "id": block.block_id,
                "refs": block.refs,
                "fill": block.fill,
                "owners": owners[block.block_id],
            }
            for block in pool.blocks
        ],
        "seqs": [
            {
                "id": sequence.request_id,
                "promptLen": sequence.prompt_len,
                "decodeTotal": sequence.max_new_tokens,
                "produced": sequence.produced,
                "table": list(sequence.block_table),
                "phase": (
                    "done"
                    if sequence.finished
                    else "decode"
                    if sequence.state == "decoding"
                    else "waiting"
                ),
            }
            for sequence in sequences
        ],
        "log": list(log),
    }


async def build_frames() -> list[dict]:
    pool = PagedBlockPool(size=8)
    cache = PrefixCache()
    sequences: list[Sequence] = []
    log: list[str] = []
    frames: list[dict] = []

    def snap() -> None:
        frames.append(snapshot(pool, sequences, log))

    snap()  # step 0: empty schedule

    prompt_a = [11, 12, 13, 14, 15, 16]
    a = Sequence(
        tokens=list(prompt_a),
        block_pool=pool,
        state="waiting",
        max_new_tokens=2,
        next_token=101,
        request_id="A",
        prompt_len=len(prompt_a),
    )
    await a.prefill(chunk_size=4)
    cache.insert(prompt_a, a.block_table)
    sequences.append(a)
    log.append("A prefill complete → blocks 0–1")
    snap()

    b = Sequence(
        tokens=list(prompt_a),
        block_pool=pool,
        state="waiting",
        max_new_tokens=2,
        next_token=201,
        request_id="B",
        prompt_len=len(prompt_a),
    )
    node, matched = cache.match(b.tokens)
    if matched != len(b.tokens):
        raise AssertionError("B should hit A's full prompt prefix")
    b.block_table = list(node.block_ids)
    pool.retain_blocks(b.block_table)
    b.num_tokens = matched
    b.state = "decoding"
    sequences.append(b)
    log.append("B prefix hit → shares 0–1")
    snap()

    before = a.block_table[1]
    await a.decode()
    after = a.block_table[1]
    if after != before:
        log.append(f"A decode · COW block {before} → {after}")
    else:
        log.append(f"A decode · writes block {after}")
    snap()

    await b.decode()
    log.append("B decode · writes block 1 in place")
    snap()

    await a.decode()
    log.append("A hits max_new_tokens · done")
    snap()

    prompt_c = [21, 22, 23, 24, 25]
    c = Sequence(
        tokens=list(prompt_c),
        block_pool=pool,
        state="waiting",
        max_new_tokens=1,
        next_token=301,
        request_id="C",
        prompt_len=len(prompt_c),
    )
    c.block_table = [
        pool.allocate_block() for _ in range(ceil(len(prompt_c) / TOKENS_PER_BLOCK))
    ]
    await c.prefill(chunk_size=len(prompt_c))
    sequences.append(c)
    log.append("C prefill complete → blocks 3–4")
    snap()

    await c.decode()
    log.append("C decode · done")
    snap()

    await b.decode()
    log.append("B decode · done")
    snap()

    return frames


def main() -> None:
    frames = asyncio.run(build_frames())
    payload = {
        "workload": {"tokensPerBlock": TOKENS_PER_BLOCK, "poolSize": 8},
        "frames": frames,
    }
    print(json.dumps(payload, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
