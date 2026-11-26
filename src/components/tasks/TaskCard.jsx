import { Calendar, Check, ListChecks, Pencil, Trash2 } from 'lucide-react';

const PRIORITY_STYLES = {
  low: 'bg-slate-800 text-slate-300 ring-slate-700',
  medium: 'bg-sky-500/10 text-sky-300 ring-sky-500/25',
  high: 'bg-amber-500/10 text-amber-300 ring-amber-500/25',
  urgent: 'bg-rose-500/15 text-rose-300 ring-rose-500/30',
};

const STATUS_LABELS = {
  todo: { label: 'To Do', cls: 'bg-slate-800 text-slate-300' },
  in_progress: { label: 'In Progress', cls: 'bg-indigo-500/15 text-indigo-300' },
  done: { label: 'Done', cls: 'bg-emerald-500/15 text-emerald-300' },
};

function formatDate(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

function isTaskOverdue(task) {
  if (task.status === 'done' || !task.dueDate) return false;
  const startOfTodayUtc = new Date();
  startOfTodayUtc.setUTCHours(0, 0, 0, 0);
  return new Date(task.dueDate) < startOfTodayUtc;
}

export function TaskCard({ task, onToggleDone, onStatusChange, onEdit, onDelete }) {
  const isDone = task.status === 'done';
  const isOverdue = isTaskOverdue(task);
  const completedSubs = task.subtasks?.filter((s) => s.completed).length || 0;
  const totalSubs = task.subtasks?.length || 0;

  return (
    <div
      className={`group rounded-2xl border p-4 transition ${
        isDone
          ? 'border-slate-800/60 bg-slate-900/30 opacity-80'
          : 'border-slate-800/90 bg-slate-900/70 hover:border-slate-700'
      }`}
    >
      <div className="flex items-start gap-3.5">
        <button
          type="button"
          onClick={() => onToggleDone(task)}
          aria-label={isDone ? 'Mark as to do' : 'Mark as completed'}
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
            isDone
              ? 'border-emerald-500 bg-emerald-500 text-slate-950'
              : 'border-slate-600 bg-slate-950 hover:border-indigo-400'
          }`}
        >
          {isDone && <Check className="h-3.5 w-3.5 stroke-[3]" />}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3
              className={`text-sm font-semibold sm:text-base ${
                isDone ? 'text-slate-400 line-through' : 'text-slate-100'
              }`}
            >
              {task.title}
            </h3>

            <div className="flex items-center gap-1.5">
              <span
                className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium capitalize ring-1 ring-inset ${
                  PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.medium
                }`}
              >
                {task.priority}
              </span>
              <select
                value={task.status}
                onChange={(e) => onStatusChange(task, e.target.value)}
                aria-label="Task status"
                className={`cursor-pointer rounded-md border-0 px-2 py-0.5 text-[11px] font-medium outline-none ${
                  STATUS_LABELS[task.status]?.cls || STATUS_LABELS.todo.cls
                }`}
              >
                <option value="todo" className="bg-slate-900 text-slate-100">
                  To Do
                </option>
                <option value="in_progress" className="bg-slate-900 text-slate-100">
                  In Progress
                </option>
                <option value="done" className="bg-slate-900 text-slate-100">
                  Done
                </option>
              </select>
            </div>
          </div>

          {task.description && (
            <p className="mt-1.5 line-clamp-2 text-sm text-slate-400">{task.description}</p>
          )}

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <span className="rounded-md bg-slate-800/80 px-2 py-0.5 font-medium text-slate-300">
                {task.category || 'Personal'}
              </span>

              {task.dueDate && (
                <span
                  className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 ${
                    isOverdue
                      ? 'bg-rose-500/15 font-medium text-rose-300'
                      : 'bg-slate-800/60 text-slate-400'
                  }`}
                >
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(task.dueDate)}
                  {isOverdue && ' (Overdue)'}
                </span>
              )}

              {totalSubs > 0 && (
                <span className="inline-flex items-center gap-1 rounded-md bg-slate-800/60 px-2 py-0.5 text-slate-300">
                  <ListChecks className="h-3.5 w-3.5 text-indigo-400" />
                  {completedSubs}/{totalSubs}
                </span>
              )}

              {task.tags?.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-indigo-500/10 px-2 py-0.5 text-[11px] text-indigo-300"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-1 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
              <button
                type="button"
                onClick={() => onEdit(task)}
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-indigo-300"
                aria-label="Edit task"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => onDelete(task)}
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-rose-400"
                aria-label="Delete task"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

