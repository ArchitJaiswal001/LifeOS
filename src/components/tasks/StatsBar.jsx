import { AlertCircle, CheckCircle2, Clock, Layers } from 'lucide-react';

export function StatsBar({ stats }) {
  const completionRate =
    stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;

  const cards = [
    {
      label: 'Total Tasks',
      value: stats.total,
      hint: `${stats.todo} queued to start`,
      icon: Layers,
      accent: 'text-indigo-400 bg-indigo-500/10 ring-indigo-500/20',
    },
    {
      label: 'In Progress',
      value: stats.in_progress,
      hint: 'Active focus items',
      icon: Clock,
      accent: 'text-sky-400 bg-sky-500/10 ring-sky-500/20',
    },
    {
      label: 'Completed',
      value: stats.done,
      hint: `${completionRate}% completion rate`,
      icon: CheckCircle2,
      accent: 'text-emerald-400 bg-emerald-500/10 ring-emerald-500/20',
    },
    {
      label: 'Overdue',
      value: stats.overdue,
      hint: stats.overdue > 0 ? 'Needs attention' : 'All caught up',
      icon: AlertCircle,
      accent:
        stats.overdue > 0
          ? 'text-rose-400 bg-rose-500/10 ring-rose-500/20'
          : 'text-slate-400 bg-slate-800/70 ring-slate-700/60',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 shadow-sm transition hover:border-slate-700"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                {card.label}
              </span>
              <div className={`rounded-xl p-2 ring-1 ${card.accent}`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold tracking-tight text-white">{card.value}</p>
            <p className="mt-1 text-xs text-slate-400">{card.hint}</p>
          </div>
        );
      })}
    </div>
  );
}

