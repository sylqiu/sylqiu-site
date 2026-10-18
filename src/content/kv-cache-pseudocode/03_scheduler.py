import asyncio
from collections import deque

from .core_objects import BlockPool, Sequence

PREFILL_CHUNK_SIZE = 256


async def advance(
    sequence: Sequence,
    block_pool: BlockPool,
) -> None:
    """Advance one sequence; await only its own phase."""
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
    """Submit independent work; task retirement is elided."""
    while running or waiting:
        for sequence in list(running):
            asyncio.create_task(
                advance(sequence=sequence, block_pool=block_pool)
            )

        while waiting and block_pool.can_allocate(sequence=waiting[0]):
            running.append(waiting.popleft())

        await asyncio.sleep(0)
