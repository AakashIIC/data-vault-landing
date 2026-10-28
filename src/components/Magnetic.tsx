import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react';
import type { ReactNode, PointerEvent } from 'react';

// Pulls its child a few pixels toward the pointer, springing back on leave
export function Magnetic({ children, strength = 0.25 }: { children: ReactNode; strength?: number }) {
  const reduce = useReducedMotion();
  const x = useSpring(useMotionValue(0), { stiffness: 260, damping: 18 });
  const y = useSpring(useMotionValue(0), { stiffness: 260, damping: 18 });

  const move = (e: PointerEvent<HTMLSpanElement>) => {
    if (reduce || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * strength);
    y.set((e.clientY - r.top - r.height / 2) * strength);
  };
  const reset = () => { x.set(0); y.set(0); };

  return (
    <motion.span className="magnetic" style={{ x, y }} onPointerMove={move} onPointerLeave={reset}>
      {children}
    </motion.span>
  );
}
