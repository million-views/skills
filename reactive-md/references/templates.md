---
title: Spec Templates
status: reference
---

# Spec Templates

Starter skeletons for each document type. Match to the use case, then fill in the
placeholders. Read the corresponding recipe for a fully worked example.

---

## Product Spec (async team review)

For: new features or products going to a team for async review and approval.
Companion recipe: `recipes/product-spec/`.

````markdown
# Feature Name

## Who This Is For
One paragraph. Specific person, specific frustration.

## The Problem
What they're missing and why it matters. No solutions yet.

## Why Now
Market timing or opportunity. Why not six months ago?

## The Solution: [Framing]
One sentence. Then the first demo.

```jsx live id="key-screen" device=mobile zoom=fill
import { KeyScreen } from './lib/ui/KeyScreen.jsx';
import { DEMO_DATA } from './data/demo-data.js';
export function Demo() { return <KeyScreen {...DEMO_DATA} />; }
```

**Design decisions:**
- **[Choice]**: [Why this, not the alternative]
- **[Edge case]**: [How handled and why]

## [Next Screen]
...

## End to End
Navigation state table. FTUE scenario. Daily-use scenario.

## Decision
Concrete recommendation. Next step.
````

---

## Quick Prototype (solo iteration)

For: rapid exploration of a single idea; no team review required.

````markdown
# Feature Name

## The Idea
```jsx live id="main" device=mobile zoom=fill
...
```

## Edge Cases
Loading, empty, error states.
````

---

## Brownfield UX Refinement (existing codebase redesign)

For: improving screens that already exist. Screenshots required before writing.
Companion recipe: `recipes/brownfield-redesign/` — includes `compare-view.jsx`.

> **Before writing anything**, confirm screenshots of the current experience exist in
> `screenshots/current/`. If not, ask the product owner to provide them.
> The AS-IS view is a Markdown image, not a React fence.

````markdown
# [Screen/Flow] UX Redesign

**Status:** draft | review | approved

## Who Uses This Today
One paragraph. Specific person, specific task, specific context.

## The Problem with the Current Experience
What is broken, where users drop off or struggle. Evidence if available
(error rates, support tickets, usability research). No demos yet.

## The Cost of Not Fixing This
User drop-off, support volume, conversion impact. Quantify where possible.

---

## Audit: [Screen Name]

![Screen Name — current state](./screenshots/current/01-screen-name.png)

**Friction points:**
- **[Pain point 1]**: [What the user experiences and why it fails]
- **[Pain point 2]**: [Where they abandon or make errors]

---

## Redesign: [Screen Name]

```jsx live id="proposed-[screen]" device=mobile zoom=fill
import { ProposedScreen } from './proposed-screen.jsx';
export function Demo() { return <ProposedScreen />; }
```

**Design decisions:**
- **[Change]**: [Why this, not the original approach]
- **[What was preserved]**: [What stayed and why it was worth keeping]
- **[Rejected alternative]**: [What was considered and discarded]

---

## Side-by-Side (optional)

```jsx live id="[screen]-compare" device=none
import { CompareView } from './compare-view.jsx';
import { ProposedScreen } from './proposed-screen.jsx';
export function Compare() {
  return (
    <CompareView screenshotSrc="./screenshots/current/01-screen-name.png">
      <ProposedScreen />
    </CompareView>
  );
}
```

---

## Migration Notes
Behavioral deltas: what changes for existing users.
Rollout strategy: feature flag, incremental rollout, or breaking change?
Compatibility constraints: anything that cannot change without a migration path.

## Decision
Concrete recommendation. What ships first. What gets deferred.
````
