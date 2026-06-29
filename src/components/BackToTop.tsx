import { useState } from 'react';
import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

export function BackToTop() {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);
  useMotionValueEvent(scrollY, 'change', (latest) => setVisible(latest > 650));

  return visible ? (
    <motion.a href="#home" aria-label="Back to top" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 14 }} className="fixed bottom-5 right-5 z-50 grid h-12 w-12 place-items-center rounded-full border border-white/10 bg-[#151519]/80 text-white shadow-2xl backdrop-blur-xl">
      <ArrowUp className="h-5 w-5" />
    </motion.a>
  ) : null;
}
