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
    <div className="p-5 bg-white border border-slate-100 rounded-2xl @container shadow-[0_16px_32px_-12px_rgba(59,175,73,0.06)]">
      {/*
          Editorial Typography:
          Tight tracking, clean hairline separators
      */}
      <div className="flex items-baseline justify-between mb-4 border-b border-[#3baf49]/20 pb-2">
        <h3 className="m-0 font-black text-[#3baf49] text-[9px] uppercase tracking-[0.2em] leading-none">
          Comparative Analysis
        </h3>
        <span className="text-[9px] font-medium text-slate-400 uppercase tracking-widest leading-none">Index 100 Baseline</span>
      </div>

      <div className="space-y-4 @landscape:grid @landscape:grid-cols-2 @landscape:gap-x-10 @landscape:space-y-0 @landscape:gap-y-4">
        {data.map((item) => (
          <div key={item.name} className="flex flex-col gap-1">
            <div className="flex justify-between items-end">
              <span className="text-[10px] font-bold text-slate-900 tracking-tight uppercase">{item.name}</span>
              <span className="text-[10px] font-black text-slate-900 tracking-tighter italic whitespace-nowrap">
                {item.score}.0<span className="text-[8px] ml-0.5 not-italic text-slate-400">PTS</span>
              </span>
            </div>
            
            <div className="w-full bg-[#ceead2]/30 h-1 overflow-hidden">
              <motion.div
                initial={isSSR ? { width: `${item.score}%` } : { width: 0 }}
                whileInView={{ width: `${item.score}%` }}
                viewport={{ once: true }}
                className={`h-full ${item.color || 'bg-[#3baf49]'}`}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} 
              />
            </div>
          </div>
        ))}
        {data.length === 0 && <p className="text-slate-400 text-[10px] italic">No comparative data available.</p>}
      </div>
    </div>
  );
}

/**
 * Responsive Feature Comparison Matrix
 * Uses Progressive Disclosure: Tables on desktop, definition cards on mobile.
 */
export function FeatureMatrix({ features = [] }) {
  const Check = () => <span className="text-[#3baf49] text-[10px] font-black px-1 py-0.5 bg-[#ceead2]/50 rounded leading-none">YES</span>;
  const Cross = () => <span className="text-slate-300 text-[10px] font-light tracking-[0.1em] uppercase leading-none">None</span>;

  return (
    <div className="@container p-5 bg-white border border-slate-100 rounded-2xl shadow-[0_16px_32px_-12px_rgba(59,175,73,0.06)]">
      {/* Table View: Only visible on wider containers */}
      <div className="hidden @md:block scrollbar-hide">
        <table className="w-full text-left border-collapse">
          <thead className="border-b border-[#3baf49]/10">
            <tr>
              <th className="py-3 pr-2 font-black text-[9px] uppercase tracking-widest text-[#3baf49]">Strategic Capability</th>
              <th className="py-3 px-3 text-center font-black text-[9px] uppercase tracking-widest text-slate-900 bg-[#ceead2]/10">R-MD</th>
              <th className="py-3 px-3 text-center font-black text-[9px] uppercase tracking-widest text-slate-400">Figma</th>
              <th className="py-3 px-3 text-center font-black text-[9px] uppercase tracking-widest text-slate-400">Storybook</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {features.map((f) => (
              <tr key={f.name} className="group hover:bg-[#ceead2]/5 transition-colors">
                <td className="py-2.5 pr-2 text-[11px] font-bold text-slate-900 tracking-tight">{f.name}</td>
                <td className="py-2.5 px-3 text-center bg-[#ceead2]/5">{f.ours ? <Check /> : <Cross />}</td>
                <td className="py-2.5 px-3 text-center">{f.compA ? <Check /> : <Cross />}</td>
                <td className="py-2.5 px-3 text-center">{f.compB ? <Check /> : <Cross />}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card View: Mobile-first alternative */}
      <div className="block @md:hidden divide-y divide-slate-100">
        {features.map((f) => (
          <div key={f.name} className="py-3">
            <h4 className="font-black text-[9px] uppercase tracking-widest text-[#3baf49] mb-3">{f.name}</h4>
            <div className="flex justify-between items-center text-center">
              <div className="flex flex-col gap-1.5">
                <span className="text-[7px] uppercase font-bold text-slate-400 tracking-tighter">R-MD</span>
                <div className="h-5 flex items-center justify-center">{f.ours ? <Check /> : <Cross />}</div>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-[7px] uppercase font-bold text-slate-400 tracking-tighter">Figma</span>
                <div className="h-5 flex items-center justify-center">{f.compA ? <Check /> : <Cross />}</div>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-[7px] uppercase font-bold text-slate-400 tracking-tighter">Storybook</span>
                <div className="h-5 flex items-center justify-center">{f.compB ? <Check /> : <Cross />}</div>
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
  color = "#3baf49" 
}) {
  const isSSR = useIsSSR();
  if (data.length === 0) return <div className="py-12 border border-slate-100 rounded-2xl text-slate-400 text-center text-[10px] uppercase tracking-widest bg-white">Awaiting Dataset...</div>;

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
    <div className="bg-white border border-slate-100 rounded-2xl flex flex-col @landscape:flex-row w-full aspect-[4/3] @landscape:h-[320px] relative @container/chart overflow-hidden shadow-[0_16px_32px_-12px_rgba(59,175,73,0.06)]">
      {/*
          Side-Rail:
          Strategic sidebar for context and metadata.
      */}
      <div className="p-5 flex flex-col justify-between @landscape:w-60 @landscape:border-r @landscape:border-slate-50 bg-[#ceead2]/5 shrink-0">
        <div>
          <h4 className="m-0 text-[10px] font-black text-[#6cc277] uppercase tracking-[0.2em] leading-none mb-1.5">
            Trend Intelligence
          </h4>
          <h3 className="m-0 text-[clamp(16px,4cqw,22px)] font-black text-slate-900 tracking-tighter leading-[0.9] mb-3">
            {title}
          </h3>
          
          <div className="hidden @landscape:block">
            <p className="text-[10px] text-slate-500 leading-snug mb-2">
              Experimental growth observed following Q3 architecture pivot.
            </p>
            <div className="h-px w-6 bg-[#3baf49] mb-2" />
            <span className="text-[8px] font-bold text-slate-900 uppercase tracking-widest">Source: Internal Metrics</span>
          </div>
        </div>

        {/* Status Indicator: Minimalist */}
        <div className="flex items-center gap-1.5 mt-2 @landscape:mt-0">
          <div className="w-1 h-1 bg-[#3baf49]" />
          <span className="text-[8px] font-black text-slate-900 uppercase tracking-widest">Verified Real-Time</span>
        </div>
      </div>

      {/*
          Chart Canvas:
          Flat, minimalist SVG without grid noise.
      */}
      <div className="flex-1 relative p-6">
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
            stroke="#3baf49"
            strokeWidth="0.5"
            strokeOpacity="0.1"
          />

          {/* Area under curve: Subtle brand gradient effect */}
          <motion.path
            d={`${pathData} L ${points[points.length-1][0]} ${baseHeight - paddingY + 10} L ${points[0][0]} ${baseHeight - paddingY + 10} Z`}
            fill="#ceead2"
            fillOpacity="0.1"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
          />

          {/* Data Path: Ultra-thin precise line */}
          <motion.path
            d={pathData}
            fill="none"
            stroke={color}
            strokeWidth="1.2"
            initial={isSSR ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }} 
          />

          {/* Data High-points: Small square markers instead of circles */}
          {points.map((p, i) => (
            <motion.rect
              key={i}
              x={p[0] - 1.5}
              y={p[1] - 1.5}
              width="3"
              height="3"
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
              ? "hidden @md:block text-[8px] font-medium fill-slate-300 select-none uppercase tracking-widest"
              : "text-[8px] font-black fill-slate-900 select-none uppercase tracking-widest";

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
    <div className="flex gap-4 p-5 border border-slate-100 rounded-2xl bg-[#ceead2]/10 @container shadow-[0_16px_32px_-12px_rgba(59,175,73,0.06)]">
      <div className="shrink-0 text-[#3baf49] @[width<200px]:hidden">
        <Icon size={18} strokeWidth={2.5} />
      </div>
      <div>
        <h4 className="m-0 font-black text-[#3baf49] text-[10px] uppercase tracking-widest mb-2 leading-tight">
          {title}
        </h4>
        <div className="text-[12px] text-slate-700 leading-relaxed font-medium italic">
          "{children}"
        </div>
      </div>
    </div>
  );
}
