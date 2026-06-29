import { motion, useReducedMotion } from 'framer-motion';
import { processSteps } from '../data/portfolio';
import { SectionHeading } from './SectionHeading';

export function Process() {
  const reduce = useReducedMotion();
  return (
    <section className="px-4 py-24">
      <div className="mx-auto max-w-7xl">
        <SectionHeading title="From concept to polished release" description="A focused workflow for turning raw ideas into refined interfaces, maintainable code, and launch-ready experiences." />
        <div className="relative grid gap-4 lg:grid-cols-6">
          <div className="absolute left-0 right-0 top-16 hidden h-px bg-gradient-to-r from-transparent via-[#8B5CF6]/60 to-transparent lg:block" />
          {processSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div key={step.title} initial={reduce ? false : { opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.07 }} className="glass relative rounded-[28px] p-5">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#8B5CF6]/18 text-[#C084FC]"><Icon className="h-6 w-6" /></div>
                <h3 className="mt-6 text-lg font-semibold text-white">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-400">{step.text}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
