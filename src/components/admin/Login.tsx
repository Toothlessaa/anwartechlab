import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { loginAdmin } from '../../lib/adminAuth';

const ease = [0.16, 1, 0.3, 1] as const;

const BOOT_LINES = [
  '> INITIALIZING SECURE PROTOCOL v2.4.1',
  '> LOADING ENCRYPTION KEYS ............ OK',
  '> BINDING BIOMETRIC INTERFACE ........ OK',
  '> HANDSHAKE VERIFIED .................. OK',
];

const TOKENS = ['ACCESS', '0x7F41', '{ }', 'AUTH', 'root@atl', 'SYS://', 'DECRYPT', '>>', 'KEY.gen', '//'];

const matrixStreams = Array.from({ length: 22 }, (_, index) => ({
  id: index,
  left: `${index * 4.65}%`,
  delay: `${(index % 7) * -1.35}s`,
  duration: `${7 + (index % 6)}s`,
  text: index % 3 === 0 ? '010110100111001011010011' : index % 3 === 1 ? '101001011100101101001110' : '110101101001011100101101',
}));

function HudRings() {
  const reduce = useReducedMotion();
  const spins = useMemo(() => [
    { size: 760, duration: 90, reverse: false, border: 'border-white/[0.06]', satellite: false },
    { size: 620, duration: 70, reverse: true, border: 'border-dashed border-[#00FF41]/15', satellite: true },
    { size: 500, duration: 55, reverse: false, border: 'border-white/[0.08]', satellite: false },
    { size: 420, duration: 40, reverse: true, border: 'border-dashed border-[#00FF41]/10', satellite: true },
  ], []);

  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:block" aria-hidden="true">
      {spins.map((ring) => (
        <motion.div
          key={ring.size}
          className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full ${ring.border}`}
          style={{ width: ring.size, height: ring.size, left: 0, top: 0 }}
          animate={reduce ? undefined : { rotate: ring.reverse ? -360 : 360 }}
          transition={{ duration: ring.duration, repeat: Infinity, ease: 'linear' }}
        >
          {ring.satellite && (
            <span className="absolute -top-[3px] left-1/2 h-[6px] w-[6px] -translate-x-1/2 rounded-full bg-[#00FF41] shadow-[0_0_12px_rgba(0,255,65,0.95)]" />
          )}
          {ring.size === 760 && (
            <>
              <span className="absolute -left-[3px] top-1/2 h-[6px] w-[6px] -translate-y-1/2 rounded-full bg-[#00FF41]/70 shadow-[0_0_10px_rgba(0,255,65,0.8)]" />
              <span className="absolute -right-[3px] top-1/2 h-[6px] w-[6px] -translate-y-1/2 rounded-full bg-white/40 shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
            </>
          )}
        </motion.div>
      ))}
      <motion.svg
        className="absolute h-[760px] w-[760px] -translate-x-1/2 -translate-y-1/2"
        viewBox="0 0 760 760"
        animate={reduce ? undefined : { rotate: 360 }}
        transition={{ duration: 34, repeat: Infinity, ease: 'linear' }}
      >
        <defs>
          <linearGradient id="anwartech-arc" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00FF41" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#00FF41" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <circle cx="380" cy="380" r="370" fill="none" stroke="url(#anwartech-arc)" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="1162 580">
          <animateTransform attributeName="transform" type="rotate" from="0 380 380" to="360 380 380" dur="12s" repeatCount="indefinite" />
        </circle>
      </motion.svg>
      <motion.svg
        className="absolute h-[760px] w-[760px] -translate-x-1/2 -translate-y-1/2"
        viewBox="0 0 760 760"
        animate={reduce ? undefined : { rotate: -360 }}
        transition={{ duration: 48, repeat: Infinity, ease: 'linear' }}
      >
        <circle cx="380" cy="380" r="358" fill="none" stroke="#00FF41" strokeOpacity="0.22" strokeWidth="1" strokeDasharray="2 14" />
      </motion.svg>
    </div>
  );
}

function StatusClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  return (
    <span className="pixel-copy text-[11px] font-bold tracking-widest text-[#00FF41]/70">
      {now.toISOString().slice(11, 19)} UTC
    </span>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [errorCount, setErrorCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [booted, setBooted] = useState(reduce ?? false);

  useEffect(() => {
    if (reduce) return;
    const timer = window.setTimeout(() => setBooted(true), 3000);
    return () => window.clearTimeout(timer);
  }, [reduce]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading || authorized) return;
    setError('');
    setLoading(true);
    try {
      await loginAdmin(email, password);
      setAuthorized(true);
      window.setTimeout(() => navigate('/admin/projects'), 800);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ACCESS DENIED :: INVALID CREDENTIALS');
      setErrorCount((value) => value + 1);
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-[#07080B] px-4 py-10">
      <HudRings />

      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,65,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.055)_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_76%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(0,255,65,0.13),transparent_20rem),radial-gradient(circle_at_62%_55%,rgba(30,255,90,0.08),transparent_22rem),radial-gradient(circle_at_38%_58%,rgba(0,255,65,0.06),transparent_18rem)]" />
        <div className="scanlines absolute inset-0 opacity-60" />
        <div className="scan-sweep absolute left-0 h-24 w-full bg-gradient-to-b from-transparent via-[#00FF41]/[0.045] to-transparent" />
        <div className="crt-vignette absolute inset-0" />
      </div>

      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {TOKENS.map((token, index) => (
          <motion.span
            key={token}
            className="pixel-copy absolute text-sm font-bold text-white/[0.05]"
            style={{ left: `${8 + ((index * 13) % 82)}%`, top: `${10 + ((index * 19) % 76)}%` }}
            animate={reduce ? undefined : { y: [-10, 14, -10], x: [-6, 8, -6], opacity: [0.03, 0.075, 0.03] }}
            transition={{ duration: 9 + index, repeat: Infinity, ease: 'easeInOut', delay: index * 0.24 }}
          >
            {token}
          </motion.span>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {matrixStreams.map((stream) => (
          <span
            key={stream.id}
            className="matrix-stream pixel-copy"
            style={{ left: stream.left, animationDelay: stream.delay, animationDuration: stream.duration }}
          >
            {stream.text}
          </span>
        ))}
      </div>

      <header className="pointer-events-none absolute left-6 top-6 z-20 sm:left-8 sm:top-8">
        <motion.p
          className="pixel-copy text-[11px] font-bold tracking-[0.28em] text-[#00FF41]/80"
          initial={reduce ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: booted ? 0.4 : 3.3, ease }}
        >
          ANWAR TECH LABS // SECURE TERMINAL
        </motion.p>
      </header>

      <footer className="pointer-events-none absolute inset-x-6 bottom-6 z-20 flex items-center justify-between sm:inset-x-8 sm:bottom-8">
        <motion.p
          className="pixel-copy hidden text-[10px] font-bold tracking-widest text-white/30 sm:block"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: booted ? 0.5 : 3.4, ease }}
        >
          CHANNEL 128-BIT ENCRYPTED :: ANWARTECH OS 2.4.1
        </motion.p>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00FF41] opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00FF41] shadow-[0_0_8px_rgba(0,255,65,1)]" />
          </span>
          <StatusClock />
        </div>
      </footer>

      <div className="relative z-10 w-full max-w-sm">
        <AnimatePresence mode="wait">
          {!booted ? (
            <motion.div
              key="boot"
              className="pixel-copy w-full rounded-2xl border border-[#00FF41]/20 bg-black/60 p-6 shadow-[0_0_60px_rgba(0,255,65,0.08)] backdrop-blur-xl"
              initial={reduce ? false : { opacity: 0, scale: 0.94, filter: 'blur(6px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={reduce ? undefined : { opacity: 0, scale: 0.94, filter: 'blur(8px)' }}
              transition={{ duration: 0.5, ease }}
            >
              <div className="mb-5 flex items-center justify-between">
                <p className="text-[11px] font-bold tracking-[0.22em] text-[#00FF41]">ANWARTECH BOOT SEQUENCE</p>
                <span className="text-[10px] font-bold text-white/30">0x9F</span>
              </div>
              <div className="space-y-2.5">
                {BOOT_LINES.map((line, index) => (
                  <motion.p
                    key={line}
                    className="text-xs font-bold text-[#00FF41]/85"
                    initial={reduce ? false : { opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.28, delay: 0.3 + index * 0.6, ease }}
                  >
                    {line}
                  </motion.p>
                ))}
                <p className="flex items-center gap-1 pt-1 text-xs font-bold text-white/70">
                  <span className="text-[#00FF41]">&gt;</span>
                  <span className="hud-caret inline-block h-3.5 w-2 bg-[#00FF41] shadow-[0_0_10px_rgba(0,255,65,0.9)]" />
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="login"
              initial={reduce ? false : { opacity: 0, y: 26, scale: 0.95, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.7, ease }}
            >
              <motion.div
                key={`shake-${errorCount}`}
                animate={errorCount > 0 ? { x: [0, -12, 12, -8, 8, -4, 4, 0] } : { x: 0 }}
                transition={errorCount > 0 ? { duration: 0.55, ease: 'easeInOut' } : { duration: 0.2 }}
                className="relative overflow-hidden rounded-2xl p-[1.5px]"
              >
                <motion.div
                  className="absolute inset-0 bg-[conic-gradient(from_0deg,rgba(0,255,65,0.5),rgba(0,255,65,0.04),rgba(255,255,255,0.08),rgba(0,255,65,0.5))]"
                  animate={reduce ? undefined : { rotate: 360 }}
                  transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
                />
                <div className="relative rounded-[14.5px] bg-[#0A0B10]/95 px-7 py-8 backdrop-blur-2xl sm:px-8">
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mb-5 flex items-start gap-3 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3">
                          <span className="hud-glitch pixel-copy text-xs font-black tracking-widest text-red-400">
                            !&nbsp;ACCESS DENIED
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="mb-1 flex items-center justify-between">
                    <p className="pixel-copy text-[10px] font-bold tracking-[0.3em] text-white/35">CLEARANCE LEVEL :: GOLD</p>
                    <span className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-[#00FF41]/70">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#00FF41] shadow-[0_0_6px_rgba(0,255,65,1)]" />
                      SECURE
                    </span>
                  </div>

                  <h1 className="pixel-copy text-3xl font-black tracking-[0.14em] text-white sm:text-4xl">
                    {'ANWARTECH'.split('').map((char, index) => (
                      <motion.span
                        key={`${char}-${index}`}
                        className="text-white"
                        initial={reduce ? false : { opacity: 0, y: 14, filter: 'blur(6px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        transition={{ duration: 0.45, delay: 0.15 + index * 0.045, ease }}
                      >
                        {char}
                      </motion.span>
                    ))}
                  </h1>
                  <p className="pixel-copy mt-1.5 text-[11px] font-bold tracking-[0.24em] text-[#00FF41]/80">
                    SECURE ACCESS TERMINAL
                  </p>

                  <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                    <div>
                      <label htmlFor="email" className="pixel-copy mb-2 block text-[11px] font-bold tracking-[0.2em] text-[#00FF41]/75">
                        [ USER_ID ]
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="username"
                        spellCheck={false}
                        placeholder="admin@example.com"
                        className="pixel-copy w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-bold tracking-wide text-white caret-[#00FF41] placeholder:text-white/25 outline-none transition-all duration-300 focus:border-[#00FF41]/60 focus:bg-[#00FF41]/[0.04] focus:shadow-[0_0_24px_rgba(0,255,65,0.18),inset_0_0_12px_rgba(0,255,65,0.05)]"
                      />
                    </div>

                    <div>
                      <label htmlFor="password" className="pixel-copy mb-2 block text-[11px] font-bold tracking-[0.2em] text-[#00FF41]/75">
                        [ PASSPHRASE ]
                      </label>
                      <div className="relative">
                        <input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          autoComplete="current-password"
                          placeholder="••••••••••••"
                          className="pixel-copy w-full rounded-lg border border-white/10 bg-white/[0.03] py-3 pl-4 pr-12 text-sm font-bold tracking-wide text-white caret-[#00FF41] placeholder:text-white/25 outline-none transition-all duration-300 focus:border-[#00FF41]/60 focus:bg-[#00FF41]/[0.04] focus:shadow-[0_0_24px_rgba(0,255,65,0.18),inset_0_0_12px_rgba(0,255,65,0.05)]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((value) => !value)}
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                          className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-md text-white/40 transition-colors hover:bg-white/5 hover:text-[#00FF41]"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading || authorized}
                      className={`group relative w-full overflow-hidden rounded-lg border px-4 py-3.5 text-sm font-black tracking-[0.22em] transition-all duration-300 ${
                        authorized
                          ? 'border-[#00FF41]/70 bg-[#00FF41] text-[#05060A] shadow-[0_0_36px_rgba(0,255,65,0.5)]'
                          : errorCount > 0 && !loading
                            ? 'border-red-500/50 bg-red-500/15 text-red-300 shadow-[0_0_28px_rgba(239,68,68,0.25)]'
                            : 'border-[#00FF41]/40 bg-[#00FF41]/10 text-[#00FF41] shadow-[0_0_24px_rgba(0,255,65,0.12)] hover:bg-[#00FF41]/20 hover:shadow-[0_0_40px_rgba(0,255,65,0.28)] disabled:opacity-70'
                      }`}
                    >
                      {!authorized && (
                        <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 skew-x-[-24deg] bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-[460%]" />
                      )}
                      <span className="relative flex items-center justify-center gap-2.5">
                        {loading ? (
                          <>
                            <span className="relative flex h-4 w-4 items-center justify-center">
                              <motion.span
                                className="absolute inset-0 rounded-full border border-current opacity-80"
                                animate={reduce ? undefined : { scale: [1, 1.9], opacity: [0.9, 0] }}
                                transition={{ duration: 1.1, repeat: Infinity, ease: 'easeOut' }}
                              />
                              <span className="h-1.5 w-1.5 rounded-full bg-current shadow-[0_0_10px_currentColor]" />
                            </span>
                            AUTHENTICATING…
                          </>
                        ) : authorized ? (
                          <>
                            <span className="h-2 w-2 rounded-full bg-[#05060A] shadow-[0_0_8px_#05060A]" />
                            ACCESS GRANTED ✓
                          </>
                        ) : (
                          'INITIALIZE ACCESS'
                        )}
                      </span>
                    </button>
                  </form>

                  <div className="pixel-copy mt-6 flex items-center justify-between text-[10px] font-bold tracking-widest text-white/25">
                    <span>ANWARTECH OS v2.4.1.77</span>
                    <span>SESSION :: ENCRYPTED</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}