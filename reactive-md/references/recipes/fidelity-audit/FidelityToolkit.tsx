import React, { useState, useEffect } from 'react';

/**
 * FidelityToolkit: A high-fidelity diagnostic suite for design system auditing.
 *
 * This toolkit demonstrates how to verify "Logical Truth" in Reactive MD by
 * comparing the Logical Intent (requested via DSL) against the
 * Experienced Reality (measured in the browser).
 *
 * It uses the public DOM contract provided by the 4-Tier ViewportFrame:
 * - Tier 0 (Scroller): .canvas-scroller
 * - Tier 1 (Bezel): .physical-viewport
 * - Tier 2 (Lens): .display-container
 * - Tier 3 (Artboard): .content-normalizer (Sovereign Neutrality applies here)
 */

/**
 * ZoomDiagnostic: Displays resolution and scale diagnostics.
 */
export function ZoomDiagnostic({ title = 'Fidelity Audit' }) {
  const [experienced, setExperienced] = useState({ width: 0, height: 0 });
  const [intent, setIntent] = useState({ width: 0, height: 0, zoom: 'unknown', orientation: 'unknown', label: 'unknown' });
  const rootRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const update = () => {
      const bezel = el.closest('.physical-viewport') as HTMLElement;
      // V1.1.2 FIDELITY FIX: We measure the Display Container (Tier 2) or Artboard (Tier 3)
      // instead of the Bezel (Tier 1). The Bezel accounts for physical borders (+2px),
      // while the inner containers represent the "Logical Screen" (Artboard).
      const artboard = el.closest('.display-container') as HTMLElement;
      const scroller = el.closest('.canvas-scroller') as HTMLElement;

      if (bezel && artboard && scroller) {
        const style = getComputedStyle(bezel);
        const rect = artboard.getBoundingClientRect();

        setIntent({
          width: parseInt(style.getPropertyValue('--rmd-logical-width')) || 0,
          height: parseInt(style.getPropertyValue('--rmd-logical-height')) || 0,
          zoom: scroller.getAttribute('data-rmd-zoom-mode') || 'unknown',
          orientation: bezel.getAttribute('data-rmd-orientation') || 'unknown',
          label: bezel.getAttribute('data-rmd-device-label') || 'unknown'
        });

        setExperienced({
          width: Math.round(rect.width),
          height: Math.round(rect.height)
        });
      }
      frameId = requestAnimationFrame(update);
    };

    let frameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId);
  }, []);

  const scale = intent.width > 0 ? experienced.width / intent.width : 1.0;

  const rowStyle = "flex justify-between border-b border-slate-100 py-1 last:border-0";
  const labelStyle = "text-[10px] font-bold text-slate-400 uppercase tracking-tighter";
  const valueStyle = "text-[10px] font-mono text-slate-600";

  return (
    <div ref={rootRef} className="bg-white/95 backdrop-blur-md border-2 border-slate-200 rounded-xl p-4 shadow-xl w-full max-w-sm pointer-events-none select-none my-4">
      <div className="flex items-center gap-2 mb-3 border-b-2 border-slate-100 pb-2">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">{title}</h3>
      </div>

      <div className="space-y-1">
        <div className="text-[9px] font-black text-indigo-500 mb-1 truncate">
          LOGICAL TRUTH ({intent.label}, {intent.orientation})
        </div>
        <div className={rowStyle}>
          <span className={labelStyle}>Resolution</span>
          <span className={valueStyle}>{intent.width}x{intent.height}</span>
        </div>
        <div className={rowStyle}>
          <span className={labelStyle}>Zoom Mode</span>
          <span className={valueStyle}>{intent.zoom}</span>
        </div>

        <div className="text-[9px] font-black text-emerald-500 mt-3 mb-1">EXPERIENCED REALITY</div>
        <div className={rowStyle}>
          <span className={labelStyle}>Artboard Size</span>
          <span className={valueStyle}>{experienced.width}x{experienced.height}</span>
        </div>
        <div className={rowStyle}>
          <span className={labelStyle}>Calculated Scale</span>
          <span className={`text-[10px] font-mono font-bold ${scale > 1.01 ? 'text-orange-500' : scale < 0.99 ? 'text-blue-500' : 'text-emerald-600'}`}>
            {scale.toFixed(4)}x
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * GutterDiagnostic: Measures exact browser-to-artboard physical offset for synchronizing scrollbar headers.
 * Useful for finding the 'Universal Gutter' constant via fine-grained measurement.
 */
export function GutterDiagnostic() {
  const [offsets, setOffsets] = useState({ left: 0, right: 0, windowWidth: 0, scrollerLeft: 0 });
  const [vars, setVars] = useState({ target: '...', ext: '...' });
  const ref = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      const bezel = ref.current?.closest('.physical-viewport');
      const scroller = ref.current?.closest('.canvas-scroller');
      if (bezel && scroller) {
        const rect = bezel.getBoundingClientRect();
        const scRect = scroller.getBoundingClientRect();
        setOffsets({
          left: Math.round(rect.left),
          right: Math.round(window.innerWidth - rect.right),
          windowWidth: window.innerWidth,
          scrollerLeft: Math.round(scRect.left)
        });

        // Read real-time parity constants from CSS variables
        const style = getComputedStyle(document.documentElement);
        setVars({
          target: style.getPropertyValue('--rmd-parity-target-total-gutter').trim() || 'N/A',
          ext: style.getPropertyValue('--rmd-parity-external-body-padding').trim() || 'N/A'
        });
      }
    };
    window.addEventListener('resize', update);
    update();
    return () => window.removeEventListener('resize', update);
  }, []);

  const internalGutter = offsets.left - offsets.scrollerLeft;

  return (
    <div ref={ref} className="bg-slate-900 text-white rounded-lg p-3 font-mono text-[9px] shadow-2xl border border-white/10 uppercase tracking-widest flex flex-col gap-1">
      <div className="flex justify-between border-b border-white/10 pb-1 mb-1 font-black text-emerald-400">
        <span>Gutter Calibration</span>
        <span>{offsets.windowWidth}px</span>
      </div>
      <div className="flex justify-between">
        <span className="text-slate-500">Scroller Start</span>
        <span className="text-white font-bold">{offsets.scrollerLeft}px</span>
      </div>
      <div className="flex justify-between">
        <span className="text-slate-500">Bezel Left (Abs)</span>
        <span className="text-emerald-400 font-bold">{offsets.left}px</span>
      </div>
      <div className="flex justify-between">
        <span className="text-slate-500">Internal Gutter</span>
        <span className="text-orange-400 font-bold">{internalGutter}px</span>
      </div>
      <div className="flex justify-between">
        <span className="text-slate-500">Right Offset</span>
        <span className="text-emerald-400 font-bold">{offsets.right}px</span>
      </div>
      <div className="mt-2 pt-2 border-t border-white/10 flex flex-col gap-1">
        <div className="flex justify-between">
          <span className="text-slate-500 text-[7px] uppercase tracking-tighter">Target Gutter</span>
          <span className="text-white/50 text-[7px] px-1 rounded bg-white/5 select-all">{vars.target}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500 text-[7px] uppercase tracking-tighter">Ext Padding</span>
          <span className="text-white/50 text-[7px] px-1 rounded bg-white/5 select-all">{vars.ext}</span>
        </div>
      </div>
      <div className="mt-2 text-[8px] text-slate-400 leading-tight italic">
        * Match offsets between views for exact scrollbar parity.
      </div>
    </div>
  );
}

/**
 * OrientationIndicator: Visualizes Container Query detection for rotation.
 */
export function OrientationIndicator() {
  return (
    <div className="w-24 h-24 rounded-2xl bg-slate-900 shadow-2xl flex items-center justify-center transition-all duration-700
                    @portrait:scale-90 @landscape:scale-110 group">
      <div className="relative w-12 h-8 border-2 border-white/30 rounded-md transition-all duration-700
                      @portrait:rotate-90 @landscape:rotate-0">
        <div className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full bg-white/50" />
      </div>
    </div>
  );
}
