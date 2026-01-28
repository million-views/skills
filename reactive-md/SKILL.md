---
name: reactive-md
description: Literate UI/UX for product teams - accelerate from idea to working prototype in minutes using markdown with embedded interactive React components. Use for fast iteration and async collaboration on product specs, wireframes, user flows, feature demos, and design documentation. Replaces static documentation and handoff tools (like Figma or Storybook) with executable specs in version control.
license: MIT
metadata:
  version: "1.1.0"
  author: million-views (https://m5nv.com)
---

# Reactive MD

Generate functional markdown documents with embedded interactive React components for product design collaboration.

## Reference Documentation

**[GUIDE.md](references/GUIDE.md)** - Complete technical reference, troubleshooting, patterns, and dos/donts
**[use-cases.md](references/use-cases.md)** - Example implementations for each primary use case

(Consult these resources throughout for detailed guidance, pattern examples, and reference implementations.)

## When to Use This Skill

Use reactive-md when the user asks to create:

**Primary Use Cases:**
- Product specs with working prototypes
- User flow wireframes and interactive demos
- Feature prototypes, concept exploration, and visual demos
- A/B tests, dashboards, component galleries
- Interactive documentation and living specifications
- Data journalism and visual essays (narrative storytelling with animated visualizations)

**Aliases**: "visual essay", "data story", "live doc", "prototype", "POC", "interactive spec" all refer to reactive-md documents.

## Core Capabilities

Reactive-md documents support:

**Two Preview Modes:**
1. **Markdown Preview**: Offline, bundled packages only, server-side rendering
2. **Interactive Preview** (`Cmd+K P`): Browser-based webview, supports CDN packages and platform APIs

**Interactive Fences (CRITICAL):**

**When to use `live` modifier:**
- User wants to **see/interact** with the component
- Creating a working demo or prototype
- Showing how something works in practice
- All primary use cases (prototypes, concept exploration, specs, wireframes, demos)

**When to use regular fences (no `live`):**
- Explaining **how** something works (discourse about the code)
- Showing anti-patterns or broken examples
- Comparing different approaches side-by-side
- Code snippets that are incomplete or won't run standalone

**Syntax:**
- `` ```jsx live `` - JavaScript + JSX components (executable)
- `` ```tsx live `` - TypeScript + JSX components (executable)
- `` ```css live `` - CSS stylesheets (executable)
- `` ```jsx `` - Code examples for discussion (non-executable)
- `` ```tsx `` - Code snippets for illustration (non-executable)
- `` ```css `` - CSS snippets for illustration (non-executable)

**Modifiers & Anchors:**
- **`id="stable-name"`** - Prevents a **Component Refresh** (reload) when editing the surrounding narrative. Essential for maintaining state while writing.
- **`device="mobile"`** - Sets the initial emulation viewport (also `tablet`, `desktop`).
- **`orientation="portrait"`** - Sets the initial rotation: `portrait` or `landscape`.
- **`lock-view`** - Standalone flag to strictly enforce DSL viewport settings.

**For Anti-Patterns and Discourse:**
When showing anti-patterns or broken examples in documentation, wrap the code fence in markdown backticks to prevent execution:

````markdown
<!-- ❌ Wrong: Top-level JSX with imports doesn't work -->
```jsx live
import Card from './Card.jsx';
<Card />
```
````

This clearly signals the wrapped code fence is for **illustration only** (showing what NOT to do), not for execution.

**The correct `jsx live` pattern** always imports and wraps JSX in a component function:
```jsx live
import { useState } from 'react';
import Card from './references/recipes/feature-spec/proto-kit.jsx';

function Demo() {
  return <Card />;
}
```

**Default behavior:** When in doubt, use `live` - reactive-md's purpose is interactive demos.

**File Types:**
- **Markdown (`.md`)** - Primary document only (entry point for preview)
- **JSX/TSX (`.jsx`, `.tsx`)** - Primary viewable OR dependent (can be imported)
- **Logic & Utils (`.js`, `.mjs`, `.ts`)** - Dependent only (logic/utilities imported by components)
- **CSS (`.css`)** - Dependent only (imported by JSX or via `css live` fences)
- **JSON (`.json`)** - Dependent only (imported by JSX/TSX)

**Hot Module Reload:** Edit any file → preview updates automatically

**Import Patterns (Where and How):**
- **In `.jsx`/`.tsx` files or `jsx live` fences:** Use `import './style.css'` or `import data from './data.json' with { type: 'json' }`
- **In `.css` files or `css live` fences:** Use `@import './other.css'`

## Technical Integrity Checklist

Before delivering, ensure:
1.  **Container Root**: Does the root JSX element of the `live` fence have the `@container` class? (Mandatory for responsive emulation).
2.  **Pathing**: Are all local imports using absolute-relative paths (e.g., `./proto-kit.jsx`)?
3.  **Sidecars**: Has logic/UI exceeding 30 lines been extracted to a sidecar file? (Follow the "Project Folder" model).
4.  **Single Entry Point**: Does the `live` fence have exactly one primary component or top-level JSX element to render? (Consult **GUIDE.md** for sidecar library discipline and export rules).
5.  **Preview Safety**: Do exported sidecar components have default prop values? (Ensures the **Interactive Preview** doesn't crash with "Minified React error #130" when rendering components in standalone Gallery mode without parent data).
6.  **Stable ID (Optional)**: If the component has interactive state (forms, filters), does the fence have a stable `id="..."` to prevent state loss during narrative edits?


## Package & Data Reference

### Bundled (Offline/Static)
`dayjs`, `motion/react` (renamed from `framer-motion`), `lucide-react`, `clsx`, `es-toolkit`.

### CDN (Interactive Only)
`zustand`, `jotai`, `tailwind-merge`, `react-hook-form`, `lucide-react`.

### Remote Data Pattern
Always initialize state with defaults for **Markdown Preview** SSR compatibility.

```jsx live id="data-fetcher"
import { useState, useEffect } from 'react';
import { Display, LoadingState } from './references/recipes/feature-spec/proto-kit.jsx';

function DataDemo() {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch('https://api.example.com/data').then(r => r.json()).then(setData);
  }, []);
  return <div>{data ? <Display data={data} /> : <LoadingState />}</div>;
}
```

## Styling
Reactive MD uses a `container-first` styling system:

- **Tailwind v4 (Primary)**: Standard utility classes + Container Query variants.
- **CSS Context (`css live`)**: Use for document-wide custom properties or brand tokens. Apply these to subsequent components via semantic classes.
- **Sidecar CSS**: For complex, component-specific styles (import in `.jsx`).

### Rule #1 (The Responsive Root)
To ensure prototypes respond to **emulated device sizes** (the `ViewportFrame`) rather than the VS Code pane, follow these rules:

1.  **Containment**: The root element of every `jsx live` fence **must** use the Tailwind `@container` class or native `container-type: inline-size`.
2.  **Container Queries**: When using Tailwind, use the `@` prefix for all responsive variants (e.g., `@md:grid-cols-2`, `@lg:p-12`).
3.  **Forbidden**: Do NOT use standard Media Query variants (e.g., `md:`, `lg:` in Tailwind) as they target the entire IDE window.


## File Organization: The "Project Folder" Model

Treat every literate doc as a hub-and-spoke system.

- **The Hub**: A clean `.md` narrative that explains the "Why" and "How."
- **The Spokes**: Sidecar `.jsx`, `.css`, and `.json` files for implementation details.
- **Extraction Rule**: If a component or logic fence exceeds **30 lines**, extract it to a sidecar file.

### Multi-File Architecture
Always prefer a structured project folder approach for non-trivial tasks (anything requiring more than one component).

**Example structure:**
```
feature-name/
  spec.md              (The Hub: Narrative + High-level Demo)
  component-name.jsx   (The Spoke: Implementation)
  styles.css           (The Spoke: Custom styles/tokens)
  data.json            (The Spoke: Mock data)
```

**Workflow:**
1.  **Analyze**: Determine the core components and data structures needed to narrate the story effectively.
2.  **Scaffold**: Create the sidecar files (`.jsx`, `.css`, `.json`) first.
3.  **Narrate**: Write the primary `.md` file, importing the components into live fences.
4.  **Stable Identity**: ALWAYS use `id="unique-string"` in fences that have interactive state (forms, filters) to prevent unmounting during narrative edits.


## Examples

**Read example files in [references/recipes/](references/recipes/) to see how to write functional live docs:**

- **[references/recipes/feature-spec/](references/recipes/feature-spec/)** - Product specification with working components and edge case handling
- **[references/recipes/a-b-test-proposal/](references/recipes/a-b-test-proposal/)** - A/B test methodology with business metrics and comparison widget
- **[references/recipes/visual-essays/](references/recipes/visual-essays/)** - Data journalism, market research, and visual storytelling using SVG charts and matrices
- **[references/recipes/user-flow/](references/recipes/user-flow/)** - Multi-step flows with validation, error handling, and success states
- **[references/recipes/dark-mode-toggle/](references/recipes/dark-mode-toggle/)** - Multi-file imports, external `.jsx` and `.css` files
- **[references/recipes/notification-system/](references/recipes/notification-system/)** - Multi-component architecture, folder organization
- **[references/recipes/data-loading/](references/recipes/data-loading/)** - JSON imports and API fetch patterns

## Boundaries & Refusals (CRITICAL)

### esm.sh Limitations (Forbidden)
Do NOT use these packages in **Interactive Preview** (they fail via esm.sh):
- `recharts`: (Missing `clsx` dependency resolution). Use SVG/Tailwind for charts.
- `swr`: (Missing context shim). Use `fetch()` + `useState`.
- `@tanstack/react-query`: (Multi-instance conflicts). Use `zustand`.

### Infrastructure
Refuse requests for deployment, Docker, databases, or real-time WebSockets. Prototypes are client-side only (local persistence via `localStorage` is okay).

