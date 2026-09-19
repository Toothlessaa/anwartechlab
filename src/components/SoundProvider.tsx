import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const SoundContext = createContext({ enabled: false, tick: () => {}, whoosh: (_exit = false) => {} });
export const useSound = () => useContext(SoundContext);
const preferenceKey = 'atl-sound-enabled';

export function SoundProvider({ children }: { children: ReactNode }) {
  const audio = useRef<AudioContext | null>(null);
  const master = useRef<GainNode | null>(null);
  const noise = useRef<AudioBuffer | null>(null);
  const allowed = useRef(false);
  const lastTick = useRef(0);
  const [enabled, setEnabled] = useState(false);
  const [unavailable, setUnavailable] = useState(false);

  const enable = useCallback(async () => {
    try {
      const ctx = audio.current ?? new AudioContext();
      audio.current = ctx;
      if (!master.current) {
        master.current = ctx.createGain();
        master.current.connect(ctx.destination);
      }
      allowed.current = true;
      await ctx.resume();
      if (!allowed.current) return;
      master.current.gain.setValueAtTime(document.hidden ? 0 : 0.35, ctx.currentTime);
      setEnabled(true);
      try { localStorage.setItem(preferenceKey, 'true'); } catch { /* Storage can be blocked. */ }
    } catch {
      allowed.current = false;
      setUnavailable(true);
    }
  }, []);

  const tick = useCallback(() => {
    const ctx = audio.current;
    if (!allowed.current || !ctx || ctx.state !== 'running' || !master.current || document.hidden) return;
    if (performance.now() - lastTick.current < 65) return;
    lastTick.current = performance.now();
    const tone = ctx.createOscillator();
    const envelope = ctx.createGain();
    tone.type = 'triangle';
    tone.frequency.setValueAtTime(1800, ctx.currentTime);
    tone.frequency.exponentialRampToValueAtTime(650, ctx.currentTime + 0.035);
    envelope.gain.setValueAtTime(0.0001, ctx.currentTime);
    envelope.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.003);
    envelope.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.045);
    tone.connect(envelope).connect(master.current);
    tone.start();
    tone.stop(ctx.currentTime + 0.05);
    tone.onended = () => { tone.disconnect(); envelope.disconnect(); };
  }, []);

  const whoosh = useCallback((exit = false) => {
    const ctx = audio.current;
    if (!allowed.current || !ctx || ctx.state !== 'running' || !master.current || document.hidden) return;
    const duration = exit ? 0.65 : 1.7;
    if (!noise.current) {
      noise.current = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
      const samples = noise.current.getChannelData(0);
      for (let i = 0; i < samples.length; i++) samples[i] = Math.random() * 2 - 1;
    }
    const source = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const envelope = ctx.createGain();
    source.buffer = noise.current;
    filter.type = 'bandpass';
    filter.Q.value = 0.65;
    filter.frequency.setValueAtTime(exit ? 2200 : 180, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(exit ? 180 : 2800, ctx.currentTime + duration);
    envelope.gain.setValueAtTime(0.0001, ctx.currentTime);
    envelope.gain.exponentialRampToValueAtTime(0.45, ctx.currentTime + duration * 0.4);
    envelope.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    source.connect(filter).connect(envelope).connect(master.current);
    source.start();
    source.stop(ctx.currentTime + duration);
    source.onended = () => { source.disconnect(); filter.disconnect(); envelope.disconnect(); };
  }, []);

  useEffect(() => {
    const selector = 'a[href], button, [role="button"], input, select, textarea, .cursor-target, [data-sound-hover]';
    const target = (node: EventTarget | null) => node instanceof Element ? node.closest(selector) : null;
    const feedback = (event: PointerEvent | FocusEvent) => {
      if (event instanceof PointerEvent && event.pointerType !== 'mouse') return;
      const control = target(event.target);
      if (!control || control.matches(':disabled, [aria-disabled="true"], [data-sound-toggle]') || control === target(event.relatedTarget)) return;
      tick();
    };
    const restore = () => {
      try { if (localStorage.getItem(preferenceKey) === 'true' && !allowed.current) void enable(); } catch { /* Optional preference. */ }
    };
    const visibility = () => {
      const ctx = audio.current;
      if (ctx && master.current) master.current.gain.setTargetAtTime(document.hidden || !allowed.current ? 0 : 0.35, ctx.currentTime, 0.02);
    };
    document.addEventListener('pointerover', feedback);
    document.addEventListener('focusin', feedback);
    document.addEventListener('pointerdown', restore);
    document.addEventListener('keydown', restore);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      document.removeEventListener('pointerover', feedback);
      document.removeEventListener('focusin', feedback);
      document.removeEventListener('pointerdown', restore);
      document.removeEventListener('keydown', restore);
      document.removeEventListener('visibilitychange', visibility);
      void audio.current?.close();
      audio.current = null;
      master.current = null;
      noise.current = null;
      allowed.current = false;
    };
  }, [enable, tick]);

  const toggle = () => {
    if (!enabled) { void enable(); return; }
    allowed.current = false;
    setEnabled(false);
    if (audio.current && master.current) master.current.gain.setTargetAtTime(0, audio.current.currentTime, 0.015);
    try { localStorage.setItem(preferenceKey, 'false'); } catch { /* Optional preference. */ }
  };

  return (
    <SoundContext.Provider value={{ enabled, tick, whoosh }}>
      {children}
      <button type="button" className="sound-toggle" data-sound-toggle aria-label={enabled ? 'Mute sound effects' : 'Enable sound effects'} aria-pressed={enabled} onClick={toggle} disabled={unavailable}>
        {enabled ? <Volume2 size={16} aria-hidden="true" /> : <VolumeX size={16} aria-hidden="true" />}
        <span>{unavailable ? 'Sound unavailable' : enabled ? 'Sound on' : 'Enable sound'}</span>
      </button>
    </SoundContext.Provider>
  );
}
