import { useEffect, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { SiNextdotjs, SiReact, SiTailwindcss, SiTypescript } from 'react-icons/si';
import { storageAsset } from '../lib/assets';
import { FloatingShapes } from './FloatingShapes';
import LogoLoop from './LogoLoop';
import { BinaryBackground } from './BinaryBackground';

const techLogos = [
  { node: <SiReact />, title: 'React', href: 'https://react.dev' },
  { node: <SiNextdotjs />, title: 'Next.js', href: 'https://nextjs.org' },
  { node: <SiTypescript />, title: 'TypeScript', href: 'https://www.typescriptlang.org' },
  { node: <SiTailwindcss />, title: 'Tailwind CSS', href: 'https://tailwindcss.com' },
];

const heroBg = storageAsset('web/bg.png');
const heroTitle = 'Anwar Tech Labs';
const heroSubtitle = 'Software engineers, frontend & app developers.';

export function Hero({ start = true }: { start?: boolean }) {
  const reduce = useReducedMotion();
  const shouldReduce = Boolean(reduce);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 0.35], [0, reduce ? 0 : 90]);

  return (
    <section id="home" className="binary-surface relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-[#101923] px-4 pb-20 pt-20">
      <img src={heroBg} alt="" className="absolute inset-0 h-full w-full object-cover object-center opacity-95" aria-hidden="true" />
      <div className="absolute inset-0 bg-[#0A0F1F]/20" />
      <FloatingShapes />
      <motion.div style={{ y }} className="absolute inset-x-0 top-10 mx-auto h-[30rem] max-w-5xl rounded-full bg-[radial-gradient(circle,rgba(251,146,60,0.1),rgba(15,23,42,0.12)_34%,transparent_72%)] blur-3xl" />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-b from-transparent via-[#17171c]/80 to-[#17171c]" />
      <BinaryBackground />
      <motion.div initial={reduce ? false : { opacity: 0, y: 26 }} animate={start ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="relative z-10 mx-auto mt-8 flex w-full min-w-0 max-w-6xl flex-col items-center text-center">
        <HeroTitle text={heroTitle} />
        <TypewriterSubtitle text={heroSubtitle} reduce={shouldReduce} start={start} />
        <div className="mt-12 h-20 w-full max-w-3xl opacity-75">
          <LogoLoop
            logos={techLogos}
            speed={100}
            direction="left"
            logoHeight={44}
            gap={72}
            hoverSpeed={0}
            scaleOnHover
            fadeOut
            fadeOutColor="#101923"
            ariaLabel="Technology stack"
          />
        </div>
      </motion.div>
      <motion.a href="#expertise" aria-label="Scroll to expertise" initial={reduce ? false : { opacity: 0, y: 12 }} animate={start ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }} transition={{ delay: start ? 1 : 0 }} className="absolute bottom-8 left-1/2 grid h-16 w-9 -translate-x-1/2 place-items-center rounded-full border-2 border-white/75 text-[#00FF41]">
        <motion.span animate={reduce || !start ? {} : { y: [-8, 7, -8], opacity: [0.45, 1, 0.45] }} transition={{ duration: 1.25, repeat: Infinity, ease: 'easeInOut' }}>
          <ArrowDown className="h-5 w-5" />
        </motion.span>
      </motion.a>
    </section>
  );
}

function TypewriterSubtitle({ text, reduce, start }: { text: string; reduce: boolean; start: boolean }) {
  const [typed, setTyped] = useState(reduce ? text : '');

  useEffect(() => {
    if (reduce) {
      setTyped(text);
      return;
    }

    if (!start) {
      setTyped('');
      return;
    }

    let index = 0;
    let interval: number | undefined;

    setTyped('');

    const timeout = window.setTimeout(() => {
      interval = window.setInterval(() => {
        index += 1;
        setTyped(text.slice(0, index));

        if (index >= text.length && interval) {
          window.clearInterval(interval);
        }
      }, 42);
    }, 1800);

    return () => {
      window.clearTimeout(timeout);
      if (interval) window.clearInterval(interval);
    };
  }, [reduce, start, text]);

  const isTyping = typed.length < text.length;

  return (
    <p aria-label={text} className="pixel-copy mx-auto mt-8 grid max-w-2xl text-[12px] font-bold uppercase tracking-[0.18em] text-[#00FF41]">
      <span className="invisible col-start-1 row-start-1" aria-hidden="true">{text}</span>
      <span className="col-start-1 row-start-1" aria-hidden="true">
        {typed}
        {isTyping ? <span className="ml-1 inline-block h-[1em] w-[0.08em] translate-y-[0.12em] bg-[#00FF41]" /> : null}
      </span>
    </p>
  );
}

function HeroTitle({ text }: { text: string }) {
  return (
    <h1 className="max-w-full bg-white bg-clip-text text-4xl font-black uppercase leading-[0.9] tracking-[0.06em] text-transparent drop-shadow-[0_16px_42px_rgba(0,0,0,0.55)] sm:text-7xl sm:tracking-[0.11em] lg:text-[6.6rem] xl:text-[7.4rem]">
      {text}
    </h1>
  );
}
