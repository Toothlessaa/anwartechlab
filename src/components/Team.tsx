import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { BadgeCheck } from 'lucide-react';
import { members } from '../data/portfolio';
import { storageAsset } from '../lib/assets';

const roleDetails = [
  'Leads client communication, project direction, and delivery.',
  'Checks quality, analyzes requirements, and helps keep delivery organized.',
  'Backend developer handling APIs, data, and system logic.',
  'UI/UX designer focused on user flows and product visuals.',
  'Frontend developer focused on responsive web interfaces.',
  'Frontend developer building clean and usable client pages.',
];

const profilePhotos: Record<string, string> = {
  'Noel Blanco': storageAsset('team/noel.png'),
  'Khalifa Blanco': storageAsset('team/khalifa.jpg'),
  'Felbert Yarte': storageAsset('team/felbert.JPG'),
  'Jean Robert Owen Pascua': storageAsset('team/jean.jpg'),
  'Jay Anne Lalanan': storageAsset('team/jayanne.jpg'),
  'Ivar Hinisan': storageAsset('team/ivar.jpg'),
};

const premiumEase = [0.16, 1, 0.3, 1] as const;

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

const titleWords = ['Meet', 'Our', 'Team'];

export function Team() {
  const reduce = useReducedMotion();
  const flowRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: flowRef, offset: ['start 72%', 'end 58%'] });
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const pathOpacity = useTransform(scrollYProgress, [0, 0.08, 1], [0, 1, 1]);

  return (
    <section id="team" className="relative overflow-hidden px-4 py-24 sm:py-32">
      <div className="pointer-events-none absolute left-1/2 top-24 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-[#8B5CF6]/10 blur-3xl" />
      <div className="pointer-events-none absolute right-[-10rem] bottom-20 h-80 w-80 rounded-full bg-[#5EE7FF]/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[38px] border border-white/10 bg-[#17171c]/82 px-5 py-10 shadow-[0_34px_120px_rgba(0,0,0,0.34)] backdrop-blur-xl sm:px-10 sm:py-14 lg:px-14">
        <motion.div
          className="absolute right-[-9rem] top-[-8rem] h-72 w-72 rounded-full border-[52px] border-[#5EE7FF]/10"
          aria-hidden="true"
          initial={reduce ? false : { scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1, ease: premiumEase }}
        />
        <motion.div
          className="absolute bottom-[-11rem] left-[-9rem] h-80 w-80 rounded-full border-[58px] border-[#8B5CF6]/12"
          aria-hidden="true"
          initial={reduce ? false : { scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1, delay: 0.15, ease: premiumEase }}
        />

        <div className="relative grid gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <motion.div
              initial={reduce ? false : 'hidden'}
              whileInView="show"
              viewport={{ once: true, amount: 0.55 }}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
            >
              {titleWords.map((word, index) => (
                <motion.span
                  key={word}
                  className={`block text-6xl font-black leading-[0.9] tracking-[-0.075em] sm:text-8xl ${index === 1 ? 'text-[#5EE7FF]' : index === 2 ? 'text-[#C084FC]' : 'text-white'}`}
                  variants={{ hidden: { opacity: 0, y: 44, filter: 'blur(10px)' }, show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.82, ease: premiumEase } } }}
                >
                  {word}
                </motion.span>
              ))}
            </motion.div>
            <motion.p
              className="mt-7 max-w-sm text-sm leading-7 text-zinc-400 sm:text-base"
              initial={reduce ? false : { opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.7 }}
              transition={{ duration: 0.74, delay: 0.28, ease: premiumEase }}
            >
              The people behind planning, design, frontend, backend, testing, and every client handoff.
            </motion.p>
          </div>

          <div ref={flowRef} className="relative">
            <motion.svg
              aria-hidden="true"
              className="pointer-events-none absolute left-0 top-12 h-[calc(100%-6rem)] w-44 overflow-visible md:w-48"
              viewBox="0 0 192 820"
              preserveAspectRatio="none"
              style={{ opacity: reduce ? 1 : pathOpacity }}
            >
              <defs>
                <linearGradient id="team-curve" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#5EE7FF" />
                  <stop offset="48%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#5EE7FF" stopOpacity="0.45" />
                </linearGradient>
                <filter id="team-curve-glow" x="-80%" y="-20%" width="260%" height="140%">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <motion.path
                d="M 56 20 C 56 92, 144 92, 144 164 C 144 236, 48 236, 48 308 C 48 380, 144 380, 144 452 C 144 524, 48 524, 48 596 C 48 668, 144 668, 144 800"
                fill="none"
                stroke="url(#team-curve)"
                strokeLinecap="round"
                strokeWidth="3"
                filter="url(#team-curve-glow)"
                style={{ pathLength: reduce ? 1 : pathLength }}
              />
            </motion.svg>

            <div className="relative z-10">
              {members.map((member, index) => {
                const photo = profilePhotos[member.name];
                const isLead = index === 0;
                const alignRight = index % 2 === 1;
                const hasNext = index < members.length - 1;

                return (
                  <motion.article
                    key={member.name}
                    className={`relative flex gap-5 pb-8 md:gap-7 ${alignRight ? 'md:pl-24' : 'md:pr-10'} ${hasNext ? '' : 'pb-0'}`}
                    initial={reduce ? false : { opacity: 0, x: alignRight ? 42 : -42, y: 24 }}
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    viewport={{ once: true, amount: 0.35 }}
                    transition={{ duration: 0.78, delay: index * 0.08, ease: premiumEase }}
                  >
                    <div className="relative flex shrink-0 flex-col items-center self-stretch">
                      <motion.div
                        className={`${isLead ? 'h-24 w-24 md:h-28 md:w-28' : 'h-20 w-20 md:h-24 md:w-24'} relative z-10 shrink-0 overflow-hidden rounded-full border-2 border-[#5EE7FF]/40 bg-[#0A0F1F] shadow-[0_18px_46px_rgba(0,0,0,0.3),0_0_28px_rgba(139,92,246,0.18)]`}
                        initial={reduce ? false : { scale: 0.6, rotate: -10 }}
                        whileInView={{ scale: 1, rotate: 0 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{ duration: 0.7, delay: index * 0.08 + 0.1, ease: premiumEase }}
                      >
                        {photo ? (
                          <img src={photo} alt={`${member.name} profile`} className="h-full w-full object-cover object-top" />
                        ) : (
                          <div className="grid h-full w-full place-items-center bg-[radial-gradient(circle_at_35%_20%,rgba(94,231,255,0.22),transparent_38%),linear-gradient(135deg,#111827,#3b1974,#17171c)] text-2xl font-black tracking-[-0.08em] text-white">
                            {initials(member.name)}
                          </div>
                        )}
                      </motion.div>
                    </div>

                    <div className={`min-w-0 flex-1 rounded-[26px] border border-white/10 bg-[#1d1d23]/90 p-5 shadow-[0_18px_54px_rgba(0,0,0,0.18)] backdrop-blur-md ${isLead ? 'md:p-6' : ''}`}>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className={`${isLead ? 'text-3xl' : 'text-2xl'} font-black leading-tight tracking-[-0.05em] text-white`}>{member.name}</h3>
                        <BadgeCheck className="h-5 w-5 fill-[#5EE7FF] text-[#5EE7FF]" />
                      </div>
                      <p className="mt-1 text-sm font-bold text-[#C084FC]">{member.role}</p>
                      <p className="mt-3 max-w-md text-sm leading-6 text-zinc-400">{roleDetails[index]}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {member.skills.map((skill) => (
                          <span key={skill} className="rounded-full border border-white/10 bg-white/7 px-3 py-1 text-xs font-semibold text-zinc-300">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
