import * as React from 'react';
import { motion } from 'motion/react';
import { SidebarPanel, SidebarStat } from './SidebarPanel.tsx';

function useIsSSR(): boolean {
  return typeof window === 'undefined' || (window as any).__REACTIVE_MD_SSR__ === true;
}

function formatTick(v: number): string {
  return v % 1 === 0 ? String(Math.round(v)) : v.toFixed(1);
}

interface DataPoint {
  /** X-axis period label, e.g. "Q1" or "Jan" */
  label: string;
  /** Numeric Y value */
  value: number;
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
  /** Data series; each entry produces one point on the line */
  data?:    DataPoint[];
  /** Hex or CSS color for the line, area fill, and hover dot. Defaults to indigo-600 */
  color?:   string;
  /** Short headline shown in the top-left of the chart area */
  title?:   string;
  /** Secondary descriptor below the title */
  label?:   string;
  /**
   * Stats to show in the right-hand analytics panel (visible at @4xl+).
   * Panel is hidden when omitted — no default values are injected.
   * Pass explicit, contextual items, e.g. `[{ label: 'Q7 PEAK', value: '100', note: 'Inflection at Q3' }]`.
   */
  stats?:      StatItem[];
  /** Header label for the stats panel. Only relevant when `stats` is provided. */
  statsTitle?: string;
  /** Text shown in the portrait bottom strip */
  caption?:    string;
}

interface GridLineProps {
  index:      number;
  paddingX:   number;
  paddingY:   number;
  baseWidth:  number;
  baseHeight: number;
}

function GridLine({ index, paddingX, paddingY, baseWidth, baseHeight }: GridLineProps) {
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

function StatPanel({ stats, title }: { stats: StatItem[]; title?: string }) {
  return (
    <div className="hidden @4xl:flex w-[32%] border-l border-slate-200/60 bg-slate-50/40 flex-col p-[5cqw] gap-[4cqh]">
      <div className="flex flex-col gap-[0.5cqh]">
        <span className="text-[min(8px,1.8cqh)] font-black text-slate-400 uppercase tracking-[0.2em] leading-none">
          {title ?? 'ANALYSIS'}
        </span>
        <div className="h-0.5 w-[5cqw] bg-indigo-600" />
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
 * TrendChart — animated SVG line chart for visual-essay frames.
 *
 * Renders a line + area chart with labeled X and Y axes and optional hover
 * interaction. The right-hand stats panel (visible at @4xl+) is hidden by
 * default — provide explicit `stats` items with contextual labels and notes.
 *
 * All label text is prop-driven — no hardcoded copy.
 */
export function TrendChart({
  data = [],
  color = '#4f46e5',
  title,
  label,
  stats,
  statsTitle,
  caption,
}: Props) {
  const isSSR = useIsSSR();
  const [hovIndex, setHovIndex] = React.useState<number | null>(null);

  if (data.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-slate-50 border border-dashed border-slate-200">
        <span className="text-[min(10px,2cqh)] uppercase font-black tracking-[0.3em] text-slate-300">
          NO DATA
        </span>
      </div>
    );
  }

  const baseWidth  = 500;
  const baseHeight = 300;  // extra 20px at bottom for X-axis labels
  const paddingX   = 40;
  const paddingY   = 60;

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range    = maxValue - minValue || 1;

  function getPoint(d: DataPoint, i: number): [number, number] {
    const divisor = data.length > 1 ? data.length - 1 : 1;
    const x = paddingX + (i / divisor) * (baseWidth - paddingX * 2);
    const y = (baseHeight - paddingY) - ((d.value - minValue) / range) * (baseHeight - paddingY * 2);
    return [x, y];
  }

  const points   = data.map(getPoint);
  const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ');
  const areaData = `${pathData} L ${points[points.length - 1][0]} ${baseHeight - paddingY} L ${points[0][0]} ${baseHeight - paddingY} Z`;

  const baseline = baseHeight - paddingY;

  function handleMouseMove(e: React.MouseEvent<SVGSVGElement>) {
    if (isSSR) return;
    const bounds = e.currentTarget.getBoundingClientRect();
    const xProp  = (e.clientX - bounds.left) / bounds.width;
    const index  = Math.round(xProp * (data.length - 1));
    if (index >= 0 && index < data.length) setHovIndex(index);
  }

  return (
    <div
      className="h-full w-full relative bg-white overflow-hidden flex flex-col font-sans"
      onMouseLeave={() => setHovIndex(null)}
    >
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 relative flex flex-col min-w-0">
          {(title || label) && (
            <div className="absolute top-[4cqh] left-[5cqw] flex flex-col gap-[0.3cqh] z-30">
              {title && (
                <div className="flex items-center gap-[1.5cqw]">
                  <div className="w-4 h-0.5" style={{ background: color }} />
                  <span className="text-[min(9px,2cqh)] font-black text-slate-950 uppercase tracking-[0.25em] leading-none">
                    {title}
                  </span>
                </div>
              )}
              {label && (
                <span className="text-[min(11.5px,2.6cqh)] font-black text-slate-300 uppercase tracking-widest mt-1">
                  {label}
                </span>
              )}
            </div>
          )}

          <div className="flex-1 w-full relative p-[2cqw] flex items-center justify-center bg-transparent min-h-0 cursor-crosshair">
            <svg
              viewBox={`0 0 ${baseWidth} ${baseHeight}`}
              className="w-full h-full max-h-full overflow-visible transition-all duration-700 ease-out"
              preserveAspectRatio="xMidYMid meet"
              onMouseMove={handleMouseMove}
            >
              <defs>
                <linearGradient id="trendAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor={color} stopOpacity="0.1" />
                  <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
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

              {/* Y-axis: value labels at top / mid / bottom grid positions */}
              <g>
                {[0, 2, 4].map(i => {
                  const gy  = paddingY + (i / 4) * (baseHeight - paddingY * 2);
                  const val = minValue + (1 - i / 4) * range;
                  return (
                    <text
                      key={i}
                      x={paddingX - 8}
                      y={gy + 4}
                      textAnchor="end"
                      style={{ fontSize: '11px', fill: '#94a3b8', fontWeight: 700, fontFamily: 'ui-monospace, monospace' }}
                    >
                      {formatTick(val)}
                    </text>
                  );
                })}
              </g>

              {/* X-axis: period labels below baseline */}
              <g>
                {data.map((d, i) => {
                  const [x] = getPoint(d, i);
                  return (
                    <text
                      key={i}
                      x={x}
                      y={baseline + 20}
                      textAnchor="middle"
                      style={{ fontSize: '10px', fill: '#94a3b8', fontWeight: 700, letterSpacing: '0.08em', fontFamily: 'ui-monospace, monospace' }}
                    >
                      {d.label.toUpperCase()}
                    </text>
                  );
                })}
              </g>

              <motion.path
                d={areaData}
                fill="url(#trendAreaGrad)"
                initial={isSSR ? { opacity: 0.8 } : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2, delay: 0.5 }}
              />
              <motion.path
                d={pathData}
                fill="none"
                stroke={color}
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={isSSR ? { pathLength: 1 } : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
              />

              {!isSSR && hovIndex !== null && (
                <g>
                  <line
                    x1={points[hovIndex][0]} y1={paddingY}
                    x2={points[hovIndex][0]} y2={baseline}
                    stroke={color} strokeWidth="1" strokeDasharray="4 2"
                    className="opacity-40"
                  />
                  <circle
                    cx={points[hovIndex][0]}
                    cy={points[hovIndex][1]}
                    r="7"
                    fill={color}
                    stroke="white"
                    strokeWidth="3"
                  />
                  <text
                    x={points[hovIndex][0]}
                    y={points[hovIndex][1] - 15}
                    textAnchor="middle"
                    className="text-[12px] font-black fill-slate-950 tabular-nums select-none"
                  >
                    {data[hovIndex].value.toFixed(1)}
                  </text>
                </g>
              )}
            </svg>
          </div>
        </div>

        {stats && stats.length > 0 && <StatPanel stats={stats} title={statsTitle} />}
      </div>

      {caption && (
        <div className="hidden @portrait:block px-[6cqw] py-[3.5cqh] border-t border-slate-200 bg-indigo-50/50">
          <p className="m-0 text-[min(14px,3.2cqh)] text-slate-900 leading-[1.4] font-bold tracking-tight uppercase italic">
            {caption}
          </p>
        </div>
      )}
    </div>
  );
}
