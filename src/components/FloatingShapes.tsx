import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

export function FloatingShapes() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 140]);

  const shapes = [
    {
      className: 'left-[31%] top-[13%] h-36 w-36 rotate-[8deg] rounded-[3px] border-[rgba(0,255,65,0.20)] bg-[linear-gradient(135deg,#111b17_0%,#080d0b_50%,#030504_100%)]',
      duration: 7,
    },
    {
      className: 'right-[34%] top-[24%] h-24 w-48 -rotate-[18deg] rounded-[5px] border-[rgba(0,255,65,0.20)] bg-[linear-gradient(135deg,#101817_0%,#0b1110_50%,#060908_100%)]',
      duration: 8,
    },
    {
      className: 'right-[37%] top-[45%] h-48 w-48 rotate-[30deg] rounded-[6px] border-[rgba(0,255,65,0.20)] bg-[linear-gradient(135deg,#0d1512_0%,#080d0b_50%,#030504_100%)]',
      duration: 9,
    },
  ];

  return (
    <motion.div style={{ y }} className="pointer-events-none absolute inset-0 overflow-hidden">
      {shapes.map((shape, index) => (
        <motion.div
          key={shape.className}
          className={`absolute ${shape.className} border shadow-[24px_28px_70px_rgba(0,0,0,0.55),0_0_12px_rgba(0,255,65,0.08),inset_0_0_18px_rgba(0,255,65,0.04)]`}
          animate={reduce ? {} : { y: [0, -22, 0], rotate: [index * 8, index * 8 + 16, index * 8] }}
          transition={{ duration: shape.duration, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </motion.div>
  );
}
