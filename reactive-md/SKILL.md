---
name: reactive-md
description: Literate UI/UX for product teams - accelerate from idea to working prototype in minutes using markdown with embedded interactive React components. Use for fast iteration and async collaboration on product specs, wireframes, user flows, feature demos, and design documentation. Replaces static documentation and handoff tools (like Figma or Storybook) with executable specs in version control.
license: MIT
metadata:
  version: "1.2.0"
  author: million-views (https://m5nv.com)
---

# Reactive MD

Generate functional markdown documents with embedded interactive React components. This skill is optimized for creating high-fidelity, emulated prototypes where the "Logical Reality" of the device is preserved regardless of the editor's width.

## The Senior's Quality Bar (Philosophy)

To reach senior-level expertise in Literate UI/UX, follow these three non-negotiable principles:

1.  **The Document is the Product**: Your markdown is not just documentation; it is a functional prototype. If the code is messy, the design is considered unverified.
2.  **Logical Truth over Literal Appearance**: Never design for the "now" (what you see in your sidebar). Design for the "target" (the emulated device). Use **Container Queries** exclusively.
3.  **Clean Spines, Rich Sidecars**: Keep the primary `.md` file (The Spine) focused on the narrative "Why." Move the "How" (implementation details) into sidecar `.jsx`/`.tsx` files.

## Primary Use Cases & Triggers

Use this skill when the user mentions:
- **Product Specs / PRDs**: "Draft a spec for...", "Create a PRD with a prototype..."
- **Visual Essays**: "Write a data story about...", "Create a visual essay for..."
- **Interactive Demos**: "Build a clickable mockup...", "Prototype the login flow..."
- **Fidelity Audits**: "Check the responsive behavior of...", "Audit the mobile UI..."
- **Living Docs**: "Create a component gallery...", "Document this design system..."

---

## Technical Directives

### 1. The Hub-and-Spoke Workflow
Always treat a project as a multi-file system.
- **`spec.md`**: The narrative entry point. Start here. Use prose to set the stage.
- **Sidecar Libraries**: Implementation modules (e.g., `proto-kit.jsx`, `idea-kit.jsx`). Use these as shared libraries to serve multiple fences across your document. Extract logic here if a fence exceeds 30 lines.
- **`styles.css`**: Design tokens and advanced layout.

**Flat structure** (simple projects, few components):
```
feature-name/
  spec.md              <- Narrative explaining "Why" and "How"
  proto-kit.jsx        <- Implementation library (shared across fences)
  styles.css           <- Design system tokens and brand CSS
  data.json            <- Mock payload for prototypes
```

**Nested structure** (larger projects, many components):
```
feature-name/
  spec.md              <- Narrative (prose + live demos)
  lib/ui/              <- Components >100 lines or reused across fences
    Component.jsx
  data/                <- Mock data, fixtures
    sample.json
  styles.css           <- Design tokens
```

**Extraction thresholds:**
- **<50 lines, single-use**: Keep inline in the fence.
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

> **Precedence**: `mid` > `model` > `device`.

> **`id` is mandatory** for any fence with user state (forms, filters, tabs). Always use it.

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

**Import patterns**:
- `import './styles.css'` (Native CSS)
- `import data from './data.json'` (Mock Data)
- `import { motion } from 'motion/react'` (Bundled Library)
- `import { Card } from './Card.jsx'` (Sidecar Component)

### 5. Sidecar File Rules (`.jsx` | `.tsx`)
- **Inline Exports**: Use `export function Component()`. This ensures the Preview button appears at the definition.
- **Avoid Tail-End Exports**: Do not place `export default` at the bottom of a file, separated from the code.
- **Helper Components**: Non-exported helpers are supported. JavaScript hoisting handles placement.
- **Library Discipline**: Use named exports for utilities; reserve `export default` for the primary "App" component.
- **Pure Presentation**: Props control all behavior. Components should support flexible prop types (e.g., `period: number | object`) and provide sensible defaults. Never hard-code data inside a reusable component — receive it via props from the Demo fence.

---

## Integrity Checklist

Before delivering, run this audit:

1.  **Resilient?** Exported components have full default props. (Ensures stability in Gallery Mode.)
2.  **Stable?** Stateful fences have a stable `id`.
3.  **Clean?** Fences are under 10 lines of "glue code." Logic exceeding 30 lines is extracted to sidecars.
4.  **Local?** No external CDNs. Only bundled packages.
5.  **Narrated?** Prose explains the *intent* — the "why" of the design, not just what it does.
6.  **Pathed?** All local imports use relative paths (e.g., `./proto-kit.jsx`).
7.  **Single Entry?** Each `live` fence renders one component via `export` or last PascalCase function.

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
- **[Feature Spec](references/recipes/feature-spec/spec.md)**: Hub-and-spoke product spec with sidecar library.
- **[A/B Test Proposal](references/recipes/a-b-test-proposal/spec.md)**: Compare components with business metrics.
- **[Fidelity Audit](references/recipes/fidelity-audit/spec.md)**: Test responsive boundaries and safe areas.
- **[Visual Essays](references/recipes/visual-essays/spec.md)**: Narrative storytelling with SVG charts.
- **[Multi-File Imports](references/recipes/notification-system/spec.md)**: Complex component organization.
- **[DSL Showcase](references/recipes/dsl-showcase/spec.md)**: Fence modifiers, device emulation, and orientation.
