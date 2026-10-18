import coreObjects from "./00_core_objects.py?raw";
import pagedAttention from "./01_paged_attention.py?raw";
import radixAttention from "./02_radix_attention.py?raw";
import scheduler from "./03_scheduler.py?raw";
import handoff from "./04_handoff.py?raw";
import asyncServing from "./05_async_serving.py?raw";

export const pseudocode = {
  coreObjects: coreObjects.trim(),
  pagedAttention: pagedAttention.trim(),
  radixAttention: radixAttention.trim(),
  scheduler: scheduler.trim(),
  handoff: handoff.trim(),
  asyncServing: asyncServing.trim(),
};
