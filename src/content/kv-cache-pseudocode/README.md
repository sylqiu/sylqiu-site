# KV cache pseudocode

Edit the `.py` files in this directory, then rebuild the site. `index.ts`
imports each file with Vite's `?raw` loader, and the illustration renders the
text into its code cards.

- `00_core_objects.py` — shared dataclasses and the `BlockPool` protocol
- `01_paged_attention.py` — block append and copy-on-write
- `02_radix_attention.py` — prefix match and insertion
- `03_scheduler.py` — continuous-batching step
- `04_handoff.py` — prefill-to-decode KV handoff
- `05_async_serving.py` — conceptual async scheduling and per-request tasks
