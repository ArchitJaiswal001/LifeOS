import { useCallback, useEffect, useState } from 'react';
import { CheckSquare, Plus, Search } from 'lucide-react';
import { apiClient } from '../api/client';
import { AppShell } from '../components/layout/AppShell';
import { StatsBar } from '../components/tasks/StatsBar';
import { TaskCard } from '../components/tasks/TaskCard';
import { TaskModal } from '../components/tasks/TaskModal';
import { useAuth } from '../context/AuthContext';

const STATUS_TABS = [
  { id: 'all', label: 'All' },
  { id: 'todo', label: 'To Do' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'done', label: 'Done' },
];

export function DashboardPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, todo: 0, in_progress: 0, done: 0, overdue: 0 });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const fetchTasks = useCallback(async () => {
    setError('');
    try {
      const params = {
        status: statusFilter,
        priority: priorityFilter,
        sort: sortBy,
        ...(categoryFilter !== 'all' ? { category: categoryFilter } : {}),
        ...(searchQuery.trim() ? { search: searchQuery.trim() } : {}),
      };
      const res = await apiClient.get('/tasks', { params });
      setTasks(res.data.data.tasks);
      setStats(res.data.data.stats);
      setCategories(res.data.data.categories);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load tasks.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, priorityFilter, categoryFilter, sortBy, searchQuery]);

  useEffect(() => {
    const timer = setTimeout(fetchTasks, 150);
    return () => clearTimeout(timer);
  }, [fetchTasks]);

  const handleSaveTask = async (payload) => {
    if (editingTask) {
      await apiClient.patch(`/tasks/${editingTask._id}`, payload);
    } else {
      await apiClient.post('/tasks', payload);
    }
    setEditingTask(null);
    await fetchTasks();
  };

  const handleToggleDone = async (task) => {
    setError('');
    try {
      const nextStatus = task.status === 'done' ? 'todo' : 'done';
      await apiClient.patch(`/tasks/${task._id}`, { status: nextStatus });
      await fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task status.');
    }
  };

  const handleStatusChange = async (task, nextStatus) => {
    setError('');
    try {
      await apiClient.patch(`/tasks/${task._id}`, { status: nextStatus });
      await fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task status.');
    }
  };

  const handleDeleteTask = async (task) => {
    setError('');
    try {
      await apiClient.delete(`/tasks/${task._id}`);
      await fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete task.');
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Good day, {user?.name?.split(' ')[0] || 'there'}
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Manage your active tasks, priorities, and deadlines in one place.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setEditingTask(null);
              setModalOpen(true);
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-500"
          >
            <Plus className="h-4 w-4" />
            New Task
          </button>
        </div>

        <StatsBar stats={stats} />

        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-1 rounded-xl bg-slate-950/70 p-1 ring-1 ring-slate-800">
              {STATUS_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStatusFilter(tab.id)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                    statusFilter === tab.id
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative min-w-[200px] flex-1 sm:flex-initial">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tasks or #tags..."
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2 pl-9 pr-3 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                aria-label="Filter by priority"
                className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none"
              >
                <option value="all">All Priorities</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                aria-label="Filter by category"
                className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort tasks"
                className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="dueDate">Due Date</option>
                <option value="priority">Highest Priority</option>
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
            {error}
          </div>
        )}

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 animate-pulse rounded-2xl border border-slate-800/70 bg-slate-900/50"
              />
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 px-6 py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/20">
              <CheckSquare className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-white">No matching tasks found</h3>
            <p className="mt-1 max-w-sm text-sm text-slate-400">
              Create your first task or adjust your active filters to see items in this view.
            </p>
            <button
              type="button"
              onClick={() => {
                setEditingTask(null);
                setModalOpen(true);
              }}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              <Plus className="h-4 w-4" />
              Create Task
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onToggleDone={handleToggleDone}
                onStatusChange={handleStatusChange}
                onEdit={(t) => {
                  setEditingTask(t);
                  setModalOpen(true);
                }}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
        )}
      </div>

      <TaskModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleSaveTask}
        initialTask={editingTask}
      />
    </AppShell>
  );
}

