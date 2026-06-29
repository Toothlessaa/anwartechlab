import { motion, useReducedMotion } from 'framer-motion';
import { services } from '../data/portfolio';

const codeLines = [
  { n: '1', text: "import { useEffect, useState } from 'react';" },
  { n: '2', text: "import { motion } from 'framer-motion';" },
  { n: '3', text: "import { Code2, Globe2, Smartphone } from 'lucide-react';" },
  { n: '4', text: "import { services } from '../data/portfolio';" },
  { n: '5', text: '' },
  { n: '6', text: 'export function Expertise() {' },
  { n: '7', text: '  const [active, setActive] = useState("design");' },
  { n: '8', text: '  const reduce = useReducedMotion();' },
  { n: '9', text: '' },
  { n: '10', text: '  return (' },
  { n: '11', text: '    <section id="expertise">' },
  { n: '12', text: '      <h2>Our Expertise</h2>' },
  { n: '13', text: '      {services.map((service) => <Card key={service.title} />)}' },
  { n: '14', text: '    </section>' },
  { n: '15', text: '  );' },
  { n: '16', text: '}' },
];

export function Services() {
  const reduce = useReducedMotion();
  const accentColors = ['bg-[#ff2fa8]', 'bg-[#3657ff]', 'bg-[#ff6b2d]'];

  return (
    <section id="expertise" className="relative overflow-hidden bg-[#17171c] px-4 pb-28 pt-24">
      <div className="pointer-events-none absolute inset-x-0 bottom-[-4rem] mx-auto hidden max-w-5xl opacity-[0.2] md:block">
        <pre className="code-fade pixel-copy mx-auto max-h-[360px] overflow-hidden text-left text-[15px] font-bold leading-7 text-white">
          {codeLines.map((line) => (
            <div key={line.n} className="grid grid-cols-[3rem_1fr] gap-5">
              <span className="text-right text-[#6B7280]">{line.n}</span>
              <span className="text-[#94A3B8]">
                {line.text.includes('import') ? <><span className="text-[#C084FC]">import</span>{line.text.replace('import', '')}</> : null}
                {line.text.includes('export') ? <><span className="text-[#C084FC]">export</span>{line.text.replace('export', '')}</> : null}
                {!line.text.includes('import') && !line.text.includes('export') ? line.text : null}
              </span>
            </div>
          ))}
        </pre>
      </div>
      <div className="relative mx-auto max-w-[1348px]">
        <motion.h2 initial={reduce ? false : { opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16 text-center text-6xl font-black tracking-[-0.075em] text-white sm:text-8xl lg:text-[7rem]">Our Expertise</motion.h2>
        <div className="relative z-10 grid border-[3px] border-[#8f8f96] bg-[#17171c]/95 md:grid-cols-3">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.article key={service.title} initial={reduce ? false : { opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.55, delay: index * 0.06 }} className="min-h-[410px] border-b border-[#8f8f96] px-10 py-14 md:border-b-0 md:border-r md:last:border-r-0 lg:px-11">
                <div className="flex items-start gap-8">
                  <Icon className="mt-1 h-14 w-14 shrink-0 text-zinc-100" strokeWidth={1.7} />
                  <h3 className="relative max-w-[16rem] text-3xl font-black leading-[1.05] tracking-[-0.055em] text-white">
                    <span className={`absolute left-0 top-[1.1em] h-2 w-[9.4rem] ${accentColors[index]}`} />
                    <span className="relative">{service.title}</span>
                  </h3>
                </div>
                <div className="pixel-copy mt-8 text-lg font-bold leading-8 text-zinc-100">
                  <p className="text-[#5f6068]">&lt;h3&gt;</p>
                  <div className="ml-6 border-l-2 border-[#6b6c73] pl-6">
                    {service.description}
                  </div>
                  <p className="mt-3 text-[#5f6068]">&lt;/h3&gt;</p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
