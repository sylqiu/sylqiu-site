---
id: one-way-functions
module: m1
kind: theory
title: One-way functions
reading:
  text: Primer §2.1
publish: true
---

# One-way functions

This lesson is a worked example of the authoring format, not finished prose.
Everything below is ordinary markdown plus four directives. Rewrite it freely.

:::def{#owf title="One-way function"}
A function $f\colon\{0,1\}^* \to \{0,1\}^*$ is **one-way** if it is computable in
polynomial time and for every probabilistic polynomial-time algorithm $A$,
every polynomial $p(\cdot)$, and all sufficiently large $n$,

$$\Pr_{x \leftarrow \{0,1\}^n}\bigl[\,A(f(x)) \in f^{-1}(f(x))\,\bigr] < \frac{1}{p(n)}.$$
:::

The quantifier order is the whole content of the definition: the adversary is
fixed first, then we ask about large enough $n$.

::scene{id="hybrid-chain" title="The hybrid argument" height="440"}

:::narration{scene="hybrid-chain"}
- Start from a distribution H₀ that the adversary cannot distinguish from uniform.
- Move one component at a time. Each step changes a single coordinate, never the whole string.
- If each single step can only be detected with advantage at most ε/k, no efficient test can tell the endpoints apart.
- Sum the k steps with the triangle inequality — the total advantage is at most ε.
:::

:::thm{#hybrid title="Hybrid argument"}
If two distributions are each $k$ single-coordinate steps away from each other,
and no efficient distinguisher detects any single step with advantage greater
than $\varepsilon/k$, then no efficient distinguisher separates the endpoints
with advantage greater than $\varepsilon$.
:::

:::proof
Suppose $D$ separates $H_0$ from $H_k$ with advantage $\varepsilon$. Then

$$\varepsilon = \bigl|\Pr[D(H_0)=1] - \Pr[D(H_k)=1]\bigr| \le \sum_{i=1}^{k} \bigl|\Pr[D(H_{i-1})=1] - \Pr[D(H_i)=1]\bigr|.$$

At least one term on the right is at least $\varepsilon/k$, contradicting the
per-step bound.
:::

Actually check yourself before moving on.

:::check{qid="owf-1"}
Why must the adversary be quantified before $n$ in the definition of one-wayness?
- [ ] Because adversaries are faster on short inputs.
- [x] Because a fixed adversary must fail for all sufficiently large input lengths.
- [ ] Because $n$ is chosen by the adversary.
- [ ] Because polynomial time is only defined asymptotically.

Since the probability is over $x \leftarrow \{0,1\}^n$, the guarantee has to hold
as $n$ grows — an adversary that inverts only finitely many lengths still counts
as a failure. Fixing the adversary first is what makes "for all sufficiently
large $n$" meaningful.
:::

## Authoring notes

- `:::def` / `:::thm` / `:::proof` / `:::con` / `:::ex` / `:::rem` render as boxes. The optional `title="..."` overrides the label.
- `::scene{id="..."}` embeds a demo registered in `src/lib/registry.ts`. `height` is optional.
- `:::narration{scene="..."}` is the ordered list of spoken lines. Each bullet is one beat; the demo can react to it via `play(beatIndex)`.
- `:::check{qid="..."}` needs exactly one `- [x]` option.
- `publish: true` in the frontmatter is required — drafts stay out of the build.
