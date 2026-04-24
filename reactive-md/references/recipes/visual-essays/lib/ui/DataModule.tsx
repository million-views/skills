import * as React from 'react';

/** Two-layer dot-grid texture — subtle fine + coarse grid overlay for visual density. */
function GridOverlay() {
  return (
    <>
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:120px_120px]" />
    </>
  );
}

interface Props {
  /** Primary heading displayed prominently in the header */
  title:        string;
  /** Supporting descriptor shown below the title in muted text */
  subtitle?:    string;
  /** Short identifier shown in the header strip, e.g. "STRATEGIC_ASSET_v2" */
  source?:      string;
  /** Status label shown beside source, e.g. "DRAFT" or "LOCKED" */
  status?:      string;
  /** Optional right-hand sidebar (visible at @lg container width+) */
  sidebar?:     React.ReactNode;
  /** Optional footer content. If omitted the footer bar is hidden entirely. */
  footer?:      React.ReactNode;
  /**
   * Optional confidentiality / provenance line rendered centered in the footer strip.
   * Use `·` as a separator between clauses, e.g.:
   * `"CONFIDENTIAL · PREPARED FOR ACME CORP · DO NOT DISTRIBUTE"`
   *
   * When both `footer` and `disclaimer` are provided, `footer` content sits on the
   * left and `disclaimer` on the right within the same footer bar.
   */
  disclaimer?:  string;
  /** Main content rendered in the body area */
  children?:    React.ReactNode;
}

/**
 * DataModule — structural shell for visual-essay frames.
 *
 * Provides a consistent header (title, optional source/status chip, issuance
 * timestamp), a main + optional sidebar layout, and an optional footer. All
 * chrome text is prop-driven; no hardcoded copy.
 */
export function DataModule({
  title,
  subtitle,
  source,
  status,
  sidebar,
  footer,
  disclaimer,
  children,
}: Props) {
  const timestamp = React.useMemo(
    () => new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    [],
  );

  return (
    <section className="flex flex-col h-full w-full bg-white border border-slate-200 overflow-hidden relative font-sans text-slate-900">
      <GridOverlay />

      {/* Header */}
      <header className="px-[5cqw] py-[3cqh] border-b border-slate-200/60 flex justify-between items-start bg-white/90 backdrop-blur-md z-20 shrink-0">
        <div className="flex flex-col gap-[0.5cqh]">
          {(source || status) && (
            <div className="flex items-center gap-[1.5cqw]">
              <div className="w-[1.2cqw] h-[0.4cqh] bg-indigo-600" />
              {source && (
                <span className="text-[min(7px,1.4cqh)] font-black text-slate-400 uppercase tracking-[0.2em] leading-none">
                  {source}
                </span>
              )}
              {source && status && <div className="h-2 w-px bg-slate-200" />}
              {status && (
                <span className="text-[min(7px,1.4cqh)] font-bold text-indigo-500/80 uppercase tracking-widest leading-none">
                  {status}
                </span>
              )}
            </div>
          )}

          <h3 className="m-0 text-[min(22px,5cqh)] font-black text-slate-950 tracking-[-0.04em] leading-none mt-[1cqh]">
            {title}
          </h3>

          {subtitle && (
            <p className="m-0 mt-[0.8cqh] text-[min(11px,2.2cqh)] font-medium text-slate-500/80 leading-snug max-w-[50cqw]">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex flex-col items-end gap-[0.5cqh]">
          <span className="text-[min(7px,1.4cqh)] font-black text-slate-300 uppercase tracking-[0.15em] leading-none">
            ISSUED
          </span>
          <span className="text-[min(10px,2cqh)] font-bold text-slate-950 tabular-nums uppercase tracking-tight">
            {timestamp}
          </span>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        <main className="flex-1 overflow-hidden relative flex flex-col">
          {children}
        </main>

        {sidebar && (
          <aside className="hidden @lg:flex w-[28cqw] border-l border-slate-200/60 bg-slate-50/40 flex-col overflow-y-auto p-[4cqw] gap-[4cqh] z-10">
            {sidebar}
          </aside>
        )}
      </div>

      {/* Footer — hidden when neither footer nor disclaimer is provided */}
      {(footer || disclaimer) && (
        <footer className="px-[5cqw] py-[1.5cqh] bg-white border-t border-slate-200/40 flex justify-between items-center shrink-0 z-20">
          {footer && <div>{footer}</div>}
          {disclaimer && (
            <span
              className="text-[min(7px,1.4cqh)] font-black text-slate-300 uppercase tracking-[0.2em] leading-none"
              style={{ marginLeft: footer ? undefined : 'auto', marginRight: footer ? undefined : 'auto' }}
            >
              {disclaimer}
            </span>
          )}
        </footer>
      )}
    </section>
  );
}
