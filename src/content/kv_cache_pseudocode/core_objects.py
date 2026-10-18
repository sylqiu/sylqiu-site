from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Protocol

Tensor = Any
KVTensor = tuple[Tensor, Tensor]  # packed (k, v) pair
TOKENS_PER_BLOCK = 4


@dataclass
class KVBlock:
    """One fixed-size physical block of cached K/V pairs."""

    block_id: int
    refs: int = 1
    slots: list[KVTensor | None] = field(
        default_factory=lambda: [None] * TOKENS_PER_BLOCK
    )

    @property
    def fill(self) -> int:
        """Number of occupied slots in this block."""
        return sum(slot is not None for slot in self.slots)


@dataclass
class Sequence:
    """One request's token state and logical-to-physical block table."""

    tokens: list[int]
    block_table: list[int] = field(default_factory=list)
    num_tokens: int = 0
    state: str = "waiting"    # waiting -> decoding -> finished
    block_pool: BlockPool | None = None
    max_new_tokens: int = 1
    produced: int = 0
    next_token: int = 0
    request_id: str = ""
    prompt_len: int = 0

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
        from .paged_attention import append_kv

        if self.block_pool is None:
            raise RuntimeError("sequence has no block pool")
        while self.num_tokens < len(self.tokens):
            end = min(self.num_tokens + chunk_size, len(self.tokens))
            while self.num_tokens < end:
                token_id = self.tokens[self.num_tokens]
                append_kv(self, project_kv(token_id), self.block_pool)
        self.state = "decoding"

    async def decode(self) -> None:
        """Generate one token and append its KV; update finished state."""
        from .paged_attention import append_kv

        if self.finished:
            return
        if self.block_pool is None:
            raise RuntimeError("sequence has no block pool")
        token_id = self.next_token + self.produced
        self.tokens.append(token_id)
        append_kv(self, project_kv(token_id), self.block_pool)
        self.produced += 1
        self.state = "finished" if self.produced >= self.max_new_tokens else "decoding"


def project_kv(token_id: int) -> KVTensor:
    """Toy projection: one deterministic (k, v) pair per token."""
    return (token_id, token_id * 2 + 1)


class BlockPool(Protocol):
    """Allocator and refcount owner for physical KV blocks."""

    def __getitem__(self, block_id: int) -> KVBlock: ...
    def allocate_block(self) -> int: ...
    def retain_blocks(self, block_ids: list[int]) -> None: ...
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
