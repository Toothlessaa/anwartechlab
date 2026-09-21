import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { navItems } from '../data/portfolio';

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('home');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const sections = navItems.map((item) => document.getElementById(item.id)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) setActive(entry.target.id); });
    }, { rootMargin: '-42% 0px -50% 0px' });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const home = document.getElementById('home');
    if (!home) return;

    const observer = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting), { threshold: 0.72 });
    observer.observe(home);
    return () => observer.disconnect();
  }, []);

  return (
    <header className={`fixed left-0 right-0 top-0 z-50 px-4 transition duration-300 ${scrolled ? 'studio-nav--scrolled' : 'pt-5'}`}>
      <nav className={`relative mx-auto flex max-w-7xl items-center justify-center bg-transparent px-0 transition-all duration-300 ${scrolled ? 'h-14' : 'h-14'}`}>
        <div className={`hidden items-center lg:flex ${scrolled ? 'gap-16' : 'gap-12'}`}>
          {navItems.map((item, index) => (
            <a key={item.id} href={`#${item.id}`} aria-current={active === item.id ? 'location' : undefined} className="studio-nav-link pixel-copy relative flex flex-col items-center font-bold tracking-tight transition">
              <span className="mb-1 text-[10px] leading-none text-zinc-500">{String(index + 1).padStart(2, '0')}</span>
              {active === item.id ? <motion.span layoutId="nav-active" className="absolute -bottom-2 left-0 h-px w-full bg-accent" transition={{ type: 'spring', stiffness: 280, damping: 28 }} /> : null}
              <span className={`relative leading-none ${scrolled ? 'text-lg' : 'text-lg'}`}>// {item.label}</span>
            </a>
          ))}
        </div>
        <button className="studio-secondary absolute right-0 grid h-10 w-10 place-items-center rounded-full lg:hidden" onClick={() => setOpen((value) => !value)} aria-label="Toggle menu" aria-expanded={open}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>
      {open ? (
        <div className="glass mx-4 mt-3 rounded-[28px] p-4 lg:hidden">
          {navItems.map((item) => <a key={item.id} href={`#${item.id}`} onClick={() => setOpen(false)} aria-current={active === item.id ? 'location' : undefined} className="studio-nav-link block rounded-2xl px-4 py-3 transition hover:bg-accent/8">// {item.label}</a>)}
        </div>
      ) : null}
    </header>
  );
}
