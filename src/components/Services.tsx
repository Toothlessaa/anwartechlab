import { motion, useReducedMotion } from 'framer-motion';
import { services } from '../data/portfolio';

const premiumEase = [0.16, 1, 0.3, 1] as const;

export function Services() {
  const reduce = useReducedMotion();

  return (
    <section id="expertise" className="relative overflow-hidden px-4 py-20 sm:py-24">
      <div className="pointer-events-none absolute left-[8%] top-20 h-64 w-64 rounded-full bg-[#3B82F6]/10 blur-3xl" />
      <div className="pointer-events-none absolute right-[10%] bottom-16 h-64 w-64 rounded-full bg-[#7C3AED]/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <motion.h2
          initial={reduce ? false : { opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.58, ease: premiumEase }}
          className="mb-12 text-5xl font-black leading-[0.95] tracking-[-0.07em] text-white sm:text-7xl"
        >
          Our Expertise
        </motion.h2>

        <div className="grid auto-rows-fr gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.article
                key={service.title}
                initial={reduce ? false : { opacity: 0, y: 40, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.48, delay: index * 0.08, ease: premiumEase }}
                whileHover={reduce ? undefined : { y: -6, scale: 1.01 }}
                className="group relative flex h-full transform-gpu flex-col overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.095),rgba(255,255,255,0.035))] shadow-[0_22px_70px_rgba(0,0,0,0.24)] backdrop-blur-md transition-colors will-change-transform hover:border-[#00FF41]/40"
              >
                <div className="relative m-3 overflow-hidden rounded-[23px] border border-white/10 bg-[#09090B] aspect-[16/9]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_12%,rgba(94,231,255,0.18),transparent_32%),linear-gradient(145deg,rgba(255,255,255,0.08),rgba(255,255,255,0.015))]" />
                  <div className="absolute left-4 right-4 top-4 flex items-center justify-between gap-3">
                    <div className="flex gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#FF6B6B]" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[#FFD166]" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[#00FF41]" />
                    </div>
                  </div>
                  <div className="grid h-full place-items-center">
                    <Icon className="h-16 w-16 text-zinc-100 sm:h-20 sm:w-20" strokeWidth={1.5} />
                  </div>
                </div>

                <div className="flex min-h-0 flex-1 flex-col px-5 pb-5 pt-3 sm:px-6 sm:pb-6">
                  <h3 className="text-2xl font-black leading-tight tracking-[-0.045em] text-white">
                    {service.title}
                  </h3>
                  <div className="mt-2 h-1 w-16 rounded-full bg-[#00FF41]/60" />
                  <p className="pixel-copy mt-4 text-sm leading-6 text-zinc-400">
                    {service.description}
                  </p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
