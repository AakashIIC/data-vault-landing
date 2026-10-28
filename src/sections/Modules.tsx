import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react';
import type { PointerEvent, ReactNode } from 'react';
import { DEMANDS, MODULES, type Module } from '../data/content';
import { CountUp, EASE, rise, stagger } from '../lib/motion';
import { scrollToId } from '../lib/lenis';
import { Icon } from '../components/Icon';

const openTour = (i: number) => {
  window.dispatchEvent(new CustomEvent<number>('tour:open', { detail: i }));
  scrollToId('tour');
};

// 3D tilt with a glare that follows the pointer
function Tilt({ children, className }: { children: ReactNode; className: string }) {
  const reduce = useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rx = useSpring(useTransform(py, [0, 1], [6, -6]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(px, [0, 1], [-8, 8]), { stiffness: 200, damping: 20 });
  const gx = useTransform(px, v => `${v * 100}%`);
  const gy = useTransform(py, v => `${v * 100}%`);
  const glare = useMotionTemplate`radial-gradient(360px circle at ${gx} ${gy}, #ffffff22, transparent 60%)`;

  const move = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const leave = () => { px.set(0.5); py.set(0.5); };

  return (
    <motion.div className={className} variants={rise(24, 0.6)} onPointerMove={move} onPointerLeave={leave} style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}>
      {children}
      <motion.span className="glare" style={{ background: glare }} aria-hidden="true" />
    </motion.div>
  );
}

function ModuleCard({ m }: { m: Module }) {
  const inner = (
    <>
      <span className="mod-ic"><Icon id={m.icon} /></span>
      <h3>{m.name}</h3>
      <p>{m.text}</p>
      <span className="who"><span>{m.who}</span><span className="go">See it <Icon id="i-arrow" /></span></span>
    </>
  );
  return (
    <motion.div className="mod-cell" variants={rise(24, 0.6)} whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
      {m.tour !== undefined
        ? <button type="button" className="mod" onClick={() => openTour(m.tour!)}>{inner}</button>
        : <a className="mod" href={m.href}>{inner}</a>}
    </motion.div>
  );
}

export function Modules() {
  return (
    <div>
      <motion.div className="mods" variants={stagger(0.07)} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }}>
        <Tilt className="mod feature">
          <span className="badge">FLAGSHIP</span>
          <span className="mod-ic"><Icon id="i-vault" /></span>
          <h3>Data Vault +</h3>
          <p>The deep view of your customers across a quarter: who they are, what they keep asking for, what blocks them and how urgent they are. Export it all as a PDF report.</p>
          <div className="subs">
            {['Know Your Leads', 'Customer demands', 'Recurring issues', 'Urgency levels', 'Buying intent', 'Agent deep dive', 'PDF reports'].map(s => <span key={s}>{s}</span>)}
          </div>
          <div className="demands">
            <small>Top customer demands · this quarter</small>
            {DEMANDS.map(([n, v], i) => (
              <div className="dem" key={n}>
                <span>{n}</span>
                <div>
                  <motion.i
                    style={{ width: `${(v / 38) * 100}%` }}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.3 + i * 0.12, ease: EASE }}
                  />
                </div>
                <b><CountUp value={`${v}%`} /></b>
              </div>
            ))}
          </div>
          <span className="who"><span>Admins · Team leads</span></span>
        </Tilt>
        {MODULES.map(m => <ModuleCard key={m.name} m={m} />)}
      </motion.div>
      <motion.div className="utils" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
        <span>Also included</span>
        <span className="util"><Icon id="i-file" />Generated Reports</span>
        <span className="util"><Icon id="i-bookmark" />Bookmarks</span>
        <span className="util"><Icon id="i-chart" />Usage Stats</span>
        <span className="util"><Icon id="i-spark" />What’s New</span>
      </motion.div>
    </div>
  );
}
