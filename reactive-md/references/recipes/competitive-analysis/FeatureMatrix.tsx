import clsx from 'clsx';

type SupportLevel = 'full' | 'partial' | 'none' | 'na';

interface Column {
  label: string;
  highlight?: boolean;
}

interface Feature {
  name: string;
  values: SupportLevel[];
}

interface Category {
  label: string;
  features: Feature[];
}

interface Props {
  categories?: Category[];
  columns?: Column[];
}

const SYMBOL: Record<SupportLevel, string> = {
  full:    '✓',
  partial: '◑',
  none:    '—',
  na:      'N/A',
};

const VALUE_CLASS: Record<SupportLevel, string> = {
  full:    'text-green-600',
  partial: 'text-amber-500',
  none:    'text-slate-400',
  na:      'text-slate-300 italic',
};

function CellValue({ level, highlight }: { level: SupportLevel; highlight?: boolean }) {
  return (
    <td className={clsx('py-3.5 text-center text-sm', VALUE_CLASS[level], { 'bg-blue-50 font-bold': highlight })}>
      {SYMBOL[level]}
    </td>
  );
}

function FeatureRow({ row, columns }: { row: Feature; columns: Column[] }) {
  return (
    <tr className="border-t border-slate-100 hover:bg-slate-50/80">
      <td className="text-slate-700" style={{ padding: '0.875rem 1rem', paddingLeft: '2rem' }}>{row.name}</td>
      {columns.map(({ highlight }, i) => (
        <CellValue key={i} level={row.values[i] ?? 'none'} highlight={highlight} />
      ))}
    </tr>
  );
}

function CategoryGroup({ category, columns }: { category: Category; columns: Column[] }) {
  return (
    <>
      <tr>
        <th
          colSpan={columns.length + 1}
          scope="row"
          className="px-4 py-2 bg-slate-50 border-t border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-widest text-left"
        >
          {category.label}
        </th>
      </tr>
      {category.features.map(row => (
        <FeatureRow key={row.name} row={row} columns={columns} />
      ))}
    </>
  );
}

function MatrixHead({ columns }: { columns: Column[] }) {
  return (
    <tr>
      <th
        scope="col"
        className="py-3 px-4 font-semibold text-slate-600 text-left bg-slate-50 border-b-2 border-slate-200"
      >
        Feature
      </th>
      {columns.map(({ label, highlight }, i) => (
        <th
          key={i}
          scope="col"
          className={clsx('py-3 px-4 font-semibold border-b-2 border-slate-200',
            highlight ? 'bg-blue-50 text-blue-700' : 'bg-slate-50 text-slate-600')}
          style={{ textAlign: 'center' }}
        >
          {label}
        </th>
      ))}
    </tr>
  );
}

function MatrixLegend({ colSpan }: { colSpan: number }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-2.5 border-t border-slate-100">
        <div className="flex gap-5 text-xs">
          <span className="flex items-center gap-1.5 text-green-600 font-bold">
            ✓ <span className="text-slate-400 font-normal">Full support</span>
          </span>
          <span className="flex items-center gap-1.5 text-amber-500 font-bold">
            ◑ <span className="text-slate-400 font-normal">Partial</span>
          </span>
          <span className="flex items-center gap-1.5 text-slate-400">— Absent</span>
          <span className="flex items-center gap-1.5 text-slate-300 italic">N/A <span className="not-italic text-slate-400">Not applicable</span></span>
        </div>
      </td>
    </tr>
  );
}

export default function FeatureMatrix({ categories = [], columns = [] }: Props) {
  const colWidth = `${(60 / Math.max(columns.length, 1)).toFixed(1)}%`;

  return (
    <div className="font-sans rounded-xl border border-slate-200 overflow-hidden text-sm">
      <table className="w-full table-fixed border-collapse">
        <colgroup>
          <col style={{ width: '40%' }} />
          {columns.map((_, i) => <col key={i} style={{ width: colWidth }} />)}
        </colgroup>
        <thead>
          <MatrixHead columns={columns} />
        </thead>
        <tbody>
          {categories.map(cat => (
            <CategoryGroup key={cat.label} category={cat} columns={columns} />
          ))}
        </tbody>
        <tfoot>
          <MatrixLegend colSpan={columns.length + 1} />
        </tfoot>
      </table>
    </div>
  );
}
