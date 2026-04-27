---
title: Common Pitfalls
status: reference
---

# Common Pitfalls

Failure modes that cause render errors or silent misbehavior in live fences.
Check this list before delivering any document.

---

## 1. React hooks are not globals — always import them

The JSX transform is automatic but hooks are not. Every hook used in a fence
must be imported explicitly.

```jsx
// ❌ Crashes — useState is not defined
function Counter() {
  const [n, setN] = useState(0);
  return <button onClick={() => setN(n + 1)}>{n}</button>;
}

// ✅ Correct
import { useState } from 'react';
function Counter() {
  const [n, setN] = useState(0);
  return <button onClick={() => setN(n + 1)}>{n}</button>;
}
```

This includes `useMemo`, `useEffect`, `useRef`, `useCallback`, and all others.
`React` itself is not a global either — never write `React.useState(...)`.

---

## 2. `useMemo` for stable date/random values — import it, don't prefix it

A common skill instruction is "use `React.useMemo(() => new Date(), [])` for date
fixtures." This throws `ReferenceError: React is not defined`. The correct form:

```jsx
// ❌ Throws ReferenceError
const today = React.useMemo(() => new Date(), []);

// ✅ Correct
import { useMemo } from 'react';
const today = useMemo(() => new Date(), []);
```

---

## 3. `window` / `document` / `localStorage` accessed at render time crashes Markdown Preview

Markdown Preview runs server-side (Node.js). Browser globals do not exist there.
Any component that reads them during render will throw on the static preview path.

```jsx
// ❌ Throws in Markdown Preview
function Banner() {
  const w = window.innerWidth; // ReferenceError
  return <div>{w}px</div>;
}

// ✅ Guard inside useEffect — runs only in the browser
import { useState, useEffect } from 'react';
function Banner() {
  const [w, setW] = useState(0);
  useEffect(() => { setW(window.innerWidth); }, []);
  return <div>{w}px</div>;
}
```

Applies to: `window`, `document`, `navigator`, `localStorage`, `sessionStorage`,
`location`, `history`, `matchMedia`, `ResizeObserver`, `IntersectionObserver`.

---

## 4. No top-level `await` — wrap all async work in `useEffect`

Top-level `await` is a syntax error in this execution context. AI assistants
frequently write it as an alternative to `useEffect`. It always fails.

```jsx
// ❌ Syntax error
const data = await fetch('/api/items').then(r => r.json());

// ✅ Correct
import { useState, useEffect } from 'react';
function List() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    fetch('/api/items').then(r => r.json()).then(setItems);
  }, []);
  return <ul>{items.map(i => <li key={i.id}>{i.name}</li>)}</ul>;
}
```

---

## 5. Local files must use `import`, never `fetch()`

`fetch('./data.json')` fails for local files in the extension's security context.
Always use ESM static import for local assets.

```jsx
// ❌ Fails — local paths are not HTTP-accessible
useEffect(() => { fetch('./data/users.json').then(...) }, []);

// ✅ Correct
import users from './data/users.json';
```

---

## 6. One exported component per fence — multiple exports create ambiguity

Entry point resolution: **the sole `export`** if present; otherwise the **last
top-level PascalCase function**. When a fence has multiple named exports, the
renderer picks the last one — often not what was intended.

```jsx
// ❌ Ambiguous — which one renders?
export function CardSmall() { return <div>S</div>; }
export function CardLarge() { return <div>L</div>; }

// ✅ One export per fence; helpers are non-exported
function CardSmall() { return <div>S</div>; }
export function CardLarge() { return <div>L</div>; }
```

Move multi-export components to a sidecar file and import them individually
per fence when you need to show more than one.

---

## 7. `export default` placement — first position is fine, tail-end is not

"Avoid tail-end exports" means: do not write `export default` as a separate
statement at the bottom of the file, disconnected from the function. A
first-position `export default function App()` is perfectly valid.

```jsx
// ❌ Tail-end — preview button does not appear at the definition
function App() { return <div>hello</div>; }
export default App;

// ✅ First-position — preview button appears at the function
export default function App() { return <div>hello</div>; }

// ✅ Also fine — named inline export
export function App() { return <div>hello</div>; }
```

---

## 8. `forwardRef` does not exist in React 19 — use `ref` as a direct prop

React 19 removed `forwardRef`. AI assistants trained on older patterns will
still generate it. It throws a runtime error.

```jsx
// ❌ React 19: forwardRef is not a function
import { forwardRef } from 'react';
const Input = forwardRef((props, ref) => <input ref={ref} {...props} />);

// ✅ React 19: ref is a plain prop
function Input({ ref, ...props }) {
  return <input ref={ref} {...props} />;
}
```

---

## 9. Missing `key` on list renders — silent reconciliation bugs

Not a crash, but causes stale-render bugs and React warnings. Every `.map()`
that returns JSX must have a stable `key` on the outermost element.

```jsx
// ❌ Missing key — React warns, list may render stale items
items.map(item => <li>{item.name}</li>)

// ✅ Stable key (prefer id over index)
items.map(item => <li key={item.id}>{item.name}</li>)
```

Use a stable identifier (`id`, `slug`, `uuid`) over array index. Index keys
cause incorrect animation and focus behavior when the list reorders.

---

## 10. External APIs: always handle loading and error states

A fetch that renders nothing while loading shows a blank fence — indistinguishable
from a broken component. Always provide explicit loading and error UI.

```jsx
import { useState, useEffect } from 'react';

export function ProductList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://api.example.com/products')
      .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(data => { setItems(data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, []);

  if (loading) return <div className="p-4 text-gray-400">Loading…</div>;
  if (error)   return <div className="p-4 text-red-500">Error: {error}</div>;
  return <ul>{items.map(i => <li key={i.id}>{i.name}</li>)}</ul>;
}
```
