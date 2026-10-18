from math import ceil

from .core_objects import BlockPool, KVTensor, Sequence
from .paged_attention import B, append_kv

# prefill worker
blocks: list[int] = pool.alloc(ceil(len(prompt) / B))
prefill(prompt, blocks)
send_kv(blocks, decode_worker)        # bytes + block table

# decode worker — pool: BlockPool
blocks: list[int] = recv_kv()
seq: Sequence = Sequence(tokens=[], table=blocks)
for _ in range(max_new_tokens):
    logits = decode(seq)
    kv: KVTensor = project(seq, sample(logits))
    append_kv(seq, kv, pool)
