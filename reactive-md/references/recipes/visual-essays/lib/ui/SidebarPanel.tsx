import * as React from 'react';

/**
 * SidebarPanel — vertical stack with consistent gap.
 * Use as the root container for any sidebar content block.
 */
export function SidebarPanel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-[3.5cqh]">
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------

interface SidebarStatProps {
  /** Short uppercase label displayed above the value */
  label: string;
  /** The numeric or string value to display large */
  value: string | number;
  /** Short unit label rendered in accent color, e.g. "UNIT" or "MEAN" */
  unit?: string;
  /** Longer explanatory text rendered below the value */
  note?: string;
}

/**
 * SidebarStat — large numeric metric with label, optional unit and note.
 */
export function SidebarStat({ label, value, unit, note }: SidebarStatProps) {
  return (
    <div className="flex flex-col">
      <span className="text-[min(7.5px,1.6cqh)] font-black text-slate-400 uppercase mb-[0.8cqh] tracking-widest leading-none">
        {label}
      </span>
      <div className="flex items-baseline gap-1">
        <span className="text-[min(28px,6.5cqh)] font-black text-slate-950 tabular-nums leading-none tracking-[-0.05em]">
          {value}
        </span>
        {unit && (
          <span className="text-[min(10px,2cqh)] font-black text-indigo-500 uppercase">
            {unit}
          </span>
        )}
      </div>
      {note && (
        <p className="m-0 mt-[1cqh] text-[min(11px,2.2cqh)] text-slate-500/80 italic font-medium leading-[1.6]">
          {note}
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------

interface SidebarCardProps {
  /** Optional label chip rendered above the body text */
  label?:      string;
  /** 'neutral' (default) = white bg + subtle border; 'indigo' = indigo-tinted bg */
  accent?:     'indigo' | 'neutral';
  /** 'slate' (default) = muted label; 'indigo' = accent label */
  labelColor?: 'indigo' | 'slate';
  children:    React.ReactNode;
}

/**
 * SidebarCard — text card with optional label chip and accent variant.
 */
export function SidebarCard({
  label,
  accent     = 'neutral',
  labelColor = 'slate',
  children,
}: SidebarCardProps) {
  const bg = accent === 'indigo'
    ? 'bg-indigo-50/30 border-indigo-100'
    : 'bg-white border-slate-200/60 shadow-sm';
  const lc = labelColor === 'indigo' ? 'text-indigo-600' : 'text-slate-400';

  return (
    <div className={`p-[3.5cqw] border rounded-[2px] ${bg}`}>
      {label && (
        <span className={`block text-[min(7.5px,1.5cqh)] font-black uppercase tracking-[0.2em] whitespace-nowrap leading-none mb-[1cqh] ${lc}`}>
          {label}
        </span>
      )}
      <p className="m-0 text-[min(11px,2.2cqh)] font-medium text-slate-600 leading-snug">
        {children}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------

interface SidebarProgressProps {
  /** Short uppercase label displayed above the bar */
  label:   string;
  /** Fill percentage, clamped to 0–100 */
  percent: number;
  /** Optional status text rendered below the bar in accent color */
  status?: string;
}

/**
 * SidebarProgress — labeled progress bar with optional status line.
 */
export function SidebarProgress({ label, percent, status }: SidebarProgressProps) {
  const clamped = Math.max(0, Math.min(100, percent));

  return (
    <div className="flex flex-col gap-[1.5cqh]">
      <span className="text-[min(7.5px,1.6cqh)] font-black text-slate-400 uppercase tracking-[0.25em] leading-none">
        {label}
      </span>
      <div className="h-[2cqh] w-full bg-slate-100/60 rounded-full overflow-hidden shadow-inner">
        <div
          className="h-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.3)]"
          style={{ width: `${clamped}%` }}
        />
      </div>
      {status && (
        <span className="text-[min(11px,2.2cqh)] font-bold text-indigo-600 italic uppercase leading-none">
          {status}
        </span>
      )}
    </div>
  );
}
