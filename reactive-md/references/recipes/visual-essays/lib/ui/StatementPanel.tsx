import * as React from 'react';

type Alignment = 'left' | 'center';

interface Props {
  /** The primary headline or pull quote */
  statement: string;
  /** Small monospace label rendered below the statement, e.g. "DIRECTIVE_01A" */
  label?:    string;
  /** 'left' (default) = accent bar + left-aligned text; 'center' = centered, no bar */
  align?:    Alignment;
  /** Background tint; 'slate' = slate-50/50; 'white' (default) = transparent */
  bg?:       'white' | 'slate';
}

/**
 * StatementPanel — full-height billboard for a single claim inside a DataModule.
 *
 * Two modes driven by `align`:
 * - `left` (default): indigo accent bar + left-aligned bold italic headline + optional directive label
 * - `center`: centered statement with a thin rule below, no accent bar
 *
 * @example
 * ```tsx
 * // Left-aligned pull quote with directive label
 * <StatementPanel
 *   statement='"The distance between design and code is the primary source of entropy."'
 *   label="DIRECTIVE_01A"
 * />
 *
 * // Centered closing statement
 * <StatementPanel
 *   statement={"Stop drawing software.\nStart writing it."}
 *   align="center"
 *   bg="slate"
 * />
 * ```
 */
export function StatementPanel({ statement, label, align = 'left', bg = 'white' }: Props) {
  const bgClass  = bg === 'slate' ? 'bg-slate-50/50' : '';
  const isCenter = align === 'center';

  return (
    <div className={`h-full flex flex-col justify-center p-[8cqw] gap-[3cqh] ${bgClass}`}>
      {!isCenter && (
        <div className="h-1 w-[12cqw] bg-indigo-600 shadow-[0_0_12px_rgba(79,70,229,0.3)]" />
      )}

      <p
        className={`m-0 font-black text-slate-950 leading-[1.1] uppercase tracking-[-0.04em] italic ${
          isCenter ? 'text-center text-sm @md:text-lg tracking-[0.4em]' : 'text-2xl @lg:text-3xl'
        }`}
        style={{ whiteSpace: 'pre-line' }}
      >
        {statement}
      </p>

      {isCenter && (
        <div className="flex justify-center">
          <div className="w-12 h-px bg-slate-900/10" />
        </div>
      )}

      {!isCenter && label && (
        <div className="flex items-center gap-[3cqw] mt-[2cqh]">
          <span className="text-[10px] font-black text-slate-400 font-mono uppercase tracking-[0.3em]">
            {label}
          </span>
          <div className="flex-1 h-px bg-slate-100" />
        </div>
      )}
    </div>
  );
}
