---
name: reactive-md
description: Literate UI/UX for product teams - accelerate from idea to working prototype in minutes using markdown with embedded interactive React components. Use for fast iteration and async collaboration on product specs, wireframes, user flows, feature demos, and design documentation. Replaces static documentation and handoff tools (like Figma or Storybook) with executable specs in version control.
license: MIT
metadata:
  version: "1.1.0"
  author: million-views (https://m5nv.com)
---

# Reactive MD

Generate functional markdown documents with embedded interactive React components. This skill is optimized for creating high-fidelity, emulated prototypes where the "Logical Reality" of the device is preserved regardless of the editor's width.

## The Senior's Quality Bar (Philosophy)

To reach senior-level expertise in Literate UI/UX, follow these three non-negotiable principles:

1.  **The Document is the Product**: Your markdown is not just documentation; it is a functional prototype. If the code is messy, the design is considered unverified.
2.  **Logical Truth over Literal Appearance**: Never design for the "now" (what you see in your sidebar). Design for the "target" (the emulated device). Use **Container Queries** exclusively.
3.  **Clean Spines, Rich Sidecars**: Keep the primary `.md` file (The Spine) focused on the narrative "Why." Move the "How" (implementation details) into sidecar `.jsx` files.

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
- **`styles.css`**: Design tokens and advanced layout hacks.

### 2. Viewport Specification (DSL)
Establish the "Reality" in the first line of the code fence:
` ```jsx live id="stable-name" device=mobile orientation=portrait `
- **`id`**: **MANDATORY**. Prevents state loss during prose edits. Use kebab-case.
- **`device`**: `mobile` | `tablet` | `desktop` | `none` (liquid).
- **`orientation`**: `portrait` | `landscape`.
- **`zoom`**: `auto` (default) | `fill` (stretch) | `none` (1:1).

### 3. Styling Logic (The Container First Rule)
- **PROHIBITED**: Standard Media Queries (`md:`, `lg:`) and `vw`/`vh` units. They break during emulation.
- **REQUIRED**: **Container Queries** (`@md:`, `@lg:`) and Container Units (`cqw`, `cqh`). Use them for everything responsive.
- **Native CSS**: Supported via `css live` or imported files. Use for "UI Grid" precision.

## The Integrity Checklist (The Senior's Pass)

Before delivering, run this mental audit:
1.  **Is it resilient?** Do exported components have full default props? (Ensures stability when previewed directly in Gallery Mode).
2.  **Is it stable?** Is there a stable `id` on the main interactive fence?
3.  **Is it clean?** Are all helper components defined **BEFORE** the `export default` in sidecar files?
4.  **Is it local?** No external CDNs. Only use bundled packages (Lucide, Motion, etc.).
5.  **Is it narrated?** Does the prose explain the *intent* of the prototype or the screen that is being designed?

### Styling Strategy
Reactive MD supports both native CSS and Tailwind CSS (v4) in both preview modes.
- **Logical Reality**: Always use **Container Queries** (`@md:`) instead of Media Queries (`md:`). Elements respond to the emulated frame size, not the global window.
- **Native CSS**: Supported via `css live` fences or imported `.css` files. Use for advanced UI iteration and fine-grained layout control.
- **Tailwind v4**: Available out-of-the-box. Use the `@` prefix for responsive variants (e.g., `@md:grid-cols-2`, `@lg:p-8`).
- **Orientation Variants**: Use `@landscape:` and `@portrait:` for responsive layouts that adapt to emulated device rotation.

## Authoring Reference

### Fence Specification & Anchors
` ```jsx live [id] [device] [orientation] [zoom] [mid] [lock-view] `

| Anchor | Type | Principle |
| :--- | :--- | :--- |
| **`id="stable-id"`** | string | **Stability**. Prevents app-remount on prose edits. Essential for forms/state. |
| **`device="mobile"`** | enum | **Context**. Targets `mobile`, `tablet`, `desktop`. Default is `none` (liquid). |
| **`orientation="landscape"`** | enum | **Perspective**. Sets rotation. Triggers `@landscape` CSS variants. |
| **`zoom="fill"`** | enum | **Presentation**. `auto` is default; `fill` expands to sidebar width. |
| **`lock-view`** | flag | **Intent**. Standardizes UI by hiding manual emulator controls. |

### Visual Storytelling Rules
- **Non-Executable Discourse**: For anti-patterns or broken code, wrap regular fences in markdown backticks.
- **Library Discipline**: Sidecars are libraries, not just snippets. Export multiple components to be composed in the `spec.md`. 
- **Preview Resilience**: Always use **default props** for presentation components. This ensures that when you open the sidecar file directly, every component is previewable in **Gallery Mode** without crashing.
- **The Ideal Fence**: Import complex UI from your sidecars; keep the fence under 10 lines of "glue code."
- **Import Patterns**:
  - `import './styles.css'` (Native CSS)
  - `import data from './data.json' with { type: 'json' }` (Mock Data)
  - `import { motion } from 'motion/react'` (Animation)

## Boundaries & Refusals
- **No CDNs**: Refuse `axios`, `swr`, `recharts`, or external scripts. Use native `fetch` and bundled registry.
- **No DevOps**: Refuse Docker, deployment, or database setup.
- **Scoped Prototypes**: Steer complex "Full-App" requests toward high-fidelity User Flows and interactive specs.

## Technical Integrity Checklist

Before delivering, ensure:
1.  **Pathing**: All local imports use absolute-relative paths (e.g., `./proto-kit.jsx` or `./idea-kit.jsx`).
2.  **Sidecars**: Logic/UI exceeding 30 lines is extracted to a sidecar file.
3.  **Single Entry Point**: The `live` fence has exactly one primary component function or top-level element.
4.  **Helper Placement**: Non-exported helper components in sidecar files are defined **BEFORE** the `export default`.
5.  **Preview Safety**: Exported components provide default prop values to prevent rendering crashes in standalone gallery view.
6.  **Stable ID**: Fences with state (forms, filters) must have a stable `id="..."`.

## Package & Data Reference (Offline Registry)

The following libraries are available **offline** (no CDN required) in both previews:

| Category | Packages |
| :--- | :--- |
| **Motion** | `motion/react` (exported as `motion`) |
| **Icons** | `lucide-react`, `@heroicons/react` |
| **State** | `zustand`, `jotai`, `react-hook-form` |
| **Logic** | `es-toolkit`, `dayjs`, `uuid` |
| **Styles** | `clsx`, `tailwind-merge` (`twMerge`), `class-variance-authority` (`cva`) |

### Rule: No External CDNs
Prototypes are local-first. Refuse requests for `recharts`, `axios`, `swr`, or `react-query`. Use native `fetch()` and SVG/Tailwind for visualizations (refer to `chart-components.jsx`).

## Workflow: The "Project Folder" Model

Treat every literate doc as a **Hub-and-Spoke** system.

1.  **The Hub (`spec.md`)**: Narrative-driven entry point.
2.  **The Spokes**: `.jsx`, `.css`, and `.json` sidecars for implementation.

**Multi-File Architecture (Example):**
```
feature-name/
  spec.md              <- Narrative explaining "Why" and "How"
  idea-kit.jsx         <- Implementation library (Shared across fences)
  styles.css           <- Design system tokens and brand CSS
  data.json            <- Mock payload for prototypes
```

## Boundaries & Refusals
- **Infrastructure**: Refuse requests for Docker, CI/CD, databases, or real-time WebSockets.
- **Complexity**: If a user asks for a full-scale app, steer them toward a high-fidelity "Literate Prototype" that demonstrates the core user flows and UX intent rather than full system implementation.

## Examples
Refer to these recipes for pattern matching:
- **[A/B Test Proposal](references/recipes/a-b-test-proposal/spec.md)**: Compare components with business metrics.
- **[Fidelity Audit](references/recipes/fidelity-audit/spec.md)**: Test responsive boundaries and safe areas.
- **[Visual Essays](references/recipes/visual-essays/spec.md)**: Narrative storytelling with SVG charts.
- **[Multi-File Imports](references/recipes/notification-system/spec.md)**: Complex component organization.

