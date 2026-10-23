---
title: "Distributed Systems, by Simulation"
subtitle: "Course structure v0.2 — exploration-first, no blank-page design"
status: draft
audience: "reads code; knows nothing about distributed systems"
---

# Thesis

The subject is not "systems". It is the **tradeoff surface**: consistency,
availability, latency, cost, and operational complexity, under failure. The
course lets the reader *move a knob and watch the bill arrive*.

Four rules, and everything below follows from them:

1. **One workload for the whole course.** Same app, same invariants, different
   designs. Comparisons are only meaningful if the workload is fixed.
2. **Independent axes, each with its own shelf** — not one long
   naive → production story. Production systems are *combinations* of
   independent choices; a single ladder teaches a just-so story and hides the
   Pareto frontier.
3. **Observability before design; prediction before running.** You cannot learn
   a tradeoff you cannot see, and you cannot see one you did not predict.
4. **The reader explores pre-built designs; there is no blank page.** A novice
   asked to "design V2" learns nothing and stalls. Every design in the course
   ships as a runnable artifact. The reader's job is to *compare, predict, and
   choose* — never to invent from scratch.

---

# Audience and interaction model

Assumed: can read code, has used a database, no distributed systems background.
No proofs, no protocol authoring, no "now implement Raft".

**Each unit ships a shelf of 4 pre-built designs**, not a ladder the reader
must climb. Every design card states, in plain language:

- **Assumption** — what it takes for granted ("the leader is the only writer")
- **Mechanism** — one sentence, plus the code that implements it
- **Fixes** — which preceding failure it addresses
- **Price** — latency, availability, complexity, or money

**Four interaction modes per unit**, increasing in agency:

| Mode | What the reader does | Why it exists |
|------|----------------------|---------------|
| **Tour** | Watch one fixed seed with narration | Learn to read the trace at all |
| **Knobs** | Change one parameter, see a diff of the run | Isolate cause from noise |
| **Compare** | Two designs, same seed, side by side | See the tradeoff directly |
| **Hunt** | Find the seed where design C loses a write | Make failure concrete |

**Commitment device:** predict before run, choose before reveal. The prediction
is a single click (which invariant, roughly how often), not an essay. The gap
between predicted and observed is the teaching moment, and it is shown to the
reader as a number.

**Vocabulary in situ.** A term appears the first time the simulation forces it,
with one sentence and a "why this exists". A side panel doubles as a glossary.
Cap: about three new terms per unit.

**No unit asks for a design.** The hardest ask is "given this SLO, pick one of
these four and defend it with a measurement."

---

# The fixed workload: "Ledger"

A small ticket-booking ledger. Boring enough to read in one screen, nasty
enough to break every design:

- `get(key)`, `transfer(a, b, n)`, `reserve(seat, client_req_id)`, `list`
- invariants:
  - **I1** money is conserved (multi-key)
  - **I2** a seat is never double-booked (uniqueness)
  - **I3** a client session reads its own writes
  - **I4** no acknowledged write is lost
  - **I5** a retried request has exactly one effect

Why this workload: multi-key invariants cannot be fixed by per-key quorums;
retries have visible side effects; every invariant fails *differently* under
each design. That difference is the curriculum.

The reader never implements the ledger. It is the constant, like a physics
engine in a game.

---

# Unit 0 — The lab (build before lesson 1)

Everything else is cheap once this exists; nothing works without it.

Deterministic discrete-event simulator:

- virtual clock, seeded RNG per node; **same seed ⇒ identical schedule**
- network: latency distribution, drop, duplicate, reorder, partition matrix
  (including asymmetric partitions)
- nodes: crash, pause/GC, restart with and without disk
- clocks: skew and drift, monotonic vs wall
- trace: every send/recv/state transition plus client ops and replies
- checkers: small-model linearizability, invariant predicates, duplicate-effect
  detector
- outputs: `frames.json` (replay, existing site pattern) and `trace.json`
  (forensics unit)

UI: Step / Run / Pause / Reset, seed field, chaos dial, invariant panel that
turns red **at the exact event** and links to the trace line. Plus a Compare
pane: two runs, same seed, linked scrubber.

Acceptance test: a scripted run where naive retry double-charges, visible in
the trace, reproducible from a seed. If that does not work, the course does not
exist yet.

---

# Unit shape (every unit, no exceptions)

**Goal / Why here / Vocabulary (≤3) / Shelf / Break it / Compare / Choose / Read**

- *Shelf* is 4 pre-built designs with assumption, mechanism, fixes, price.
  Four is the cap: more becomes a menu, fewer hides the tradeoff space.
- *Break it* names the fault profile and a seed range; 100 seeds, not one.
- *Compare* runs two shelf designs on the same seed, side by side.
- *Choose* gives a scenario with an SLO and asks which shelf design wins,
  defended by a measured number.
- *Artifact* is a decision record plus a delta: predicted vs. observed.
  No hand-written distributed systems code anywhere in the core course.

---

# Units

Tier: **I** intro, **C** core, **A** advanced, **X** capstone.

| # | Tier | Axis | Naive shelf design (pre-built) | First failure | Rest of the shelf | Artifact |
|---|------|------|-------------------------------|---------------|-------------------|----------|
| 1 | I | Retries & idempotency | RPC with timeout + retry | duplicate effect (I5) | backoff · dedup table · idempotency keys | duplicate effects / 1k requests |
| 2 | I | Failure detection | fixed timeout = dead | GC pause ⇒ false failover | adaptive (phi) · lease · lease + fencing | false-positive rate vs. detect time |
| 3 | I | Single-leader replication | ack after local write | lost acknowledged writes (I4) | async · sync-all · quorum ack | RPO vs. write p99 |
| 4 | C | Quorums | N=3, R=1, W=2 | stale / non-monotonic read (I3) | tunable R/W · read-repair · quorum reads | violations vs. read latency |
| 5 | C | Consensus | first-to-timeout leader | split brain under partition | Raft · pre-vote · joint config | seconds unavailable per partition |
| 6 | C | Client sessions | retry until success | double apply at the state machine (I5) | session table · dedup log · lease reads | retry amplification factor |
| 7 | A | Sharding | `hash(key) % N` | rebalance moves ~100% of keys | consistent hashing · ranges · bounded movement | % keys moved, p99 during movement |
| 8 | A | Multi-region | single global leader | 150 ms on every write | LWW · causal · CRDT subset | conflict rate, convergence time, lost updates |
| 9 | A | Overload | unbounded queues + retries | metastable collapse | admission control · budgets · load shedding | goodput vs. offered load |
| 10 | A | Time & leases | lease by local clock | two writers, corruption | monotonic clock · fencing tokens | corruption count under skew |
| 11 | X | Forensics | — | — | trace with one injected bug | root cause + minimal seed |
| 12 | X | The frontier | — | — | 3 pre-built architectures × 4 fault profiles | Pareto plot + decision memo |

## Per-unit notes

**1. Retries.** The first unit is the on-ramp: one client, one server, one lost
reply. Every novice has written this bug. The lesson is that the client cannot
distinguish "not done" from "done, reply lost" — so the fix is an identity, not
more retries.

**2. Failure detection.** "Dead" is a decision with a threshold. Show that the
threshold buys detection time with false positives. The pause-the-process fault
is the one everyone forgets; it is also the most fun to watch.

**3. Durability.** Separate "replicated", "durable", and "acknowledged". The
metric is the window of acknowledged-but-lost writes — measured, not asserted.

**4. Quorums.** The keystone. N/R/W sliders plus a partition button turn CAP
from a slogan into a shape on a chart. Let the reader find the case where
R+W>N still does not give what they assumed.

**5. Consensus.** Do not teach Raft by animation. Teach it by cost: elections
under partition, the availability bill, safety vs. liveness. The reader picks
between four consensus configurations and sees the downtime each bought.

**6. Exactly-once.** "Exactly-once delivery" is a lie; "exactly-once effect" is
an artifact. Client, network, and state machine each try to double-apply; the
reader sees which layer has to pay.

**7. Sharding.** The naive design is perfect until the first rebalance. Measure
movement, not boxes and arrows.

**8. Multi-region.** The one unit where physics sets a hard floor. LWW is the
plausible fix that silently loses updates; CRDTs work only for a subset.

**9. Overload.** Most production outages are not partitions; they are
metastable failures. Retry amplification is the villain and the chart is the
lesson.

**10. Time.** Clocks are not time. Leases are the canonical trap, fencing
tokens the canonical save.

**11. Forensics.** Reuse traces from units 1–10. The reader names the invariant,
finds the event, and submits the minimal reproducing seed. Multiple choice on
the diagnosis, free text on the seed. This tests debugging, which is the job.

**12. Frontier.** Same workload, three pre-built architectures (strong,
available, hybrid), four fault profiles, plot latency / availability / cost.
Defend one in a page. There is no correct answer; there is a defended one.

---

# Beginner on-ramp (first 60 minutes)

1. **10 min — Watch.** Unit 1 tour: one request, one lost reply, one duplicate
   charge. Nothing else on screen.
2. **15 min — Poke.** Move the fault dial from 0% to 5%; watch duplicates
   appear. Change one design: add the dedup table. Same seed, side by side.
3. **15 min — Hunt.** Find the seed where the dedup table itself has a bug
   (dedup keyed on the wrong field). Diagnosis is multiple choice.
4. **10 min — Choose.** "Card payments, 0.1% duplicate tolerance, 50 ms
   budget — which of the four designs?" Defend with the measured number.
5. **10 min — Read.** Two pages of prose, now that every term has a referent.

If this hour does not work, no later unit will.

---

# Tracks

- **Weekend sprint (6–8 h):** Unit 0, 1, 2, 4, 9, 12 skim.
- **Core course (novice path):** 1–6, then 11, 12. Ten to twelve hours.
- **Full course:** 0–12.
- **Depth add-on (optional, for the curious):** FLP, linearizability proofs,
  CALM, CRDT convergence, Jepsen-style history analysis.
- **Ops add-on:** run one shelf design for a week with a fault injector; write
  the postmortem.

# Prerequisites

Comfort reading code in one language. No concurrency or networking background
assumed. Theory arrives after the reader has felt the problem, never before.

# Explicitly out of scope (v1)

Byzantine faults, authoring protocols, implementing Raft, Spanner TrueTime
beyond one reading, CRDT proofs, database internals. The course is a flight
simulator, not a ground school.

# Build order

1. Unit 0 harness + Ledger + I1–I5 checkers (the real project).
2. Units 1, 2, 4 — the on-ramp; they must work before anything else is written.
3. Units 3, 5, 6 — the replication cluster.
4. Units 7, 8 — scale.
5. Units 9, 10 — operations.
6. Units 11, 12 — capstones, written last because they consume traces.

# Anti-patterns

- **Blank-page design tasks.** The novice stalls; the expert is bored. Ship
  designs, ask for choices.
- **Animation-only sims.** If the reader cannot break it, it is a diagram.
- **Strawman naive.** The first shelf entry must be defensible.
- **One mega-ladder.** Conflates independent decisions and implies a single
  destination.
- **System tourism.** "Cassandra vs etcd" teaches brands; the axes teach
  mechanisms.
- **A single seed.** One run is an anecdote; 1,000 seeds is a distribution.
- **No price tag.** Every improvement must show what it cost.
- **Menu overload.** More than four designs per unit turns exploration into
  browsing.

# Open questions

1. Does the Ledger workload feel right, or is a scheduler/queue a better spine?
2. Sim in Python (matches the kv-cache `sim.py` → `frames.json` pattern) or in
   TypeScript (runs live in the page)?
3. Which four designs belong on each shelf — and is four the right number, or
   three plus a "surprise" variant?
4. Should unit 11 (forensics) come earlier, once the reader can read a trace?

# Sources

- Kleppmann, *Designing Data-Intensive Applications* — the spine for units 3–8.
- MIT 6.824 / 6.5840 labs — Raft and KV server; useful as the *reference
  implementation* behind unit 5's shelf, not as an exercise.
- Raft paper (Ongaro & Ousterhout); Dynamo (DeCandia et al.); Spanner
  (Corbett et al.).
- Brewer, "CAP Twelve Years Later"; Gilbert & Lynch, "Brewer's Conjecture".
- Lamport, "Time, Clocks, and the Ordering of Events".
- Hayashibara et al., phi accrual failure detector.
- Shapiro et al., CRDT survey.
- Bronson et al., "Metastable Failures in Distributed Systems".
- Kleppmann, "How to do distributed locking" (fencing tokens, unit 10).
- Jepsen analyses — real, adversarial histories; good trace-reading material.
- AWS Builders' Library — timeouts, retries, backoff (units 1, 9).
