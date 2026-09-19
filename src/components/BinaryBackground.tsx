import { useEffect, useRef, useState } from 'react';

const columns = Array.from({ length: 26 }, (_, index) =>
  Array.from({ length: 64 }, (_, row) => ((row * 17 + index * 13 + row * index) % 7 < 3 ? '0' : '1')).join(''),
);

export function BinaryBackground() {
  const ref = useRef<HTMLDivElement>(null);
  const [running, setRunning] = useState(false);
  const [repeats, setRepeats] = useState(1);

  useEffect(() => {
    let visible = false;
    const update = () => setRunning(visible && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    });
    const resize = new ResizeObserver(([entry]) => {
      setRepeats(Math.max(1, Math.ceil(entry.contentRect.height / (64 * 21.6))));
    });
    if (ref.current) {
      observer.observe(ref.current);
      resize.observe(ref.current);
    }
    document.addEventListener('visibilitychange', update);
    return () => {
      observer.disconnect();
      resize.disconnect();
      document.removeEventListener('visibilitychange', update);
    };
  }, []);

  return (
    <div ref={ref} className="binary-background" aria-hidden="true" data-running={running}>
      {columns.map((text, index) => (
        <span key={index} style={{ left: `${(index + 0.5) * 100 / columns.length}%`, animationDuration: `${(22 + index % 9 * 3) * repeats}s`, animationDelay: `${-index * 3.7}s`, opacity: 0.35 + (index % 4) * 0.15 }}>
          {text.repeat(repeats * 2)}
        </span>
      ))}
    </div>
  );
}
