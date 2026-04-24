import * as React from 'react';
import { motion } from 'motion/react';

function useIsSSR(): boolean {
  return typeof window === 'undefined' || (window as any).__REACTIVE_MD_SSR__ === true;
}

// Minimum column widths that trigger horizontal scroll before any clipping occurs.
const FEATURE_COL_MIN = 160; // px — feature name column
const COMP_COL_MIN    = 110; // px — each competitor column

/**
 * 'full'    → indigo ACTIVE badge
 * 'partial' → amber PARTIAL badge
 * 'none'    → empty circle (absent)
 * 'na'      → N/A label (not applicable)
 */
type SupportLevel = 'full' | 'partial' | 'none' | 'na';

interface Column {
  /** Label shown in the dark header bar for this competitor column */
  label:      string;
  /** When true the column gets an indigo tint to mark the primary/"us" column */
  highlight?: boolean;
}

interface Feature {
  /** Row label shown in the sticky feature-name column */
  name:   string;
  /** Positional array — index matches column order */
  values: SupportLevel[];
  /** Optional annotation shown below the feature name, e.g. "4.2× faster" */
  note?:  string;
}

interface Category {
  /** Section header label. Empty string = no header row rendered for this group */
  label:    string;
  /** Rows belonging to this category section */
  features: Feature[];
}

interface Props {
  /** Ordered list of category sections with their feature rows */
  categories?: Category[];
  /** Ordered list of competitor columns; index matches values[] in each Feature */
  columns?:    Column[];
}

function SupportBadge({ level }: { level: SupportLevel }) {
  if (level === 'full') {
    return (
      <div className="bg-indigo-600 text-white text-[min(7px,1.5cqh)] font-black px-[1cqw] py-[0.4cqh] rounded-[2px] leading-none uppercase tracking-[0.05em]">
        ACTIVE
      </div>
    );
  }
  if (level === 'partial') {
    return (
      <div className="bg-amber-100 text-amber-700 text-[min(7px,1.5cqh)] font-black px-[1cqw] py-[0.4cqh] rounded-[2px] leading-none uppercase tracking-[0.05em]">
        PARTIAL
      </div>
    );
  }
  if (level === 'na') {
    return (
      <span className="text-[min(7px,1.5cqh)] font-black text-slate-300 uppercase tracking-widest">
        N/A
      </span>
    );
  }
  // 'none'
  return (
    <div
      className="rounded-full border-2 border-slate-200"
      style={{ width: '0.8cqw', height: '0.8cqw', minWidth: '8px', minHeight: '8px' }}
    />
  );
}

interface FeatureRowProps {
  feature:     Feature;
  globalIndex: number;
  columns:     Column[];
  isSSR:       boolean;
  gridCols:    string;
}

function FeatureRow({ feature, globalIndex, columns, isSSR, gridCols }: FeatureRowProps) {
  return (
    <motion.div
      initial={isSSR ? false : { opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: globalIndex * 0.03 }}
      className="group border-b border-slate-100 last:border-0 hover:bg-slate-50/30 transition-colors"
      style={{ display: 'grid', gridTemplateColumns: gridCols }}
    >
      {/* Feature name — sticky left so it stays visible on horizontal scroll */}
      <div className="sticky left-0 z-10 p-[2.5cqh] flex flex-col justify-center min-w-0 bg-white group-hover:bg-slate-50/30 transition-colors">
        <span className="text-[min(12px,2.8cqh)] font-black text-slate-950 uppercase tracking-tight italic leading-tight truncate">
          {feature.name}
        </span>
        {feature.note && (
          <span className="text-[min(7px,1.5cqh)] font-black text-indigo-500 mt-1 uppercase">
            Δ {feature.note}
          </span>
        )}
      </div>

      {columns.map(({ highlight }, i) => (
        <div
          key={i}
          className="p-[2cqh] flex items-center justify-center border-l border-slate-100/50"
          style={{ background: highlight ? 'rgba(238,242,255,0.4)' : undefined }}
        >
          <SupportBadge level={feature.values[i] ?? 'none'} />
        </div>
      ))}
    </motion.div>
  );
}

function CategoryHeader({ label }: { label: string }) {
  return (
    <div className="bg-slate-50/60 border-b border-slate-100 px-[2.5cqh] py-[1.5cqh]">
      <span className="text-[min(7.5px,1.6cqh)] font-black text-slate-400 uppercase tracking-[0.2em]">
        {label}
      </span>
    </div>
  );
}

/**
 * FeatureMatrix — capability comparison grid for visual-essay frames.
 *
 * Visual style: dark column header (slate-950), indigo highlight for the
 * primary column, badge-style support indicators, animated rows.
 *
 * API mirrors competitive-analysis/FeatureMatrix: positional `values[]` array
 * indexed to the `columns[]` definition. No unicode symbols required.
 *
 * @example
 * ```tsx
 * const columns = [
 *   { label: 'Us',      highlight: true },
 *   { label: 'Legacy A' },
 * ];
 * const categories = [
 *   {
 *     label: 'Core',
 *     features: [
 *       { name: 'Real-time sync', values: ['full', 'partial'], note: '4× faster' },
 *     ],
 *   },
 * ];
 * return <FeatureMatrix columns={columns} categories={categories} />;
 * ```
 */
export function FeatureMatrix({ categories = [], columns = [] }: Props) {
  const isSSR    = useIsSSR();
  const gridCols = `1.5fr ${columns.map(() => '1fr').join(' ')}`;
  const minWidth = FEATURE_COL_MIN + columns.length * COMP_COL_MIN;

  // Build rows with a globally-incrementing index for stagger animation.
  // Local `let` is fine here — deterministic per render, not a side effect.
  let featureIndex = 0;
  const rows = categories.map(cat => {
    const catRows = cat.features.map(f => {
      const idx = featureIndex++;
      return (
        <FeatureRow
          key={f.name}
          feature={f}
          globalIndex={idx}
          columns={columns}
          isSSR={isSSR}
          gridCols={gridCols}
        />
      );
    });
    return (
      <React.Fragment key={cat.label}>
        {cat.label && <CategoryHeader label={cat.label} />}
        {catRows}
      </React.Fragment>
    );
  });

  return (
    // Single scroll container — handles both overflow-y (rows) and overflow-x
    // (columns). Sticky top-0 and sticky left-0 both anchor inside this element.
    <div className="h-full w-full bg-white font-sans border-t border-slate-200 overflow-auto">
      <div style={{ minWidth }}>
        {/* Column header — sticky top; first cell also sticky left (doubly-sticky) */}
        <div
          className="bg-slate-950 border-b border-slate-900 sticky top-0 z-30"
          style={{ display: 'grid', gridTemplateColumns: gridCols }}
        >
          <div className="sticky left-0 z-40 bg-slate-950 p-[2cqh] px-[2.5cqh] flex items-center">
            <span className="text-[min(8px,1.8cqh)] font-black text-slate-400 uppercase tracking-[0.2em]">
              CAPABILITY
            </span>
          </div>
          {columns.map(({ label, highlight }, i) => (
            <div
              key={i}
              className="p-[2cqh] flex items-center justify-center border-l border-white/5"
              style={{ background: highlight ? 'rgba(99,102,241,0.2)' : undefined }}
            >
              <span
                className={`text-[min(8.5px,2cqh)] font-black uppercase tracking-[0.15em] ${
                  highlight ? 'text-indigo-400' : 'text-slate-500'
                }`}
              >
                {label}
              </span>
            </div>
          ))}
        </div>

        {rows}
      </div>
    </div>
  );
}
