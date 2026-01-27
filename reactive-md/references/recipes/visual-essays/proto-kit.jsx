import React from 'react';
import { motion } from 'motion/react';

/**
 * Score comparison bar chart.
 * Preview Safety: Default data to empty array.
 */
export function ComparisonMatrix({ data = [] }) {
  return (
    <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
      <h3 className="font-bold text-slate-800 mb-6">Market Share & Score</h3>
      <div className="space-y-4">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-4">
            <span className="w-32 text-sm font-semibold text-slate-600 truncate">{item.name}</span>
            <div className="flex-1 bg-slate-100 rounded-full h-4 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.score}%` }}
                className={`h-full ${item.color || 'bg-blue-500'} rounded-full`}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
            <span className="w-12 text-right text-sm font-bold text-slate-900">{item.score}%</span>
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
            <th className="p-4 text-center font-bold text-blue-600 bg-blue-50/50">Our Platform</th>
            <th className="p-4 text-center font-bold text-slate-700">Incumbent A</th>
            <th className="p-4 text-center font-bold text-slate-700">Incumbent B</th>
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
 */
export function SVGTrendChart({ 
  data = [], 
  title = "Growth Trends", 
  color = "#3b82f6" 
}) {
  if (data.length === 0) return <div className="p-8 border border-dashed rounded-xl text-slate-400 text-center text-sm">Waiting for trend data...</div>;

  const width = 400;
  const height = 150;
  const padding = 20;
  
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;

  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((d.value - minValue) / range) * (height - padding * 2);
    return [x, y];
  });

  const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ');

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">{title}</h4>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
        {/* Animated Path */}
        <motion.path
          d={pathData}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
        {/* Points with hover effect */}
        {points.map((p, i) => (
          <motion.circle
            key={i}
            cx={p[0]}
            cy={p[1]}
            r="4"
            fill="white"
            stroke={color}
            strokeWidth="2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1 + i * 0.1 }}
            whileHover={{ scale: 1.5, fill: color }}
          />
        ))}
      </svg>
      <div className="mt-4 flex justify-between text-xs font-medium text-slate-400">
        <span>{data[0]?.label}</span>
        <span>{data[data.length - 1]?.label}</span>
      </div>
    </div>
  );
}

/**
 * Narrative Card for Visual Essays
 */
export function InsightCard({ children, icon: Icon = () => null, title = "Insight" }) {
  return (
    <div className="flex gap-4 p-5 bg-amber-50 rounded-xl border border-amber-100">
      <div className="mt-1 text-amber-600">
        <Icon size={20} />
      </div>
      <div>
        <h5 className="font-bold text-amber-900 mb-1">{title}</h5>
        <div className="text-sm text-amber-800 leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}
