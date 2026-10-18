# KV cache implementation

This is a runnable toy implementation of the serving loop, not production
code. The site imports the source files with Vite's `?raw` loader and renders
them verbatim in the pseudocode section.

- `core_objects.py` — blocks, sequences, the pool protocol, radix nodes
- `paged_attention.py` — append, block boundary, copy-on-write
- `radix_attention.py` — prefix match, split, insert
- `scheduler.py` — iteration-level batching
- `handoff.py` — prefill-to-decode KV handoff
- `sim.py` — tiny A/B/C workload; writes the frames played by §12

Generate the frames after changing the implementation:

    cd src/content
    python3 -m kv_cache_pseudocode.sim > kv-cache-frames.json
