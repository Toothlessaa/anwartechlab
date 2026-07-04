import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { milestones } from '../data/portfolio';

const premiumEase = [0.16, 1, 0.3, 1] as const;

export function Milestones() {
  const reduce = useReducedMotion();

  return (
    <section id="experience" className="relative overflow-hidden px-4 py-20 sm:py-24">
      <div className="pointer-events-none absolute left-[12%] top-20 h-64 w-64 rounded-full bg-[#7C3AED]/10 blur-3xl" />
      <div className="pointer-events-none absolute right-[12%] bottom-12 h-64 w-64 rounded-full bg-[#06B6D4]/10 blur-3xl" />

      <div className="relative mx-auto max-w-5xl">
        <motion.div
          className="mx-auto mb-10 max-w-2xl text-center"
          initial={reduce ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.68, ease: premiumEase }}
        >
          <h2 className="text-5xl font-black leading-[0.95] tracking-[-0.065em] text-white sm:text-7xl">Why Teams Choose Us</h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-zinc-400 sm:text-base">
            We combine startup speed, product thinking, and disciplined engineering to help clients launch with confidence.
          </p>
        </motion.div>

        <div className="grid gap-3">
          {milestones.map((item, index) => (
            <motion.div
              key={item.title}
              initial={reduce ? false : { opacity: 0, y: 28, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.55, delay: index * 0.07, ease: premiumEase }}
              className="group grid gap-4 rounded-[24px] border border-white/10 bg-[#1d1d23]/88 p-5 shadow-[0_18px_54px_rgba(0,0,0,0.18)] backdrop-blur-md transition hover:border-[#00FF41]/35 hover:bg-[#22222a]/92 sm:grid-cols-[5rem_1fr_auto] sm:items-center"
            >
              <div className="pixel-copy text-sm font-black text-[#00FF41]">0{index + 1}</div>
              <div>
                <h3 className="text-xl font-black tracking-[-0.04em] text-white sm:text-2xl">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-400">{item.text}</p>
              </div>
              <div className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/5 text-white transition group-hover:border-[#00FF41]/35 group-hover:text-[#00FF41]">
                <ArrowUpRight className="h-5 w-5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
