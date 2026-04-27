---
name: reactive-md
description: Literate UI/UX for product teams — write product specs, PRDs, and interactive prototypes as a single Markdown document with embedded live React components. Use when a user needs to create a product spec with working demos, prototype a user flow, audit responsive behavior, or produce any document where the artifact should serve as the prototype. Designed for async collaboration — the document replaces the meeting.
license: MIT
compatibility: Requires VS Code with the Reactive MD extension (million-views.reactive-md) installed.
metadata:
  version: "1.2.1"
  author: million-views (https://m5nv.com)
---

# Reactive MD

**Reactive MD** is a VS Code extension with three modes: **Markdown Preview** (static SSR render), **Interactive Preview** (live React execution with device emulation), and **Publish** (static site export of your document and its islands).

Write Markdown documents where the prose and the prototype are the same artifact. Each live fence is an executable screen or component; the surrounding prose is the spec, rationale, and review surface. The goal is a document a reviewer can read, argue with, and say yes or no to — without scheduling a follow-up meeting.

## The Quality Bar (Three Lenses)

A reactive-md document reaches the quality bar when it passes all three lenses simultaneously:

1. **Read like a narrative**: Prose leads. The problem is established before any demo appears. Each section earns the right to show a component.
2. **Review like a spec**: After every demo, design decisions are documented — the choices that can't be seen in the UI. This is what makes async convergence possible.
3. **Experience like a prototype**: Components are real. Device emulation reflects the true target context. The full system is wired together at the end.

**The Document is the Product**: A messy component in thin prose is not a spec. It is an incomplete handoff.

## Primary Use Cases

| Trigger | Document type |
|---------|---------------|
| "Draft a spec for...", "Create a PRD" | Product spec with WHO/PROBLEM/SOLUTION flow |
| "Prototype a user flow", "Mockup the checkout" | Interactive flow with navigation state and edge cases |
| "Run an A/B test", "Compare two variants" | A/B test proposal with hypothesis, variants, and success metrics |
| "Write a data story", "Visual essay about..." | Narrative with embedded charts and analysis |
| "Audit the mobile UI", "Check responsive behavior" | Fidelity audit with device matrix |
| "Document this design system", "Component gallery" | Living docs with live examples |
| "Analyze the market", "Where do we stand vs. competitors" | Competitive analysis with score matrix, feature comparison, and positioning recommendation |
| "Redesign this screen", "Audit existing UX", "Map UX debt", "Before/after comparison" | Brownfield UX refinement — AS-IS audit, friction mapping, TO-BE proposal with migration notes |

---

## Document Craft

### The Literate Structure

Every reactive-md document has three zones, in order:

1. **Context zone** — WHO, PROBLEM, WHY NOW. No demos yet. This is the argument that makes the demos matter.
2. **Exploration zone** — One section per screen, feature, or component. Each section: prose → demo → design decisions.
3. **Integration zone** — The full system wired together. Navigation state. Scenario fixtures. The answer to "does this actually work end to end?"

### The Design Decisions Block

After every live fence in a product spec, write a design decisions block. This is not optional. It is what makes the document substitutable for a meeting. A reviewer must be able to say yes or no to the design without asking a follow-up question.

A good decisions block answers:
- What non-obvious choice was made, and why?
- What was the rejected alternative?
- What edge case is handled, and how?
- What constraint shaped this decision?

```markdown
**Design decisions:**
- **Single question on onboarding**: Birth year only. Life expectancy defaults to 90.
  Less morbid on day one; adjustable in settings.
- **"Neither" scores 10, not 0**: Even hard weeks count as lived time.
  Zero would make the app punishing. This is a witness, not a judge.
- **No leaderboard**: Score is personal — calibrated against yourself only.
  Population percentiles would corrupt the intention.
```

### Scenario Data Fixtures

For documents that show a full system, create separate named fixtures for each meaningful state of the world. Import by name.

```js
// data/demo-data.js
export const FTUE_DATA = { user: { birthYear: 1995 }, ratings: {} };
export const DAILY_USE_DATA = { user: { birthYear: 1990 }, ratings: { /* 2 years */ } };
```

Use `useMemo(() => new Date(), [])` (imported from `'react'`) for any date fixture — prevents animation resets on prose edits.

### End-to-End Integration

Product specs must close with a section that wires everything together:
- A navigation state table (From → Trigger → To)
- Two demo scenarios: first-time user and established user
- What persists, and how it survives a reload

Individual fences are proofs. The integration section is the argument.

---

## Brownfield UX Refinement

When the codebase already exists and the goal is to improve it — not build from scratch — the document structure shifts from *invention* to *diagnosis and prescription*. The document argues that the current UX fails, shows the evidence, then proposes the fix.

### Input Model: Screenshots First

**Do not read the codebase to recreate current screens.** The screenshot is the ground truth of what users experience — capturing rendered state, browser defaults, production data shapes, and theme inheritance that source code alone cannot convey.

The preferred input model:

1. **Product owner provides screenshots** of every meaningful screen state (default, loading, empty, error, success) from the running application.
2. Screenshots are placed in `screenshots/current/` within the document folder, named descriptively.
3. The spec embeds them as **plain Markdown images**. The screenshot *is* the AS-IS view. No React fence is needed for the current state.

**When screenshots are not available**: ask the PO explicitly before proceeding. Do not infer the current UX from code.

### Document Zones

1. **Context zone** — WHO currently uses this, THE PROBLEM with the current UX, THE COST of not fixing it. No demos yet.
2. **Audit zone** — One section per screen: embed the screenshot as a plain Markdown image, then annotate friction points as prose callouts below it. No fence.
3. **Redesign zone** — Per screen: the proposed redesign as a `jsx live` fence → design decisions block (what changed, what was preserved, what was rejected).
4. **Migration zone** — Behavioral deltas, rollout strategy, compatibility constraints. Mandatory.

### AS-IS: Plain Markdown Image

```markdown
## Audit: Cart Summary

![Cart Summary — current state](./screenshots/current/01-cart-summary.png)

**Friction points:**
- **No item count in header**: Users scroll back to verify cart contents before paying.
- **"Proceed" CTA is below the fold on mobile**: 60% of users never see it without scrolling.
- **No price breakdown**: Tax and shipping appear only at payment — surprise costs drive abandonment.
```

No fence. No React. The screenshot speaks for itself; the prose names what is wrong.

### TO-BE: React Fence

````markdown
## Redesign: Cart Summary

```jsx live id="proposed-cart" device=mobile zoom=fill
import { ProposedCart } from './proposed-cart.jsx';
export function Demo() { return <ProposedCart />; }
```

**Design decisions:**
- **Sticky CTA**: Always visible — no scrolling required to proceed.
- **Inline price breakdown**: Tax and shipping shown as line items. Eliminates the abandonment spike at payment.
- **Cart count in header badge**: Persistent context without requiring scroll-back.
````

### Optional: Side-by-Side with CompareView

For a direct before/after in the same view, use the `CompareView` widget. It renders the screenshot on the left and the proposed component on the right:

````markdown
```jsx live id="compare-cart" device=none
import { CompareView } from './compare-view.jsx';
import { ProposedCart } from './proposed-cart.jsx';

export function Compare() {
  return (
    <CompareView screenshotSrc="./screenshots/current/01-cart-summary.png">
      <ProposedCart />
    </CompareView>
  );
}
```
````

`CompareView` degrades gracefully: if the image path is missing or fails to load, it shows a placeholder. Copy `compare-view.jsx` from `references/recipes/brownfield-redesign/` into your document folder.

> **Image resolution**: In Markdown Preview, local images always resolve. In Interactive Preview, relative paths (e.g., `./screenshots/current/foo.png`) resolve when `spec.md` and `screenshots/` share the same parent folder.

### Folder Layout

```
product/checkout/ux-redesign/
  spec.md                         <- audit → redesign → migration
  compare-view.jsx                <- CompareView widget (copied from recipe)
  proposed-cart.jsx               <- extracted proposed component (>30 lines)
  screenshots/
    current/                      <- PO-provided screenshots
      01-cart-summary.png
      02-payment-error.png
  data/
    demo-state.js
  styles.css
```

### Key Distinctions from Greenfield

- **AS-IS is a Markdown image, not React.** Never write JSX to approximate the current screen. The screenshot is the spec input — cheaper, faster, and more accurate.
- The **context zone** argues *why the current experience fails*, not why the feature matters.
- Friction points are prose annotations below a screenshot — not live demos.
- Design decisions must explicitly answer: "What was preserved from the original, and why?"
- The **migration zone** is mandatory — stakeholders need to know what changes for existing users.

---

## Technical Directives

### 1. The Hub-and-Spoke Workflow
Always treat a project as a multi-file system.
- **`spec.md`**: The narrative entry point. Start here. Use prose to set the stage.
- **Sidecar Libraries**: Implementation modules (e.g., `proto-kit.jsx`, `idea-kit.jsx`). Use these as shared libraries to serve multiple fences across your document. Extract logic here if a fence exceeds 30 lines.
- **`styles.css`**: Design tokens and advanced layout.

**Convention**: place all reactive-md documents under `product/` in the source root. This avoids collisions with `specs/` (test suites), `docs/` (API/site tooling), and `design/` (design-system tooling). The entry point is always `spec.md` — `find product/ -name "spec.md"` finds every document in the repo.

Two levels, no deeper:
- `product/<name>/spec.md` — top-level vision for a product or subsystem
- `product/<name>/<feature>/spec.md` — feature deep dive within that product

Going deeper than two levels is a signal the document has become an implementation note, not a product spec.

**Top-level product spec** (vision, positioning, full narrative):
```
product/checkout/
  spec.md              <- Product vision: who, problem, why now
  proto-kit.jsx        <- Shared component library
  styles.css           <- Design tokens
```

**Feature deep dive** (sidecar-heavy, multiple fences):
```
product/checkout/cart/
  spec.md              <- Feature spec with per-screen demos
  lib/ui/              <- Components >100 lines or reused across fences
    CartItem.jsx
    OrderSummary.jsx
  data/
    demo-data.js       <- FTUE_DATA, DAILY_USE_DATA fixtures
  styles.css
```

Folder names are stable feature identifiers — `cart`, not `cart-redesign`. Iteration history belongs in git; version status belongs in the frontmatter `status` field (`draft`, `review`, `approved`).

**Extraction thresholds:**
- **<30 lines, single-use**: Keep inline in the fence.
- **>30 lines in a fence**: Extract to a top-level sidecar (e.g., `proto-kit.jsx`).
- **>100 lines, reused, or complex logic**: Promote to `lib/ui/`.

### 2. Viewport Specification (DSL)
Establish the "Reality" in the fence info string:
` ```jsx live id="stable-name" device=mobile orientation=portrait `

| Modifier | Type | Principle |
| :--- | :--- | :--- |
| **`id="stable-id"`** | string | **Stability**. Prevents component remount on prose edits. Essential for forms/state. Use kebab-case. |
| **`device="mobile"`** | enum | **Context**. Targets `mobile`, `tablet`, `desktop`. Default is `none` (no emulation). |
| **`mid="iphone-15-pro"`** | string | **Hardware Fidelity**. Specific Model ID for exact viewport and safe-area emulation. |
| **`model="iPhone 14"`** | string | **Fuzzy Match**. Human-readable device name; system finds the closest match. |
| **`orientation="landscape"`** | enum | **Perspective**. Sets rotation. Triggers `@landscape` CSS variants. |
| **`zoom="fill"`** | enum | **Presentation**. `auto` (default/capped at 1.0x), `fill` (stretch to sidebar), `none` (1:1). |
| **`lock-view`** | flag | **Intent**. Hides emulation controls; strictly enforces header settings. |
| **`no-placeholder`** | flag | Suppresses guidance cards for non-rendering components. |

> **Precedence**: `mid` > `model` > `device`. `id` is mandatory for any stateful fence.

**Semantic device choices** — the DSL expresses design intent, not just viewport size:

| Choice | When to use |
|--------|-------------|
| `device=mobile zoom=fill` | App screens — show them at full size, as designed |
| `device=tablet orientation=landscape zoom=fill` | Widescreen flows — onboarding, dashboards, split views |
| `device=none` | Components at natural width — cards, widgets, charts |
| `device=none lock-view` | Narrative-frozen — no controls, pure illustration |
| `zoom=fill` | "Experience as designed" — device fills the panel |
| `zoom=auto` | "See the device in context" — device at natural or smaller size |

> **When to use `device`**: Device profiles are for **product screens** — views the end user sees on their phone, tablet, or desktop. Compositional widgets shown in isolation to explain a core concept (e.g., a mortality bar, a rating scale, a chart) should **not** specify `device` or `orientation`. They render at natural size within the document flow. The distinction: if it's *what the user holds*, give it a device. If it's *what the reader learns from*, let it breathe.

### 3. Styling Logic (The Container-First Rule)

Reactive MD wraps every component in a containment context (`container-type: size`). Your layout must respond to the **emulated device dimensions**, not the VS Code window.

- **PROHIBITED**: Standard media queries and viewport units. In Tailwind, this means `md:`, `lg:`, `sm:` (no `@` prefix). In CSS, this means `@media (min-width: ...)` and `vw`/`vh` units. These all respond to the global VS Code window and will not reflect device emulation.
- **REQUIRED**: Container queries and container units.
  - **Tailwind v4**: Use the `@` prefix for responsive variants — `@md:`, `@lg:`, `@xl:` (e.g., `@md:grid-cols-2`, `@lg:p-8`). These respond to the component's container, not the window.
  - **Vanilla CSS**: Use `@container` rules (e.g., `@container (min-width: 768px) { ... }`). Use container units `cqw`, `cqh` instead of `vw`, `vh`.
- **Orientation Variants**:
  - **Tailwind**: `@landscape:flex-row`, `@portrait:flex-col`
  - **CSS**: `@container (orientation: landscape) { ... }`

### 4. Fence Entry & Import Patterns

**Fence languages**: `jsx live`, `tsx live`, `css live`. Both JSX and TSX are fully supported.

**Entry point resolution**: the sole `export` if present; then the last top-level PascalCase function.

Two patterns for organizing fences:
- **Inner functions** (rapid drafting): `function Entry() { function Helper() {...}; return <Helper />; }`
- **Explicit export** (production-style): define helpers first, then `export function Entry() {...}`

**The Demo Pattern** (preferred for extracted components):
Wrap imported components in a Demo function that provides data via props. This separates presentation from data, makes the component's API explicit, and lets you swap data sources trivially.

````markdown
```jsx live
import Component from './lib/ui/Component.jsx';
import data from './data/sample.json';

export function Demo() {
  return (
    <Component
      items={data.items}
      onSelect={(item) => console.log('Selected:', item)}
    />
  );
}
```
````

**Import patterns**:
- `import './styles.css'` (Native CSS)
- `import data from './data.json'` (Mock Data)
- `import { motion } from 'motion/react'` (Bundled Library)
- `import { Card } from './Card.jsx'` (Sidecar Component)

**Data sourcing**: `import data from './data.json'` is the preferred pattern — offline, version-controlled, and fast. Use `fetch()` only when validating a live API integration; wrap it in `useEffect`, handle loading and error states, and expect CORS constraints. See `references/recipes/data-loading/spec.md` for both patterns side by side.

### 5. Sidecar File Rules (`.jsx` | `.tsx`)
- **Inline Exports**: Use `export function Component()`. This ensures the Preview button appears at the definition.
- **Avoid Tail-End Exports**: Do not place `export default` at the bottom of a file, separated from the code.
- **Helper Components**: Non-exported helpers are supported. JavaScript hoisting handles placement.
- **Library Discipline**: Use named exports for utilities; reserve `export default` for the primary "App" component.
- **Pure Presentation**: Props control all behavior. Components should support flexible prop types (e.g., `period: number | object`) and provide sensible defaults. Never hard-code data inside a reusable component — receive it via props from the Demo fence.
- **Resilient Defaults**: When a sidecar is opened directly, the extension renders all exports in Gallery Mode with empty props. Always default props that are used as components or iterated over:
  
  ```jsx
  // Fragile — crashes if Icon is undefined
  export function FeatureIcon({ icon: Icon }) {
    return <Icon size={24} />;
  }
  // Resilient — safe in Gallery Mode
  export function FeatureIcon({ icon: Icon = () => null }) {
    return <Icon size={24} />;
  }
  ```

### 6. Theme & CSS Variables

Use `css live` fences for document-scoped styles. The system injects `--rmd-bg` and `--rmd-fg` variables that adapt to the active VS Code theme — use them to keep components readable in both light and dark modes.

````markdown
```css live
:root {
  --accent: var(--rmd-fg);
}
.brand-card {
  border: 1px solid var(--accent);
  background: var(--rmd-bg);
}
```
````

### 7. Common Pitfalls

Full list with code examples → **[references/pitfalls.md](references/pitfalls.md)**

The most critical failures to avoid:
- **Import all hooks explicitly** — `useState`, `useMemo`, etc. are not globals; `React.useMemo(...)` throws.
- **Guard browser globals in `useEffect`** — `window`/`document`/`localStorage` crash Markdown Preview (SSR).
- **No top-level `await`** — syntax error; all async work goes inside `useEffect`.
- **Local files via `import`, never `fetch()`** — local paths are not HTTP-accessible.
- **One export per fence** — multiple named exports create entry-point ambiguity; extras become non-exported helpers.
- **No `forwardRef`** — React 19 removed it; `ref` is a plain prop.

---

## Spec Templates

Starter skeletons for Product Spec, Quick Prototype, and Brownfield UX Redesign:
→ **[references/templates.md](references/templates.md)**

Load this file when the user asks you to generate a document. Match the skeleton to the
use case, then fill in the placeholders. For Brownfield: confirm screenshots exist in
`screenshots/current/` before writing — the AS-IS view is a Markdown image, not a React fence.

---

## Before You Generate

When the request is ambiguous, ask:
- **Type**: Product spec for async review, or quick prototype for solo iteration?
- **Audience**: Solo exploration, or team review that needs to reach a decision?
- **Depth**: Sketch (one screen), feature (2–5 screens), or full product (end-to-end)?
- **Greenfield or brownfield?** If brownfield: *"Please provide screenshots of the current screens in `screenshots/current/`. I'll embed them as Markdown images, annotate the friction, then write the proposed redesign as live React fences — no codebase access needed."*

A product spec for team review needs the full literate structure with context zone, design decisions, and end-to-end integration. A quick prototype does not. A brownfield redesign needs screenshots before any fences are written.

---

## Integrity Checklist

Before delivering, run this audit:

1.  **Arguable?** Could a reviewer say yes or no to the design without a follow-up meeting?
2.  **Narrated?** Prose earns every demo. No fence appears without context that makes it matter.
3.  **Decisions documented?** Non-obvious design choices explained after every fence.
4.  **Resilient?** Exported components have full default props. (Ensures stability in Gallery Mode.)
5.  **Stable?** Stateful fences have a stable `id`.
6.  **Scenario-tested?** For full-system docs: distinct fixtures for first-time and established user states.
7.  **Clean?** Fences are under 10 lines of "glue code." Logic exceeding 30 lines is extracted to sidecars.
8.  **Local?** No external CDNs. Only bundled packages.
9.  **Pathed?** All local imports use relative paths (e.g., `./proto-kit.jsx`).

---

## Package & Data Reference (Offline Registry)

The following libraries are available **offline** (no CDN required) in both previews:

| Category | Packages |
| :--- | :--- |
| **Motion** | `motion/react` (exported as `motion`) |
| **Icons** | `lucide-react`, `@heroicons/react` |
| **State** | `zustand`, `jotai`, `react-hook-form` |
| **Validation** | `zod`, `@hookform/resolvers/zod` (`zodResolver`) |
| **Logic** | `es-toolkit`, `dayjs`, `uuid` |
| **Styles** | `clsx`, `tailwind-merge` (`twMerge`), `class-variance-authority` (`cva`) |

## Boundaries & Refusals
- **No External CDNs**: Refuse `axios`, `swr`, `recharts`, `react-query`, or external scripts. Use native `fetch()` for external APIs and SVG/Tailwind for visualizations.
- **No Infrastructure**: Refuse Docker, CI/CD, databases, or real-time WebSockets.
- **Scoped Prototypes**: Steer complex "Full-App" requests toward high-fidelity User Flows and interactive specs that demonstrate the core UX intent.

## Examples
Refer to these recipes for pattern matching:
- **[Product Spec](references/recipes/product-spec/spec.md)**: Full literate structure — WHO/PROBLEM/WHY → per-screen demos with design decisions → end-to-end integration. Study this first for any async-review document.
- **[Feature Spec](references/recipes/feature-spec/spec.md)**: Hub-and-spoke document structure with a sidecar library; the canonical single-feature PRD template.
- **[User Flow](references/recipes/user-flow/spec.md)**: Multi-screen flow with navigation state — signup, onboarding, plan selection.
- **[A/B Test Proposal](references/recipes/a-b-test-proposal/spec.md)**: Compare variants with hypothesis, live demos, and success metrics.
- **[Fidelity Audit](references/recipes/fidelity-audit/spec.md)**: Test responsive boundaries and safe areas across a device matrix.
- **[Visual Essays](references/recipes/visual-essays/spec.md)**: Narrative storytelling with embedded SVG charts.
- **[Dark Mode Toggle](references/recipes/dark-mode-toggle/spec.md)**: `css live` blocks and sidecar CSS — the only recipe demonstrating live CSS theming.
- **[Multi-Sidecar Architecture](references/recipes/notification-system/spec.md)**: Multiple imported sidecar components coordinated across one document.
- **[Data Loading Patterns](references/recipes/data-loading/spec.md)**: JSON import vs. `fetch()` — when to use each, side by side.
- **[DSL Showcase](references/recipes/dsl-showcase/spec.md)**: Every fence modifier demonstrated — device emulation, orientation, zoom, lock-view.
- **[Competitive Analysis](references/recipes/competitive-analysis/spec.md)**: Conclusion-first structure — executive summary → score matrix → feature comparison → strategic insights → recommendation. The document makes a call, not just shows data.
- **[Brownfield UX Refinement](references/recipes/brownfield-redesign/spec.md)**: Screenshot-as-AS-IS → friction callouts → React fence for the redesign → optional `CompareView` side-by-side → migration notes. Copy `compare-view.jsx` from this recipe into your document folder.
