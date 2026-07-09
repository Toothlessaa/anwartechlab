import { ChevronLeft, ChevronRight, Images, type LucideIcon, Sparkles } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useGalleryItems } from '../lib/data';

const categoryIcons: Record<string, LucideIcon> = {
  Update: Sparkles,
  Launch: Sparkles,
  Event: Images,
  Team: Images,
  'Behind the Scenes': Images,
};

const premiumEase = [0.16, 1, 0.3, 1] as const;

function safeText(value: unknown, fallback = '') {
  return typeof value === 'string' ? value : fallback;
}

function safeImages(value: unknown, fallbackImage: unknown) {
  const images = Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string' && item.length > 0) : [];
  const cover = typeof fallbackImage === 'string' && fallbackImage ? [fallbackImage] : [];
  return Array.from(new Set([...images, ...cover]));
}

function formatDate(value: string) {
  if (!value) return 'Recent update';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

export function Gallery() {
  const { items } = useGalleryItems();
  const reduce = useReducedMotion();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isCarouselHovered, setIsCarouselHovered] = useState(false);

  useEffect(() => {
    if (!items.length) {
      setSelectedId(null);
      setActiveImageIndex(0);
      return;
    }

    setSelectedId((current) => (current && items.some((item) => item.id === current) ? current : items[0].id));
  }, [items]);

  const selectedItem = useMemo(() => items.find((item) => item.id === selectedId) ?? items[0] ?? null, [items, selectedId]);
  const selectedImages = selectedItem ? safeImages(selectedItem.images, selectedItem.image) : [];
  const activeImage = selectedImages[activeImageIndex] || selectedImages[0] || '';
  const selectedSummary = safeText(selectedItem?.summary, safeText(selectedItem?.description));
  const selectedContent = safeText(selectedItem?.content, safeText(selectedItem?.description));
  const paragraphs = selectedContent.split(/\n+/).filter(Boolean);

  useEffect(() => {
    setActiveImageIndex(0);
    setIsCarouselHovered(false);
  }, [selectedId]);

  useEffect(() => {
    if (reduce || isCarouselHovered || selectedImages.length <= 1) return;
    const interval = setInterval(() => {
      setActiveImageIndex((current) => (current + 1) % selectedImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [selectedId, selectedImages.length, reduce, isCarouselHovered]);

  function showPreviousImage() {
    if (!selectedImages.length) return;
    setActiveImageIndex((current) => (current - 1 + selectedImages.length) % selectedImages.length);
  }

  function showNextImage() {
    if (!selectedImages.length) return;
    setActiveImageIndex((current) => (current + 1) % selectedImages.length);
  }

  return (
    <section id="gallery" className="relative max-w-[100vw] overflow-x-clip bg-[#101014] px-3 py-16 sm:px-4 sm:py-32">
      <div className="pointer-events-none absolute left-[-8rem] top-20 h-80 w-80 rounded-full bg-[#00FF41]/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 right-[-8rem] h-96 w-96 rounded-full bg-[#00FF41]/8 blur-3xl" />

      <div className="relative mx-auto w-full min-w-0 max-w-[calc(100vw-1.5rem)] sm:max-w-7xl">
        <motion.div
          className="mb-6 max-w-3xl sm:mb-10"
          initial={reduce ? false : { opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.45 }}
          transition={{ duration: 0.72, ease: premiumEase }}
        >
          <p className="pixel-copy text-xs font-bold lowercase tracking-[0.24em] text-[#00FF41] sm:text-sm sm:tracking-[0.28em]">// media</p>
          <h2 className="mt-3 text-balance text-3xl font-black leading-[0.98] tracking-[-0.06em] text-white sm:mt-4 sm:text-5xl lg:text-7xl">Project Updates, Team Posts, and Launch Notes</h2>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-400 sm:mt-5 sm:text-base sm:leading-7">
            A media feed for product updates, team activity, and behind-the-scenes progress across the portfolio.
          </p>
        </motion.div>

        {!selectedItem ? (
          <div className="rounded-[24px] border border-dashed border-white/10 p-12 text-center">
            <p className="text-zinc-500">No media posts yet.</p>
          </div>
        ) : (
          <div className="grid w-full min-w-0 max-w-full gap-4 sm:gap-6 lg:grid-cols-[minmax(0,1.2fr)_380px] lg:items-start">
            <article className="relative w-[calc(100vw-1.5rem)] min-w-0 max-w-full justify-self-center rounded-[24px] border border-white/10 bg-[#17171c]/92 p-3 shadow-[0_24px_90px_rgba(0,0,0,0.28)] backdrop-blur-2xl sm:w-full sm:rounded-[34px] sm:p-6 lg:order-1">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,255,65,0.14),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(0,255,65,0.08),transparent_28%)] opacity-80" />
              <div className="relative min-w-0">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <span className="rounded-full border border-[#00FF41]/25 bg-[#00FF41]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#00FF41] sm:px-3 sm:text-xs sm:tracking-[0.18em]">
                    {safeText(selectedItem.category, 'Update') || 'Update'}
                  </span>
                  <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-500 sm:text-xs sm:tracking-[0.18em]">{formatDate(safeText(selectedItem.date))}</span>
                </div>

                <h3 className="mt-3 max-w-full break-words text-lg font-black leading-tight tracking-[-0.03em] text-white sm:text-5xl sm:tracking-[-0.05em]">{safeText(selectedItem.title, 'Media Post')}</h3>
                <p className="mt-2 line-clamp-2 max-w-full break-words text-xs leading-5 text-zinc-300 sm:line-clamp-none sm:text-base sm:leading-7">{selectedSummary}</p>

                <div className="mt-4 grid w-full min-w-0 max-w-full gap-4 sm:gap-6 lg:grid-cols-[minmax(260px,0.72fr)_minmax(0,1fr)] lg:items-start">
                  <div className="w-full min-w-0 max-w-full overflow-hidden rounded-[20px] border border-white/10 bg-[#0d0f13] sm:rounded-[28px]">
                    {activeImage ? (
                      <div
                        className="relative h-[clamp(120px,42vw,170px)] overflow-hidden bg-black/20 sm:h-[240px] lg:h-[260px]"
                        onMouseEnter={() => setIsCarouselHovered(true)}
                        onMouseLeave={() => setIsCarouselHovered(false)}
                      >
                        <img src={activeImage} alt={safeText(selectedItem.title, 'Media post')} className="h-full w-full object-cover" />
                        {selectedImages.length > 1 ? (
                          <>
                            <button type="button" onClick={showPreviousImage} className="absolute left-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full border border-white/10 bg-[#09090B]/70 text-white transition hover:border-[#00FF41]/35 hover:text-[#00FF41] sm:left-3 sm:h-10 sm:w-10" aria-label="Previous image">
                              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                            </button>
                            <button type="button" onClick={showNextImage} className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full border border-white/10 bg-[#09090B]/70 text-white transition hover:border-[#00FF41]/35 hover:text-[#00FF41] sm:right-3 sm:h-10 sm:w-10" aria-label="Next image">
                              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                            </button>
                          </>
                        ) : null}
                      </div>
                    ) : (
                      <div className="grid h-[clamp(120px,42vw,170px)] place-items-center text-sm font-medium text-zinc-500 sm:h-[240px] lg:h-[260px]">No media attached</div>
                    )}

                    {selectedImages.length > 1 ? (
                      <div className="flex w-full min-w-0 max-w-full gap-2 overflow-x-auto border-t border-white/10 bg-white/[0.02] p-2 sm:grid sm:grid-cols-4 sm:overflow-visible sm:p-2.5">
                        {selectedImages.map((image, index) => (
                          <button
                            key={`${selectedItem.id}-image-${index}`}
                            type="button"
                            onClick={() => setActiveImageIndex(index)}
                            className={`w-16 shrink-0 overflow-hidden rounded-xl border transition sm:w-auto ${index === activeImageIndex ? 'border-[#00FF41]/50 shadow-[0_0_0_1px_rgba(0,255,65,0.2)]' : 'border-white/10 hover:border-[#00FF41]/30'}`}
                            aria-label={`Show image ${index + 1}`}
                          >
                            <img src={image} alt={`${safeText(selectedItem.title, 'Media post')} ${index + 1}`} className="h-10 w-full object-cover sm:h-14" />
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>

                  <div className="h-fit w-full min-w-0 max-w-full rounded-[20px] border border-white/10 bg-white/[0.03] p-3 sm:rounded-[28px] sm:p-5">
                    <div className="space-y-3 break-words text-xs leading-6 text-zinc-300 sm:space-y-4 sm:text-base sm:leading-7">
                      {paragraphs.length ? paragraphs.map((paragraph, index) => <p key={`${selectedItem.id}-paragraph-${index}`}>{paragraph}</p>) : <p>{safeText(selectedItem.description)}</p>}
                    </div>
                  </div>
                </div>
              </div>
            </article>

            <aside className="w-[calc(100vw-1.5rem)] min-w-0 max-w-full justify-self-center rounded-[22px] border border-white/10 bg-[#17171c]/78 p-2 shadow-[0_24px_80px_rgba(0,0,0,0.18)] backdrop-blur-xl sm:w-full sm:rounded-[30px] sm:p-3 lg:order-2 lg:sticky lg:top-24 lg:self-start">
              <div className="mb-2 px-2 pt-2 sm:px-3">
                <p className="pixel-copy text-xs font-bold uppercase tracking-[0.18em] text-[#00FF41] sm:tracking-[0.22em]">Latest Posts</p>
              </div>
              <div className="space-y-2">
                {items.map((item) => {
                  const category = safeText(item.category, 'Update');
                  const Icon = categoryIcons[category] || Sparkles;
                  const thumbnail = safeImages(item.images, item.image)[0] || '';
                  const title = safeText(item.title, 'Media Post');
                  const summary = safeText(item.summary, safeText(item.description));
                  const active = item.id === selectedItem.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedId(item.id)}
                      className={`flex w-full items-start gap-2.5 rounded-[18px] border p-2.5 text-left transition sm:gap-3 sm:rounded-[24px] sm:p-3 ${active ? 'border-[#00FF41]/35 bg-[#00FF41]/8' : 'border-white/8 bg-white/[0.02] hover:border-[#00FF41]/25 hover:bg-[#00FF41]/6'}`}
                    >
                      <div className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-2xl border border-white/10 bg-[#101014] text-[#00FF41] sm:h-12 sm:w-12">
                        {thumbnail ? <img src={thumbnail} alt="" className="h-full w-full object-cover" /> : <Icon className="h-4 w-4 sm:h-5 sm:w-5" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2 sm:gap-3">
                          <p className="truncate text-xs font-bold text-white sm:text-sm">{title}</p>
                          <span className="shrink-0 text-[9px] uppercase tracking-[0.12em] text-zinc-500 sm:text-[10px] sm:tracking-[0.16em]">{category}</span>
                        </div>
                        <p className="mt-1 line-clamp-1 text-[11px] leading-4 text-zinc-400 sm:line-clamp-2 sm:text-xs sm:leading-5">{summary}</p>
                        <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-zinc-500 sm:mt-2 sm:text-[11px] sm:tracking-[0.16em]">{formatDate(safeText(item.date))}</p>
                      </div>
                    </button>
                  );
                })}
                {!items.length ? (
                  <div className="rounded-[24px] border border-dashed border-white/10 px-4 py-6 text-center text-sm text-zinc-500">
                    No other posts yet.
                  </div>
                ) : null}
              </div>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}
