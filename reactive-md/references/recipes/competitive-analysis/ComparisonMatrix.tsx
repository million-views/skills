import clsx from 'clsx';

interface Competitor {
  name: string;
  score: number;
  highlight?: boolean;
}

interface Props {
  data?: Competitor[];
  /** Describes what the score measures — e.g. "Feature depth score (out of 100)" */
  title: string;
}

const VALUE_MAX = 100;

function ScoreBar({ score, highlight }: { score: number; highlight?: boolean }) {
  return (
    <div
      className="h-2 rounded-full bg-slate-100 overflow-hidden"
      role="meter"
      aria-valuenow={score}
      aria-valuemin={0}
      aria-valuemax={VALUE_MAX}
      aria-label={`Score: ${score} out of ${VALUE_MAX}`}
    >
      <div
        className={clsx('h-full rounded-full transition-all', highlight ? 'bg-blue-600' : 'bg-slate-300')}
        style={{ width: `${score}%` }}
      />
    </div>
  );
}

function ScoreRow({ name, score, highlight }: Competitor) {
  return (
    <li className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className={highlight ? 'font-bold text-blue-700' : 'text-slate-700'}>{name}</span>
        <span className={highlight ? 'font-bold text-blue-700' : 'text-slate-500'}>{score}</span>
      </div>
      <ScoreBar score={score} highlight={highlight} />
    </li>
  );
}

export default function ComparisonMatrix({ data = [], title }: Props) {
  return (
    <section className="bg-white rounded-xl border border-slate-200">
      <header className="px-6 pt-5 pb-4 border-b border-slate-100">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-widest">{title}</h3>
      </header>
      <ol className="space-y-4 list-none p-0 m-0 px-6 py-5">
        {data.map(competitor => (
          <ScoreRow key={competitor.name} {...competitor} />
        ))}
      </ol>
    </section>
  );
}
