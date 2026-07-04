import { Quote } from 'lucide-react';
import { storageAsset } from '../lib/assets';

const matrixStreams = Array.from({ length: 24 }, (_, index) => ({
  id: index,
  left: `${index * 4.35}%`,
  delay: `${(index % 8) * -1.15}s`,
  duration: `${7 + (index % 6)}s`,
  text: index % 3 === 0 ? '010110100111001011010011' : index % 3 === 1 ? '101001011100101101001110' : '001101011010010111001011',
}));

const ceoPhoto = storageAsset('team/noel.png');
const testimonials = [
  'We build every project with one goal: help clients launch clean, reliable digital products that are easy to use and ready to grow.',
  'Our team handles strategy, design, development, and delivery with direct communication from the first idea to the final handoff.',
  'Anwar Tech Labs focuses on real business websites, client systems, and polished interfaces that solve practical problems.',
];

export function Contact() {
  return (
    <section id="contact" className="relative mt-12 overflow-hidden bg-[#020402] px-4 py-0">
      <div className="pointer-events-none absolute inset-0 opacity-70" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_24%,rgba(0,255,65,0.18),transparent_28rem),radial-gradient(circle_at_78%_76%,rgba(0,255,65,0.12),transparent_24rem),linear-gradient(180deg,rgba(0,0,0,0.25),rgba(0,0,0,0.88))]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,255,65,0.08)_1px,transparent_1px),linear-gradient(180deg,rgba(0,255,65,0.055)_1px,transparent_1px)] bg-[size:54px_54px]" />
        {matrixStreams.map((stream) => (
          <span
            key={stream.id}
            className="matrix-stream pixel-copy"
            style={{ left: stream.left, animationDelay: stream.delay, animationDuration: stream.duration }}
          >
            {stream.text}
          </span>
        ))}
      </div>
      <div className="relative z-10 mx-auto grid max-w-7xl lg:grid-cols-[0.9fr_1.45fr]">
        <div className="py-20 pr-8">
          <h2 className="max-w-sm text-3xl font-black leading-tight tracking-[-0.04em] text-white">Available for select freelance opportunities</h2>
          <p className="pixel-copy mt-9 max-w-sm text-[12px] font-bold leading-5 text-white">Have an exciting project you need help with? Send us an email or contact the team via instant message.</p>
        </div>
        <div className="relative grid gap-px py-px md:grid-cols-2">
          {testimonials.map((quote, item) => (
            <article key={item} className={`min-h-72 border border-[#00FF41]/20 bg-black/58 p-8 text-white shadow-[inset_0_0_32px_rgba(0,255,65,0.08)] backdrop-blur-sm ${item === 2 ? 'md:col-start-2' : ''}`}>
              <Quote className="h-10 w-10 fill-[#00FF41]/20 text-[#9cff9c] drop-shadow-[0_0_10px_rgba(0,255,65,0.65)]" />
              <p className="pixel-copy mt-12 text-[12px] font-bold leading-5 text-white/90">{quote}</p>
              <div className="mt-8 flex items-center justify-between">
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
