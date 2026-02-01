import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';

/**
 * Environment detection for SSR vs Interactive Preview.
 */
function useIsSSR() {
  return typeof window === 'undefined' || window.__REACTIVE_MD_SSR__ === true;
}

/**
 * Strategic Data Module
 * A high-density container that provides consistent header/footer and enforces
 * viewport-perfect sizing using container query units.
 */
export function DataModule({ 
  title, 
  subtitle, 
  source = "STRATEGIC_ASSET_v1.1", 
  children,
  sidebar
}) {
  return (
    <section className="flex flex-col h-full w-full bg-white border border-slate-200 overflow-hidden select-none relative font-sans text-slate-900 group/module">
      {/* Sophisticated Background Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:120px_120px]" />

      {/* Header: High-Fidelity Strategic Bar */}
      <header className="px-[5cqw] py-[3cqh] border-b border-slate-200/60 flex justify-between items-start bg-white/90 backdrop-blur-md z-20 shrink-0">
        <div className="flex flex-col gap-[0.5cqh]">
          <div className="flex items-center gap-[1.5cqw]">
            <div className="w-[1.2cqw] h-[0.4cqh] bg-indigo-600" />
            <span className="text-[min(7px,1.4cqh)] font-black text-slate-400 uppercase tracking-[0.2em] leading-none">
              {source}
            </span>
            <div className="h-2 w-px bg-slate-200" />
            <span className="text-[min(7px,1.4cqh)] font-bold text-indigo-500/80 uppercase tracking-widest leading-none">
              CONFIDENTIAL_DRAFT
            </span>
          </div>
          
          <h3 className="m-0 text-[min(22px,5cqh)] font-black text-slate-950 tracking-[-0.04em] leading-none mt-[1cqh]">
            {title}
          </h3>

          {subtitle && (
            <p className="m-0 mt-[0.8cqh] text-[min(11px,2.2cqh)] font-medium text-slate-500/80 leading-snug max-w-[50cqw]">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-[6cqw]">
          <div className="hidden @md:flex flex-col items-end gap-[0.5cqh]">
            <span className="text-[min(7px,1.4cqh)] font-black text-slate-300 uppercase tracking-[0.15em] leading-none">FIDELITY_SCORE</span>
            <div className="flex gap-1">
               {[1,2,3,4,5].map(i => (
                 <div key={i} className={`w-1.5 h-1.5 rounded-full ${i <= 4 ? 'bg-indigo-600' : 'bg-slate-100'}`} />
               ))}
            </div>
          </div>
          <div className="flex flex-col items-end gap-[0.5cqh]">
            <span className="text-[min(7px,1.4cqh)] font-black text-slate-300 uppercase tracking-[0.15em] leading-none">ISSUANCE_TIMESTAMP</span>
            <span className="text-[min(10px,2cqh)] font-bold text-slate-950 tabular-nums uppercase tracking-tight">
              {new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
            </span>
          </div>
        </div>
      </header>

      {/* Content Area */}
      <div className="flex-1 flex overflow-hidden">
        <main className="flex-1 overflow-hidden relative">
          {children}
        </main>
        
        {sidebar && (
          <aside className="hidden @lg:flex w-[28cqw] border-l border-slate-200/60 bg-slate-50/40 flex-col overflow-y-auto p-[4cqw] gap-[4cqh] z-10">
            {sidebar}
          </aside>
        )}
      </div>

      {/* Footer: Detailed Audit Trail */}
      <footer className="px-[5cqw] py-[2cqh] bg-white border-t border-slate-200/60 flex justify-between items-center shrink-0 z-20">
        <div className="flex items-center gap-[3cqw]">
          <div className="flex items-center gap-[1.5cqw]">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[min(8px,1.8cqh)] font-bold text-slate-500 uppercase tracking-widest">
               LIVE_DATA_FEED_ACTIVE
             </span>
          </div>
          <div className="h-3 w-px bg-slate-200" />
          <span className="hidden @sm:inline text-[min(8px,1.8cqh)] font-medium text-slate-400 italic">
            N-Dimension: Alpha-7_Subsystem
          </span>
        </div>


        
        <div className="flex items-center gap-[2cqw]">
          <span className="text-[min(8px,1.8cqh)] font-black text-white bg-slate-950 px-[1.5cqw] py-[0.6cqh] rounded-[2px] uppercase tracking-widest">
            AUTHENTICATED_ACCESS
          </span>
        </div>
      </footer>
    </section>
  );
}

function CheckIcon() {
  return (
    <div className="flex items-center justify-center">
      <div className="bg-indigo-600 text-white text-[min(7px,1.5cqh)] font-black px-[1cqw] py-[0.4cqh] rounded-[2px] leading-none uppercase tracking-[0.05em] shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
        ACTIVE
      </div>
    </div>
  );
}

function CrossIcon() {
  return (
    <div className="flex items-center justify-center">
      <div className="w-[0.8cqw] h-[0.8cqw] rounded-full border-2 border-slate-200" />
    </div>
  );
}

function MatrixRow({ item, index, isSSR }) {
  return (
    <motion.div
      key={item.name}
      initial={isSSR ? false : { x: -10, opacity: 0 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04, ease: "easeOut" }}
      className="px-[5cqw] py-[3cqh] @md:py-[2.5cqh] flex justify-between items-center hover:bg-slate-50/80 transition-all cursor-default group/row border-b border-slate-100 last:border-0"
    >
      <div className="flex items-center gap-[4cqw]">
        <div className="flex flex-col">
          <span className="text-slate-300 text-[min(7px,1.5cqh)] font-black uppercase tracking-widest mb-1 group-hover/row:text-indigo-400 transition-colors">SEC_0{index + 1}</span>
          <span className="text-slate-900 text-[min(15px,3.4cqh)] font-black tracking-tight uppercase italic leading-none">{item.name}</span>
        </div>
      </div>

      <div className="flex flex-col items-end gap-[1.2cqh]">
        <div className="h-[0.8cqh] w-[25cqw] bg-slate-100 rounded-full overflow-hidden relative shadow-inner">
          <div className="absolute inset-0 opacity-40 bg-[linear-gradient(90deg,transparent_20%,rgba(255,255,255,0.4)_21%,transparent_22%,transparent_40%,rgba(255,255,255,0.4)_41%,transparent_42%)] bg-[size:20cqw_100%] z-10" />
          <motion.div 
            style={{ width: isSSR ? `${item.score}%` : 0 }}
            initial={isSSR ? false : { width: 0 }}
            animate={{ width: `${item.score}%` }}
            transition={{ duration: 1.2, delay: 0.1 + index * 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 relative overflow-hidden" 
          >
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.2)_0%,transparent_100%)]" />
          </motion.div>
        </div>
        <div className="flex items-center gap-2">
           <span className="text-indigo-600 text-[min(13px,3cqh)] font-black tabular-nums tracking-tighter saturate-150 leading-none">{item.score}%</span>
           <div className={`w-1 h-1 rounded-full ${item.score > 80 ? 'bg-emerald-500' : 'bg-amber-400'}`} />
        </div>
      </div>
    </motion.div>
  );
}

function TrendBar({ height }) {
  return (
    <div 
      style={{ height: `${height}%` }} 
      className="flex-1 bg-indigo-600/10 border-t border-indigo-600/30 group-hover:bg-indigo-600/20 transition-all duration-500" 
    />
  );
}

/**
 * Performance Comparison Matrix
 */
export function ComparisonMatrix({ data = [] }) {
  const isSSR = useIsSSR();

  return (
    <div className="h-full w-full bg-white flex flex-col overflow-hidden font-sans group">
      <div className="px-[5cqw] py-[3cqh] border-b border-slate-100 flex justify-between items-end bg-slate-50/30">
        <div className="flex flex-col gap-[0.5cqh]">
          <span className="text-[min(8px,1.8cqh)] font-black text-indigo-600/60 uppercase tracking-[0.2em] leading-none">MARKET_VELOCITY_AUDIT</span>
          <h3 className="m-0 text-[min(20px,4.5cqh)] font-black tracking-[-0.03em] text-slate-950 uppercase italic">
            Sector Benchmark Alpha
          </h3>
        </div>
        <div className="hidden @md:flex flex-col items-end">
          <span className="text-[min(8px,1.8cqh)] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">AGGREGATE_SIGMA</span>
          <span className="text-[min(22px,5cqh)] font-black text-slate-950 tabular-nums leading-none tracking-tighter italic saturate-150">
            84.2%
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto flex @lg:flex-row flex-col">
        <div className="flex-1 divide-y divide-slate-100">
          {data.map((item, i) => (
            <MatrixRow key={item.name} item={item} index={i} isSSR={isSSR} />
          ))}
        </div>

        <div className="hidden @lg:flex w-[38%] bg-slate-50/30 border-l border-slate-200/60 p-[5cqw] flex-col gap-[4cqh]">
           <div className="flex flex-col gap-[1cqh]">
              <span className="text-[min(9px,2cqh)] font-black text-slate-400 uppercase tracking-[0.25em] leading-none">STRATEGIC_OVERSIGHT</span>
              <div className="h-px bg-slate-200 w-1/3" />
           </div>

           <div className="space-y-[4.5cqh] mt-[1cqh]">
             <div className="flex flex-col">
                <span className="text-[min(7.5px,1.6cqh)] font-black text-slate-400 uppercase mb-[0.8cqh] tracking-widest">VARIANCE_DELTA_v2</span>
                <span className="text-[min(28px,6.5cqh)] font-black text-slate-950 tabular-nums tracking-[-0.05em] leading-none mb-2">+12.42</span>
                <p className="m-0 text-[min(11px,2.2cqh)] text-slate-500/80 italic font-medium leading-[1.6]">
                  Calculated against the sector-weighted baseline of the previous fiscal period. Error margin: ±0.03.
                </p>
             </div>

             <div className="space-y-[1.5cqh]">
                <div className="flex justify-between items-end">
                   <span className="text-[min(7.5px,1.6cqh)] font-black text-slate-400 uppercase tracking-widest">TREND_PROJECTION</span>
                   <span className="text-[min(9px,2cqh)] font-bold text-indigo-600 uppercase">HIGH_FIDELITY</span>
                </div>
                <div className="h-[10cqh] w-full flex items-end gap-[3px]">
                   {[30, 45, 35, 60, 50, 80, 75, 95, 85, 100].map((h, i) => (
                     <TrendBar key={i} height={h} />
                   ))}
                </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function FeatureComparisonRow({ feature, index, columns, isSSR }) {
  const cellStyle = "flex items-center justify-center p-[2cqh] border-l border-slate-100/50 relative";
  const labelStyle = "text-[min(7.5px,1.6cqh)] font-black text-slate-300 uppercase tracking-widest absolute top-1 left-1.5 opacity-0 @sm:opacity-100";

  return (
    <motion.div 
      initial={isSSR ? false : { opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="grid grid-cols-[1.5fr_1fr_1fr_1fr] border-b border-slate-100 hover:bg-slate-50/30 transition-colors group/row"
    >
      <div className="p-[2.5cqh] flex flex-col justify-center min-w-0">
        <span className="text-[min(12px,2.8cqh)] font-black text-slate-950 uppercase tracking-tight italic leading-tight truncate">
          {feature.name}
        </span>
        {feature.delta && (
          <span className="text-[min(7px,1.5cqh)] font-black text-indigo-500 mt-1 uppercase">
            Δ {feature.delta}
          </span>
        )}
      </div>

      <div className={`${cellStyle} bg-indigo-50/10`}>
        <span className={`${labelStyle} text-indigo-400`}>{columns[0]}</span>
        {feature.ours ? <CheckIcon /> : <CrossIcon />}
      </div>

      <div className={cellStyle}>
        <span className={labelStyle}>{columns[1]}</span>
        {feature.compA ? <CheckIcon /> : <CrossIcon />}
      </div>

      <div className={cellStyle}>
        <span className={labelStyle}>{columns[2]}</span>
        {feature.compB ? <CheckIcon /> : <CrossIcon />}
      </div>
    </motion.div>
  );
}

/**
 * Feature Comparison Matrix
 */
export function FeatureMatrix({ 
  features = [], 
  columns = ["REACTIVE_MD", "LEGACY_A", "LEGACY_B"] 
}) {
  const isSSR = useIsSSR();

  return (
    <div className="h-full w-full bg-white relative group flex flex-col overflow-hidden font-sans border-t border-slate-200">
      {/* Header: Fixed Column Labels */}
      <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] bg-slate-950 border-b border-slate-900 sticky top-0 z-30">
        <div className="p-[2cqh] px-[2.5cqh] flex items-center">
           <span className="text-[min(8px,1.8cqh)] font-black text-slate-400 uppercase tracking-[0.2em]">CAPABILITY_AUDIT</span>
        </div>
        {columns.map((col, i) => (
          <div key={col} className={`p-[2cqh] flex items-center justify-center border-l border-white/5 ${i === 0 ? 'bg-indigo-600/20' : ''}`}>
            <span className={`text-[min(8.5px,2cqh)] font-black uppercase tracking-[0.15em] ${i === 0 ? 'text-indigo-400' : 'text-slate-500'}`}>
              {col}
            </span>
          </div>
        ))}
      </div>

      {/* Rows: Scrollable Grid */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {features.map((f, i) => (
          <FeatureComparisonRow 
            key={f.name} 
            feature={f} 
            index={i} 
            columns={columns}
            isSSR={isSSR} 
          />
        ))}
      </div>
    </div>
  );
}

function GridLine({ index, paddingX, paddingY, baseWidth, baseHeight }) {
  const y = paddingY + (index / 4) * (baseHeight - paddingY * 2);
  return (
    <line 
      x1={paddingX} 
      y1={y} 
      x2={baseWidth - paddingX} 
      y2={y} 
      className="stroke-slate-900" 
      strokeWidth="1" 
    />
  );
}

/**
 * High-Fidelity Animated SVG Chart
 */
export function SVGTrendChart({
  data = [],
  color = "#4f46e5"
}) {
  const isSSR = useIsSSR();
  const [povIndex, setPovIndex] = React.useState(null);

  if (data.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-slate-50 border border-dashed border-slate-200">
        <span className="text-[min(10px,2cqh)] uppercase font-black tracking-[0.3em] text-slate-300">VOID_DATA</span>
      </div>
    );
  }

  const baseWidth = 500;
  const baseHeight = 280;
  const paddingX = 40;
  const paddingY = 60;

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const avgValue = data.reduce((acc, curr) => acc + curr.value, 0) / data.length;
  const range = maxValue - minValue || 1;

  function calculatePoint(d, i) {
    const divisor = data.length > 1 ? data.length - 1 : 1;
    const x = paddingX + (i / divisor) * (baseWidth - paddingX * 2);
    const y = (baseHeight - paddingY) - ((d.value - minValue) / range) * (baseHeight - paddingY * 2.0);
    return [x, y];
  }

  const points = data.map(calculatePoint);

  const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ');
  const areaData = `${pathData} L ${points[points.length - 1][0]} ${baseHeight - paddingY} L ${points[0][0]} ${baseHeight - paddingY} Z`;

  function handleMouseMove(e) {
    if (isSSR) return;
    const bounds = e.currentTarget.getBoundingClientRect();
    const xProp = (e.clientX - bounds.left) / bounds.width;
    const index = Math.round(xProp * (data.length - 1));
    if (index >= 0 && index < data.length) {
      setPovIndex(index);
    }
  }

  return (
    <div 
      className="h-full w-full relative bg-white overflow-hidden flex flex-col font-sans group/chart"
      onMouseLeave={() => setPovIndex(null)}
    >
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 relative flex flex-col min-w-0">
          <div className="absolute top-[4cqh] left-[5cqw] flex flex-col gap-[0.3cqh] z-30">
            <div className="flex items-center gap-[1.5cqw]">
              <div className="w-4 h-0.5 bg-indigo-600" />
              <span className="text-[min(9px,2cqh)] font-black text-slate-950 uppercase tracking-[0.25em] leading-none">ALPHA_MOMENTUM</span>
            </div>
            <span className="text-[min(11.5px,2.6cqh)] font-black text-slate-300 uppercase tracking-widest mt-1">Real-Time Vector Engine</span>
          </div>

          <div className="flex-1 w-full relative p-[2cqw] flex items-center justify-center bg-transparent min-h-0 cursor-crosshair">
            <svg
              viewBox={`0 0 ${baseWidth} ${baseHeight}`}
              className="w-full h-full max-h-full overflow-visible transition-all duration-700 ease-out"
              preserveAspectRatio="xMidYMid meet"
              onMouseMove={handleMouseMove}
            >
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity="0.1" />
                  <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Sophisticated Grid Lines */}
              <g className="opacity-[0.05]">
                {[0, 1, 2, 3, 4].map(i => (
                  <GridLine 
                    key={i} 
                    index={i} 
                    paddingX={paddingX} 
                    paddingY={paddingY} 
                    baseWidth={baseWidth} 
                    baseHeight={baseHeight} 
                  />
                ))}
              </g>

              {/* Area & Line */}
              <motion.path
                d={areaData} fill="url(#areaGradient)"
                initial={isSSR ? { opacity: 0.8 } : { opacity: 0 }} 
                animate={{ opacity: 1 }}
                transition={{ duration: 2, delay: 0.5 }}
              />
              <motion.path
                d={pathData} fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"
                initial={isSSR ? { pathLength: 1 } : { pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }} 
              />
              
              {/* Contextual Focus Point */}
              {!isSSR && povIndex !== null && (
                <g>
                  <line x1={points[povIndex][0]} y1={paddingY} x2={points[povIndex][0]} y2={baseHeight - paddingY} stroke={color} strokeWidth="1" strokeDasharray="4 2" className="opacity-40" />
                  <circle cx={points[povIndex][0]} cy={points[povIndex][1]} r="7" fill={color} stroke="white" strokeWidth="3" className="shadow-lg" />
                  <text 
                    x={points[povIndex][0]} y={points[povIndex][1] - 15} 
                    textAnchor="middle" 
                    className="text-[12px] font-black fill-slate-950 tabular-nums select-none"
                  >
                    {data[povIndex].value.toFixed(1)}
                  </text>
                </g>
              )}
            </svg>
          </div>
        </div>

        <div className="hidden @[width>780px]:flex w-[32%] border-l border-slate-200/60 bg-slate-50/40 flex-col p-[5cqw] relative z-20">
          <div className="flex flex-col gap-[0.5cqh] mb-[4cqh]">
            <span className="text-[min(8px,1.8cqh)] font-black text-slate-400 uppercase tracking-[0.2em] leading-none">ANALYTIC_FEED_BETA</span>
            <div className="h-0.5 w-[5cqw] bg-indigo-600" />
          </div>
          
          <div className="flex-1 flex flex-col gap-[5cqh]">
            <div className="flex flex-col group/metric">
               <span className="text-[min(7.5px,1.6cqh)] font-black text-slate-400 uppercase mb-[0.8cqh] tracking-widest leading-none">PEAK_AMPLITUDE</span>
               <div className="flex items-baseline gap-1">
                 <span className="text-[min(28px,6.5cqh)] font-black text-slate-950 tabular-nums leading-none tracking-[-0.05em]">{maxValue.toFixed(1)}</span>
                 <span className="text-[min(10px,2cqh)] font-black text-indigo-500 uppercase">UNIT</span>
               </div>
            </div>

            <div className="flex flex-col group/metric">
               <span className="text-[min(7.5px,1.6cqh)] font-black text-slate-400 uppercase mb-[0.8cqh] tracking-widest leading-none">NORM_AVERAGE</span>
               <div className="flex items-baseline gap-1">
                 <span className="text-[min(28px,6.5cqh)] font-black text-slate-950 tabular-nums leading-none tracking-[-0.05em]">{avgValue.toFixed(1)}</span>
                 <span className="text-[min(10px,2cqh)] font-black text-amber-500 uppercase">MEAN</span>
               </div>
            </div>

            <div className="mt-auto pt-[4cqh] border-t border-slate-200/60">
               <p className="m-0 text-[min(11px,2.4cqh)] text-slate-500 leading-relaxed italic font-medium">
                  Recursive audit confirms 99.8% vector stability across the strategic infrastructure landscape.
               </p>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden @portrait:block px-[6cqw] py-[3.5cqh] border-t border-slate-200 bg-indigo-50/50 relative">
        <div className="flex items-center gap-[2cqw] mb-1">
           <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
           <span className="text-[min(8px,1.8cqh)] font-black text-indigo-600 uppercase tracking-widest">MOBILE_SUMMARY</span>
        </div>
        <p className="m-0 text-[min(14px,3.2cqh)] text-slate-900 leading-[1.4] font-bold tracking-tight uppercase italic">
          Audit cycle complete. No significant variance detected in baseline trajectory.
        </p>
      </div>

      <div className="px-[5cqw] py-[2cqh] border-t border-slate-50 flex justify-between items-center bg-white shrink-0">
        <div className="flex items-center gap-[1.5cqw]">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
          <span className="text-[min(8px,1.8cqh)] font-black text-slate-400 uppercase tracking-widest">STRATEGIC_ASSET / ACTIVE</span>
        </div>
        <span className="text-[min(8px,1.8cqh)] font-black text-indigo-600 bg-indigo-50 px-[1.5cqw] rounded-[2px] uppercase tracking-tighter">
          Ver-v1.1
        </span>
      </div>
    </div>
  );
}
