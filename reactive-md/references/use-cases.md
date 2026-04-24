---
title: Use Cases — JTBD → Recipe Map
status: reference
---

# Use Cases

Maps user intent (Jobs To Be Done) to the recipe in `references/recipes/` that should be used
as the authoritative starting point. Each entry lists the trigger phrases that indicate the
job, the recipe folder, and the key authoring directive from that recipe's frontmatter.

> **For AI assistants**: Match the user's request to a trigger phrase. Go to the corresponding
> recipe folder, read `spec.md`, and follow its `instruction` frontmatter exactly. Do not
> recreate sidecar components inline — import them.

---

## 1. Create a Product Spec / PRD

**Triggers**: "Draft a spec for...", "Create a PRD", "Write a product vision", "Document what
we're building"

**Recipe**: `recipes/product-spec/`

**Directive**: Follow the literate structure strictly — WHO → THE PROBLEM → WHY NOW → each
screen as a live demo → design decisions block after every fence → end-to-end integration with
navigation state table and FTUE/daily-use scenario fixtures. Never produce a fence without
prose that earns it and a design decisions block that follows it.

---

## 2. Write a Feature Spec

**Triggers**: "Write a feature spec", "Create a PRD for this feature", "Document this feature",
"Brief the engineering team"

**Recipe**: `recipes/feature-spec/`

**Directive**: State the user problem, define functional and non-functional requirements, show
a live interactive demo, add a design decisions block after the demo, and define success
metrics. Every section must answer a specific stakeholder question — cut anything that doesn't.

---

## 3. Prototype a User Flow

**Triggers**: "Prototype a user flow", "Mockup the checkout", "Document the signup flow",
"Map out the onboarding", "Show the multi-step journey"

**Recipe**: `recipes/user-flow/`

**Directive**: Build a multi-step flow with navigation state — show each step as a live
component, wire transitions with shared state, handle error and empty states explicitly, and
close with a first-time and returning-user scenario. The full flow must be walkable end-to-end
without a presenter.

---

## 4. Propose an A/B Test

**Triggers**: "Run an A/B test", "Compare two variants", "Write a test proposal", "Document
the experiment hypothesis"

**Recipe**: `recipes/a-b-test-proposal/`  
**Sidecar**: `ABTestVariants.jsx` — renders control/treatment side by side.

**Directive**: State the hypothesis and baseline metric, show both variants as live components
side by side, define the success metric and minimum detectable effect, specify audience and
duration, and close with a binary decision criteria table. A reviewer must approve or reject
without a follow-up meeting.

---

## 5. Analyze the Market / Competitive Landscape

**Triggers**: "Analyze the market", "Where do we stand vs. competitors", "Competitive
analysis", "Feature comparison", "Positioning map"

**Recipe**: `recipes/competitive-analysis/`  
**Sidecars**: `ComparisonMatrix.tsx`, `CompetitorCard.tsx`, `FeatureMatrix.tsx`

**Directive**: Structure conclusion-first — the executive summary leads with the verdict, not
the data. Then: score matrix, competitor profiles, feature comparison (✓ / ◑ / — values),
numbered insights with implication framing, and a recommendation as a time-boxed checklist.
The document must make a call, not just show data.

---

## 6. Write a Data Story / Visual Essay

**Triggers**: "Write a data story", "Visual essay about...", "Turn this data into a narrative",
"Build a strategy deck", "Make this analysis readable"

**Recipe**: `recipes/visual-essays/`  
**Sidecar barrel**: `proto-kit.jsx` → exports `DataModule`, `TrendChart`, `ScoreChart`,
`FeatureMatrix`, `SidebarPanel`, `SidebarStat`, `SidebarCard`, `SidebarProgress`,
`StatementPanel`

**Directive**: Lead with the argument, not the data — each chart illustrates a claim made in
the surrounding prose. The document must reach a conclusion. Never embed a chart without a
sentence before it that states what the reader should see.

---

## 7. Audit Responsive / Device Fidelity

**Triggers**: "Audit the mobile UI", "Check responsive behavior", "Verify container queries",
"Test breakpoints across devices", "Why does this look wrong on tablet"

**Recipe**: `recipes/fidelity-audit/`

**Directive**: Audit the same component across mobile, tablet, and desktop breakpoints using
device emulation for each. Verify that `@md:` / `@lg:` Tailwind container variants and
`@container` CSS rules fire at the correct emulated sizes — not the VS Code window. Document
what breaks at each boundary, why it breaks, and what the fix is.

---

## 8. Build a Component or Design System

**Triggers**: "Document this design system", "Create a component gallery", "Build a component
with live examples", "Show this component across themes"

**Recipes** (pick the most relevant pattern):

- `recipes/dark-mode-toggle/` — **CSS variable theming**: use `css live` to define
  document-scoped tokens, reference `--rmd-bg` / `--rmd-fg` in all fences. Never hardcode
  colors.
- `recipes/notification-system/` — **Multi-sidecar composition**: one component per concern,
  ≤30 lines inline per fence, resilient default props for Gallery Mode.
- `recipes/data-loading/` — **Data patterns**: JSON import for offline prototypes; `fetch()`
  in `useEffect` for live API validation. Always pair fetch with loading and error states.

---

## 9. Showcase DSL Capabilities

**Triggers**: "Show me all the fence options", "What does lock-view do", "Demonstrate device
emulation", "Reference for fence modifiers"

**Recipe**: `recipes/dsl-showcase/`

**Directive**: Produce a working example for every fence modifier — device emulation, orientation,
zoom modes, stable id anchors, lock-view, and no-placeholder. Each modifier gets its own fence
with prose explaining what it controls and when to use it. This is a reference, not a template
for product specs.
