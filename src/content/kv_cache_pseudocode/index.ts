import coreObjects from "./core_objects.py?raw";
import pagedAttention from "./paged_attention.py?raw";
import radixAttention from "./radix_attention.py?raw";
import scheduler from "./scheduler.py?raw";
import handoff from "./handoff.py?raw";

export const pseudocode = {
  coreObjects: coreObjects.trim(),
  pagedAttention: pagedAttention.trim(),
  radixAttention: radixAttention.trim(),
  scheduler: scheduler.trim(),
  handoff: handoff.trim(),
};
