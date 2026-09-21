import { Quote } from 'lucide-react';
import { BinaryBackground } from './BinaryBackground';

const ceoPhoto = '/noel.jpg';
const testimonials = [
  'Anwar Tech Labs focuses on real business websites, client systems, and polished interfaces that solve practical problems.',
];

export function Contact() {
  return (
    <section id="contact" className="binary-surface relative mt-12 flex flex-1 flex-col overflow-hidden bg-[#020402] px-4">
      <BinaryBackground variant="full" />
      <div className="relative z-10 mx-auto flex flex-1 flex-col gap-8 py-12 lg:w-full lg:flex-row lg:items-stretch lg:py-20">
        <div className="flex w-full flex-col justify-center lg:w-[40%] lg:pr-8">
          <h2 className="max-w-sm text-3xl font-black leading-tight tracking-[-0.04em] text-white">Available for select freelance opportunities</h2>
          <p className="pixel-copy mt-9 max-w-sm text-[12px] font-bold leading-5 text-white">Have an exciting project you need help with? Send us an email or contact the team via instant message.</p>
        </div>
        <div className="flex w-full items-stretch lg:w-[60%] lg:items-start lg:justify-end">
          {testimonials.map((quote, item) => (
            <article key={item} className="studio-card flex w-full max-w-sm flex-col justify-between p-5 text-white">
              <div>
                <Quote className="h-8 w-8 text-zinc-400" />
                <p className="pixel-copy mt-5 text-[12px] font-bold leading-5 text-white/90">{quote}</p>
              </div>
              <div className="mt-5 flex items-center justify-between">
                <p className="pixel-copy text-[11px] font-bold text-zinc-300">- Noel Blanco, CEO</p>
                <img src={ceoPhoto} alt="Noel Blanco, CEO" className="h-[60px] w-[60px] shrink-0 rounded-full border border-[#00ff41] object-cover object-center" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
