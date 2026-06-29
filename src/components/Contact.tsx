import { ArrowUp, Code2, Mail, MessageCircle, Network, Quote, Share2 } from 'lucide-react';
import { contactLinks } from '../data/portfolio';

const icons = [Mail, MessageCircle, Share2, Code2, Network];

export function Contact() {
  return (
    <section id="contact" className="mt-12 bg-[#050507] px-4 py-0">
      <div className="mx-auto grid max-w-7xl lg:grid-cols-[0.9fr_1.45fr]">
        <div className="py-20 pr-8">
          <h2 className="max-w-sm text-3xl font-black leading-tight tracking-[-0.04em] text-white">Available for select freelance opportunities</h2>
          <p className="pixel-copy mt-9 max-w-sm text-[12px] font-bold leading-5 text-white">Have an exciting project you need help with? Send us an email or contact the team via instant message.</p>
          <a href="mailto:hello@anwartechlabs.dev" className="pixel-copy mt-20 inline-block text-[13px] font-bold text-white underline decoration-[#C084FC] decoration-2 underline-offset-4">hello@anwartechlabs.dev</a>
          <div className="mt-6 grid gap-2">
            {contactLinks.map((link, index) => {
              const Icon = icons[index];
              return <a key={link} href="#" className="pixel-copy flex items-center gap-3 text-[12px] font-bold text-white transition hover:text-[#C084FC]"><Icon className="h-3.5 w-3.5 text-[#C084FC]" />{link}</a>;
            })}
          </div>
        </div>
        <div className="relative grid md:grid-cols-2">
          {[0, 1, 2].map((item) => (
            <article key={item} className={`${item === 1 ? 'bg-[#0673dc]' : 'bg-[#B85CF6]'} min-h-72 p-8 text-white ${item === 2 ? 'md:col-start-2' : ''}`}>
              <Quote className="h-10 w-10 fill-white/80 text-white/80" />
              <p className="pixel-copy mt-12 text-[12px] font-bold leading-5 text-white/90">Anwar Tech Labs is known for responsible development, clean visual systems and an ability to convert complex product ideas into polished interfaces.</p>
              <div className="mt-8 flex items-center justify-between">
                <p className="pixel-copy text-[11px] font-bold">- Product Founder</p>
                <div className="h-12 w-12 rounded-full border-2 border-white bg-[url('https://picsum.photos/seed/client-face/120/120')] bg-cover" />
              </div>
            </article>
          ))}
          <a href="#home" className="absolute bottom-8 right-8 hidden h-10 w-10 place-items-center bg-white text-[#8B5CF6] lg:grid" aria-label="Back to top"><ArrowUp className="h-5 w-5" /></a>
        </div>
      </div>
    </section>
  );
}
