import { ArrowUp, Code2, Network, Share2 } from 'lucide-react';
import { Button } from './ui/button';

export function Footer() {
  return (
    <footer className="bg-[#050507] px-4 py-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="pixel-copy text-sm font-bold text-white">AnwarTechLabs._</p>
          <p className="mt-2 max-w-lg text-sm leading-6 text-zinc-500">Software engineers, front end developers, and app builders for polished digital products.</p>
          <p className="mt-4 text-xs text-zinc-600">© {new Date().getFullYear()} Anwar Tech Labs. All rights reserved.</p>
        </div>
        <div className="flex items-center gap-3">
          {[Share2, Code2, Network].map((Icon, index) => <a key={index} href="#contact" aria-label="Social link" className="grid h-11 w-11 place-items-center rounded-full border border-white/10 text-zinc-400 transition hover:text-white"><Icon className="h-5 w-5" /></a>)}
          <Button asChild variant="secondary" size="icon"><a href="#home" aria-label="Back to top"><ArrowUp className="h-5 w-5" /></a></Button>
        </div>
      </div>
    </footer>
  );
}
