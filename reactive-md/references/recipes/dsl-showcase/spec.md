# DSL Showcase

A reference document demonstrating every fence modifier in the Reactive MD DSL.
Use this as a playground to understand how device emulation, orientation, zoom, and identity anchors affect your prototypes.

## 1. Liquid Mode (The Default)

When no device modifiers are specified, the component renders as a standard block element — no emulation frame, no fixed viewport. This is ideal for simple UI elements.

```jsx live id="liquid-card"
function LiquidCard() {
  return (
    <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900 mb-2">Default: Liquid</h3>
      <p className="text-sm text-slate-600 leading-relaxed">
        No <code>device</code> modifier. This card expands to fill available width
        and grows with its content height. Resize your editor to see it reflow.
      </p>
    </div>
  );
}
```

## 2. Mobile Portrait (Standard)

The most common emulation target. The component "believes" it is on a 375×667 viewport.

```jsx live id="mobile-portrait" device=mobile
import { Smartphone } from 'lucide-react';

function MobileDemo() {
  return (
    <div className="h-full bg-gradient-to-b from-indigo-50 to-white flex flex-col items-center justify-center p-6 font-sans">
      <Smartphone className="w-10 h-10 text-indigo-500 mb-4" />
      <h2 className="text-xl font-bold text-slate-900 mb-1">Mobile Portrait</h2>
      <p className="text-sm text-slate-500 text-center">
        375 × 667 — iPhone SE logical viewport
      </p>
    </div>
  );
}
```

## 3. Mobile Landscape

Same logical device, rotated. The `@landscape:` Tailwind variant activates and `@portrait:` deactivates.

```jsx live id="mobile-landscape" device=mobile orientation=landscape
function LandscapeDemo() {
  return (
    <div className="h-full bg-emerald-50 flex items-center justify-center p-6 font-sans">
      <div className="text-center">
        <h2 className="text-xl font-bold text-emerald-900 mb-1">Landscape Mode</h2>
        <p className="text-sm text-emerald-600">
          667 × 375 — same device, rotated 90°
        </p>
        <div className="mt-4 flex gap-3 justify-center">
          <div className="@portrait:hidden px-3 py-1.5 bg-emerald-600 text-white text-xs rounded-full font-medium">
            Visible in landscape
          </div>
          <div className="@landscape:hidden px-3 py-1.5 bg-amber-600 text-white text-xs rounded-full font-medium">
            Visible in portrait
          </div>
        </div>
      </div>
    </div>
  );
}
```

## 4. Tablet

768×1024 — iPad Classic logical viewport. Use `@md:` container queries to adapt layout.

```jsx live id="tablet-view" device=tablet
function TabletDemo() {
  return (
    <div className="h-full bg-sky-50 flex items-center justify-center p-8 font-sans">
      <div className="@md:grid @md:grid-cols-2 @md:gap-8 flex flex-col gap-4 max-w-lg">
        <div className="p-5 bg-white rounded-lg border border-sky-200">
          <h3 className="font-semibold text-sky-900 mb-1">Panel A</h3>
          <p className="text-sm text-sky-600">Side-by-side on tablet via <code>@md:grid-cols-2</code></p>
        </div>
        <div className="p-5 bg-white rounded-lg border border-sky-200">
          <h3 className="font-semibold text-sky-900 mb-1">Panel B</h3>
          <p className="text-sm text-sky-600">Stacked on mobile, split on wider viewports</p>
        </div>
      </div>
    </div>
  );
}
```

## 5. Desktop

1920×1080 — Full HD. Use `@lg:` and `@xl:` variants for wide layouts.

```jsx live id="desktop-view" device=desktop
function DesktopDemo() {
  return (
    <div className="h-full bg-slate-900 flex items-center justify-center p-8 font-sans">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Desktop HD</h2>
        <p className="text-slate-400">1920 × 1080 logical viewport</p>
        <div className="mt-6 @xl:flex @xl:gap-4 grid gap-3">
          <div className="px-4 py-2 bg-slate-800 rounded-lg text-slate-300 text-sm">Module 1</div>
          <div className="px-4 py-2 bg-slate-800 rounded-lg text-slate-300 text-sm">Module 2</div>
          <div className="px-4 py-2 bg-slate-800 rounded-lg text-slate-300 text-sm">Module 3</div>
        </div>
      </div>
    </div>
  );
}
```

## 6. Hardware Model ID (`mid`)

For pixel-perfect fidelity. Emulates the exact viewport, safe-area insets, and Dynamic Island of a specific device.

```jsx live id="iphone-pro" mid=iphone-15-pro lock-view
function HardwareDemo() {
  return (
    <div className="h-full bg-black text-white flex flex-col font-sans"
         style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">iPhone 15 Pro</h2>
          <p className="text-sm text-slate-400 mb-4">
            Exact hardware viewport with Dynamic Island
          </p>
          <p className="text-xs text-slate-500">
            <code>mid=iphone-15-pro</code> + <code>lock-view</code>
          </p>
        </div>
      </div>
      <div className="px-6 pb-4 text-center text-xs text-slate-600">
        Safe-area insets are applied via env()
      </div>
    </div>
  );
}
```

## 7. Zoom Modes

### 7a. Zoom: Fill
Stretches to fill the sidebar width regardless of logical size. Good for presentations.

```jsx live id="zoom-fill" device=mobile zoom=fill
function FillDemo() {
  return (
    <div className="h-full bg-violet-50 flex items-center justify-center font-sans">
      <div className="text-center p-6">
        <h2 className="text-xl font-bold text-violet-900 mb-1">Zoom: Fill</h2>
        <p className="text-sm text-violet-600">Stretched to sidebar width</p>
      </div>
    </div>
  );
}
```

### 7b. Zoom: None (1:1)
No scaling — renders at exact logical pixels. May cause horizontal scrolling if the viewport exceeds the panel width.

```jsx live id="zoom-none" device=mobile zoom=none
function NativeDemo() {
  return (
    <div className="h-full bg-amber-50 flex items-center justify-center font-sans">
      <div className="text-center p-6">
        <h2 className="text-xl font-bold text-amber-900 mb-1">Zoom: None</h2>
        <p className="text-sm text-amber-600">1:1 pixel-perfect — may scroll</p>
      </div>
    </div>
  );
}
```

## 8. Lock View

Hides the emulation controls in Interactive Preview. Use this when the viewport is part of the spec — the reviewer should see exactly what you defined, no toggles.

```jsx live id="locked-spec" device=mobile lock-view
function LockedDemo() {
  return (
    <div className="h-full bg-rose-50 flex items-center justify-center font-sans">
      <div className="text-center p-6">
        <h2 className="text-xl font-bold text-rose-900 mb-1">Locked View</h2>
        <p className="text-sm text-rose-600">
          No device picker or zoom toggles visible.
          The spec author controls the viewport.
        </p>
      </div>
    </div>
  );
}
```

## 9. Stable Identity (`id`)

The `id` modifier prevents state loss when you edit prose around the fence.
Try editing the text in this section — the counter below will survive because the fence has a stable identity anchor.

```jsx live id="stateful-counter" device=mobile
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="h-full bg-white flex flex-col items-center justify-center gap-4 font-sans">
      <span className="text-5xl font-bold text-indigo-600 tabular-nums">{count}</span>
      <div className="flex gap-3">
        <button
          onClick={() => setCount(c => c - 1)}
          className="px-4 py-2 bg-slate-100 rounded-lg text-slate-700 font-medium hover:bg-slate-200"
        >
          −
        </button>
        <button
          onClick={() => setCount(c => c + 1)}
          className="px-4 py-2 bg-indigo-600 rounded-lg text-white font-medium hover:bg-indigo-700"
        >
          +
        </button>
      </div>
      <p className="text-xs text-slate-400">Edit the prose around this fence — count survives.</p>
    </div>
  );
}
```

## 10. TypeScript Fence (`tsx live`)

TSX fences are fully supported. Use them when you want type safety in your prototypes.

```tsx live id="typed-badge"
interface BadgeProps {
  label: string;
  variant?: 'info' | 'success' | 'warning';
}

function Badge({ label, variant = 'info' }: BadgeProps) {
  const colors = {
    info: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-amber-100 text-amber-800',
  };

  return (
    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${colors[variant]}`}>
      {label}
    </span>
  );
}

export default function BadgeGallery() {
  return (
    <div className="p-6 flex flex-wrap gap-3 items-center">
      <Badge label="Info" variant="info" />
      <Badge label="Success" variant="success" />
      <Badge label="Warning" variant="warning" />
    </div>
  );
}
```

## 11. CSS Live Context

A `css live` fence defines document-wide styles. Every component below it inherits these tokens.

```css live
:root {
  --brand-accent: #6366f1;
  --brand-surface: #eef2ff;
}

.brand-card {
  background: var(--brand-surface);
  border-left: 4px solid var(--brand-accent);
  padding: 1rem 1.25rem;
  border-radius: 0.5rem;
  font-family: system-ui, sans-serif;
}

.brand-card h4 {
  color: var(--brand-accent);
  margin: 0 0 0.25rem;
  font-size: 0.95rem;
}

.brand-card p {
  color: #475569;
  margin: 0;
  font-size: 0.85rem;
}
```

```jsx live id="css-consumer"
function BrandDemo() {
  return (
    <div className="p-6 flex flex-col gap-4">
      <div className="brand-card">
        <h4>Custom Token</h4>
        <p>This card uses <code>--brand-accent</code> defined in the css live fence above.</p>
      </div>
      <div className="brand-card">
        <h4>Document Scope</h4>
        <p>All components in this document inherit these styles.</p>
      </div>
    </div>
  );
}
```

---

## Quick Reference

| Modifier | Values | Default | Purpose |
| :--- | :--- | :--- | :--- |
| `id` | any kebab-case string | (none) | Stable identity anchor |
| `device` | `mobile`, `tablet`, `desktop`, `none` | `none` | Emulation category |
| `mid` | device model id | (none) | Exact hardware emulation |
| `model` | device name string | (none) | Fuzzy device match |
| `orientation` | `portrait`, `landscape` | `portrait` | Viewport rotation |
| `zoom` | `auto`, `fill`, `none` | `auto` | Scaling strategy |
| `lock-view` | (flag) | off | Hide emulation controls |
| `no-placeholder` | (flag) | off | Suppress guidance cards |
