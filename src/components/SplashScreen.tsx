import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';

const services = ['Web Development', 'Web Development', 'UI/UX Design', 'Artificial Intelligence', 'Cloud Solutions'];
const floatingTokens = ['<>', '{}', 'const', 'API', 'React', 'TS', 'AI', 'SaaS', 'Cloud'];
const premiumEase = [0.16, 1, 0.3, 1] as const;

type SplashScreenProps = {
  onComplete: () => void;
};

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const reduce = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const [typed, setTyped] = useState('');
  const [serviceIndex, setServiceIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 70, damping: 22, mass: 0.25 });
  const smoothY = useSpring(pointerY, { stiffness: 70, damping: 22, mass: 0.25 });
  const logoX = useTransform(smoothX, [-1, 1], [-10, 10]);
  const logoY = useTransform(smoothY, [-1, 1], [-8, 8]);
  const gridX = useTransform(smoothX, [-1, 1], [-16, 16]);
  const gridY = useTransform(smoothY, [-1, 1], [-10, 10]);

  const particles = useMemo(
    () => Array.from({ length: 34 }, (_, index) => ({
      index,
      size: 2 + (index % 4),
      radius: 68 + (index % 5) * 20,
      angle: (index * 137.5) % 360,
      duration: 8 + (index % 7),
      delay: index * 0.035,
      opacity: 0.22 + (index % 5) * 0.08,
    })),
    [],
  );

  useEffect(() => {
    if (reduce) {
      setProgress(100);
      const completeTimer = window.setTimeout(onComplete, 900);
      return () => window.clearTimeout(completeTimer);
    }

    const start = performance.now();
    let frame = 0;
    const duration = 5600;

    const tick = (time: number) => {
      const next = Math.min(100, Math.round(((time - start) / duration) * 100));
      setProgress(next);
      if (next < 100) {
        frame = requestAnimationFrame(tick);
        return;
      }
      setLeaving(true);
      window.setTimeout(onComplete, 780);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [onComplete, reduce]);

  useEffect(() => {
    if (reduce) return;
    const current = services[serviceIndex];
    const doneTyping = !deleting && typed === current;
    const doneDeleting = deleting && typed === '';
    const delay = doneTyping ? 980 : doneDeleting ? 220 : deleting ? 42 : 76;

    const timer = window.setTimeout(() => {
      if (doneTyping) {
        setDeleting(true);
        return;
      }
      if (doneDeleting) {
        setDeleting(false);
        setServiceIndex((value) => (value + 1) % services.length);
        return;
      }
      setTyped((value) => deleting ? current.slice(0, Math.max(0, value.length - 1)) : current.slice(0, value.length + 1));
    }, delay);

    return () => window.clearTimeout(timer);
  }, [deleting, reduce, serviceIndex, typed]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[999] grid min-h-[100dvh] overflow-hidden bg-[#09090B] text-[#F8FAFC]"
        initial={{ opacity: 1, clipPath: 'circle(140% at 50% 50%)' }}
        animate={leaving ? { opacity: 0, clipPath: 'circle(0% at 50% 50%)' } : { opacity: 1, clipPath: 'circle(140% at 50% 50%)' }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.72, ease: premiumEase }}
        onPointerMove={(event) => {
          if (reduce || event.pointerType !== 'mouse') return;
          pointerX.set((event.clientX / window.innerWidth - 0.5) * 2);
          pointerY.set((event.clientY / window.innerHeight - 0.5) * 2);
        }}
      >
        <motion.div
          className="absolute inset-0 opacity-55"
          style={{ x: reduce ? 0 : gridX, y: reduce ? 0 : gridY }}
          animate={reduce ? undefined : { scale: [1, 1.05] }}
          transition={{ duration: 5.8, ease: 'easeOut' }}
        >
          <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.08)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(circle_at_center,black,transparent_72%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_44%,rgba(59,130,246,0.18),transparent_18rem),radial-gradient(circle_at_58%_52%,rgba(124,58,237,0.16),transparent_20rem),radial-gradient(circle_at_43%_56%,rgba(6,182,212,0.11),transparent_16rem)]" />
        </motion.div>

        <div className="pointer-events-none absolute inset-0">
          {floatingTokens.map((token, index) => (
            <motion.span
              key={token}
              className="pixel-copy absolute text-sm font-bold text-white/5 blur-[0.4px] sm:text-lg"
              style={{ left: `${8 + ((index * 11) % 82)}%`, top: `${12 + ((index * 17) % 72)}%` }}
              animate={reduce ? undefined : { y: [-10, 14, -10], x: [-6, 8, -6], opacity: [0.03, 0.075, 0.03] }}
              transition={{ duration: 9 + index, repeat: Infinity, ease: 'easeInOut', delay: index * 0.28 }}
            >
              {token}
            </motion.span>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-0">
          {particles.map((particle) => (
            <motion.span
              key={particle.index}
              className="absolute left-1/2 top-1/2 rounded-full bg-[#06B6D4] shadow-[0_0_16px_rgba(6,182,212,0.85)]"
              style={{ width: particle.size, height: particle.size, opacity: particle.opacity }}
              initial={{ x: 0, y: 0, scale: 0 }}
              animate={reduce ? { scale: 1 } : {
                x: [0, Math.cos((particle.angle * Math.PI) / 180) * particle.radius, Math.cos(((particle.angle + 80) * Math.PI) / 180) * (particle.radius + 18), 0],
                y: [0, Math.sin((particle.angle * Math.PI) / 180) * particle.radius, Math.sin(((particle.angle + 80) * Math.PI) / 180) * (particle.radius + 18), 0],
                scale: [0, 1, 0.82, 0],
              }}
              transition={{ duration: particle.duration, repeat: Infinity, ease: 'easeInOut', delay: particle.delay }}
            />
          ))}
        </div>

        <div className="relative z-10 flex min-h-[100dvh] flex-col items-center justify-center px-5 py-12">
          <motion.div
            className="relative flex flex-col items-center"
            style={{ x: reduce ? 0 : logoX, y: reduce ? 0 : logoY }}
            animate={reduce ? undefined : { translateY: [0, -6, 0] }}
            transition={{ duration: 4.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <motion.div
              className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#06B6D4] shadow-[0_0_45px_rgba(6,182,212,0.95)]"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.2, 0.55], opacity: [0, 1, 0] }}
              transition={{ duration: 1.1, ease: premiumEase }}
            />

            <motion.svg width="172" height="172" viewBox="0 0 172 172" className="drop-shadow-[0_0_36px_rgba(59,130,246,0.35)] sm:h-56 sm:w-56">
              <defs>
                <linearGradient id="atl-logo" x1="20" x2="152" y1="20" y2="152">
                  <stop offset="0%" stopColor="#06B6D4" />
                  <stop offset="46%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#7C3AED" />
                </linearGradient>
                <filter id="atl-glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <motion.path d="M86 12 L148 48 L148 124 L86 160 L24 124 L24 48 Z" fill="none" stroke="url(#atl-logo)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" filter="url(#atl-glow)" initial={reduce ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.24, delay: 1.12, ease: premiumEase }} />
              <motion.path d="M52 118 L86 42 L120 118" fill="none" stroke="url(#atl-logo)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" filter="url(#atl-glow)" initial={reduce ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.08, delay: 1.38, ease: premiumEase }} />
              <motion.path d="M66 94 H106" fill="none" stroke="#F8FAFC" strokeWidth="6" strokeLinecap="round" initial={reduce ? false : { pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.62, delay: 2.0, ease: premiumEase }} />
              <motion.circle cx="86" cy="86" r="68" fill="url(#atl-logo)" opacity="0.08" initial={{ opacity: 0 }} animate={{ opacity: [0.05, 0.14, 0.07] }} transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 2.2 }} />
            </motion.svg>

            <motion.div className="mt-7 flex flex-wrap justify-center gap-[0.34em] text-center text-2xl font-black tracking-[0.24em] text-white sm:text-4xl" initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { delayChildren: 2.35, staggerChildren: 0.045 } } }}>
              {'ANWAR TECH LAB'.split('').map((char, index) => (
                <motion.span key={`${char}-${index}`} className={char === ' ' ? 'w-3 sm:w-5' : ''} variants={{ hidden: { opacity: 0, y: 18, filter: 'blur(8px)' }, show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.55, ease: premiumEase } } }}>
                  {char}
                </motion.span>
              ))}
            </motion.div>

            <motion.p className="mt-5 max-w-xl text-center text-sm font-semibold tracking-wide text-white/70 sm:text-base" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.72, delay: 3.05, ease: premiumEase }}>
              Engineering Ideas Into Reality
            </motion.p>

            <motion.div className="pixel-copy mt-5 h-7 text-center text-sm font-bold text-[#5EE7FF] sm:text-base" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.34, duration: 0.5 }}>
              {typed || services[0].slice(0, reduce ? services[0].length : 0)}
              <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 0.86, repeat: Infinity, ease: 'easeInOut' }} className="ml-1 text-white">|</motion.span>
            </motion.div>
          </motion.div>

          <motion.div className="glass absolute bottom-8 left-1/2 w-[min(92vw,520px)] -translate-x-1/2 rounded-full px-5 py-4" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.66, delay: 3.75, ease: premiumEase }}>
            <div className="mb-3 flex items-center justify-between text-xs font-bold text-white/78 sm:text-sm">
              <span>Launching Experience...</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <motion.div className="relative h-full rounded-full bg-gradient-to-r from-[#06B6D4] via-[#3B82F6] to-[#7C3AED] shadow-[0_0_22px_rgba(59,130,246,0.65)]" style={{ width: `${progress}%` }}>
                <motion.span className="absolute inset-y-0 right-0 w-16 bg-gradient-to-r from-transparent via-white/80 to-transparent blur-[1px]" animate={reduce ? undefined : { x: [-90, 22] }} transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }} />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
