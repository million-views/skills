import { motion } from 'motion/react';

/**
 * Environment detection for SSR vs Interactive Preview.
 * Reactive MD provides the __REACTIVE_MD_SSR__ global.
 */
function useIsSSR() {
  return typeof window === 'undefined' || window.__REACTIVE_MD_SSR__ === true;
}

/**
 * Score comparison bar chart.
 * Preview Safety: Default data to empty array.
 */
export function ComparisonMatrix({ data = [] }) {
  const isSSR = useIsSSR();

  return (
    <div className="py-6 bg-white border-y border-slate-100 @container">
      {/*
          Editorial Typography:
          Tight tracking, clean hairline separators
      */}
      <div className="flex items-baseline justify-between mb-8 border-b border-slate-900/10 pb-2">
        <h3 className="m-0 font-black text-slate-900 text-[10px] uppercase tracking-[0.2em] leading-none">
          Comparative Analysis
        </h3>
        <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Index 100 Baseline</span>
      </div>

      <div className="space-y-6 @landscape:grid @landscape:grid-cols-2 @landscape:gap-x-12 @landscape:space-y-0 @landscape:gap-y-6">
        {data.map((item) => (
          <div key={item.name} className="flex flex-col gap-1">
            <div className="flex justify-between items-end">
              <span className="text-[11px] font-bold text-slate-900 tracking-tight uppercase">{item.name}</span>
              <span className="text-[11px] font-black text-slate-900 tracking-tighter italic whitespace-nowrap">
                {item.score}.0<span className="text-[8px] ml-0.5 not-italic text-slate-400">PTS</span>
              </span>
            </div>
            
            <div className="w-full bg-slate-50 h-1 overflow-hidden">
              <motion.div
                initial={isSSR ? { width: `${item.score}%` } : { width: 0 }}
                whileInView={{ width: `${item.score}%` }}
                viewport={{ once: true }}
                className={`h-full ${item.color || 'bg-slate-900'}`}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} 
              />
            </div>
          </div>
        ))}
        {data.length === 0 && <p className="text-slate-400 text-[11px] italic">No comparative data available.</p>}
      </div>
    </div>
  );
}

/**
 * Responsive Feature Comparison Matrix
 * Uses Progressive Disclosure: Tables on desktop, definition cards on mobile.
 */
export function FeatureMatrix({ features = [] }) {
  const Check = () => <span className="text-slate-900 text-xs font-black">YES</span>;
  const Cross = () => <span className="text-slate-300 text-xs font-light">--</span>;

  return (
    <div className="@container border-t border-slate-900 bg-white">
      {/* Table View: Only visible on wider containers */}
      <div className="hidden @md:block">
        <table className="w-full text-left border-collapse">
          <thead className="border-b border-slate-100">
            <tr>
              <th className="py-4 pr-4 font-black text-[10px] uppercase tracking-widest text-slate-400">Core Capability</th>
              <th className="py-4 px-4 text-center font-black text-[10px] uppercase tracking-widest text-slate-900 bg-slate-50">R-MD</th>
              <th className="py-4 px-4 text-center font-black text-[10px] uppercase tracking-widest text-slate-400">Figma</th>
              <th className="py-4 px-4 text-center font-black text-[10px] uppercase tracking-widest text-slate-400">Storybook</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {features.map((f) => (
              <tr key={f.name} className="group">
                <td className="py-4 pr-4 text-[12px] font-bold text-slate-900 tracking-tight">{f.name}</td>
                <td className="py-4 px-4 text-center bg-slate-50/50">{f.ours ? <Check /> : <Cross />}</td>
                <td className="py-4 px-4 text-center">{f.compA ? <Check /> : <Cross />}</td>
                <td className="py-4 px-4 text-center">{f.compB ? <Check /> : <Cross />}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card View: Mobile-first alternative */}
      <div className="block @md:hidden divide-y divide-slate-100">
        {features.map((f) => (
          <div key={f.name} className="py-4">
            <h4 className="font-black text-[10px] uppercase tracking-widest text-slate-400 mb-3">{f.name}</h4>
            <div className="flex justify-between items-center text-center">
              <div className="flex flex-col gap-1">
                <span className="text-[8px] uppercase font-bold text-slate-400">R-MD</span>
                <div className="h-6 flex items-center justify-center">{f.ours ? <Check /> : <Cross />}</div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[8px] uppercase font-bold text-slate-400">Figma</span>
                <div className="h-6 flex items-center justify-center">{f.compA ? <Check /> : <Cross />}</div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[8px] uppercase font-bold text-slate-400">Storybook</span>
                <div className="h-6 flex items-center justify-center">{f.compB ? <Check /> : <Cross />}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Animated SVG Trend Chart (Data Journalism Style)
 * Optimized for layout neutrality and proportional scaling.
 */
export function SVGTrendChart({
  data = [],
  title = "Growth Trends",
  color = "#111827" 
}) {
  const isSSR = useIsSSR();
  if (data.length === 0) return <div className="py-12 border-t border-slate-100 text-slate-400 text-center text-[11px] uppercase tracking-widest">Awaiting Dataset...</div>;

  // Unitless coordinate system for SVG geometry (scales with SVG)
  const baseWidth = 400;
  const baseHeight = 220;
  const paddingX = 40;
  const paddingY = 50;

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;

  const points = data.map((d, i) => {
    const x = paddingX + (i / (data.length - 1)) * (baseWidth - paddingX * 2);
    const y = (baseHeight - paddingY) - ((d.value - minValue) / range) * (baseHeight - paddingY * 1.5);
    return [x, y];
  });

  const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ');

  return (
    <div className="bg-white border-y border-slate-100 flex flex-col @landscape:flex-row w-full aspect-[4/3] @md:aspect-video relative @container/chart overflow-hidden">
      {/*
          Side-Rail:
          Strategic sidebar for context and metadata.
      */}
      <div className="p-6 flex flex-col justify-between @landscape:w-72 @landscape:border-r @landscape:border-slate-50 bg-white">
        <div>
          <h4 className="m-0 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] leading-none mb-3">
            Trend Intelligence
          </h4>
          <h3 className="m-0 text-[clamp(18px,5cqw,28px)] font-black text-slate-900 tracking-tighter leading-[0.9] mb-6">
            {title}
          </h3>
          
          <div className="hidden @landscape:block">
            <p className="text-[11px] text-slate-500 leading-relaxed mb-4">
              Analysis reveals an exponential shift in design-to-logic workflows following the Q3 architecture pivot.
            </p>
            <div className="h-px w-8 bg-slate-900 mb-4" />
            <span className="text-[9px] font-bold text-slate-900 uppercase tracking-widest">Source: Internal Metrics</span>
          </div>
        </div>

        {/* Status Indicator: Minimalist */}
        <div className="flex items-center gap-2 mt-4 @landscape:mt-0">
          <div className="w-1.5 h-1.5 bg-slate-900" />
          <span className="text-[9px] font-black text-slate-900 uppercase tracking-widest">Verified Real-Time</span>
        </div>
      </div>

      {/*
          Chart Canvas:
          Flat, minimalist SVG without grid noise.
      */}
      <div className="flex-1 relative p-4 @md:p-10">
        <svg
          viewBox={`0 0 ${baseWidth} ${baseHeight}`}
          className="w-full h-full overflow-visible"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Baseline only */}
          <line
            x1={paddingX}
            y1={baseHeight - paddingY + 10}
            x2={baseWidth - paddingX}
            y2={baseHeight - paddingY + 10}
            stroke="#111827"
            strokeWidth="0.5"
            strokeOpacity="0.1"
          />

          {/* Data Path: Ultra-thin precise line */}
          <motion.path
            d={pathData}
            fill="none"
            stroke={color}
            strokeWidth="1.5"
            initial={isSSR ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Data High-points: Small square markers instead of circles */}
          {points.map((p, i) => (
            <motion.rect
              key={i}
              x={p[0] - 2}
              y={p[1] - 2}
              width="4"
              height="4"
              fill="white"
              stroke={color}
              strokeWidth="1"
              initial={isSSR ? { scale: 1 } : { scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: (isSSR ? 0 : 1 + i * 0.1) }}
            />
          ))}

          {/* Typography: Small, tracked-out caps */}
          {data.map((d, i) => {
            const isFirst = i === 0;
            const isLast = i === data.length - 1;
            const labelClass = (!isFirst && !isLast)
              ? "hidden @md:block text-[9px] font-medium fill-slate-300 select-none uppercase tracking-widest"
              : "text-[9px] font-black fill-slate-900 select-none uppercase tracking-widest";

            return (
              <text
                key={i}
                x={points[i][0]}
                y={baseHeight - 10}
                textAnchor="middle"
                className={labelClass}
              >
                {d.label}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

/**
 * Editorial Insight Card
 * Side-accent style, magazine feel.
 */
export function InsightCard({ title, icon: Icon, children }) {
  return (
    <div className="flex gap-6 py-6 border-l-2 border-slate-900 pl-6 bg-slate-50/50 @container">
      <div className="shrink-0 text-slate-900 @[width<200px]:hidden">
        <Icon size={18} strokeWidth={2.5} />
      </div>
      <div>
        <h4 className="m-0 font-black text-slate-900 text-[11px] uppercase tracking-widest mb-2 leading-tight">
          {title}
        </h4>
        <div className="text-[13px] text-slate-600 leading-relaxed font-medium italic">
          "{children}"
        </div>
      </div>
    </div>
  );
}
