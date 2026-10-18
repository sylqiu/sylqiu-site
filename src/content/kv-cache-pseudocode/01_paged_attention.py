from copy import copy

from .core_objects import BlockPool, KVTensor, Sequence

TOKENS_PER_BLOCK = 4


def ensure_private_block(
    sequence: Sequence,
    logical_block: int,
    block_pool: BlockPool,
) -> int:
    """Return a physical block this sequence may modify, copying if shared."""
    block_id = sequence.block_table[logical_block]
    block = block_pool[block_id]
    if block.refs == 1:
        return block_id

    private_id = block_pool.allocate_block()
    copy(block, block_pool[private_id])
    block.refs -= 1
    sequence.block_table[logical_block] = private_id
    return private_id


def write_kv(
    sequence: Sequence,
    logical_block: int,
    token_position: int,
    kv: KVTensor,
    block_pool: BlockPool,
) -> None:
    """Write one packed KV pair into a logical block, copying it if shared."""
    block_id = ensure_private_block(sequence, logical_block, block_pool)
    block_pool[block_id].slots[token_position % TOKENS_PER_BLOCK] = kv


def append_kv(
    sequence: Sequence,
    kv: KVTensor,
    block_pool: BlockPool,
) -> None:
    """Append one packed KV pair at the sequence's next token position."""
    if sequence.num_tokens % TOKENS_PER_BLOCK == 0:
        sequence.block_table.append(block_pool.allocate_block())

    logical_block = len(sequence.block_table) - 1
    write_kv(sequence, logical_block, sequence.num_tokens, kv, block_pool)
    sequence.num_tokens += 1
