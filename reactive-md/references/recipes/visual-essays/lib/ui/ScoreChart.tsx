import * as React from 'react';
import { motion } from 'motion/react';
import { SidebarPanel, SidebarStat } from './SidebarPanel.tsx';

function useIsSSR(): boolean {
  return typeof window === 'undefined' || (window as any).__REACTIVE_MD_SSR__ === true;
}

interface ScoreItem {
  /** Display name for this row */
  name:       string;
  /** Score from 0–100; drives bar width and the green/amber status dot */
  score:      number;
  /** When true the bar is styled with the primary accent color */
  highlight?: boolean;
}

interface StatItem {
  /** Short uppercase label displayed above the value */
  label: string;
  /** The numeric or string value to display */
  value: string | number;
  /** Short unit label rendered in accent color, e.g. "%" or "×" */
  unit?: string;
  /** Longer explanatory note rendered below the value */
  note?: string;
}

interface Props {
  /** Rows to render; each entry becomes an animated bar */
  data?:  ScoreItem[];
  /** Optional header title rendered above the bars */
  title?: string;
  /**
   * Optional stat items for the right-hand analysis panel (visible at @lg+).
   * If omitted the panel is hidden.
   */
  stats?: StatItem[];
}

function BarRow({ item, index, isSSR }: { item: ScoreItem; index: number; isSSR: boolean }) {
  return (
    <motion.div
      initial={isSSR ? false : { x: -10, opacity: 0 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04, ease: 'easeOut' }}
      className="px-[5cqw] py-[3cqh] @md:py-[2.5cqh] flex justify-between items-center hover:bg-slate-50/80 transition-all cursor-default group/row border-b border-slate-100 last:border-0"
    >
      <div className="flex flex-col">
        <span className="text-slate-300 text-[min(7px,1.5cqh)] font-black uppercase tracking-widest mb-1 group-hover/row:text-indigo-400 transition-colors">
          SEC_0{index + 1}
        </span>
        <span className="text-slate-900 text-[min(15px,3.4cqh)] font-black tracking-tight uppercase italic leading-none">
          {item.name}
        </span>
      </div>

      <div className="flex flex-col items-end gap-[1.2cqh]">
        <div className="h-[0.8cqh] w-[25cqw] bg-slate-100 rounded-full overflow-hidden shadow-inner">
          <motion.div
            style={{ width: isSSR ? `${item.score}%` : 0 }}
            initial={isSSR ? false : { width: 0 }}
            animate={{ width: `${item.score}%` }}
            transition={{ duration: 1.2, delay: 0.1 + index * 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-indigo-600 text-[min(13px,3cqh)] font-black tabular-nums tracking-tighter leading-none">
            {item.score}%
          </span>
          <div className={`w-1 h-1 rounded-full ${item.score > 80 ? 'bg-emerald-500' : 'bg-amber-400'}`} />
        </div>
      </div>
    </motion.div>
  );
}

function StatPanel({ stats }: { stats: StatItem[] }) {
  return (
    <div className="hidden @lg:flex w-[38%] bg-slate-50/30 border-l border-slate-200/60 p-[5cqw] flex-col gap-[4cqh]">
      <div className="flex flex-col gap-[1cqh]">
        <span className="text-[min(9px,2cqh)] font-black text-slate-400 uppercase tracking-[0.25em] leading-none">
          ANALYSIS
        </span>
        <div className="h-px bg-slate-200 w-1/3" />
      </div>
      <SidebarPanel>
        {stats.map((s, i) => (
          <SidebarStat key={i} label={s.label} value={s.value} unit={s.unit} note={s.note} />
        ))}
      </SidebarPanel>
    </div>
  );
}

/**
 * ScoreChart — animated horizontal bar chart for ranking competitors.
 *
 * Each row is a named entry with a 0–100 score. The optional `stats` panel
 * (right side, visible at @lg+) accepts caller-provided analysis items — no
 * hardcoded copy.
 */
export function ScoreChart({ data = [], title, stats }: Props) {
  const isSSR = useIsSSR();

  return (
    <div className="h-full w-full bg-white flex flex-col overflow-hidden font-sans">
      {title && (
        <div className="px-[5cqw] py-[3cqh] border-b border-slate-100 bg-slate-50/30">
          <h3 className="m-0 text-[min(20px,4.5cqh)] font-black tracking-[-0.03em] text-slate-950 uppercase italic">
            {title}
          </h3>
        </div>
      )}

      <div className="flex-1 overflow-y-auto flex @lg:flex-row flex-col">
        <div className="flex-1 divide-y divide-slate-100">
          {data.map((item, i) => (
            <BarRow key={item.name} item={item} index={i} isSSR={isSSR} />
          ))}
        </div>

        {stats && stats.length > 0 && <StatPanel stats={stats} />}
      </div>
    </div>
  );
}
