import { milestones } from '../data/portfolio';

export function Milestones() {
  return (
    <section id="experience" className="px-4 py-24">
      <div className="mx-auto max-w-xl">
        <h2 className="mb-10 text-center text-5xl font-black leading-[0.95] tracking-[-0.06em] text-white">Professional<br />Experience</h2>
        <div className="space-y-2">
          {milestones.map((item, index) => (
            <div key={item.title} className="flex items-center justify-between bg-[#3b007d] px-5 py-3 text-white shadow-[0_10px_30px_rgba(59,0,125,0.22)]">
              <span className="pixel-copy text-[11px] font-bold">{item.title}</span>
              <span className="pixel-copy text-[11px] font-bold text-white/80">{index === 0 ? '2019 - 2024' : index === 1 ? '2018 - 2019' : '2017 - Present'} +</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
