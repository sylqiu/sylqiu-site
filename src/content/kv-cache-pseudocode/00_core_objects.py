from dataclasses import dataclass
from typing import Any, Protocol

Tensor = Any
KVTensor = tuple[Tensor, Tensor]  # packed (k, v) pair


@dataclass
class KVBlock:
    id: int
    refs: int = 1
    slots: list[KVTensor]


@dataclass
class Sequence:
    tokens: list[int]
    table: list[int]          # logical block -> physical block
    len: int = 0
    state: str = "waiting"
    # plus prefill(), decode(), finished


class BlockPool(Protocol):
    def __getitem__(self, block: int) -> KVBlock: ...
    def alloc(self) -> int: ...
    def free(self, block: int) -> None: ...
    def free_sequence(self, seq: Sequence) -> None: ...
    def can_fit(self, seq: Sequence) -> bool: ...


@dataclass
class RadixNode:
    key: list[int]
    kv: list[int]
    children: dict[int, "RadixNode"]
    refs: int = 0
    last_access: int = 0
