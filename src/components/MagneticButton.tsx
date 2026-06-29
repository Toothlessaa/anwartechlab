import { type ReactNode } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';
import { Button } from './ui/button';

type Props = { children: ReactNode; href: string; variant?: 'default' | 'secondary' };

export function MagneticButton({ children, href, variant = 'default' }: Props) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 160, damping: 18 });
  const springY = useSpring(y, { stiffness: 160, damping: 18 });
  const rotate = useTransform(springX, [-28, 28], [-3, 3]);

  return (
    <motion.div
      style={reduce ? undefined : { x: springX, y: springY, rotate }}
      onPointerMove={(event) => {
        if (reduce) return;
        const rect = event.currentTarget.getBoundingClientRect();
        x.set((event.clientX - rect.left - rect.width / 2) * 0.22);
        y.set((event.clientY - rect.top - rect.height / 2) * 0.22);
      }}
      onPointerLeave={() => { x.set(0); y.set(0); }}
    >
      <Button asChild size="lg" variant={variant}><a href={href}>{children}</a></Button>
    </motion.div>
  );
}
