from math import ceil
from typing import Any

from .core_objects import BlockPool, KVTensor, Sequence
from .paged_attention import TOKENS_PER_BLOCK, append_kv


def prefill(prompt_token_ids: list[int], block_ids: list[int]) -> None:
    """Run the prompt through the model and fill its KV blocks."""
    ...


def send_kv(block_ids: list[int], decode_worker: Any) -> None:
    """Send KV blocks and their table to a decode worker."""
    ...


def prefill_worker(
    prompt_token_ids: list[int],
    block_pool: BlockPool,
    decode_worker_handle: Any,
) -> list[int]:
    """Prefill a prompt and send its KV blocks to a decode worker."""
    block_count = ceil(len(prompt_token_ids) / TOKENS_PER_BLOCK)
    block_ids = [block_pool.allocate_block() for _ in range(block_count)]
    prefill(prompt_token_ids=prompt_token_ids, block_ids=block_ids)
    send_kv(block_ids=block_ids, decode_worker=decode_worker_handle)
    return block_ids


def decode_worker(
    block_ids: list[int],
    block_pool: BlockPool,
    max_new_tokens: int,
) -> None:
    """Continue token-by-token decoding from received KV blocks."""
    sequence = Sequence(tokens=[], block_table=block_ids)
    for _ in range(max_new_tokens):
        logits = decode(sequence=sequence)
        token_id = sample(logits=logits)
        kv: KVTensor = project(sequence=sequence, token_id=token_id)
        append_kv(sequence=sequence, kv=kv, block_pool=block_pool)
