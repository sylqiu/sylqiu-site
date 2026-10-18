from dataclasses import dataclass
from typing import Any, Protocol

Tensor = Any
KVTensor = tuple[Tensor, Tensor]  # packed (k, v) pair


@dataclass
class KVBlock:
    """One fixed-size physical block of cached K/V pairs."""

    block_id: int
    refs: int = 1
    slots: list[KVTensor]


@dataclass
class Sequence:
    """One request's token state and logical-to-physical block table."""

    tokens: list[int]
    block_table: list[int]   # logical block -> physical block id
    num_tokens: int = 0
    state: str = "waiting"    # waiting -> decoding -> finished

    @property
    def is_prefill(self) -> bool:
        """True while the prompt still has unprocessed tokens."""
        return self.state == "waiting"

    @property
    def finished(self) -> bool:
        """True after EOS or the max-new-token limit."""
        return self.state == "finished"

    async def prefill(self, chunk_size: int) -> None:
        """Process up to chunk_size prompt tokens and append their KV."""
        ...

    async def decode(self) -> None:
        """Generate one token and append its KV; update finished state."""
        ...


class BlockPool(Protocol):
    """Allocator and refcount owner for physical KV blocks."""

    def __getitem__(self, block_id: int) -> KVBlock: ...
    def allocate_block(self) -> int: ...
    def free_block(self, block_id: int) -> None: ...
    def free_sequence(self, sequence: Sequence) -> None: ...
    def can_allocate(self, sequence: Sequence) -> bool: ...


@dataclass
class RadixNode:
    """One radix-tree edge: a token range and the KV blocks covering it."""

    token_ids: list[int]
    block_ids: list[int]
    children: dict[int, "RadixNode"]
    ref_count: int = 0
    last_access_time: int = 0
