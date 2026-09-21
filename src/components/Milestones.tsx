import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { milestones } from '../data/portfolio';
import { BinaryBackground } from './BinaryBackground';

const premiumEase = [0.16, 1, 0.3, 1] as const;

export function Milestones() {
  const reduce = useReducedMotion();

  return (
    <section id="experience" className="binary-surface relative overflow-hidden px-4 py-20 sm:py-24">
      <BinaryBackground section="experience" />

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
              className="studio-card group grid gap-4 p-5 sm:grid-cols-[5rem_1fr_auto] sm:items-center"
            >
              <div className="pixel-copy text-sm font-black text-accent">0{index + 1}</div>
              <div>
                <h3 className="text-xl font-black tracking-[-0.04em] text-white sm:text-2xl">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-400">{item.text}</p>
              </div>
              <div className="grid h-11 w-11 place-items-center rounded-full border border-white/10 text-zinc-400 transition group-hover:border-accent/35 group-hover:text-accent">
                <ArrowUpRight className="h-5 w-5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
