import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown } from 'lucide-react';

type HudSelectProps = {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
};

export default function HudSelect({ label, value, options, onChange }: HudSelectProps) {
  const [open, setOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  useEffect(() => {
    setFocusedIndex(Math.max(0, options.indexOf(value)));
  }, [open, options, value]);

  function select(option: string) {
    onChange(option);
    setOpen(false);
  }

  return (
    <div ref={rootRef} className="relative">
      <label className="pixel-copy mb-2 block text-[11px] font-bold tracking-[0.2em] text-[#00FF41]/75">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`pixel-copy flex w-full items-center justify-between gap-2 rounded-lg border bg-white/[0.03] px-4 py-3 text-sm font-bold tracking-wide text-white outline-none transition-all duration-300 ${
          open
            ? 'border-[#00FF41]/60 bg-[#00FF41]/[0.04] shadow-[0_0_24px_rgba(0,255,65,0.18),inset_0_0_12px_rgba(0,255,65,0.05)]'
            : 'border-white/10 hover:border-[#00FF41]/40'
        }`}
      >
        <span className="truncate">{value}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className={open ? 'text-[#00FF41] drop-shadow-[0_0_6px_rgba(0,255,65,0.8)]' : 'text-white/35'}
        >
          <ChevronDown className="h-4 w-4" />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-0 right-0 top-full z-30 mt-1.5 overflow-hidden rounded-lg border border-[#00FF41]/25 bg-[#0B0C11] p-1 shadow-[0_16px_48px_rgba(0,0,0,0.65),0_0_24px_rgba(0,255,65,0.08)] backdrop-blur-xl"
          >
            {options.map((option, index) => {
              const active = option === value;
              return (
                <li key={option}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={active}
                    onMouseEnter={() => setFocusedIndex(index)}
                    onClick={() => select(option)}
                    className={`flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left text-[13px] font-bold tracking-wide transition-colors duration-200 ${
                      index === focusedIndex ? 'bg-[#00FF41]/10 text-[#00FF41]' : 'text-zinc-300'
                    }`}
                  >
                    <span>{option}</span>
                    {active && (
                      <Check className="h-4 w-4 text-[#00FF41] drop-shadow-[0_0_6px_rgba(0,255,65,0.8)]" />
                    )}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}