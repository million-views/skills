import clsx from 'clsx';
import { cva } from 'class-variance-authority';

interface Labels {
  strengths?: string;
  weaknesses?: string;
  pricing?: string;
}

interface Props {
  name?: string;
  score?: number;
  highlight?: boolean;
  strengths?: string[];
  weaknesses?: string[];
  pricing?: string;
  labels?: Labels;
}

const traitLabel = cva('text-xs font-semibold uppercase tracking-widest mb-1.5', {
  variants: { color: { green: 'text-green-700', red: 'text-red-600' } },
});

const traitIcon = cva('mt-0.5', {
  variants: { color: { green: 'text-green-500', red: 'text-red-400' } },
});

const TRAIT_ICON = { green: '+', red: '−' };

function TraitList({ items, label, color }: { items: string[]; label: string; color: 'green' | 'red' }) {
  if (items.length === 0) return null;

  return (
    <div>
      <p className={traitLabel({ color })}>{label}</p>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-slate-700 flex gap-2">
            <span className={traitIcon({ color })} aria-hidden="true">{TRAIT_ICON[color]}</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function CompetitorCard({
  name = 'Competitor',
  score,
  highlight = false,
  strengths = [],
  weaknesses = [],
  pricing = 'Contact sales',
  labels = {},
}: Props) {
  const lbl = { strengths: 'Strengths', weaknesses: 'Weaknesses', pricing: 'Pricing', ...labels };

  return (
    <article className={clsx('rounded-xl border p-5 bg-white flex flex-col gap-4', highlight ? 'border-blue-400 ring-1 ring-blue-200' : 'border-slate-200')}>
      <header className="flex items-center justify-between">
        <h3 className={clsx('text-base font-bold', highlight ? 'text-blue-700' : 'text-slate-800')}>{name}</h3>
        {score !== undefined && (
          <span className={clsx('text-sm font-semibold px-2 py-0.5 rounded-full', highlight ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500')}>
            {score}/100
          </span>
        )}
      </header>

      <TraitList items={strengths} label={lbl.strengths} color="green" />
      <TraitList items={weaknesses} label={lbl.weaknesses} color="red" />

      <footer className="mt-auto pt-3 border-t border-slate-100">
        <p className="text-xs text-slate-500">
          <span className="font-semibold text-slate-700">{lbl.pricing}: </span>{pricing}
        </p>
      </footer>
    </article>
  );
}
