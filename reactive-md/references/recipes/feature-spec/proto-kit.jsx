// Primary export for the "App" context of this file
export default function FeatureSpecDemo({ 
  title = "Infrastructure Audit",
  buttonLabel = "Initialize Core",
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
    <div className="p-[4cqw] bg-white border border-slate-200/60 rounded-[4px] shadow-sm flex flex-col gap-[3cqh]">
      <div className="flex items-center justify-between">
        <span className="text-[min(8px,1.8cqh)] font-black text-slate-400 uppercase tracking-[0.2em]">SYSTEM_MOD_01</span>
        <div className={`w-[2cqh] h-[2cqh] rounded-full transition-colors ${active ? 'bg-indigo-500 shadow-[0_0_10px_rgba(79,70,229,0.4)]' : 'bg-slate-200'}`} />
      </div>

      <div>
        <h3 className="text-[min(20px,4.5cqh)] font-black text-slate-950 tracking-tight leading-none mb-[1cqh]">{title}</h3>
        <p className="text-[min(11px,2.4cqh)] font-medium text-slate-500 leading-snug">
          Verifying automated containment and logical truth emulation across the current stack.
        </p>
      </div>

      <button 
        onClick={handleToggle}
        className={`px-[4cqw] py-[2.5cqh] rounded-[2px] text-[min(12px,2.6cqh)] font-black uppercase tracking-widest transition-all active:scale-[0.98] ${
          active 
            ? 'bg-indigo-600 text-white shadow-[0_4px_12px_rgba(79,70,229,0.25)]' 
            : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
        }`}
      >
        {active ? 'RUNNING_STABLE' : 'INITIALIZE_SEQUENCE'}
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
    <div className="flex items-center gap-[3cqw] p-[4cqw] bg-slate-50/50 border border-dashed border-slate-200 rounded-[2px]">
      <div className="w-[3cqh] h-[3cqh] border-2 border-slate-300 border-t-indigo-500 rounded-full animate-spin" />
      <span className="text-[min(11px,2.4cqh)] font-bold text-slate-400 italic">Syncing with remote source...</span>
    </div>
  );
}

/**
 * Named Export: Display
 * Used by the data-fetching examples in SKILL.md
 */
export function Display({ data }) {
  return (
    <div className="p-[4cqw] bg-slate-950 border border-slate-900 rounded-[2px] font-mono shadow-inner">
      <div className="flex justify-between mb-[2cqh] text-[min(8px,1.8cqh)] font-black text-slate-500 uppercase tracking-[0.2em]">
        <span>RESPONSE_BUFFER</span>
        <span className="text-indigo-500/80">application/json</span>
      </div>
      <pre className="overflow-auto max-h-[25vh] scrollbar-thin text-indigo-100 text-[min(10px,2.2cqh)] leading-relaxed">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
