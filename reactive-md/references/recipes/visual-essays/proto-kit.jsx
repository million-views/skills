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
    <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm @container">
      {/*
          Aspect Ratio Intelligence:
          Hide the title or condense layout if the container is very flat (landscape)
      */}
      <h3 className="m-0 font-bold text-slate-800 mb-6 text-[clamp(14px,4cqw,20px)] leading-none @[aspect-ratio<1.5]:mb-2">
        Model Efficiency Score
      </h3>
      <div className="space-y-4">
        {data.map((item) => (
          <div key={item.name} className="flex flex-col @sm:flex-row @sm:items-center gap-2 @sm:gap-4">
            <span className="w-full @sm:w-32 text-sm font-semibold text-slate-600 truncate">{item.name}</span>
            <div className="flex-1 bg-slate-100 rounded-full h-3 @sm:h-4 overflow-hidden">
              <motion.div
                initial={isSSR ? { width: `${item.score}%` } : { width: 0 }}
                whileInView={{ width: `${item.score}%` }}
                viewport={{ once: true }}
                className={`h-full ${item.color || 'bg-blue-500'} rounded-full`}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
            <span className="text-right text-xs @sm:text-sm font-bold text-slate-900 shrink-0">{item.score}%</span>
          </div>
        ))}
        {data.length === 0 && <p className="text-slate-400 text-sm italic">No data provided.</p>}
      </div>
    </div>
  );
}

/**
 * Responsive Feature Comparison Matrix
 */
export function FeatureMatrix({ features = [] }) {
  const Check = () => <span className="text-emerald-500 text-lg font-bold">✓</span>;
  const Cross = () => <span className="text-rose-300 text-lg font-light">×</span>;

  return (
    <div className="@container overflow-x-auto rounded-xl border border-slate-200">
      <table className="w-full text-sm text-left border-collapse">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="p-4 font-bold text-slate-700">Capability</th>
            <th className="p-4 text-center font-bold text-blue-600 bg-blue-50/50">Reactive MD</th>
            <th className="p-4 text-center font-bold text-slate-700">Figma</th>
            <th className="p-4 text-center font-bold text-slate-700">Storybook</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {features.map((f) => (
            <tr key={f.name} className="hover:bg-slate-50/50 transition-colors">
              <td className="p-4 font-medium text-slate-900">{f.name}</td>
              <td className="p-4 text-center bg-blue-50/30">{f.ours ? <Check /> : <Cross />}</td>
              <td className="p-4 text-center">{f.compA ? <Check /> : <Cross />}</td>
              <td className="p-4 text-center">{f.compB ? <Check /> : <Cross />}</td>
            </tr>
          ))}
        </tbody>
      </table>
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
  color = "#3b82f6"
}) {
  const isSSR = useIsSSR();
  if (data.length === 0) return <div className="p-8 border border-dashed rounded-xl text-slate-400 text-center text-sm">Waiting for trend data...</div>;

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
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col w-full aspect-[4/3] @md:aspect-video relative @container/chart">
      {/*
          Stable Header:
          Container-aware spacing and sizing
      */}
      <div className="p-4 @md:p-8 pb-0 flex items-start justify-between">
        <div>
          <h4 className="m-0 text-[10px] @md:text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
            Performance Metric
          </h4>
          <h3 className="m-0 text-[clamp(16px,5cqw,24px)] font-black text-slate-900 tracking-tighter leading-none">
            {title}
          </h3>
        </div>

        {/* Dynamic Insight Badge: only visible on wider containers */}
        <div className="hidden @lg:flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full border border-green-100 shrink-0">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] font-bold text-green-700 uppercase tracking-tight">Active Pulse</span>
        </div>
      </div>

      {/*
          Chart Canvas:
          The flex-1 container allows the SVG to fill the remaining aspect-ratio space.
      */}
      <div className="flex-1 relative p-2 @md:p-8 pt-0 @md:pt-2">
        <svg
          viewBox={`0 0 ${baseWidth} ${baseHeight}`}
          className="w-full h-full overflow-visible"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Subtle horizontal grid guide */}
          <line
            x1={paddingX}
            y1={baseHeight - paddingY + 15}
            x2={baseWidth - paddingX}
            y2={baseHeight - paddingY + 15}
            stroke="#f1f5f9"
            strokeWidth="1"
          />

          {/* Data Path: reduced strokeWidth for better visual balance on small screens */}
          <motion.path
            d={pathData}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={isSSR ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />

          {/* Interactive Data Points */}
          {points.map((p, i) => (
            <motion.circle
              key={i}
              cx={p[0]}
              cy={p[1]}
              r="8"
              fill="white"
              stroke={color}
              strokeWidth="4"
              initial={isSSR ? { scale: 1 } : { scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: (isSSR ? 0 : 1 + i * 0.1) }}
              whileHover={{ scale: 1.4, fill: color }}
            />
          ))}

          {/* SVG Labels: Container-aware show/hide of intermediate labels */}
          {data.map((d, i) => {
            const isFirst = i === 0;
            const isLast = i === data.length - 1;
            const labelClass = (!isFirst && !isLast)
              ? "hidden @md:block text-[12px] font-bold fill-slate-400 select-none uppercase tracking-tight"
              : "text-[12px] font-black fill-slate-900 select-none uppercase tracking-tight";

            return (
              <text
                key={i}
                x={points[i][0]}
                y={baseHeight - 5}
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
 */
export function InsightCard({ title, icon: Icon, children }) {
  return (
    <div className="flex flex-col @sm:flex-row gap-4 p-5 bg-amber-50 rounded-xl border border-amber-100 @container">
      <div className="mt-1 text-amber-600 @[width<200px]:hidden">
        <Icon size={20} />
      </div>
      <div>
        <h4 className="m-0 font-bold text-amber-900 mb-1 leading-tight">{title}</h4>
        <div className="text-sm text-amber-800 leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}
