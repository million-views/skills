// Primary export for the "App" context of this file
export default function FeatureSpecDemo({ 
  title = "Interactive Feature Spec",
  buttonLabel = "Toggle Simulation",
  isActive: initialActive = false,
  onStateChange = () => {}
}) {
  const [active, setActive] = React.useState(initialActive);
  
  const handleToggle = () => {
    const newState = !active;
    setActive(newState);
    onStateChange(newState);
  };
  
  return (
    <div className="@container p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
      <h3 className="font-bold text-slate-900 mb-4">{title}</h3>
      <button 
        onClick={handleToggle}
        className={`px-5 py-2.5 rounded-lg text-white font-medium transition-all active:scale-95 ${
          active ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100' : 'bg-slate-400 hover:bg-slate-500 shadow-slate-100'
        } shadow-lg`}
      >
        {buttonLabel}: {active ? 'Active' : 'Inactive'}
      </button>
    </div>
  );
}

/**
 * Named Export: LoadingState
 * Used by the data-fetching examples in SKILL.md
 */
export function LoadingState() {
  return (
    <div className="flex items-center gap-3 p-4 text-slate-500 italic bg-slate-50 rounded-lg border border-dashed border-slate-200">
      <div className="w-4 h-4 border-2 border-slate-300 border-t-indigo-500 rounded-full animate-spin" />
      Syncing with remote source...
    </div>
  );
}

/**
 * Named Export: Display
 * Used by the data-fetching examples in SKILL.md
 */
export function Display({ data }) {
  return (
    <div className="p-4 bg-slate-900 text-indigo-300 border border-slate-800 rounded-lg font-mono text-sm">
      <div className="flex justify-between mb-2 text-slate-500 text-[10px] uppercase tracking-widest font-sans">
        <span>Response Buffer</span>
        <span>application/json</span>
      </div>
      <pre className="overflow-auto max-h-[200px] scrollbar-thin">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
