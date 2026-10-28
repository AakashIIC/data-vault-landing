import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import {
  AnimatePresence, animate, motion, useInView, useMotionTemplate, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform,
  type AnimationPlaybackControls,
} from 'motion/react';
import { MOMENTS } from '../data/content';
import { EASE, rise, stagger, waveform } from '../lib/motion';
import { Icon } from '../components/Icon';
import { Magnetic } from '../components/Magnetic';

const LOOP = 20;
const NB = 120;
const WORDS = ['Hear', 'what', 'your', 'customers'];

const word = {
  hidden: { opacity: 0, y: 28, filter: 'blur(8px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.75, ease: EASE } },
};

export function Hero() {
  const reduce = useReducedMotion();
  const heroRef = useRef<HTMLDivElement>(null);
  const barsRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const ctrl = useRef<AnimationPlaybackControls | null>(null);
  const curRef = useRef(0);
  const [cur, setCur] = useState(0);
  const [videoOk, setVideoOk] = useState(true);
  const heights = useMemo(() => waveform(NB, 11, [42, 54]), []);
  const timelineVisible = useInView(timelineRef, { amount: 0.1 });

  // Scroll parallax: copy drifts up and fades, the video slowly zooms
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  // Spotlight that trails the pointer
  const mx = useSpring(useMotionValue(50), { stiffness: 80, damping: 20 });
  const my = useSpring(useMotionValue(30), { stiffness: 80, damping: 20 });
  const spotlight = useMotionTemplate`radial-gradient(600px circle at ${mx}% ${my}%, #8076ee33, transparent 60%)`;
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width) * 100);
    my.set(((e.clientY - r.top) / r.height) * 100);
  };

  // Playhead position (0–1) drives the bars and the current moment
  const t = useMotionValue(MOMENTS[0].at);
  const playheadLeft = useTransform(t, v => `${v * 100}%`);
  const paint = useCallback((v: number) => {
    const kids = barsRef.current?.children ?? [];
    for (let k = 0; k < kids.length; k++) kids[k].classList.toggle('on', k / NB <= v);
    let m = 0;
    MOMENTS.forEach((mm, i) => { if (v >= mm.at) m = i; });
    if (m !== curRef.current) { curRef.current = m; setCur(m); }
  }, []);

  useEffect(() => {
    const unsub = t.on('change', paint);
    paint(t.get());
    if (reduce) return unsub;
    const c = animate(t, [0, 1], { duration: LOOP, ease: 'linear', repeat: Infinity });
    c.time = MOMENTS[0].at * LOOP;
    ctrl.current = c;
    return () => { c.stop(); unsub(); ctrl.current = null; };
  }, [t, paint, reduce]);

  // Pause the loop while the timeline is off screen
  useEffect(() => {
    const c = ctrl.current;
    if (!c) return;
    if (timelineVisible) c.play(); else c.pause();
  }, [timelineVisible]);

  const jump = (i: number) => {
    if (ctrl.current) ctrl.current.time = MOMENTS[i].at * LOOP + 0.01;
    else { t.set(MOMENTS[i].at); }
    curRef.current = i;
    setCur(i);
  };
  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const j = (i + (e.key === 'ArrowRight' ? 1 : -1) + MOMENTS.length) % MOMENTS.length;
    jump(j);
    document.getElementById(`mk-${j}`)?.focus();
  };

  const m = MOMENTS[cur];
  return (
    <div className="hero on-dark" id="top" ref={heroRef} onPointerMove={onMove}>
      {videoOk && (
        <motion.video
          className="hero-video"
          style={{ scale: videoScale }}
          src="/media/hero-loop.mp4"
          poster="/media/hero-loop.jpg"
          autoPlay={!reduce}
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          onError={() => setVideoOk(false)}
        />
      )}
      <div className="hero-shade" aria-hidden="true" />
      <motion.div className="spotlight" style={{ background: spotlight }} aria-hidden="true" />
      <div className="glow" aria-hidden="true" />

      <div className="wrap">
        <motion.div className="hero-top" style={{ y: copyY, opacity: copyOpacity }}>
          <motion.h1 variants={stagger(0.07)} initial="hidden" animate="show">
            {WORDS.map(w => (
              <span key={w}><motion.span className="w" variants={word}>{w}</motion.span>{' '}</span>
            ))}
            <motion.span className="w hl" variants={word}>actually</motion.span>{' '}
            <motion.span className="w hl shimmer" variants={word}>said.</motion.span>
          </motion.h1>
          <motion.div className="hero-side" variants={stagger(0.1, 0.45)} initial="hidden" animate="show">
            <motion.p variants={rise(16, 0.6)}>
              Data Vault AI analyses every sales call for sentiment, objections and buying intent, then tells your team who to follow up with and how.
            </motion.p>
            <motion.div className="hero-cta" variants={rise(16, 0.6)}>
              <Magnetic><a className="btn btn-hero" href="#demo">Book a demo <Icon id="i-arrow" /></a></Magnetic>
              <Magnetic><a className="btn btn-line" href="#film"><Icon id="i-play" className="play-ic" />Watch the film</a></Magnetic>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          className="timeline"
          ref={timelineRef}
          initial={{ opacity: 0, y: 60, rotateX: 18 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 1, delay: 0.55, ease: EASE }}
        >
          <div className="tl-head">
            <span className="rec"><i />CALL 4,812</span>
            <span><b>Rohan Kapoor</b> · Inverter AC enquiry · Agent Priya S.</span>
            <span className="hint">Click a marker to jump to that moment</span>
          </div>
          <div className="scrub" role="tablist" aria-label="Moments in this call">
            <div className="bars" ref={barsRef} aria-hidden="true">
              {heights.map((h, i) => (
                <motion.span
                  key={i}
                  style={{ height: `${h}%` }}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 + i * 0.005, ease: EASE }}
                />
              ))}
            </div>
            <motion.div className="playhead" style={{ left: playheadLeft }} aria-hidden="true" />
            {MOMENTS.map((mm, i) => (
              <button
                key={mm.time}
                id={`mk-${i}`}
                className="marker"
                type="button"
                role="tab"
                style={{ left: `${mm.at * 100}%` }}
                aria-selected={i === cur}
                tabIndex={i === cur ? 0 : -1}
                aria-label={`${mm.time} ${mm.tag[1]}`}
                onClick={() => jump(i)}
                onKeyDown={e => onKey(e, i)}
              >
                <span>{i + 1}</span>
              </button>
            ))}
          </div>
          <div className="tl-times num" aria-hidden="true"><span>00:00</span><span>06:42</span></div>
          <div className="moment" role="tabpanel" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={cur} className="moment-in" variants={stagger(0.07)} initial="hidden" animate="show" exit={{ opacity: 0, transition: { duration: 0.15 } }}>
                <div className="quote">
                  <motion.span className="who num" variants={rise(10)}>{m.time} · {m.who}</motion.span>
                  <motion.blockquote variants={rise(10)}>“{m.quote}”</motion.blockquote>
                </div>
                <div className="insight">
                  <motion.small variants={rise(10)}>What Data Vault found</motion.small>
                  <motion.span className={`tag ${m.tag[0]}`} variants={{ hidden: { opacity: 0, scale: 0.6 }, show: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 500, damping: 22 } } }}>{m.tag[1]}</motion.span>
                  <motion.strong variants={rise(10)}>{m.title}</motion.strong>
                  <motion.p variants={rise(10)}>{m.body}</motion.p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
