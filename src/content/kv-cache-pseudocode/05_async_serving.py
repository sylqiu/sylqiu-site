# Conceptual host-side shape: production uses CUDA streams/events.
import asyncio
from collections import deque

from .core_objects import BlockPool, Sequence
from .scheduler import PREFILL_CHUNK_SIZE


async def advance(
    sequence: Sequence,
    block_pool: BlockPool,
) -> None:
    """Advance one sequence; await only its own dependency."""
    if sequence.is_prefill:
        await sequence.prefill(chunk_size=PREFILL_CHUNK_SIZE)
    else:
        await sequence.decode()

    if sequence.finished:
        block_pool.free_sequence(sequence=sequence)


async def scheduler_loop(
    running: list[Sequence],
    waiting: deque[Sequence],
    block_pool: BlockPool,
) -> None:
    """Submit independent work without a global per-iteration barrier."""
    while running or waiting:
        # Shape only: production tracks one in-flight task per sequence
        # and retires it with a completion callback.
        for sequence in list(running):
            asyncio.create_task(
                advance(sequence=sequence, block_pool=block_pool)
            )

        # Admission is host-side bookkeeping; device work keeps running.
        while waiting and block_pool.can_allocate(sequence=waiting[0]):
            running.append(waiting.popleft())

        await asyncio.sleep(0)
