from collections import deque

from .core_objects import BlockPool, Sequence

chunk_size = 256


def scheduler_step(
    batch: list[Sequence],
    waiting: deque[Sequence],
    blocks: BlockPool,
) -> None:
    while batch or waiting:
        for seq in list(batch):
            if seq.is_prefill:
                seq.prefill(chunk_size)
            else:
                seq.decode()
            if seq.finished:
                batch.remove(seq)
                blocks.free_sequence(seq)   # refcount-aware
        while waiting and blocks.can_fit(waiting[0]):
            batch.append(waiting.popleft())
