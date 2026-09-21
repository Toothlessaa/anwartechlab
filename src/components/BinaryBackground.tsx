import { useEffect, useRef, useState } from 'react';
import './BinaryBackground.css';

const annotations = {
  home: { number: '01', side: 'left', lines: ['SOLVING', 'REAL PROBLEMS', 'THROUGH', 'TECHNOLOGY'] },
  expertise: { number: '02', side: 'right', lines: ['TECHNOLOGY', 'PEOPLE', 'BETTER FUTURES'] },
  projects: { number: '03', side: 'left', lines: ['PRODUCTS', 'THAT CREATE', 'OPPORTUNITIES'] },
  team: { number: '04', side: 'right', lines: ['PEOPLE', 'IDEAS', 'EXECUTION'] },
  highlights: { number: '05', side: 'left', lines: ['MORE', 'THAN CODE', 'A STRONGER', 'COMMUNITY'] },
  gallery: { number: '06', side: 'right', lines: ['IDEAS', 'IN PROGRESS', 'BUILT IN PUBLIC'] },
  experience: { number: '07', side: 'left', lines: ['TRUST', 'COLLABORATION', 'LONG-TERM IMPACT'] },
} as const;

// Two cached SVG layers provide the falling columns without per-character DOM.
export function BinaryBackground({ section, variant = 'sides' }: { section?: keyof typeof annotations; variant?: 'sides' | 'full' }) {
  const annotation = section ? annotations[section] : undefined;
  const backgroundRef = useRef<HTMLDivElement>(null);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    let visible = false;
    const update = () => setRunning(visible && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    });
    if (backgroundRef.current) observer.observe(backgroundRef.current);
    document.addEventListener('visibilitychange', update);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', update);
    };
  }, []);

  return (
    <>
      <div ref={backgroundRef} className={`binary-background binary-background--${variant}`} data-running={running} aria-hidden="true" />
      {annotation ? (
        <div className="side-annotation" data-side={annotation.side} data-section={section} aria-hidden="true">
          <div className="side-annotation__inner">
            <span className="side-annotation__number">{annotation.number}</span>
            <span className="side-annotation__rule" />
            <div className="side-annotation__copy">
              {annotation.lines.map(line => <span key={line}>{line}</span>)}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
