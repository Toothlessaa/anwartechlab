import { motion, useReducedMotion } from 'framer-motion';
import { CalendarDays, Megaphone, Newspaper, RefreshCw, UsersRound } from 'lucide-react';

const galleryItems = [
  {
    title: 'News Highlight',
    category: 'News',
    description: 'Company milestones, project launches, and important team stories will appear here.',
    icon: Newspaper,
  },
  {
    title: 'Announcements',
    category: 'Announcement',
    description: 'Official updates, schedules, and important notices for clients and the team.',
    icon: Megaphone,
  },
  {
    title: 'Team Updates',
    category: 'Updates',
    description: 'Progress snapshots, internal improvements, and development updates from the team.',
    icon: RefreshCw,
  },
  {
    title: 'Team Meetings',
    category: 'Meeting',
    description: 'Planning sessions, project alignment, reviews, and collaboration moments.',
    icon: CalendarDays,
  },
  {
    title: 'Team Building',
    category: 'Culture',
    description: 'Team bonding, celebrations, activities, and behind-the-scenes culture photos.',
    icon: UsersRound,
  },
];

const premiumEase = [0.16, 1, 0.3, 1] as const;

export function Gallery() {
  const reduce = useReducedMotion();

  return (
    <section id="gallery" className="relative overflow-hidden bg-[#101014] px-4 py-24 sm:py-32">
      <div className="pointer-events-none absolute left-[-8rem] top-20 h-80 w-80 rounded-full bg-[#5EE7FF]/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 right-[-8rem] h-96 w-96 rounded-full bg-[#8B5CF6]/12 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          className="mb-10 max-w-3xl"
          initial={reduce ? false : { opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.45 }}
          transition={{ duration: 0.72, ease: premiumEase }}
        >
          <p className="pixel-copy text-sm font-bold lowercase tracking-[0.28em] text-[#5EE7FF]">// gallery</p>
          <h2 className="mt-4 text-5xl font-black leading-[0.95] tracking-[-0.07em] text-white sm:text-7xl">Updates, Moments, and Team Stories</h2>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
            A placeholder space for future Supabase photos covering news, announcements, team meetings, team building, and behind-the-scenes updates.
          </p>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {galleryItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.article
                key={item.title}
                className={`${index === 0 ? 'lg:col-span-2' : ''} group relative min-h-[280px] overflow-hidden rounded-[32px] border border-white/10 bg-[#1d1d23]/86 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.25)] backdrop-blur-xl`}
                initial={reduce ? false : { opacity: 0, y: 28, scale: 0.98 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.66, delay: index * 0.06, ease: premiumEase }}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(94,231,255,0.18),transparent_34%),radial-gradient(circle_at_80%_86%,rgba(192,132,252,0.16),transparent_36%)] opacity-80 transition duration-500 group-hover:opacity-100" />
                <div className="absolute inset-x-6 top-6 h-40 rounded-[26px] border border-dashed border-white/15 bg-white/[0.03]" />
                <div className="relative flex h-full min-h-[232px] flex-col justify-between">
                  <div className="flex items-start justify-between gap-4">
                    <span className="rounded-full border border-[#5EE7FF]/25 bg-[#5EE7FF]/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[#5EE7FF]">{item.category}</span>
                    <span className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/8 text-[#C084FC]">
                      <Icon className="h-5 w-5" />
                    </span>
                  </div>

                  <div>
                    <div className="mb-5 grid h-20 place-items-center rounded-[24px] border border-white/10 bg-black/10 text-sm font-bold text-zinc-500">
                      Supabase photo placeholder
                    </div>
                    <h3 className="text-2xl font-black tracking-[-0.05em] text-white">{item.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-zinc-400">{item.description}</p>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
