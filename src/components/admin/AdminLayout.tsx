import { useEffect, useState } from 'react';
import { NavLink, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { FolderKanban, Image, LayoutDashboard, LogOut, User } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Profile } from '../../types';

const navItems = [
  { to: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { to: '/admin/gallery', label: 'Media', icon: Image },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const [session, setSession] = useState<boolean | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      if (!s) {
        setSession(false);
        return;
      }
      setSession(true);
      supabase
        .from('profiles')
        .select('*')
        .eq('id', s.user.id)
        .single()
        .then(({ data }) => {
          if (data) setProfile(data as Profile);
        });
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(!!session);
      if (!session) navigate('/admin/login');
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate('/admin/login');
  }

  if (session === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#09090B]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#00FF41] border-t-transparent" />
      </div>
    );
  }

  if (session === false) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-[#09090B]">
      <aside className="flex w-64 flex-col border-r border-white/10 bg-[#1d1d23]/86 p-5 backdrop-blur-xl">
        <div className="flex items-center gap-3 border-b border-white/10 pb-5">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#00FF41]/10 text-[#00FF41]">
            <LayoutDashboard className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">CMS Admin</p>
            <p className="text-xs text-zinc-500">Manage content</p>
          </div>
        </div>

        <nav className="mt-6 flex flex-1 flex-col gap-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#00FF41]/10 text-[#00FF41]'
                    : 'text-zinc-400 hover:bg-[#00FF41]/10 hover:text-[#00FF41]'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/10 pt-4">
          {profile && (
            <div className="mb-3 flex items-center gap-2.5 rounded-xl bg-white/5 px-4 py-2.5">
              <User className="h-4 w-4 text-zinc-500" />
              <div className="min-w-0">
                <p className="truncate text-xs font-medium text-white">{profile.email}</p>
                <p className="text-[10px] uppercase tracking-wider text-zinc-500">{profile.role}</p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-5xl px-6 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
