import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

export function FloatingShapes() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 140]);

  const shapes = [
    'left-[31%] top-[13%] h-36 w-36 rotate-[8deg] rounded-[3px] border-[#26384b] bg-[linear-gradient(135deg,#17283a_0%,#1f3448_45%,#6b341f_100%)]',
    'right-[34%] top-[24%] h-24 w-48 -rotate-[18deg] rounded-[5px] border-[#3a2a1f] bg-[linear-gradient(135deg,#2a1f18_0%,#c56f2d_45%,#121923_100%)]',
    'right-[37%] top-[45%] h-48 w-48 rotate-[30deg] rounded-[6px] border-[#222936] bg-[linear-gradient(135deg,#1b2430_0%,#111827_55%,#0a0f1f_100%)]',
    'right-[40%] top-[19%] h-11 w-11 rounded-full border-[#fde68a]/80 bg-[radial-gradient(circle_at_35%_30%,#fff7ad,#fb923c_48%,#ef4444_100%)]',
  ];

  return (
    <motion.div style={{ y }} className="pointer-events-none absolute inset-0 overflow-hidden">
      {shapes.map((shape, index) => (
        <motion.div
          key={shape}
          className={`absolute ${shape} border shadow-[20px_24px_70px_rgba(0,0,0,0.45),0_0_48px_rgba(251,146,60,0.16)]`}
          animate={reduce ? {} : { y: [0, -22, 0], rotate: [index * 8, index * 8 + 16, index * 8] }}
          transition={{ duration: 7 + index, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </motion.div>
  );
}
