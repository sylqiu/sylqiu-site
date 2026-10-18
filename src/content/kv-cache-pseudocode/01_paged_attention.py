from copy import copy

from .core_objects import BlockPool, KVTensor, Sequence, Tensor

B = 4  # tokens per block


def append_kv(
    seq: Sequence,
    k: Tensor,
    v: Tensor,
    pool: BlockPool,
) -> None:
    if seq.len % B == 0:
        seq.table.append(pool.alloc())   # logical -> physical
    blk = seq.table[-1]
    pool[blk].slots[seq.len % B] = (k, v)
    seq.len += 1


def cow_write(
    seq: Sequence,
    logical: int,
    slot: int,
    kv: KVTensor,
    pool: BlockPool,
) -> None:
    blk = seq.table[logical]
    if pool[blk].refs > 1:
        new = pool.alloc()
        copy(pool[blk], pool[new])
        pool[blk].refs -= 1
        seq.table[logical] = new
        blk = new
    pool[blk].slots[slot % B] = kv
