import { motion, useReducedMotion } from 'framer-motion';

type SectionHeadingProps = {
  title: string;
  description?: string;
  align?: 'left' | 'center';
};

export function SectionHeading({ title, description, align = 'center' }: SectionHeadingProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      className={align === 'center' ? 'mx-auto mb-12 max-w-3xl text-center' : 'mb-10 max-w-3xl'}
    >
      <h2 className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">{title}</h2>
      {description ? <p className="mt-5 text-base leading-7 text-zinc-400 sm:text-lg">{description}</p> : null}
    </motion.div>
  );
}
