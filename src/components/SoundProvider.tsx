import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';

type SoundApi = {
  enabled: boolean;
  ready: boolean;
  startAudio: () => Promise<boolean>;
  tick: () => void;
  keypress: () => void;
  whoosh: (exit?: boolean) => void;
};

const SoundContext = createContext<SoundApi>({
  enabled: true,
  ready: false,
  startAudio: async () => false,
  tick: () => {},
  keypress: () => {},
  whoosh: () => {},
});
export const useSound = () => useContext(SoundContext);

export function SoundProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const audio = useRef<AudioContext | null>(null);
  const master = useRef<GainNode | null>(null);
  const noise = useRef<AudioBuffer | null>(null);
  const keyNoise = useRef<AudioBuffer | null>(null);
  const lastTick = useRef(0);
  const lastKey = useRef(0);

  // Must be called directly from a tap or keypress so the browser treats it
  // as a genuine user gesture. The context is created synchronously before
  // any await, which is what preserves the gesture. Never auto-called on load.
  const startAudio = useCallback(async () => {
    let ctx: AudioContext | null = null;
    try {
      ctx = audio.current ?? new AudioContext();
      audio.current = ctx;
      if (!master.current) {
        master.current = ctx.createGain();
        master.current.gain.value = document.hidden ? 0 : 0.3;
        master.current.connect(ctx.destination);
      }
      const context = ctx;
      ctx.onstatechange = () => {
        if (audio.current === context) setReady(context.state === 'running');
      };
      await ctx.resume();
      // A blocked autoplay promise can settle after StrictMode cleanup.
      if (audio.current !== ctx || !master.current) return false;
      master.current.gain.setTargetAtTime(document.hidden ? 0 : 0.3, ctx.currentTime, 0.01);
      const running = ctx.state === 'running';
      setReady(running);
      return running;
    } catch {
      if (audio.current === ctx) {
        setReady(false);
        // A later browser-authorized gesture may resume a blocked context.
      }
      return false;
    }
  }, []);

  const tick = useCallback(() => {
    const ctx = audio.current;
    if (!ctx || ctx.state !== 'running' || !master.current || document.hidden) return;
    if (performance.now() - lastTick.current < 65) return;
    lastTick.current = performance.now();
    const tone = ctx.createOscillator();
    const envelope = ctx.createGain();
    tone.type = 'triangle';
    tone.frequency.setValueAtTime(1400, ctx.currentTime);
    tone.frequency.exponentialRampToValueAtTime(580, ctx.currentTime + 0.035);
    envelope.gain.setValueAtTime(0.0001, ctx.currentTime);
    envelope.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.003);
    envelope.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.045);
    tone.connect(envelope).connect(master.current);
    tone.start();
    tone.stop(ctx.currentTime + 0.05);
    tone.onended = () => { tone.disconnect(); envelope.disconnect(); };
  }, []);

  const keypress = useCallback(() => {
    const ctx = audio.current;
    if (!ctx || ctx.state !== 'running' || !master.current || document.hidden) return;
    if (performance.now() - lastKey.current < 28) return;
    lastKey.current = performance.now();
    if (!keyNoise.current) {
      keyNoise.current = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * 0.09), ctx.sampleRate);
      const samples = keyNoise.current.getChannelData(0);
      for (let i = 0; i < samples.length; i++) samples[i] = Math.random() * 2 - 1;
    }
    const now = ctx.currentTime;
    const variation = 0.92 + Math.random() * 0.16;
    const cap = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const click = ctx.createGain();
    cap.buffer = keyNoise.current;
    cap.playbackRate.value = variation;
    filter.type = 'lowpass';
    filter.frequency.value = 2100 * variation;
    filter.Q.value = 0.6;
    // A rounded key-down, followed by a quieter release: no high-pitched beep.
    click.gain.setValueAtTime(0.0001, now);
    click.gain.exponentialRampToValueAtTime(0.32, now + 0.002);
    click.gain.exponentialRampToValueAtTime(0.002, now + 0.023);
    click.gain.exponentialRampToValueAtTime(0.1, now + 0.033);
    click.gain.exponentialRampToValueAtTime(0.0001, now + 0.066);
    cap.connect(filter).connect(click).connect(master.current);
    cap.start(now);
    cap.stop(now + 0.07);
    cap.onended = () => { cap.disconnect(); filter.disconnect(); click.disconnect(); };
    const body = ctx.createOscillator();
    const bodyGain = ctx.createGain();
    body.frequency.setValueAtTime(240 * variation, now);
    body.frequency.exponentialRampToValueAtTime(105, now + 0.038);
    bodyGain.gain.setValueAtTime(0.0001, now);
    bodyGain.gain.exponentialRampToValueAtTime(0.16, now + 0.003);
    bodyGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.055);
    body.connect(bodyGain).connect(master.current);
    body.start(now);
    body.stop(now + 0.06);
    body.onended = () => { body.disconnect(); bodyGain.disconnect(); };
  }, []);

  const whoosh = useCallback((exit = false) => {
    const ctx = audio.current;
    if (!ctx || ctx.state !== 'running' || !master.current || document.hidden) return;
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
    envelope.gain.exponentialRampToValueAtTime(0.32, ctx.currentTime + duration * 0.4);
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
      if (!control || control.matches(':disabled, [aria-disabled="true"]') || control === target(event.relatedTarget)) return;
      tick();
    };
    const unlock = () => {
      if (audio.current?.state !== 'running') void startAudio();
    };
    const visibility = () => {
      const ctx = audio.current;
      if (ctx && master.current) master.current.gain.setTargetAtTime(document.hidden ? 0 : 0.3, ctx.currentTime, 0.02);
    };
    document.addEventListener('pointerover', feedback);
    document.addEventListener('focusin', feedback);
    document.addEventListener('pointerdown', unlock);
    document.addEventListener('keydown', unlock);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      document.removeEventListener('pointerover', feedback);
      document.removeEventListener('focusin', feedback);
      document.removeEventListener('pointerdown', unlock);
      document.removeEventListener('keydown', unlock);
      document.removeEventListener('visibilitychange', visibility);
      if (audio.current) {
        audio.current.onstatechange = null;
        void audio.current.close().catch(() => {});
      }
      audio.current = null;
      master.current = null;
      noise.current = null;
      keyNoise.current = null;
    };
  }, [startAudio, tick]);

  return (
    <SoundContext.Provider value={{ enabled: true, ready, startAudio, tick, keypress, whoosh }}>
      {children}
    </SoundContext.Provider>
  );
}
