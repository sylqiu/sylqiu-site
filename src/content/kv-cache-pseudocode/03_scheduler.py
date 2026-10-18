from collections import deque

from .core_objects import BlockPool, Sequence

PREFILL_CHUNK_SIZE = 256


def scheduler_step(
    running: list[Sequence],
    waiting: deque[Sequence],
    block_pool: BlockPool,
) -> None:
    """Advance resident requests once, then admit requests that fit."""
    while running or waiting:
        for sequence in list(running):
            if sequence.is_prefill:
                sequence.prefill(chunk_size=PREFILL_CHUNK_SIZE)
            else:
                sequence.decode()
            if sequence.finished:
                running.remove(sequence)
                block_pool.free_sequence(sequence=sequence)  # refcount-aware
        while waiting and block_pool.can_allocate(sequence=waiting[0]):
            running.append(waiting.popleft())
