import { useState } from 'react';
import {
  Bot,
  CheckSquare,
  Flame,
  LogOut,
  Menu,
  NotebookPen,
  Sparkles,
  Target,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ROADMAP_MODULES = [
  { label: 'Habits & Streaks', icon: Flame, phase: 'Phase 2' },
  { label: 'Goals & OKRs', icon: Target, phase: 'Phase 3' },
  { label: 'Notes & Journal', icon: NotebookPen, phase: 'Phase 3' },
  { label: 'AI Life Copilot', icon: Bot, phase: 'Phase 4' },
];

export function AppShell({ children }) {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const initials = (user?.name || 'U')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between bg-slate-900/95 px-4 py-5">
      <div>
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/25">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-white">LifeOS</span>
              <span className="ml-2 rounded-md bg-indigo-500/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-indigo-300">
                Phase 1
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 lg:hidden"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-8">
          <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Workspace
          </p>
          <nav className="mt-2 space-y-1">
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-xl bg-indigo-500/15 px-3 py-2.5 text-sm font-medium text-indigo-200 ring-1 ring-inset ring-indigo-500/30"
            >
              <CheckSquare className="h-4 w-4 text-indigo-400" />
              <span>Tasks & Focus</span>
            </button>
          </nav>
        </div>

        <div className="mt-8">
          <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Roadmap Modules
          </p>
          <div className="mt-2 space-y-1">
            {ROADMAP_MODULES.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-xl px-3 py-2 text-sm text-slate-500"
                >
                  <span className="flex items-center gap-3">
                    <Icon className="h-4 w-4 text-slate-600" />
                    <span>{item.label}</span>
                  </span>
                  <span className="rounded-md bg-slate-800/80 px-1.5 py-0.5 text-[10px] font-medium text-slate-400">
                    {item.phase}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 pt-4">
        <div className="flex items-center gap-3 rounded-xl bg-slate-950/60 p-2.5 ring-1 ring-slate-800/80">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white"
            style={{ backgroundColor: user?.avatarColor || '#6366f1' }}
          >
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-100">{user?.name}</p>
            <p className="truncate text-xs text-slate-400">{user?.email}</p>
          </div>
          <button
            type="button"
            onClick={logout}
            title="Sign out"
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-rose-400"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <aside className="hidden w-64 shrink-0 border-r border-slate-800/80 lg:block">
        <div className="sticky top-0 h-screen">{sidebarContent}</div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative z-10 w-72 border-r border-slate-800">{sidebarContent}</aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/85 px-4 py-3 backdrop-blur-md lg:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2 text-slate-300 hover:bg-slate-800"
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="text-sm font-semibold text-white">LifeOS</span>
          <button
            type="button"
            onClick={logout}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-rose-400"
            aria-label="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}

