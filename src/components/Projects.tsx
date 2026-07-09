import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { useProjects } from '../lib/data';
import { ProjectCard, type Project } from './ProjectCard';
import { Button } from './ui/button';

const filters = ['All', 'Web', 'SaaS'];
const premiumEase = [0.16, 1, 0.3, 1] as const;
const stats = [
  { value: 25, suffix: '+', label: 'Projects' },
  { value: 12, suffix: '', label: 'Clients' },
  { value: 98, suffix: '%', label: 'Satisfaction' },
  { value: 4, suffix: '+', label: 'Years' },
];

export function Projects() {
  const { projects } = useProjects();
  const [filter, setFilter] = useState('All');
  const reduce = useReducedMotion();
  const filteredProjects = useMemo(() => filter === 'All' ? projects : projects.filter((project) => project.filter === filter || project.category.includes(filter) || project.tech.includes(filter)), [filter, projects]);

  return (
    <motion.section
      id="projects"
      className="relative overflow-hidden px-4 py-20 sm:py-24"
      initial={reduce ? false : { y: 28 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.58, ease: premiumEase }}
    >
      <div className="pointer-events-none absolute left-[8%] top-20 h-64 w-64 rounded-full bg-[#3B82F6]/10 blur-3xl" />
      <div className="pointer-events-none absolute right-[10%] bottom-16 h-64 w-64 rounded-full bg-[#7C3AED]/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-10 grid gap-8 lg:grid-cols-[1fr_420px] lg:items-end">
          <div>
            <h2 className="max-w-3xl text-5xl font-black leading-[0.95] tracking-[-0.07em] text-white sm:text-7xl">Crafted Digital Experiences</h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-zinc-400 sm:text-base">A compact showcase of premium websites, product interfaces, and launch-ready digital systems built for real clients.</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {filters.map((item) => (
                <Button key={item} type="button" variant={filter === item ? 'default' : 'secondary'} size="default" onClick={() => setFilter(item)} className={filter === item ? 'bg-[#00FF41] text-[#09090B] shadow-[0_14px_40px_rgba(0,255,65,0.22)] hover:bg-[#66FF66]' : 'border-white/10 bg-white/5 text-zinc-300 hover:border-[#00FF41]/30 hover:bg-[#00FF41]/10 hover:text-[#00FF41]'}>
                  {item}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {stats.map((stat, index) => <ProjectStat key={stat.label} {...stat} index={index} />)}
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => <ProjectCard key={project.id} project={project as Project} index={index} featured={index === 0} />)}
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  );
}

function ProjectStat({ value, suffix, label, index }: { value: number; suffix: string; label: string; index: number }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const spring = useSpring(0, { stiffness: 70, damping: 18 });
  const display = useTransform(spring, (latest) => `${Math.round(latest)}${suffix}`);
  const inView = useInView(ref, { once: true, amount: 0.7 });

  useEffect(() => {
    if (inView || reduce) spring.set(value);
  }, [inView, reduce, spring, value]);

  return (
    <motion.div ref={ref} className="rounded-[20px] border border-white/10 bg-white/5 p-4 shadow-[0_18px_54px_rgba(0,0,0,0.16)] backdrop-blur-md" initial={reduce ? false : { y: 22 }} whileInView={{ y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.5, delay: index * 0.06, ease: premiumEase }}>
      <motion.p className="text-3xl font-black tracking-[-0.055em] text-white">{display}</motion.p>
      <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-500">{label}</p>
    </motion.div>
  );
}
