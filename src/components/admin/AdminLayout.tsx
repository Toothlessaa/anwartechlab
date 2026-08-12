import { useEffect, useState } from 'react';
import { NavLink, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { FolderKanban, Image, LogOut, Sparkles, User } from 'lucide-react';
import { logoutAdmin, verifyAdminSession, type AdminUser } from '../../lib/adminAuth';

const navItems = [
  { to: '/admin/projects', label: 'PROJECTS', icon: FolderKanban },
  { to: '/admin/gallery', label: 'MEDIA', icon: Image },
  { to: '/admin/highlights', label: 'HIGHLIGHTS', icon: Sparkles },
];

function StatusClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  return (
    <span className="pixel-copy text-[10px] font-bold tracking-widest text-[#00FF41]/70">
      {now.toISOString().slice(11, 19)} UTC
    </span>
  );
}

export default function AdminLayout() {
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const [session, setSession] = useState<boolean | null>(null);
  const [admin, setAdmin] = useState<AdminUser | null>(null);

  useEffect(() => {
    let cancelled = false;

    verifyAdminSession().then((currentAdmin) => {
      if (cancelled) return;
      if (!currentAdmin) {
        setSession(false);
        return;
      }
      setSession(true);
      setAdmin(currentAdmin);
    });

    return () => { cancelled = true; };
  }, []);

  async function handleLogout() {
    await logoutAdmin();
    navigate('/admin/login');
  }

  if (session === null) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#07080B]">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(0,255,65,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.05)_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
        <div className="scanlines pointer-events-none absolute inset-0 opacity-50" />
        <div className="relative flex flex-col items-center gap-5">
          <div className="relative flex h-14 w-14 items-center justify-center">
            <motion.span
              className="absolute inset-0 rounded-full border border-[#00FF41]/40"
              animate={reduce ? undefined : { scale: [1, 1.8], opacity: [0.9, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }}
            />
            <motion.span
              className="absolute inset-0 rounded-full border border-[#00FF41]/30"
              animate={reduce ? undefined : { scale: [1, 1.8], opacity: [0.9, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut', delay: 0.4 }}
            />
            <span className="h-2.5 w-2.5 rounded-full bg-[#00FF41] shadow-[0_0_16px_rgba(0,255,65,1)]" />
          </div>
          <p className="pixel-copy text-[11px] font-bold tracking-[0.3em] text-[#00FF41]/80">
            VERIFYING SESSION TOKEN<span className="hud-caret">_</span>
          </p>
        </div>
      </div>
    );
  }

  if (session === false) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-[#07080B]">
      <aside className="sticky top-0 flex h-dvh w-64 shrink-0 flex-col overflow-hidden border-r border-[#00FF41]/15 bg-[#0A0B10]/95 backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00FF41]/60 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-[#00FF41]/25 to-transparent" />

        <div className="flex items-center gap-3 border-b border-white/[0.07] p-5">
          <div className="relative grid h-10 w-10 place-items-center rounded-lg border border-[#00FF41]/30 bg-[#00FF41]/10">
            <span className="pixel-copy text-lg font-black text-[#00FF41] drop-shadow-[0_0_8px_rgba(0,255,65,0.9)]">A</span>
            <span className="absolute inset-0 rounded-lg border border-[#00FF41]/25 opacity-60" />
          </div>
          <div>
            <p className="pixel-copy text-[13px] font-black tracking-[0.18em] text-white">CMS ADMIN</p>
            <p className="pixel-copy mt-0.5 text-[10px] font-bold tracking-[0.22em] text-[#00FF41]/70">SECURE CONSOLE v2.4.1</p>
          </div>
        </div>

        <p className="pixel-copy px-5 pt-5 text-[10px] font-bold tracking-[0.3em] text-white/25">// MODULES</p>
        <nav className="mt-3 flex flex-1 flex-col gap-1.5 px-3">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `relative flex items-center gap-3 rounded-lg px-4 py-2.5 text-[12px] font-bold tracking-[0.14em] transition-all duration-300 ${
                  isActive
                    ? 'bg-[#00FF41]/10 text-[#00FF41] shadow-[0_0_20px_rgba(0,255,65,0.08)]'
                    : 'text-zinc-500 hover:bg-[#00FF41]/[0.06] hover:text-[#00FF41]/80'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="admin-nav-bar"
                      className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-[#00FF41] shadow-[0_0_10px_rgba(0,255,65,1)]"
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    />
                  )}
                  <Icon className={`h-4 w-4 ${isActive ? 'drop-shadow-[0_0_6px_rgba(0,255,65,0.8)]' : ''}`} />
                  {label}
                  {isActive && (
                    <span className="ml-auto h-1.5 w-1.5 animate-pulse rounded-full bg-[#00FF41] shadow-[0_0_8px_rgba(0,255,65,1)]" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/[0.07] p-4">
          {admin && (
            <div className="mb-3 flex items-center gap-2.5 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3.5 py-2.5">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-[#00FF41]/10">
                <User className="h-4 w-4 text-[#00FF41]" />
              </div>
              <div className="min-w-0">
                <p className="pixel-copy truncate text-[11px] font-bold text-white">{admin.email}</p>
                <p className="pixel-copy text-[9px] font-bold uppercase tracking-[0.2em] text-[#00FF41]/60">{admin.role}</p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-white/[0.07] bg-white/[0.03] px-3.5 py-2.5 text-[12px] font-bold tracking-[0.12em] text-zinc-400 transition-all duration-300 hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400 hover:shadow-[0_0_20px_rgba(239,68,68,0.15)]"
          >
            <LogOut className="h-4 w-4" />
            SIGNOUT
          </button>
          <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3">
            <span className="flex items-center gap-1.5 text-[9px] font-bold tracking-[0.22em] text-[#00FF41]/60">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#00FF41] shadow-[0_0_6px_rgba(0,255,65,1)]" />
              LINK :: SECURE
            </span>
            <StatusClock />
          </div>
        </div>
      </aside>

      <main className="relative flex-1 overflow-auto">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(0,255,65,0.028)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.028)_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_82%)]" />
        <div className="scanlines pointer-events-none absolute inset-0 opacity-30" />
        <div className="relative mx-auto max-w-5xl px-6 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}