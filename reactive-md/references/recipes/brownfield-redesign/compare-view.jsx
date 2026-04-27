import { useState } from 'react';

/**
 * CompareView — Split-screen before/after widget for brownfield redesign docs.
 *
 * Left panel: a screenshot provided by the product owner (plain <img>).
 * Right panel: the proposed React component passed as children.
 *
 * Usage:
 *   <CompareView screenshotSrc="./screenshots/current/01-screen.png">
 *     <ProposedScreen />
 *   </CompareView>
 *
 * If screenshotSrc is omitted or the image fails to load, a placeholder is shown.
 * Copy this file into your document folder alongside your spec.md.
 */

function ScreenshotPane({ src, label }) {
  const [failed, setFailed] = useState(false);

  return (
    <div>
      <div className="px-3 py-1.5 bg-red-50 border-b border-red-100">
        <span className="text-xs font-semibold text-red-600 uppercase tracking-widest">
          {label}
        </span>
      </div>
      {src && !failed ? (
        <img
          src={src}
          alt={label}
          className="w-full block"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="p-8 text-center text-xs text-gray-400 bg-gray-50 min-h-32 flex items-center justify-center">
          {src
            ? `Screenshot not found — check path: ${src}`
            : 'Provide screenshotSrc to show the current state here'}
        </div>
      )}
    </div>
  );
}

export function CompareView({
  screenshotSrc,
  currentLabel = 'Current',
  proposedLabel = 'Proposed',
  children,
}) {
  return (
    <div className="grid @md:grid-cols-2 rounded-lg overflow-hidden border border-gray-200">
      <div className="border-r border-gray-200">
        <ScreenshotPane src={screenshotSrc} label={currentLabel} />
      </div>
      <div>
        <div className="px-3 py-1.5 bg-green-50 border-b border-green-100">
          <span className="text-xs font-semibold text-green-600 uppercase tracking-widest">
            {proposedLabel}
          </span>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
