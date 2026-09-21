import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { BinaryBackground } from './BinaryBackground';
import { useSound } from './SoundProvider';

const services = ['Web Development', 'Web Development', 'UI/UX Design', 'Artificial Intelligence', 'Cloud Solutions'];
const studioName = 'ANWAR TECH LABS';
const premiumEase = [0.16, 1, 0.3, 1] as const;

type SplashScreenProps = {
  onComplete: () => void;
};

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const reduce = useReducedMotion();
  const { startAudio, keypress, whoosh } = useSound();
  const [entered, setEntered] = useState(false);
  const [progress, setProgress] = useState(0);
  const [typed, setTyped] = useState('');
  const [serviceIndex, setServiceIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [nameLength, setNameLength] = useState(0);
  const enterRef = useRef<HTMLButtonElement>(null);
  const exitPlayed = useRef(false);

  // Keyboard users land directly on the entry control while the splash owns focus.
  useEffect(() => {
    enterRef.current?.focus();
  }, []);

  // The tap (or Enter/Space) on this button is the genuine browser gesture that
  // unlocks audio, so the call below must stay directly inside this handler.
  const enter = async () => {
    if (entered) return;
    setEntered(true);
    try {
      await startAudio();
    } catch {
      // Audio unavailable: the visual sequence still plays through.
    }
    whoosh();
  };

  useEffect(() => {
    if (leaving && !exitPlayed.current) {
      exitPlayed.current = true;
      whoosh(true);
    }
  }, [leaving, whoosh]);

  // The progress clock starts only after entry, never silently beforehand.
  useEffect(() => {
    if (!entered) return;
    if (reduce) {
      setProgress(100);
      const completeTimer = window.setTimeout(onComplete, 900);
      return () => window.clearTimeout(completeTimer);
    }

    const start = performance.now();
    let frame = 0;
    let completeTimer = 0;
    const duration = 5600;

    const tick = (time: number) => {
      const next = Math.min(100, Math.round(((time - start) / duration) * 100));
      setProgress(next);
      if (next < 100) {
        frame = requestAnimationFrame(tick);
        return;
      }
      setLeaving(true);
      completeTimer = window.setTimeout(onComplete, 780);
    };

    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(completeTimer);
    };
  }, [entered, onComplete, reduce]);

  // The studio-name reveal shares one clock with its key sounds.
  useEffect(() => {
    if (!entered) return;
    if (reduce) {
      setNameLength(studioName.length);
      return;
    }
    let interval = 0;
    let index = 0;
    const delay = window.setTimeout(() => {
      interval = window.setInterval(() => {
        index += 1;
        setNameLength(index);
        if (studioName[index - 1] !== ' ') keypress();
        if (index >= studioName.length) window.clearInterval(interval);
      }, 80);
    }, 1400);
    return () => {
      window.clearTimeout(delay);
      window.clearInterval(interval);
    };
  }, [entered, reduce, keypress]);

  useEffect(() => {
    if (!entered || reduce) return;
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
      if (!deleting && nameLength === studioName.length && current[typed.length] !== ' ') keypress();
    }, delay);

    return () => window.clearTimeout(timer);
  }, [entered, deleting, reduce, serviceIndex, typed, keypress, nameLength]);

  return (
    <AnimatePresence>
      <motion.div
        data-splash
        role="dialog"
        aria-modal="true"
        aria-label="Welcome to Anwar Tech Labs"
        className="splash-screen binary-surface fixed inset-0 z-[999] grid min-h-[100dvh] overflow-hidden"
        initial={reduce ? false : { opacity: 1, clipPath: 'circle(140% at 50% 50%)' }}
        animate={reduce ? { opacity: leaving ? 0 : 1 } : leaving ? { opacity: 0, clipPath: 'circle(0% at 50% 50%)' } : { opacity: 1, clipPath: 'circle(140% at 50% 50%)' }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.72, ease: premiumEase }}
      >
        <BinaryBackground />

        <div className="relative z-10 flex min-h-[100dvh] flex-col items-center justify-center px-5 py-12">
          {!entered ? (
            <div className="flex flex-col items-center text-center">
              <svg width="120" height="120" viewBox="0 0 172 172" className="text-accent sm:h-36 sm:w-36" aria-hidden="true" focusable="false">
                <path d="M86 12 L148 48 L148 124 L86 160 L24 124 L24 48 Z" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M52 118 L86 42 L120 118" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M66 94 H106" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
              </svg>

              <p className="mt-7 text-center text-xl font-black tracking-[0.24em] text-white sm:text-2xl">{studioName}</p>

              <p className="mt-4 max-w-xl text-center text-sm font-semibold tracking-wide text-white/70 sm:text-base">
                Engineering Ideas Into Reality
              </p>

              <button
                ref={enterRef}
                type="button"
                autoFocus
                onClick={() => void enter()}
                className="mt-9 inline-flex min-h-[52px] items-center gap-3 rounded-full border border-accent/60 px-8 text-sm font-bold tracking-wide text-white transition hover:bg-accent hover:text-[var(--accent-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-main)] active:translate-y-px"
              >
                Enter the studio
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
              <p className="mt-4 text-xs font-medium tracking-wide text-zinc-500">
                Sound accompanies this experience.
              </p>
            </div>
          ) : (
            <motion.div className="relative flex flex-col items-center">
              <motion.svg width="172" height="172" viewBox="0 0 172 172" className="text-accent sm:h-56 sm:w-56">
                <motion.path d="M86 12 L148 48 L148 124 L86 160 L24 124 L24 48 Z" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" initial={reduce ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.1, delay: 0.1, ease: premiumEase }} />
                <motion.path d="M52 118 L86 42 L120 118" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" initial={reduce ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.0, delay: 0.3, ease: premiumEase }} />
                <motion.path d="M66 94 H106" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" initial={reduce ? false : { pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.5, delay: 0.85, ease: premiumEase }} />
              </motion.svg>

              <div aria-label={studioName} className="mt-7 flex flex-wrap justify-center gap-[0.34em] text-center text-2xl font-black tracking-[0.24em] text-white sm:text-4xl">
                {studioName.split('').map((char, index) => (
                  <span aria-hidden="true" key={`${char}-${index}`} className={char === ' ' ? 'w-3 sm:w-5' : ''} style={{ visibility: index < nameLength ? 'visible' : 'hidden' }}>
                    {char}
                  </span>
                ))}
              </div>

              <motion.p className="mt-5 max-w-xl text-center text-sm font-semibold tracking-wide text-white/70 sm:text-base" initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 1.9, ease: premiumEase }}>
                Engineering Ideas Into Reality
              </motion.p>

              <motion.div className="pixel-copy mt-5 h-7 text-center text-sm font-bold text-zinc-400 sm:text-base" initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2, duration: 0.5 }}>
                {typed || services[0].slice(0, reduce ? services[0].length : 0)}
                <motion.span animate={reduce ? undefined : { opacity: [0, 1, 0] }} transition={{ duration: 0.86, repeat: Infinity, ease: 'easeInOut' }} className="ml-1 text-white">|</motion.span>
              </motion.div>
            </motion.div>
          )}

          {entered ? (
            <motion.div className="glass absolute bottom-8 left-1/2 w-[min(92vw,520px)] -translate-x-1/2 rounded-full px-5 py-4" initial={reduce ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 2.5, ease: premiumEase }}>
              <div className="mb-3 flex items-center justify-between text-xs font-bold text-white/78 sm:text-sm">
                <span>Launching Experience...</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div className="splash-progress relative h-full rounded-full" style={{ width: `${progress}%` }} />
              </div>
            </motion.div>
          ) : null}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
