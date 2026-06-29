import { motion, useReducedMotion } from 'framer-motion';

const logos = ['REACT', 'VITE', 'TAILWIND', 'MOTION', 'RADIX'];

export function FeaturedLogos() {
  const reduce = useReducedMotion();
  return (
    <section className="px-4 pb-20 pt-0">
      <motion.div initial={reduce ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mx-auto max-w-3xl p-6">
        <p className="pixel-copy text-center text-[11px] font-bold uppercase tracking-tight text-zinc-600">As featured in</p>
        <div className="mt-7 grid grid-cols-2 items-center gap-8 opacity-45 sm:grid-cols-5">
          {logos.map((logo) => <div key={logo} className="pixel-copy text-center text-sm font-bold tracking-tight text-zinc-400 grayscale transition hover:text-zinc-200">{logo}</div>)}
        </div>
      </motion.div>
    </section>
  );
}
