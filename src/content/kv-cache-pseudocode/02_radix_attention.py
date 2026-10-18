from .core_objects import RadixNode


def match_prefix(
    root: RadixNode,
    tokens: list[int],
) -> tuple[RadixNode, int]:
    node, i = root, 0
    while i < len(tokens):
        child = node.children.get(tokens[i])
        if not child:
            break
        n = lcp(child.key, tokens[i:])      # longest common prefix
        if n < len(child.key):
            child = split(child, n)          # shared prefix becomes a node
            break
        node, i = child, i + n
    return node, i                          # cached KV up to i


def insert(node: RadixNode, tokens: list[int], i: int) -> None:
    node.children[tokens[i]] = RadixNode(
        tokens[i:],
        alloc_blocks(tokens[i:]),
        {},
    )
