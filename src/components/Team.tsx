import { motion, useReducedMotion } from 'framer-motion';
import { Code2, MessageCircle, Network } from 'lucide-react';
import { members } from '../data/portfolio';
import { SectionHeading } from './SectionHeading';

export function Team() {
  const reduce = useReducedMotion();
  return (
    <section id="team" className="px-4 py-24">
      <div className="mx-auto max-w-7xl">
        <SectionHeading title="Meet the Team" description="A focused development crew for planning, designing, building, launching, and supporting client products." />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-5">
          {members.map((member, index) => (
            <motion.div key={member.role} initial={reduce ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.06 }} className="glass glow-border rounded-[30px] p-5 text-center">
              <div className="mx-auto grid h-24 w-24 place-items-center rounded-[28px] bg-gradient-to-br from-[#8b35ff]/35 to-[#0077ff]/20 text-2xl font-semibold text-white">{index + 1}</div>
              <h3 className="mt-5 text-lg font-semibold text-white">{member.role}</h3>
              <div className="mt-4 flex flex-wrap justify-center gap-2">{member.skills.map((skill) => <span key={skill} className="rounded-full bg-white/7 px-3 py-1 text-xs text-zinc-300">{skill}</span>)}</div>
              <div className="mt-5 flex justify-center gap-2 text-zinc-400">{[Code2, Network, MessageCircle].map((Icon, iconIndex) => <a key={iconIndex} href="#contact" aria-label="Social profile" className="grid h-9 w-9 place-items-center rounded-full border border-white/10 hover:text-white"><Icon className="h-4 w-4" /></a>)}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
