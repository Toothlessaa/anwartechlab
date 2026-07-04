import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw authError;
      navigate('/admin/projects');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#09090B] px-4">
      <div className="w-full max-w-sm">
        <div className="rounded-[20px] border border-white/10 bg-[#1d1d23]/86 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.25)] backdrop-blur-xl">
          <h1 className="text-2xl font-black tracking-[-0.05em] text-white">Admin Login</h1>
          <p className="mt-1 text-sm text-zinc-400">Sign in to manage your content</p>

          {error && (
            <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="text-sm font-medium text-zinc-300">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-[#00FF41]/50"
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="text-sm font-medium text-zinc-300">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-[#00FF41]/50"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
               className="w-full rounded-xl bg-[#00FF41] px-4 py-2.5 text-sm font-bold text-[#09090B] transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
