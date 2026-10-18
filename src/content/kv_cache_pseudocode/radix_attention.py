from math import ceil

from .core_objects import BlockPool, RadixNode, TOKENS_PER_BLOCK


def longest_common_prefix(left: list[int], right: list[int]) -> int:
    """Length of the longest shared prefix between two token lists."""
    limit = min(len(left), len(right))
    matched = 0
    while matched < limit and left[matched] == right[matched]:
        matched += 1
    return matched


def split_edge(
    parent: RadixNode,
    node: RadixNode,
    prefix_length: int,
) -> RadixNode:
    """Split a compressed edge and return the shared-prefix node."""
    if prefix_length >= len(node.token_ids):
        return node
    suffix = node.token_ids[prefix_length:]
    original_blocks = node.block_ids
    split_block = prefix_length // TOKENS_PER_BLOCK

    child = RadixNode(
        token_ids=suffix,
        block_ids=original_blocks[split_block:],
        children=node.children,
        ref_count=node.ref_count,
        last_access_time=node.last_access_time,
    )
    node.token_ids = node.token_ids[:prefix_length]
    node.block_ids = original_blocks[: split_block + 1]
    node.children = {suffix[0]: child}
    parent.children[node.token_ids[0]] = node
    return node


def allocate_blocks(
    block_pool: BlockPool,
    token_count: int,
) -> list[int]:
    """Allocate enough physical blocks to cover a token suffix."""
    count = ceil(token_count / TOKENS_PER_BLOCK)
    return [block_pool.allocate_block() for _ in range(count)]


def match_prefix(
    root: RadixNode,
    token_ids: list[int],
) -> tuple[RadixNode, int]:
    """Return the deepest cached prefix node and its token count."""
    node, matched = root, 0
    while matched < len(token_ids):
        child = node.children.get(token_ids[matched])
        if child is None:
            break
        common = longest_common_prefix(
            left=child.token_ids,
            right=token_ids[matched:],
        )
        if common == 0:
            break
        if common < len(child.token_ids):
            child = split_edge(node, child, common)
        node, matched = child, matched + common
    return node, matched


def insert(
    node: RadixNode,
    token_ids: list[int],
    matched: int,
    block_ids: list[int],
) -> RadixNode:
    """Attach the uncached suffix below the matched node."""
    suffix = token_ids[matched:]
    if not suffix:
        return node
    child = RadixNode(
        token_ids=suffix,
        block_ids=block_ids[matched // TOKENS_PER_BLOCK:],
        children={},
    )
    node.children[suffix[0]] = child
    return child


class PrefixCache:
    """Block-aligned radix index over prompt prefixes."""

    def __init__(self) -> None:
        self.root = RadixNode(token_ids=[], block_ids=[], children={})

    def match(self, token_ids: list[int]) -> tuple[RadixNode, int]:
        return match_prefix(self.root, token_ids)

    def insert(self, token_ids: list[int], block_ids: list[int]) -> None:
        node, matched = self.match(token_ids)
        insert(node, token_ids, matched, block_ids)
