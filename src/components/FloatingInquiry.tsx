import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Mail, MessageCircle, Send, X } from 'lucide-react';

const premiumEase = [0.16, 1, 0.3, 1] as const;

export function FloatingInquiry() {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  return (
    <div className="fixed bottom-5 right-4 z-[80] sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? undefined : { opacity: 0, y: 14, scale: 0.96 }}
            transition={{ duration: 0.34, ease: premiumEase }}
            className="mb-3 w-[min(92vw,340px)] overflow-hidden rounded-[28px] border border-white/10 bg-[#17171c]/92 p-4 text-white shadow-[0_24px_90px_rgba(0,0,0,0.38),0_0_42px_rgba(94,231,255,0.12)] backdrop-blur-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-lg font-black tracking-[-0.04em]">Quick Inquiry</p>
                <p className="mt-1 text-sm leading-5 text-zinc-400">Have a project idea? Reach the team faster.</p>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/10 bg-white/5 text-zinc-300 transition hover:bg-white/10 hover:text-white" aria-label="Close inquiry widget">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 grid gap-2">
              <a href="mailto:hello@anwartechlab.com?subject=Project%20Inquiry%20for%20Anwar%20Tech%20Lab" className="group flex items-center justify-between rounded-2xl border border-[#5EE7FF]/20 bg-[#5EE7FF]/10 px-4 py-3 text-sm font-bold text-white transition hover:bg-[#5EE7FF]/16">
                <span className="inline-flex items-center gap-3"><Mail className="h-4 w-4 text-[#5EE7FF]" /> Email the team</span>
                <Send className="h-4 w-4 transition group-hover:translate-x-1" />
              </a>
              <a href="https://www.facebook.com/profile.php?id=61591170526288" target="_blank" rel="noreferrer" className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-white transition hover:border-[#8B5CF6]/35 hover:bg-[#8B5CF6]/14">
                <span className="inline-flex items-center gap-3"><MessageCircle className="h-4 w-4 text-[#C084FC]" /> Message on Facebook</span>
                <Send className="h-4 w-4 transition group-hover:translate-x-1" />
              </a>
              <a href="#contact" onClick={() => setOpen(false)} className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-white transition hover:border-[#8B5CF6]/35 hover:bg-[#8B5CF6]/14">
                <span className="inline-flex items-center gap-3"><MessageCircle className="h-4 w-4 text-[#C084FC]" /> View contact options</span>
                <Send className="h-4 w-4 transition group-hover:translate-x-1" />
              </a>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="group ml-auto flex items-center gap-3 rounded-full border border-[#5EE7FF]/25 bg-[#09090B]/78 px-4 py-3 text-sm font-black text-white shadow-[0_18px_60px_rgba(0,0,0,0.35),0_0_32px_rgba(94,231,255,0.16)] backdrop-blur-xl transition hover:border-[#5EE7FF]/50 hover:bg-[#111827]/90 sm:px-5"
        initial={reduce ? false : { opacity: 0, y: 16, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        whileHover={reduce ? undefined : { y: -3 }}
        whileTap={reduce ? undefined : { scale: 0.97 }}
        transition={{ duration: 0.48, delay: 0.6, ease: premiumEase }}
        aria-expanded={open}
        aria-label="Open quick inquiry"
      >
        <span className="relative grid h-9 w-9 place-items-center rounded-full bg-[#5EE7FF] text-[#09090B]">
          <MessageCircle className="h-4 w-4" />
          <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-[#09090B] bg-[#22c55e]" />
        </span>
        <span className="hidden sm:block">Quick Inquiry</span>
      </motion.button>
    </div>
  );
}
