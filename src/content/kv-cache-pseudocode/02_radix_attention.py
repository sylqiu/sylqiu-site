from .core_objects import RadixNode


def longest_common_prefix(left: list[int], right: list[int]) -> int:
    """Length of the longest shared prefix between two token lists."""
    limit = min(len(left), len(right))
    matched = 0
    while matched < limit and left[matched] == right[matched]:
        matched += 1
    return matched


def split_edge(node: RadixNode, prefix_length: int) -> RadixNode:
    """Split a compressed edge and return the shared-prefix node."""
    ...


def allocate_blocks(token_ids: list[int]) -> list[int]:
    """Allocate enough physical blocks to cover a token suffix."""
    ...


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
        if common < len(child.token_ids):
            child = split_edge(node=child, prefix_length=common)
            break
        node, matched = child, matched + common
    return node, matched


def insert(node: RadixNode, token_ids: list[int], matched: int) -> None:
    """Attach the uncached suffix below the matched node."""
    suffix = token_ids[matched:]
    node.children[token_ids[matched]] = RadixNode(
        token_ids=suffix,
        block_ids=allocate_blocks(token_ids=suffix),
        children={},
    )
