import { Quote } from 'lucide-react';
import { storageAsset } from '../lib/assets';
import { BinaryBackground } from './BinaryBackground';

const ceoPhoto = storageAsset('team/noel.png');
const testimonials = [
  'Anwar Tech Labs focuses on real business websites, client systems, and polished interfaces that solve practical problems.',
];

export function Contact() {
  return (
    <section id="contact" className="binary-surface relative mt-12 flex flex-1 flex-col overflow-hidden bg-[#020402] px-4">
      <div className="pointer-events-none absolute inset-0 opacity-70" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_24%,rgba(0,255,65,0.18),transparent_28rem),radial-gradient(circle_at_78%_76%,rgba(0,255,65,0.12),transparent_24rem),linear-gradient(180deg,rgba(0,0,0,0.25),rgba(0,0,0,0.88))]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,255,65,0.08)_1px,transparent_1px),linear-gradient(180deg,rgba(0,255,65,0.055)_1px,transparent_1px)] bg-[size:54px_54px]" />
      </div>
      <BinaryBackground />
      <div className="relative z-10 mx-auto flex flex-1 flex-col gap-8 py-12 lg:w-full lg:flex-row lg:items-stretch lg:py-20">
        <div className="flex w-full flex-col justify-center lg:w-[40%] lg:pr-8">
          <h2 className="max-w-sm text-3xl font-black leading-tight tracking-[-0.04em] text-white">Available for select freelance opportunities</h2>
          <p className="pixel-copy mt-9 max-w-sm text-[12px] font-bold leading-5 text-white">Have an exciting project you need help with? Send us an email or contact the team via instant message.</p>
        </div>
        <div className="flex w-full items-stretch lg:w-[60%] lg:items-start lg:justify-end">
          {testimonials.map((quote, item) => (
            <article key={item} className="flex w-full max-w-sm flex-col justify-between border border-[#00FF41]/20 bg-black/58 p-5 text-white shadow-[inset_0_0_32px_rgba(0,255,65,0.08)] backdrop-blur-sm">
              <div>
                <Quote className="h-8 w-8 fill-[#00FF41]/20 text-[#9cff9c] drop-shadow-[0_0_10px_rgba(255,255,65,0.65)]" />
                <p className="pixel-copy mt-5 text-[12px] font-bold leading-5 text-white/90">{quote}</p>
              </div>
              <div className="mt-5 flex items-center justify-between">
                <p className="pixel-copy text-[11px] font-bold text-[#baffba]">- Noel Blanco, CEO</p>
                <img src={ceoPhoto} alt="Noel Blanco" className="h-12 w-12 rounded-full border-2 border-[#00FF41]/80 object-cover object-top shadow-[0_0_18px_rgba(0,255,65,0.35)]" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
