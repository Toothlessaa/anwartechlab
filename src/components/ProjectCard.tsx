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
      initial={reduce ? false : { y: 20 }}
      animate={{ y: 0 }}
      exit={reduce ? undefined : { y: 12 }}
      transition={{ duration: 0.48, delay: index * 0.08, ease: premiumEase }}
      whileHover={reduce ? undefined : { y: -3, transition: { duration: 0.22 } }}
      className={`studio-card group relative flex h-full flex-col overflow-hidden ${featured ? 'lg:col-span-2' : ''}`}
    >
      <a href={href} target={href === '#' ? undefined : '_blank'} rel={href === '#' ? undefined : 'noreferrer'} className="block" aria-label={`View ${project.title}`}>
        <div className={`relative m-3 overflow-hidden rounded-[23px] border border-white/10 bg-[#09090B] ${previewClass}`}>
          <div className="absolute left-4 right-4 top-4 flex items-center justify-between gap-3">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#FF6B6B]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#FFD166]" />
              <span className="h-2.5 w-2.5 rounded-full bg-accent" />
            </div>
            <Badge className="studio-chip">{project.filter}</Badge>
          </div>
          <motion.div
            className="absolute inset-x-3 bottom-0 top-12 overflow-hidden rounded-t-[18px] border border-white/10 bg-[var(--bg-elevated)]"
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
          <Button asChild variant="secondary" size="default" className="group/button w-full shrink-0 justify-between px-4 sm:w-auto">
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
