import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { projects } from '../data/portfolio';
import { ProjectCard } from './ProjectCard';

const filters = ['All', 'Web Development', 'Mobile Apps', 'UI/UX'];

export function Projects() {
  const [filter, setFilter] = useState('All');
  const reduce = useReducedMotion();
  const visible = filter === 'All' ? projects : projects.filter((project) => project.filter === filter || project.category.includes(filter));

  return (
    <motion.section
      id="work"
      className="relative overflow-hidden px-4 py-24 sm:py-28"
      initial={reduce ? false : { opacity: 0, y: 80, scale: 0.95, filter: 'blur(12px)' }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 1.08, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-[#8B5CF6]/10 blur-3xl"
        animate={reduce ? undefined : { x: [-18, 20, -18], y: [0, 18, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="mx-auto max-w-5xl">
        <div className="mb-16 max-w-xl">
          <motion.h2 className="text-6xl font-black leading-[0.95] tracking-[-0.07em] text-white sm:text-7xl" initial={reduce ? false : 'hidden'} whileInView="show" viewport={{ once: true, amount: 0.6 }} variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}>
            {['Selected', 'Projects'].map((line) => (
              <motion.span key={line} className="block" variants={{ hidden: { opacity: 0, y: 42 }, show: { opacity: 1, y: 0, transition: { duration: 0.82, ease: [0.16, 1, 0.3, 1] } } }}>{line}</motion.span>
            ))}
          </motion.h2>
          <motion.p
            className="pixel-copy mt-9 max-w-sm text-[12px] font-bold leading-5 text-white"
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            A curated set of web platforms, business websites, and product interfaces built for real clients.
          </motion.p>
        </div>
        <motion.div
          className="mb-8 flex flex-wrap items-center gap-3"
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.82, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="pixel-copy text-[11px] font-bold text-zinc-400">Filter by</span>
          {filters.map((item) => (
            <motion.button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={`relative overflow-hidden rounded-full border px-4 py-2 text-sm font-semibold transition ${filter === item ? 'border-[#8B5CF6]/50 text-white' : 'border-white/10 bg-white/5 text-zinc-400 hover:border-white/20 hover:text-white'}`}
              whileTap={reduce ? undefined : { scale: 0.96 }}
              whileHover={reduce ? undefined : { y: -2 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            >
              {filter === item ? <motion.span layoutId="project-filter-active" className="absolute inset-0 rounded-full bg-[#8B5CF6]/24 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_0_28px_rgba(139,92,246,0.24)]" transition={{ type: 'spring', stiffness: 300, damping: 30 }} /> : null}
              <span className="relative">{item}</span>
            </motion.button>
          ))}
        </motion.div>
        <motion.div layout className="grid gap-5 sm:gap-7 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((project, index) => <ProjectCard key={project.title} project={project} index={index} />)}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.section>
  );
}
