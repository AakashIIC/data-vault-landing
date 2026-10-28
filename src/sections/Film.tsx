import { useEffect, useRef } from 'react';
import { Player, type PlayerRef } from '@remotion/player';
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { FILM, ProductFilm } from '../film/ProductFilm';

// The product film is a Remotion composition rendered live in the page, so it stays crisp and editable as code
export function Film() {
  const reduce = useReducedMotion();
  const frameRef = useRef<HTMLDivElement>(null);
  const player = useRef<PlayerRef>(null);
  const inView = useInView(frameRef, { amount: 0.5 });

  const { scrollYProgress } = useScroll({ target: frameRef, offset: ['start end', 'center center'] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.86, 1]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [14, 0]);

  // Play while on screen, pause when scrolled away
  useEffect(() => {
    const p = player.current;
    if (!p || reduce) return;
    if (inView) p.play(); else p.pause();
  }, [inView, reduce]);

  return (
    <motion.div className="film-frame" ref={frameRef} style={{ scale, rotateX, transformPerspective: 1400 }}>
      <Player
        ref={player}
        component={ProductFilm}
        durationInFrames={FILM.durationInFrames}
        fps={FILM.fps}
        compositionWidth={FILM.width}
        compositionHeight={FILM.height}
        style={{ width: '100%', aspectRatio: `${FILM.width} / ${FILM.height}` }}
        controls
        loop
        clickToPlay
      />
    </motion.div>
  );
}
