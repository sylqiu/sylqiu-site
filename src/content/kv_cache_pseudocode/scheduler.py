import asyncio
from collections import deque

from .core_objects import BlockPool, Sequence

PREFILL_CHUNK_SIZE = 256


async def advance(
    sequence: Sequence,
    block_pool: BlockPool,
) -> None:
    """Advance one sequence; await only its own phase."""
    if sequence.finished:
        return
    if sequence.is_prefill:
        await sequence.prefill(chunk_size=PREFILL_CHUNK_SIZE)
    else:
        await sequence.decode()
    # Retirement is the serving loop's job, after the result is delivered.


async def scheduler_loop(
    running: list[Sequence],
    waiting: deque[Sequence],
    block_pool: BlockPool,
) -> None:
    """Submit independent work and admit waiting requests each iteration."""
    while running or waiting:
        tasks = [
            asyncio.create_task(advance(sequence, block_pool))
            for sequence in running
            if not sequence.finished
        ]
        if tasks:
            await asyncio.gather(*tasks)

        while waiting and block_pool.can_allocate(waiting[0]):
            running.append(waiting.popleft())

        if not tasks and not waiting:
            break
        await asyncio.sleep(0)
