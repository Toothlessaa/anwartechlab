import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { testimonials } from '../data/portfolio';
import { SectionHeading } from './SectionHeading';

export function Testimonials() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => setIndex((value) => (value + 1) % testimonials.length), 4500);
    return () => window.clearInterval(id);
  }, [reduce]);

  const item = testimonials[index];
  return (
    <section className="px-4 py-24">
      <div className="mx-auto max-w-5xl">
        <SectionHeading title="Client words, placeholder for now" description="Replace these with real testimonials when the client quotes are ready." />
        <div className="glass relative overflow-hidden rounded-[36px] p-8 sm:p-12">
          <div className="absolute inset-0 bg-gradient-to-br from-[#8b35ff]/22 via-[#0077ff]/12 to-transparent" />
          <AnimatePresence mode="wait">
            <motion.div key={item.name} initial={reduce ? false : { opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={reduce ? undefined : { opacity: 0, x: -30 }} transition={{ duration: 0.45 }} className="relative">
              <Quote className="h-10 w-10 text-[#b58cff]" />
              <p className="mt-7 text-2xl font-medium leading-snug tracking-tight text-white sm:text-4xl">“{item.quote}”</p>
              <div className="mt-8 flex items-center gap-4"><div className="h-14 w-14 rounded-2xl bg-white/12" /><div><p className="font-semibold text-white">{item.name}</p><p className="text-sm text-zinc-400">{item.role}</p></div></div>
            </motion.div>
          </AnimatePresence>
          <div className="relative mt-8 flex gap-2">{testimonials.map((testimonial, dotIndex) => <button key={testimonial.name} onClick={() => setIndex(dotIndex)} aria-label={`Show testimonial ${dotIndex + 1}`} className={`h-2 rounded-full transition-all ${dotIndex === index ? 'w-8 bg-[#8b35ff]' : 'w-2 bg-white/25'}`} />)}</div>
        </div>
      </div>
    </section>
  );
}
