import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

export type Project = {
  id: string;
  title: string;
  category: string;
  filter: string;
  description: string;
  story?: string;
  challenge?: string;
  solution?: string;
  features?: string[];
  tech: string[];
  image: string;
  size: string;
  link?: string;
  github?: string;
};

const premiumEase = [0.16, 1, 0.3, 1] as const;

export function ProjectCard({ project, index, featured }: { project: Project; index: number; featured: boolean }) {
  const reduce = useReducedMotion();
  const href = project.link || '#';
  const previewClass = featured ? 'aspect-[16/9]' : 'aspect-[4/3]';

  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 40, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={reduce ? undefined : { opacity: 0, y: 22, scale: 0.96 }}
      transition={{ duration: 0.48, delay: index * 0.08, ease: premiumEase }}
      whileHover={reduce ? undefined : { y: -6, scale: 1.01 }}
      className={`group relative flex h-full transform-gpu flex-col overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.095),rgba(255,255,255,0.035))] shadow-[0_22px_70px_rgba(0,0,0,0.24)] backdrop-blur-md transition-colors will-change-transform hover:border-[#5EE7FF]/40 ${featured ? 'lg:col-span-2' : ''}`}
    >
      <a href={href} target={href === '#' ? undefined : '_blank'} rel={href === '#' ? undefined : 'noreferrer'} className="block" aria-label={`View ${project.title}`}>
        <div className={`relative m-3 overflow-hidden rounded-[23px] border border-white/10 bg-[#09090B] ${previewClass}`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_12%,rgba(94,231,255,0.18),transparent_32%),linear-gradient(145deg,rgba(255,255,255,0.08),rgba(255,255,255,0.015))]" />
          <div className="absolute left-4 right-4 top-4 flex items-center justify-between gap-3">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#FF6B6B]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#FFD166]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#5EE7FF]" />
            </div>
            <Badge className="border-[#5EE7FF]/25 bg-[#09090B]/60 text-[#5EE7FF]">{project.filter}</Badge>
          </div>
          <motion.div
            className="absolute inset-x-3 bottom-0 top-12 overflow-hidden rounded-t-[18px] border border-white/10 bg-[#11131a] shadow-[0_18px_55px_rgba(0,0,0,0.36)]"
            whileHover={reduce ? undefined : { y: -4 }}
            transition={{ duration: 0.35, ease: premiumEase }}
          >
            <motion.img
              src={project.image}
              alt={`${project.title} preview`}
              width={1280}
              height={800}
              loading={index < 2 ? 'eager' : 'lazy'}
              decoding="async"
              fetchPriority={index === 0 ? 'high' : 'auto'}
              className="h-full w-full transform-gpu object-contain object-top opacity-95 will-change-transform"
              whileHover={reduce ? undefined : { scale: 1.025 }}
              transition={{ duration: 0.35, ease: premiumEase }}
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090B]/40 via-transparent to-transparent" />
        </div>
      </a>

      <div className="flex min-h-0 flex-1 flex-col px-5 pb-5 pt-1 sm:px-6 sm:pb-6">
        <div className="mb-3 flex flex-wrap gap-2">
          {project.tech.slice(0, 3).map((tech) => <Badge key={tech}>{tech}</Badge>)}
        </div>
        <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="text-2xl font-black leading-tight tracking-[-0.045em] text-white">{project.title}</h3>
            <p className="mt-3 line-clamp-2 text-sm leading-6 text-zinc-400">{project.story || project.description}</p>
          </div>
          <Button asChild variant="secondary" size="default" className="group/button w-full shrink-0 justify-between border-white/10 bg-white/6 px-4 hover:border-[#5EE7FF]/35 hover:bg-[#5EE7FF]/12 sm:w-auto">
            <a href={href} target={href === '#' ? undefined : '_blank'} rel={href === '#' ? undefined : 'noreferrer'}>
              View
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover/button:translate-x-1 group-hover/button:-translate-y-0.5" />
            </a>
          </Button>
        </div>
      </div>
    </motion.article>
  );
}
