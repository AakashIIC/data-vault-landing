import { motion, useMotionValueEvent, useScroll, useSpring } from 'motion/react';
import { useState } from 'react';
import { EASE } from '../lib/motion';

const LINKS = [
  ['#top-calls', 'Top calls'],
  ['#how', 'How it works'],
  ['#modules', 'Modules'],
  ['#film', 'Watch'],
  ['#ask', 'Ask your calls'],
] as const;

export function Header() {
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });
  const [hidden, setHidden] = useState(false);

  // Hide the bar while scrolling down past the hero, bring it back on any upward scroll
  useMotionValueEvent(scrollY, 'change', y => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 640);
  });

  return (
    <>
      <motion.div className="progress" style={{ scaleX: progress }} aria-hidden="true" />
      <motion.header
        className="top on-dark"
        animate={{ y: hidden ? -72 : 0 }}
        transition={{ duration: 0.35, ease: EASE }}
      >
        <div className="wrap">
          <a className="brand" href="#top" aria-label="Data Vault AI home">
            <svg aria-hidden="true" fill="#c9c4ff"><use href="#logo" /></svg>
            Data Vault AI
          </a>
          <nav aria-label="Sections">
            {LINKS.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
          </nav>
          <a className="signin" href="#demo">Sign in</a>
        </div>
      </motion.header>
    </>
  );
}
