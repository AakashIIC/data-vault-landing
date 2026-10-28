import { useEffect, useRef, type ReactNode } from 'react';
import { animate, motion, useInView, useReducedMotion, type Variants } from 'motion/react';

export const EASE = [0.22, 1, 0.36, 1] as const;

// Parent/child variants for staggered entrances
export const stagger = (each = 0.06, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: each, delayChildren: delay } },
});
export const rise = (y = 12, duration = 0.45): Variants => ({
  hidden: { opacity: 0, y },
  show: { opacity: 1, y: 0, transition: { duration, ease: EASE } },
});

// Section wrapper that slides up once it scrolls into view
export function Reveal({ children, className, id, delay = 0 }: { children: ReactNode; className?: string; id?: string; delay?: number }) {
  return (
    <motion.div
      id={id}
      className={className}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.8, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

// Counts from 0 to the number in `value` the first time it is visible, keeping its suffix and grouping
export function CountUp({ value, className, duration = 1.1 }: { value: string; className?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView || reduce) return;
    const target = parseFloat(value.replace(/[^\d.]/g, ''));
    if (!Number.isFinite(target)) return;
    const suffix = value.replace(/[\d,.\s]/g, '');
    const grouped = value.includes(',');
    const controls = animate(0, target, {
      duration,
      ease: EASE,
      onUpdate: v => {
        const n = Math.round(v);
        el.textContent = (grouped ? n.toLocaleString('en-IN') : String(n)) + suffix;
      },
    });
    return () => controls.stop();
  }, [inView, reduce, value, duration]);

  return <span ref={ref} className={className}>{value}</span>;
}

// Deterministic waveform heights so server and client renders match
export const waveform = (n: number, seed: number, dip?: [number, number]) => {
  let s = seed;
  const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280;
  return Array.from({ length: n }, (_, i) =>
    Math.round((20 + rnd() * 80) * (0.4 + 0.6 * Math.abs(Math.sin(i / 7))) * (dip && i > dip[0] && i < dip[1] ? 0.45 : 1)),
  );
};
