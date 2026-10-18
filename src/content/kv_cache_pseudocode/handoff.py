import asyncio
from math import ceil

from .core_objects import BlockPool, Sequence
from .paged_attention import TOKENS_PER_BLOCK


async def prefill(
    prompt_token_ids: list[int],
    block_ids: list[int],
    block_pool: BlockPool,
) -> Sequence:
    """Run the prompt through the model and fill its KV blocks."""
    sequence = Sequence(
        tokens=prompt_token_ids,
        block_table=block_ids,
        block_pool=block_pool,
        state="waiting",
        prompt_len=len(prompt_token_ids),
    )
    await sequence.prefill(chunk_size=len(prompt_token_ids))
    return sequence


async def send_kv(block_ids: list[int], decode_worker: "DecodeWorker") -> None:
    """Send KV blocks and their table to a decode worker."""
    await asyncio.sleep(0)  # the transfer itself is device/network work
    decode_worker.block_ids = list(block_ids)


async def prefill_worker(
    prompt_token_ids: list[int],
    block_pool: BlockPool,
    decode_worker_handle: "DecodeWorker",
) -> tuple[Sequence, asyncio.Task]:
    """Prefill a prompt and start the KV transfer without blocking."""
    block_count = ceil(len(prompt_token_ids) / TOKENS_PER_BLOCK)
    block_ids = [block_pool.allocate_block() for _ in range(block_count)]
    sequence = await prefill(prompt_token_ids, block_ids, block_pool)
    transfer_task = asyncio.create_task(
        send_kv(block_ids=block_ids, decode_worker=decode_worker_handle)
    )
    return sequence, transfer_task


class DecodeWorker:
    """Receive a block table, then decode against the transferred KV."""

    def __init__(self, block_pool: BlockPool, max_new_tokens: int = 1) -> None:
        self.block_pool = block_pool
        self.max_new_tokens = max_new_tokens
        self.block_ids: list[int] = []

    async def run(self, transfer_task: asyncio.Task) -> Sequence:
        await transfer_task
        sequence = Sequence(
            tokens=[],
            block_table=list(self.block_ids),
            num_tokens=sum(self.block_pool[i].fill for i in self.block_ids),
            state="decoding",
            block_pool=self.block_pool,
            max_new_tokens=self.max_new_tokens,
        )
        while not sequence.finished:
            await sequence.decode()
        return sequence
