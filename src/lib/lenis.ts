import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const HEADER_OFFSET = -64;
let lenis: Lenis | null = null;

// Smooth-scrolls to a section, falling back to native scrolling when Lenis is off
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: HEADER_OFFSET });
  else el.scrollIntoView({ behavior: 'auto' });
}

// One Lenis instance driven by GSAP's ticker, so ScrollTrigger and Motion read the same scroll position
export function useSmoothScroll() {
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const instance = new Lenis({ duration: 1.15, anchors: { offset: HEADER_OFFSET } });
    lenis = instance;
    instance.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      instance.destroy();
      lenis = null;
    };
  }, []);
}
