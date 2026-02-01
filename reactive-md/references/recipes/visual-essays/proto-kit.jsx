import * as React from 'react';
import { motion } from 'motion/react';

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
  source = "SYSTEM-V1", 
  children,
  sidebar
}) {
  return (
    <section className="flex flex-col h-[100cqh] w-[100cqw] bg-white border border-slate-200 overflow-hidden @container/module select-none relative font-sans">
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* Header */}
      <header className="px-[4cqw] py-[2cqh] border-b border-slate-100 flex justify-between items-center bg-white/80 backdrop-blur-sm z-10 shrink-0">
        <div className="flex flex-col">
          <div className="flex items-center gap-[1.5cqw] mb-[0.2cqh]">
            <div className="w-[1cqw] h-[0.5cqh] bg-emerald-500" />
            <span className="text-[min(8px,1.6cqh)] font-black text-slate-400 uppercase tracking-widest leading-none">
              {source}
            </span>
          </div>
          
          <h3 className="m-0 text-[min(18px,4cqh)] font-black text-slate-950 tracking-tighter leading-none">
            {title}
          </h3>

          {subtitle && (
            <p className="m-0 mt-[0.5cqh] text-[min(10px,2cqh)] font-medium text-slate-500 leading-tight">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-[4cqw]">
          <div className="hidden @[width>500px]:flex flex-col items-end">
            <span className="text-[min(7px,1.4cqh)] font-black text-slate-300 uppercase tracking-widest leading-none">STATUS</span>
            <span className="text-[min(9px,1.8cqh)] font-bold text-emerald-600">ACTIVE</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[min(7px,1.4cqh)] font-black text-slate-300 uppercase tracking-widest leading-none">DATE</span>
            <span className="text-[min(9px,1.8cqh)] font-bold text-slate-950 tabular-nums uppercase">
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
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
          <aside className="hidden @[width>700px]:flex w-[25cqw] border-l border-slate-100 bg-slate-50/20 flex-col overflow-y-auto p-[3cqw] gap-[3cqh]">
            {sidebar}
          </aside>
        )}
      </div>

      {/* Footer */}
      <footer className="px-[4cqw] py-[1.5cqh] bg-white border-t border-slate-100 flex justify-between items-center shrink-0 z-10 @[height<150px]:hidden">
        <div className="flex items-center gap-[2cqw]">
          <span className="text-[min(8px,1.6cqh)] font-black text-slate-400 uppercase tracking-widest">
            STABILITY_INDEX
          </span>
          <div className="flex gap-[0.5cqw]">
            {[1,2,3,4].map(i => <div key={i} className="w-[0.5cqw] h-[0.5cqh] bg-emerald-500 rounded-full" />)}
          </div>
        </div>
        <div className="flex items-center gap-[1.5cqw]">
          <span className="text-[min(8px,1.6cqh)] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-[1.5cqw] py-[0.5cqh] rounded-sm">
            VERIFIED_ASSET
          </span>
        </div>
      </footer>
    </section>
  );
}

/**
 * Performance Comparison Matrix
 */
export function ComparisonMatrix({ data = [] }) {
  const isSSR = useIsSSR();

  return (
    <div className="h-full w-full bg-white flex flex-col @container/matrix overflow-hidden font-sans group">
      <div className="p-[4cqw] border-b border-slate-100 flex justify-between items-end bg-slate-50/50">
        <div className="flex flex-col gap-[0.5cqh]">
          <span className="text-[min(8px,1.6cqh)] font-black text-slate-400 uppercase tracking-widest leading-none">Market_Sector / Performance</span>
          <h3 className="m-0 text-[min(18px,4cqh)] font-black tracking-tight text-slate-950 uppercase italic">
            Comparative Analysis
          </h3>
        </div>
        <div className="hidden @[width>500px]:flex flex-col items-end">
          <span className="text-[min(8px,1.6cqh)] font-black text-slate-300 uppercase">AVG_SCORE</span>
          <span className="text-[min(18px,4cqh)] font-black text-emerald-600 tabular-nums">84.2</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar flex @[width>750px]:flex-row flex-col">
        <div className="flex-1 divide-y divide-slate-100">
          {data.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className="p-[4cqw] @[width>600px]:p-[3cqw] flex justify-between items-center hover:bg-slate-50 transition-colors"
            >
              <div className="flex flex-col">
                <span className="text-slate-300 text-[min(8px,1.6cqh)] font-black uppercase tracking-wider mb-[0.2cqh]">0{i+1}</span>
                <span className="text-slate-900 text-[min(14px,3.2cqh)] font-bold tracking-tight uppercase italic">{item.name}</span>
              </div>
              <div className="flex flex-col items-end gap-[1cqh]">
                <div className="h-[0.8cqh] w-[20cqw] bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={isSSR ? { width: `${item.score}%` } : { width: 0 }}
                    animate={{ width: `${item.score}%` }}
                    transition={{ duration: 1, delay: 0.2 + i * 0.05 }}
                    className="h-full bg-emerald-500" 
                  />
                </div>
                <span className="text-emerald-600 text-[min(12px,2.4cqh)] font-black tabular-nums">{item.score}%</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="hidden @[width>750px]:flex w-[35%] bg-slate-50 border-l border-slate-100 p-[4cqw] flex-col gap-[3cqh]">
           <div className="flex flex-col gap-[1cqh]">
              <span className="text-[min(9px,1.8cqh)] font-black text-slate-400 uppercase tracking-widest">Statistical_Overview</span>
              <div className="h-px bg-slate-200 w-full" />
           </div>

           <div className="space-y-[4cqh] mt-[2cqh]">
             <div className="flex flex-col">
                <span className="text-[min(8px,1.6cqh)] font-black text-slate-400 uppercase mb-[0.5cqh]">Variance_Delta</span>
                <span className="text-[min(24px,5cqh)] font-black text-slate-950 tabular-nums tracking-tighter leading-none">12.4%</span>
                <p className="mt-[1cqh] text-[min(10px,2cqh)] text-slate-500 italic font-medium leading-relaxed">
                  Calculated against the sector baseline for {new Date().getFullYear()}.
                </p>
             </div>

             <div className="space-y-[1cqh]">
                <span className="text-[min(8px,1.6cqh)] font-black text-slate-400 uppercase">Trend_Projection</span>
                <div className="h-[8cqh] w-full flex items-end gap-[2px]">
                   {[30, 45, 35, 60, 50, 80, 75, 95].map((h, i) => (
                     <div key={i} style={{ height: `${h}%` }} className="flex-1 bg-emerald-500/10 border-t border-emerald-500/30" />
                   ))}
                </div>
             </div>
           </div>
        </div>
      </div>
      
      <div className="px-[4cqw] py-[1cqh] border-t border-slate-100 bg-white flex justify-between items-center group-hover:bg-slate-50 transition-colors">
        <div className="flex items-center gap-[1.5cqw]">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          <span className="text-[min(8px,1.6cqh)] font-black text-slate-400 uppercase tracking-widest">System_Rendering / Stable</span>
        </div>
        <span className="text-[min(8px,1.6cqh)] font-bold text-slate-300 tabular-nums uppercase">
           Fidelity: High
        </span>
      </div>
    </div>
  );
}

/**
 * Feature Comparison Matrix
 */
export function FeatureMatrix({ features = [] }) {
  const [activeRow, setActiveRow] = React.useState(null);

  const Check = () => (
    <div className="flex items-center justify-center">
      <div className="bg-emerald-500 text-white text-[min(8px,1.6cqh)] font-black px-[1.5cqw] py-[0.5cqh] rounded-sm leading-none uppercase tracking-tighter">
        YES
      </div>
    </div>
  );
  
  const Cross = () => (
    <div className="flex items-center justify-center opacity-10">
      <div className="w-[1cqw] h-[1cqw] rounded-full bg-slate-400" />
    </div>
  );

  return (
    <div className="h-full w-full @container/matrix bg-white relative group">
      <div className="hidden @[width>500px]:block h-full p-[4cqw] overflow-hidden">
        <table className="w-full text-left border-collapse table-fixed">
          <thead>
            <tr className="border-b border-slate-900">
              <th className="py-[1.5cqh] pr-[2cqw] font-black text-[min(10px,2cqh)] uppercase tracking-widest text-slate-950 w-[45%]">Capability</th>
              <th className="py-[1.5cqh] px-[1cqw] text-center font-black text-[min(10px,2cqh)] uppercase tracking-widest text-emerald-600 bg-emerald-50/30">CURRENT</th>
              <th className="py-[1.5cqh] px-[1cqw] text-center font-black text-[min(10px,2cqh)] uppercase tracking-widest text-slate-300">CORE_A</th>
              <th className="py-[1.5cqh] px-[1cqw] text-center font-black text-[min(10px,2cqh)] uppercase tracking-widest text-slate-300">CORE_B</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {features.map((f, i) => (
              <motion.tr 
                key={f.name}
                onMouseEnter={() => setActiveRow(i)}
                onMouseLeave={() => setActiveRow(null)}
                className="group hover:bg-slate-50 transition-colors"
              >
                <td className="py-[1.5cqh] pr-[2cqw] font-black text-slate-900 tracking-tight italic">
                  <div className="flex items-center gap-[1.5cqw]">
                    <span className="text-[min(11px,2.4cqh)] uppercase">{f.name}</span>
                    {activeRow === i && (
                      <motion.div layoutId="ptr" className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    )}
                  </div>
                </td>
                <td className="py-[1.5cqh] px-[1cqw] bg-emerald-50/10">{f.ours ? <Check /> : <Cross />}</td>
                <td className="py-[1.5cqh] px-[1cqw]">{f.compA ? <Check /> : <Cross />}</td>
                <td className="py-[1.5cqh] px-[1cqw]">{f.compB ? <Check /> : <Cross />}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="block @[width>500px]:hidden h-full p-[5cqw] overflow-hidden">
        <div className="flex flex-col gap-[1cqh]">
          {features.slice(0, 5).map((f, i) => (
            <motion.div 
              key={f.name}
              initial={{ opacity: 0, x: -5 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-[3cqw] border-l-2 border-slate-950 bg-slate-50 flex flex-col gap-[1cqh]"
            >
              <h4 className="m-0 font-black text-[min(11px,2.4cqh)] text-slate-950 uppercase tracking-tight italic">
                {f.name}
              </h4>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-[2cqw]">
                  <span className="text-[min(8px,1.6cqh)] font-black text-emerald-600">STATE:</span>
                  {f.ours ? <Check /> : <Cross />}
                </div>
                <div className="flex items-center gap-[1.5cqw] opacity-40">
                   <div className="flex gap-[0.5cqw]">
                      <div className={`w-1 h-1 rounded-full ${f.compA ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                      <div className={`w-1 h-1 rounded-full ${f.compB ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                   </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Animated SVG Trend Chart
 */
export function SVGTrendChart({
  data = [],
  color = "#10b981"
}) {
  const isSSR = useIsSSR();
  const [povIndex, setPovIndex] = React.useState(null);

  if (data.length === 0) return <div className="h-full w-full flex items-center justify-center text-slate-300 text-[min(10px,2cqh)] uppercase font-black tracking-widest bg-slate-50">NO_DATA</div>;

  const baseWidth = 400;
  const baseHeight = 220;
  const paddingX = 40;
  const paddingY = 50;

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const avgValue = data.reduce((acc, curr) => acc + curr.value, 0) / data.length;
  const range = maxValue - minValue || 1;

  const points = data.map((d, i) => {
    const x = paddingX + (i / (data.length - 1)) * (baseWidth - paddingX * 2);
    const y = (baseHeight - paddingY) - ((d.value - minValue) / range) * (baseHeight - paddingY * 2.0);
    return [x, y];
  });

  const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ');

  return (
    <div 
      className="h-full w-full relative @container/chart bg-white overflow-hidden flex flex-col font-sans"
      onMouseLeave={() => setPovIndex(null)}
    >
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 relative flex flex-col min-w-0">
          <div className="absolute top-[4cqw] left-[4cqw] flex items-center gap-[2cqw] z-20">
            <div className="w-1.5 h-[1.5cqh] bg-emerald-500" />
            <span className="text-[min(10px,2.4cqh)] font-black text-slate-950 uppercase tracking-widest">Macro_Velocity</span>
          </div>

          <div className="flex-1 w-full relative p-[2cqw] flex items-center justify-center bg-transparent min-h-0 cursor-crosshair">
            <svg
              viewBox={`0 0 ${baseWidth} ${baseHeight}`}
              className="w-full h-full max-h-full overflow-visible transition-transform duration-700 ease-out"
              preserveAspectRatio="xMidYMid meet"
              onMouseMove={(e) => {
                if (isSSR) return;
                const bounds = e.currentTarget.getBoundingClientRect();
                const xProp = (e.clientX - bounds.left) / bounds.width;
                const index = Math.round(xProp * (data.length - 1));
                if (index >= 0 && index < data.length) setPovIndex(index);
              }}
            >
              <g className="opacity-30">
                <line x1={paddingX} y1={baseHeight-paddingY+10} x2={baseWidth-paddingX} y2={baseHeight-paddingY+10} stroke="#e2e8f0" strokeWidth="1" />
              </g>

              <motion.path
                d={pathData} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                initial={isSSR ? { pathLength: 1 } : { pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }} 
              />
              
              {!isSSR && povIndex !== null && (
                <circle cx={points[povIndex][0]} cy={points[povIndex][1]} r="6" fill={color} stroke="white" strokeWidth="2" />
              )}
            </svg>
          </div>
        </div>

        <div className="hidden @[width>700px]:flex w-[30%] border-l border-slate-100 bg-slate-50/50 flex-col p-[4cqw] relative">
          <div className="flex flex-col gap-[1cqh]">
            <span className="text-[min(8px,1.6cqh)] font-black text-slate-400 uppercase tracking-widest">Analytics_Feed</span>
            <div className="h-px bg-slate-200 w-full" />
          </div>
          
          <div className="mt-[4cqh] flex-1 flex flex-col gap-[4cqh]">
            <div className="flex flex-col">
               <span className="text-[min(8px,1.6cqh)] font-black text-slate-400 uppercase mb-[0.2cqh]">High_Signal</span>
               <span className="text-[min(24px,6cqh)] font-black text-slate-950 tabular-nums leading-none tracking-tighter">{maxValue.toFixed(1)}</span>
            </div>

            <div className="flex flex-col">
               <span className="text-[min(8px,1.6cqh)] font-black text-slate-400 uppercase mb-[0.2cqh]">Avg_Velocity</span>
               <span className="text-[min(24px,6cqh)] font-black text-slate-950 tabular-nums leading-none tracking-tighter">{avgValue.toFixed(1)}</span>
            </div>

            <div className="mt-auto space-y-[2cqh]">
               <p className="text-[min(10px,2.2cqh)] text-slate-500 leading-relaxed italic font-medium">
                  Baseline confirms consistent stability across the Documented infrastructure.
               </p>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden @portrait:block px-[5cqw] py-[3cqh] border-t border-slate-100 bg-slate-50 relative">
        <p className="m-0 text-[min(13px,3cqh)] text-slate-900 leading-tight font-bold tracking-tight">
          Baseline audit confirms trend stability.
        </p>
      </div>

      <div className="px-[4cqw] py-[1cqh] border-t border-slate-50 flex justify-between items-center bg-white shrink-0">
        <div className="flex items-center gap-[1.5cqw]">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span className="text-[min(8px,1.6cqh)] font-black text-slate-400 uppercase tracking-widest">Asset_Render / Success</span>
        </div>
        <span className="text-[min(8px,1.6cqh)] font-black text-emerald-600 bg-emerald-50 px-[1.5cqw] rounded-sm uppercase tracking-tighter">
          Ver-v1.0
        </span>
      </div>
    </div>
  );
}
