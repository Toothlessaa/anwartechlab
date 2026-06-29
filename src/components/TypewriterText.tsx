import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const words = ['Web Interfaces', 'Mobile Apps', 'SaaS Dashboards', 'Design Systems', 'Motion Details'];

export function TypewriterText() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [text, setText] = useState(words[0]);

  useEffect(() => {
    if (reduce) return;
    let frame = 0;
    const current = words[index];
    const id = window.setInterval(() => {
      frame += 1;
      if (frame <= current.length) setText(current.slice(0, frame));
      if (frame > current.length + 14) setIndex((value) => (value + 1) % words.length);
    }, 78);
    return () => window.clearInterval(id);
  }, [index, reduce]);

  return <span className="text-[#C084FC]">{text}<motion.span animate={reduce ? {} : { opacity: [0, 1, 0] }} transition={{ duration: 0.9, repeat: Infinity }}>|</motion.span></span>;
}
