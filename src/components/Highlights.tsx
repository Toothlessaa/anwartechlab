import { useState, type CSSProperties, type MouseEvent } from 'react';
import { ArrowUpRight, CalendarDays, MapPin } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { storageAsset } from '../lib/assets';
import { useHighlights } from '../lib/data';
import type { Highlight } from '../types';
import './Highlights.css';

const TRACK_COPIES = 3;
const premiumEase = [0.16, 1, 0.3, 1] as const;

function HighlightLink({ href, decorative }: { href: string; decorative: boolean }) {
  const className = "mt-auto inline-flex w-fit items-center gap-2 rounded-xl bg-[#00FF41] px-4 py-2.5 text-xs font-black text-[#09090B] transition hover:bg-[#66FF66] active:translate-y-px";
  const content = <><span>View details</span><ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" /></>;

  if (decorative) return <span className={className}>{content}</span>;
  if (/^https?:\/\//i.test(href)) {
    return <a href={href} target="_blank" rel="noreferrer" className={className} onClick={(event) => event.stopPropagation()}>{content}</a>;
  }
  return <Link to={href} className={className} onClick={(event) => event.stopPropagation()}>{content}</Link>;
}

function HighlightCard({ item, priority, decorative }: { item: Highlight; priority: boolean; decorative: boolean }) {
  const [flipped, setFlipped] = useState(false);
  const imageUrl = storageAsset(item.image_url);

  function handleClick(event: MouseEvent<HTMLElement>) {
    if (decorative || (event.target as HTMLElement).closest('a')) return;
    setFlipped((current) => !current);
  }

  return (
    <article
      className="highlight-card shrink-0 outline-none"
      data-flipped={flipped}
      tabIndex={decorative ? -1 : 0}
      onClick={handleClick}
      onKeyDown={(event) => {
        if (!decorative && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault();
          setFlipped((current) => !current);
        }
      }}
      aria-label={decorative ? undefined : `${item.title}. Press Enter to view more.`}
    >
      <div className="highlight-card__inner">
        <div className="highlight-card__face bg-[#17171c]">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={decorative ? '' : item.title}
              loading={priority ? 'eager' : 'lazy'}
              fetchPriority={priority ? 'high' : 'auto'}
              decoding="async"
              draggable={false}
              className="absolute inset-0 h-full w-full select-none object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,255,65,0.16),transparent_35%),#17171c]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-[#09090B]/10 to-[#09090B]/25" />
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
            {item.subtitle ? <p className="pixel-copy text-[10px] font-bold uppercase tracking-[0.2em] text-[#00FF41]">{item.subtitle}</p> : null}
            <h3 className="mt-2 text-2xl font-black leading-[1.02] tracking-[-0.045em] text-white">{item.title}</h3>
            <p className="mt-3 text-xs font-medium text-zinc-400">Tap or focus to read more</p>
          </div>
        </div>

        <div className="highlight-card__face highlight-card__back bg-[#111914] p-5 sm:p-6">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00FF41]/70 to-transparent" />
          <div className="relative flex h-full flex-col">
            {item.subtitle ? <p className="pixel-copy text-[10px] font-bold uppercase tracking-[0.2em] text-[#00FF41]">{item.subtitle}</p> : null}
            <h3 className="mt-2 text-xl font-black leading-tight tracking-[-0.035em] text-white">{item.title}</h3>
            {item.description ? <p className="mt-3 line-clamp-6 text-sm leading-6 text-zinc-300">{item.description}</p> : null}
            {item.date_text || item.location ? (
              <div className="mt-5 space-y-2 border-t border-white/10 pt-4">
                {item.date_text ? <p className="flex items-center gap-2 text-xs text-zinc-400"><CalendarDays className="h-4 w-4 text-[#00FF41]" aria-hidden="true" />{item.date_text}</p> : null}
                {item.location ? <p className="flex items-center gap-2 text-xs text-zinc-400"><MapPin className="h-4 w-4 text-[#00FF41]" aria-hidden="true" />{item.location}</p> : null}
              </div>
            ) : null}
            {item.href ? <HighlightLink href={item.href} decorative={decorative} /> : null}
          </div>
        </div>
      </div>
    </article>
  );
}

export function Highlights() {
  const { highlights, loading } = useHighlights();
  const reduce = useReducedMotion();

  if (!loading && highlights.length === 0) return null;

  const trackStyle = {
    '--highlights-duration': `${Math.max(30, highlights.length * 7)}s`,
  } as CSSProperties;

  return (
    <section id="highlights" className="highlights-carousel relative overflow-hidden bg-[#0d1110] py-20 sm:py-28" aria-labelledby="highlights-title">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_20%,rgba(0,255,65,0.1),transparent_22rem),linear-gradient(180deg,rgba(255,255,255,0.015),transparent)]" />
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.65, ease: premiumEase }}
        className="relative mx-auto mb-10 max-w-7xl px-4 sm:mb-14"
      >
        <h2 id="highlights-title" className="max-w-3xl text-4xl font-black leading-[0.98] tracking-[-0.06em] text-white sm:text-6xl lg:text-7xl">Studio Highlights</h2>
        <p className="mt-5 max-w-xl text-sm leading-7 text-zinc-400 sm:text-base">Selected launches, collaborations, and moments shaping our work beyond the final screen.</p>
      </motion.div>

      {loading ? (
        <div className="mx-auto flex max-w-7xl gap-5 overflow-hidden px-4" aria-label="Loading highlights">
          {[0, 1, 2].map((item) => <div key={item} className="h-[370px] w-[300px] shrink-0 animate-pulse rounded-[24px] border border-white/10 bg-white/5 sm:h-[400px] sm:w-[330px]" />)}
        </div>
      ) : (
        <div className="highlights-carousel__viewport">
          <div className="highlights-carousel__track" style={trackStyle}>
            {Array.from({ length: TRACK_COPIES }).flatMap((_, copy) => highlights.map((item, index) => (
              <div key={`${copy}-${item.id}`} aria-hidden={copy > 0 || undefined}>
                <HighlightCard item={item} priority={copy === 0 && index < 3} decorative={copy > 0} />
              </div>
            )))}
          </div>
        </div>
      )}
    </section>
  );
}
