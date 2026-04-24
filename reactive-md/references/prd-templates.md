---
title: PRD Templates — Reference Index
status: reference
---

# PRD Templates

An index of the PRD-category recipes in `references/recipes/`. Each recipe is a complete,
working reference document: a `spec.md` narrative plus sidecar JSX/TSX components. Use these
as the authoritative starting point when a user asks to write a PRD, proposal, A/B test, or
user flow.

> **For AI assistants**: Do not recreate sidecar components inline. Import them. The
> `instruction` in each recipe's frontmatter is the authoring directive — follow it exactly.

---

## Feature Specification

**Folder**: `recipes/feature-spec/`

**When to use**: A user wants to write a single-feature PRD, brief an engineering team, or
document a design decision with a live demo.

**Authoring directive**: State the user problem, define functional and non-functional
requirements, show a live interactive demo, add a design decisions block after the demo, and
define success metrics. Every section must answer a specific stakeholder question — cut
anything that doesn't.

---

## A/B Test Proposal

**Folder**: `recipes/a-b-test-proposal/`

**Sidecar**: `ABTestVariants.jsx` — renders control/treatment side by side.

**When to use**: A user wants to propose a conversion test, document an experiment, or compare
two variants with a hypothesis and success criteria.

**Authoring directive**: State the hypothesis and baseline metric, show both variants as live
components side by side, define the success metric and minimum detectable effect, specify
audience and duration, and close with a binary decision criteria table. A reviewer must be
able to approve or reject without a follow-up meeting.

---

## Competitive Analysis

**Folder**: `recipes/competitive-analysis/`

**Sidecars**:
- `ComparisonMatrix.tsx` — ranked score matrix (0–100 per dimension)
- `CompetitorCard.tsx` — competitor profile with strengths/weaknesses
- `FeatureMatrix.tsx` — feature comparison table (`✓` / `◑` / `—` three-state values)

**When to use**: A user wants to document market research, product positioning, or a
head-to-head capability comparison.

**Authoring directive**: Structure the document conclusion-first — the executive summary leads
with the verdict, not the data. Then: score matrix, competitor profiles, feature comparison,
numbered insights with implication framing, and a recommendation as a time-boxed checklist.
Never recreate the sidecar components inline. The document must make a call, not just show
data.

---

## User Flow Specification

**Folder**: `recipes/user-flow/`

**When to use**: A user wants to document a multi-step user journey (signup, checkout,
onboarding) with navigation state and end-to-end walkability.

**Authoring directive**: Build a multi-step flow with navigation state — show each step as a
live component, wire transitions between steps with shared state, handle error and empty
states explicitly, and close with a first-time and returning-user scenario. The full flow must
be walkable end-to-end without a presenter.

---

## How to Use

1. **Copy the recipe folder** into your project (e.g., `cp -r recipes/feature-spec/ product/my-feature/`)
2. **Rename** the folder to match your feature: `product/my-feature/`
3. **Edit `spec.md`** — replace placeholder content with your actual requirements, data, and narrative
4. **Keep the sidecars** — import them, don't rewrite them inline
5. **Follow the instruction directive** in the frontmatter — it defines the structure a reviewer expects

All recipes follow the hub-and-spoke structure: `spec.md` is the narrative entry point;
sidecar `.jsx`/`.tsx` files are shared libraries. See `SKILL.md` for the full authoring
guide.
