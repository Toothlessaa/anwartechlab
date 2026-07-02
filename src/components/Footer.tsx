import { Code2, Network, Share2 } from 'lucide-react';

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
          <a href="https://www.facebook.com/profile.php?id=61591170526288" target="_blank" rel="noreferrer" aria-label="Facebook" className="grid h-11 w-11 place-items-center rounded-full border border-white/10 text-zinc-400 transition hover:text-white"><Share2 className="h-5 w-5" /></a>
          <a href="mailto:hello@anwartechlab.com" aria-label="Email" className="grid h-11 w-11 place-items-center rounded-full border border-white/10 text-zinc-400 transition hover:text-white"><Code2 className="h-5 w-5" /></a>
          <a href="#contact" aria-label="Contact" className="grid h-11 w-11 place-items-center rounded-full border border-white/10 text-zinc-400 transition hover:text-white"><Network className="h-5 w-5" /></a>
        </div>
      </div>
    </footer>
  );
}
