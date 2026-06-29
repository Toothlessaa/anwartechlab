import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

export type Project = { title: string; category: string; description: string; tech: string[]; image: string; size: string; link?: string };

const sizeClasses: Record<string, string> = {
  featured: '',
  wide: '',
  tall: '',
  medium: '',
};

const premiumEase = [0.16, 1, 0.3, 1] as const;

const cardVariants = {
  hidden: { opacity: 0, y: 48, scale: 0.95, filter: 'blur(8px)' },
  show: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.92, delay: index * 0.12, ease: premiumEase },
  }),
  exit: { opacity: 0, y: 18, scale: 0.96, filter: 'blur(6px)', transition: { duration: 0.38, ease: [0.4, 0, 0.2, 1] as const } },
};

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const reduce = useReducedMotion();
  const href = project.link || '#';
  const isFeatured = project.size === 'featured';

  return (
    <motion.article
      layout
      custom={index}
      variants={cardVariants}
      initial={reduce ? false : 'hidden'}
      whileInView="show"
      exit={reduce ? undefined : 'exit'}
      viewport={{ once: true, amount: 0.18 }}
      whileHover={reduce ? undefined : { y: -8, scale: 1.025, rotateX: 1.2, rotateY: -1.2 }}
      transition={{ type: 'spring', stiffness: 180, damping: 20 }}
      className={`group relative flex min-h-[360px] flex-col overflow-hidden rounded-[24px] border border-white/10 bg-[#1d1d23]/95 shadow-[0_24px_70px_rgba(0,0,0,0.25)] backdrop-blur-sm [transform-style:preserve-3d] hover:border-[#8B5CF6]/45 hover:shadow-[0_32px_90px_rgba(3,7,18,0.46),0_0_44px_rgba(139,92,246,0.18)] ${sizeClasses[project.size] ?? sizeClasses.medium}`}
    >
      <motion.a
        href={href}
        target={href === '#' ? undefined : '_blank'}
        rel={href === '#' ? undefined : 'noreferrer'}
        className="relative min-h-0 flex-1 overflow-hidden bg-[#111827]"
        aria-label={`View ${project.title}`}
        initial={reduce ? false : isFeatured ? { clipPath: 'inset(0 100% 0 0)' } : { clipPath: 'inset(16% 0 0 0)' }}
        whileInView={{ clipPath: 'inset(0 0% 0 0)' }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: isFeatured ? 1.05 : 0.78, delay: index * 0.08 + 0.12, ease: premiumEase }}
      >
        <motion.img
          src={project.image}
          alt={`${project.title} mockup`}
          className="h-full w-full object-cover object-top opacity-95"
          loading="lazy"
          initial={reduce ? false : { scale: isFeatured ? 1.15 : 1.08 }}
          whileInView={{ scale: 1 }}
          whileHover={reduce ? undefined : { scale: 1.08 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 1.15, ease: premiumEase }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#17171c]/62 via-[#17171c]/8 to-transparent" />
        <motion.div className="absolute inset-0 bg-[#0A0F1F]/0 opacity-0" whileHover={reduce ? undefined : { opacity: 1, backgroundColor: 'rgba(10,15,31,0.22)' }} transition={{ duration: 0.35 }} />
        {isFeatured ? <motion.div className="absolute left-5 top-5 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-md" initial={reduce ? false : { opacity: 0, y: -12, rotate: -4 }} whileInView={{ opacity: 1, y: 0, rotate: 0 }} viewport={{ once: true }} transition={{ duration: 0.72, delay: 0.45, ease: premiumEase }}>Featured</motion.div> : null}
      </motion.a>
      <div className="relative shrink-0 bg-[#1d1d23]/98 p-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <motion.h3 className="text-base font-black tracking-[-0.03em] text-white sm:text-lg" initial={reduce ? false : { opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.62, delay: index * 0.08 + 0.22, ease: premiumEase }}>{project.title}</motion.h3>
            <motion.p className="pixel-copy mt-2 text-[10px] font-bold text-zinc-300" initial={reduce ? false : { opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.58, delay: index * 0.08 + 0.3, ease: premiumEase }}>{project.category}</motion.p>
            <motion.p className="mt-3 hidden max-w-md text-xs leading-5 text-zinc-400 md:block" initial={reduce ? false : { opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.58, delay: index * 0.08 + 0.38, ease: premiumEase }}>{project.description}</motion.p>
          </div>
          <motion.a
            href={href}
            target={href === '#' ? undefined : '_blank'}
            rel={href === '#' ? undefined : 'noreferrer'}
            className="group/button hidden shrink-0 items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:border-[#8B5CF6]/50 hover:bg-[#8B5CF6]/18 sm:inline-flex"
            initial={reduce ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={reduce ? undefined : { scale: 1.04 }}
            whileTap={reduce ? undefined : { scale: 0.98 }}
            viewport={{ once: true }}
            transition={{ duration: 0.58, delay: index * 0.08 + 0.46, ease: premiumEase }}
          >
            View Project
            <motion.span className="inline-flex" initial={false} whileHover={reduce ? undefined : { x: 6, y: -2 }} transition={{ type: 'spring', stiffness: 340, damping: 18 }}>
              <ArrowUpRight className="h-4 w-4" />
            </motion.span>
          </motion.a>
        </div>
      </div>
    </motion.article>
  );
}
