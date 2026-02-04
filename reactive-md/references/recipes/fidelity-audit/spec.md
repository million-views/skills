# Design System Fidelity Audit

High-fidelity UI/UX work depends on the **Logical Truth** of your environment: the certainty that a component set to `375px` behaves exactly like a `375px` device, regardless of visual scaling.

> [!IMPORTANT]
> **Logical vs. Literal Truth**:
> In a webview-based editor, there is a distinction between the **Literal Truth** (the physical size of the VS Code window) and the **Logical Truth** (the emulated size of your component). Standard `@media` queries are "Literally True" to the browser, but useless for design; they would see the whole 1920px screen. Reactive MD prioritizes **Logical Truth**, ensuring your CSS reflects the emulated device dimensions via Container Queries.

> [!TIP]
> **A Container-First Future**: Reactive MD intentionally prioritizes **Container Queries** over standard Media Queries. Because standard media queries target the entire VS Code window, this environment nudges you towards adopting container-aware CSS. This is a powerful architectural shift: your components become truly portable, responding to their immediate emulated viewport (the device) rather than a distant global window. Over time, you'll find this makes your design system significantly more resilient and easier to migrate between platforms.

This document demonstrates how to use Reactive MD to audit your design system's responsiveness and scaling fidelity.

---

## 1. The Plastic Bezel Rule
**The Concept**: Digital devices don't grow physical scrollbars. Software scrolls *inside* the screen.

In this audit, we verify that scrollbars appear inside the emulated device (The Artboard) and never on the outer frame (The Bezel).

```jsx live device=mobile orientation=portrait zoom=none
import { ZoomDiagnostic } from './FidelityToolkit.tsx';

export default function BezelAudit() {
  return (
    <div className="p-8 bg-slate-50 min-h-[100cqh] flex flex-col items-center gap-6">
      <ZoomDiagnostic title="Bezel Fidelity" />

      {/* Forced lateral overflow */}
      <div className="w-[600px] h-24 bg-indigo-600 flex items-center justify-center text-white font-black shadow-lg rounded-2xl">
        600px OVERFLOW
      </div>

      <div className="h-[1500px] w-full bg-white border-2 border-slate-200 rounded-2xl flex items-center justify-center text-slate-300 font-bold">
         Long Scroll Content
      </div>
    </div>
  );
}
```

**Observation Guide**:
- Hover over the indigo bar and use your scroll wheel.
- The scrollbar MUST appear **inside** the thin border of the device.
- This ensures your components handle overflow within their emulated environment correctly.

---

## 2. Aspect-Ratio & Container Truth
**The Concept**: Components should respond to the device's logical orientation, not the computer's window size.

We use **Container Queries** (`@container`) to ensure that rotating the device triggers layout changes, while resizing the VS Code sidebar does not—maintaining isolated fidelity.

```jsx live device=mobile orientation=landscape zoom=auto
import { ZoomDiagnostic, OrientationIndicator } from './FidelityToolkit.tsx';

export default function RotationAudit() {
  return (
    <div className="h-[100cqh] flex flex-col items-center justify-center p-8 transition-colors duration-700 @portrait:bg-blue-50 @landscape:bg-emerald-50">
      <ZoomDiagnostic title="Rotation Truth" />

      <div className="mt-8 flex flex-col @landscape:flex-row items-center gap-8">
        <OrientationIndicator />

        <div className="p-6 bg-white rounded-2xl border-4 border-slate-200 @landscape:border-emerald-500 transition-all shadow-sm">
          <p className="text-xs text-slate-500 font-bold uppercase tracking-tight">
            Border turns <span className="text-emerald-600">Emerald</span> in Landscape.
          </p>
        </div>
      </div>
    </div>
  );
}
```

**Observation Guide**:
- Click the **Rotate** icon in the header.
- The background should turn Emerald and the box should rotate.
- **The Test**: Shrink your VS Code sidebar. The background must stay Indigo/Blue as long as the device is in Portrait, even if the panel itself becomes "landscape" shaped.

---

## 3. Visual Zoom & Pixel Integrity
**The Concept**: Scaled-down UI must maintain its logical dimensions to satisfy `@container` queries.

```jsx live device=tablet zoom=auto
import { ZoomDiagnostic } from './FidelityToolkit.tsx';

export default function ZoomAudit() {
  return (
    <div className="h-[100cqh] flex flex-col items-center justify-center p-8 bg-slate-50 border-4 border-dashed border-slate-200">
      <ZoomDiagnostic title="Scaling Sync" />

      <div className="mt-8 text-slate-400">
        <p className="text-sm font-medium italic">Adjust panel width to see scale updates.</p>
      </div>
    </div>
  );
}
```

---

## 4. Height Parity & Layout Collapse
**The Concept**: In standard web layouts, `height: 100%` requires a strict chain of defined parent heights. If any intermediate wrapper in the shell lacks a height, the component collapses.

This test audits whether a component set to **Fill the Artboard** (`min-h-full`) actually does so, or if it collapses to its content height.

```jsx live device=tablet orientation=landscape zoom=none
import { ZoomDiagnostic, GutterDiagnostic } from './FidelityToolkit.tsx';

export default function HeightParityAudit() {
  return (
    <div className="min-h-full w-full bg-emerald-500/10 flex flex-col items-center justify-center p-8 border-4 border-emerald-500 gap-4">
      <div className="bg-white p-6 rounded-2xl shadow-xl border border-emerald-100 flex flex-col items-center gap-4">
        <ZoomDiagnostic title="Height Parity" />

        <div className="text-center space-y-2">
          <p className="text-xs font-bold text-emerald-800 uppercase">Parity Check</p>
          <p className="text-[10px] text-emerald-600 max-w-[200px]">
            The Emerald border and light green background MUST fill the entire device screen.
          </p>
        </div>
      </div>
      <GutterDiagnostic />
    </div>
  );
}
```

**Observation Guide**:
1. Check the **Markdown Preview** (SSR): The emerald border should fill the mobile screen (375px height in landscape).
2. Check the **Interactive Preview** (Webview): If the shell has a "leaky" height chain, the emerald border will shrink-wrap around the white card, leaving empty space or appearing much shorter than the SSR version.
3. This discrepancy is the "Bad News" we are hunting.

## 5. Play: The Fidelity Challenge
**The Scenario**: You've achieved height parity, but suddenly a vertical scrollbar appears in mobile portrait mode, even though "the content should fit."

**The Trap**: Authors often use aggressive padding (`p-8` is 32px) and gaps (`gap-4` is 16px) that consume valuable logical pixels. In a `375x667` portrait view:
1. `p-8` top/bottom = **64px**
2. `border-4` top/bottom = **8px**
3. `gap-4` = **16px**
4. **Total non-content height** = **88px**.
This leaves only **579px** for your cards. If `ZoomDiagnostic` and `GutterDiagnostic` together exceed 579px, you get a scrollbar.

**The Fix**: Do not apply "band-aids" in the system CSS. Instead, author with **Responsiveness in Mind**:

1. **Change the DSL**: Change the fence header to `device=mobile orientation=portrait`.
2. **Observe**: The vertical scrollbar appears because the content exceeds the 667px logical limit.
3. **The Fix**: Update your component to be more efficient on small screens:
   - Change `p-8` to `@md:p-8 p-4` (Reducing padding to 16px on mobile).
   - Change `justify-center` to `justify-start` or `@md:justify-center` to allow natural scrolling.
   - Reduce the `gap-4` to `gap-2` for mobile.

```jsx
// Fixed for Mobile Portrait
<div className="min-h-full w-full bg-emerald-500/10 flex flex-col items-center @md:justify-center p-4 @md:p-8 border-4 border-emerald-500 gap-2 @md:gap-4">
  {/* Content now fits or scrolls gracefully from top */}
</div>
```

---

## 6. Gutter Calibration & Scrollbar Sync
**The Concept**: Digital layout is often asymmetric because of the "Scrollbar Tax."

The `GutterDiagnostic` tool allows you to measure exactly where your device sits in the physical window. This is critical for matching the "Gutter Logic" between the Webview and VS Code's Markdown Preview.

**Interpretation Guide**:
- **Scroller Start**: The "Home Base" padding defined by your design system (Target: 96px).
- **Internal Gutter**: The "Sub-pixel Air" (Target: 2px). If this is 0px, your borders will clip at high zoom levels.
- **Right Offset**: If this is larger than the Scroller Start, you have a vertical scrollbar active. In high-fidelity work, we use this to adjust the "Center of Gravity" for the preview.
- **Offsets Must Match**: For perfect parity, the `Bezel Left (Abs)` value here should be identical to the measured offset in the Markdown Preview.

---

## 7. Sub-pixel Edge Detection
**The Concept**: 100% width must be exactly 100% width. No "1px ghost gaps."

```jsx live device=mobile orientation=landscape zoom=none
export default function EdgeCheck() {
  return (
    <div className="w-full h-[100cqh] bg-pink-600 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-1 bg-white/20" />
      <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20" />

      <div className="w-[100cqw] h-12 bg-white flex items-center justify-center text-pink-600 font-black text-xs">
        100CQW EDGE-TO-EDGE
      </div>
    </div>
  );
}
```

**Observation**:
- The white bar should touch the left and right edges perfectly with no horizontal scrollbars within the device.
