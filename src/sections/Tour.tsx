import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { AnimatePresence, animate, motion, useInView, useReducedMotion, type AnimationPlaybackControls } from 'motion/react';
import { LEADS } from '../data/content';
import { CountUp, EASE, rise, stagger } from '../lib/motion';
import { Icon } from '../components/Icon';

const DUR = 7;
const item = rise(14);
const grow = (delay: number) => ({ initial: { scaleX: 0 }, animate: { scaleX: 1 }, transition: { duration: 0.8, delay, ease: EASE } });

function Donut() {
  const C = 2 * Math.PI * 15.9;
  const segs: [number, string][] = [[68, 'var(--pos)'], [21, 'var(--neu)'], [11, 'var(--neg)']];
  let off = 0;
  return (
    <svg viewBox="0 0 42 42" role="img" aria-label="Positive 68%, neutral 21%, negative 11%">
      {segs.map(([v, c], i) => {
        const start = off;
        off += v;
        return (
          <motion.circle
            key={c}
            cx="21" cy="21" r="15.9" fill="none" stroke={c} strokeWidth="6"
            strokeDashoffset={(-start / 100) * C}
            initial={{ strokeDasharray: `0 ${C}` }}
            animate={{ strokeDasharray: `${(v / 100) * C} ${C}` }}
            transition={{ duration: 0.9, delay: 0.25 + i * 0.2, ease: EASE }}
          />
        );
      })}
    </svg>
  );
}

const TABS: { name: string; sub: string; body: () => ReactNode }[] = [
  {
    name: 'Daily Snapshot', sub: 'How today went', body: () => (
      <>
        <motion.div className="pane-title" variants={item}><h3>Daily Snapshot</h3><span className="pill">Electronics</span><span className="pill">Today</span></motion.div>
        <div className="grid g3">
          <motion.div className="card" variants={item}><small>Calls analysed</small><CountUp className="stat" value="1,284" /><span className="delta up">↑ 8% vs yesterday</span></motion.div>
          <motion.div className="card" variants={item}><small>Positive sentiment</small><CountUp className="stat" value="68%" /><span className="delta up">↑ 3 pts</span></motion.div>
          <motion.div className="card" variants={item}><small>Hot leads</small><CountUp className="stat" value="57" /><span className="delta down">↓ 4 vs yesterday</span></motion.div>
        </div>
        <div className="grid g2">
          <motion.div className="card" variants={item}><h4>Sentiment</h4>
            <div className="donut"><Donut />
              <div className="legend">
                <span><i className="dot" style={{ background: 'var(--pos)' }} />Positive 68%</span>
                <span><i className="dot" style={{ background: 'var(--neu)' }} />Neutral 21%</span>
                <span><i className="dot" style={{ background: 'var(--neg)' }} />Negative 11%</span>
              </div>
            </div>
          </motion.div>
          <motion.div className="card" variants={item}><h4>Top issues today</h4>
            <span className="tag neg">Price higher than online · 41</span>
            <span className="tag info">Delivery date unclear · 23</span>
            <span className="tag info">EMI eligibility · 9</span>
          </motion.div>
        </div>
      </>
    ),
  },
  {
    name: 'Lead Management', sub: 'Who to call first', body: () => (
      <>
        <motion.div className="pane-title" variants={item}><h3>Lead Management</h3><span className="pill">Sorted by priority</span></motion.div>
        <motion.div className="card scroll" variants={item}>
          <table className="tbl">
            <thead><tr><th>Lead</th><th>Product</th><th>Priority</th><th>Next step</th><th className="r">Calls</th></tr></thead>
            <motion.tbody variants={stagger(0.06, 0.15)}>
              {LEADS.map(l => (
                <motion.tr key={l.id} variants={rise(6)}>
                  <td><b>{l.name}</b></td><td>{l.product}</td><td><span className={`prio ${l.prio}`}>{l.prio.toUpperCase()}</span></td>
                  <td>{l.next.replace(/\.$/, '')}</td><td className="r">{l.calls}</td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
        </motion.div>
      </>
    ),
  },
  {
    name: 'Retargeting', sub: 'Follow up on WhatsApp', body: () => (
      <>
        <motion.div className="pane-title" variants={item}><h3>Weekend AC offer</h3><span className="pill">Campaign · Sent</span></motion.div>
        <div className="grid g2">
          <motion.div className="card" variants={item}><h4>Delivery funnel</h4>
            <div className="funnel">
              {([['Sent', 214, 100, undefined], ['Delivered', 201, 94, undefined], ['Read', 154, 72, 'var(--violet-2)'], ['Replied', 62, 29, '#975cd7']] as const).map(([n, v, w, c], i) => (
                <div key={n}><span>{n}</span><motion.i style={{ width: `${w}%`, background: c }} {...grow(0.2 + i * 0.1)} /><b><CountUp value={String(v)} /></b></div>
              ))}
            </div>
          </motion.div>
          <motion.div className="card" variants={item}><h4>Message</h4>
            <motion.div className="wa-phone" variants={stagger(0.45, 0.3)}>
              <motion.div className="wa-b" variants={rise(8)}>Hi Rohan, your 1.5 ton inverter AC comes with free installation and a 5-year compressor warranty this week.</motion.div>
              <motion.div className="wa-b me" variants={rise(8)}>Can someone visit on Saturday?</motion.div>
              <motion.div className="wa-meta" variants={rise(8)}><Icon id="i-wa" />Replied in 12 min</motion.div>
            </motion.div>
          </motion.div>
        </div>
      </>
    ),
  },
  {
    name: 'Performance Report', sub: 'Coach with evidence', body: () => (
      <>
        <motion.div className="pane-title" variants={item}><h3>Performance Report</h3><span className="pill">Last 30 days</span></motion.div>
        <motion.div className="card scroll" variants={item}>
          <table className="tbl">
            <thead><tr><th>Agent</th><th className="r">Calls</th><th className="r">Avg. talk time</th><th className="r">Positive</th><th className="r">Converted</th></tr></thead>
            <motion.tbody variants={stagger(0.06, 0.15)}>
              {([['Priya S.', '214', '5:48', '74%', '31'], ['Arjun N.', '198', '4:12', '61%', '22'], ['Meera J.', '176', '3:56', '52%', '17'], ['Karan V.', '151', '3:20', '47%', '11']] as const).map(r => (
                <motion.tr key={r[0]} variants={rise(6)}>
                  <td><b>{r[0]}</b></td><td className="r"><CountUp value={r[1]} /></td><td className="r">{r[2]}</td><td className="r"><CountUp value={r[3]} /></td><td className="r"><CountUp value={r[4]} /></td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
        </motion.div>
        <motion.div className="card" variants={item}><h4>Coaching note</h4><p className="note">Priya leads with installation and warranty before discussing price. Her price objections close at 58% against a team average of 34%.</p></motion.div>
      </>
    ),
  },
  {
    name: 'Chat', sub: 'Ask in plain English', body: () => (
      <>
        <motion.div className="pane-title" variants={item}><h3>Data Vault Chat</h3><span className="pill">Electronics</span><span className="pill">Last 7 days</span></motion.div>
        <motion.div className="card chat-card" variants={stagger(0.4, 0.2)}>
          <motion.div className="msg-user" variants={rise(8)}>Why did we lose leads on ACs last week?</motion.div>
          <motion.div className="msg-ai" variants={rise(8)}>
            <span className="ans-num">41 calls</span>
            <span>mentioned a lower online price before the customer went quiet.</span>
            <span className="src">Based on 312 AC enquiry calls · 14–20 Oct</span>
          </motion.div>
        </motion.div>
      </>
    ),
  },
];

export function Tour() {
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLElement | null>(null);
  const anim = useRef<AnimationPlaybackControls | null>(null);
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(!reduce);
  const [hover, setHover] = useState(false);
  const inView = useInView(rootRef, { amount: 0.3 });

  // The selected tab's progress bar drives auto-advance
  useEffect(() => {
    const bar = barRef.current;
    if (!bar || !playing) return;
    let live = true;
    const a = animate(bar, { width: ['0%', '100%'] }, { duration: DUR, ease: 'linear' });
    anim.current = a;
    a.then(() => { if (live) setI(v => (v + 1) % TABS.length); });
    return () => { live = false; a.stop(); anim.current = null; bar.style.width = '0%'; };
  }, [i, playing]);

  // Pause on hover or when the tour is off screen
  useEffect(() => {
    const a = anim.current;
    if (!a) return;
    if (hover || !inView) a.pause(); else a.play();
  }, [hover, inView, i]);

  // Module cards open a specific screen
  useEffect(() => {
    const on = (e: Event) => { setPlaying(false); setI((e as CustomEvent<number>).detail); };
    window.addEventListener('tour:open', on);
    return () => window.removeEventListener('tour:open', on);
  }, []);

  const pick = (j: number) => { setPlaying(false); setI(j); };
  const onKey = (e: KeyboardEvent<HTMLButtonElement>, j: number) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const k = (j + (e.key === 'ArrowRight' ? 1 : -1) + TABS.length) % TABS.length;
    pick(k);
    document.getElementById(`tab-${k}`)?.focus();
  };

  return (
    <div ref={rootRef} onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)}>
      <div className="tabs" role="tablist" aria-label="Product screens">
        {TABS.map((t, j) => (
          <button
            key={t.name} id={`tab-${j}`} className="tab" type="button" role="tab"
            aria-selected={i === j} aria-controls="pane" tabIndex={i === j ? 0 : -1}
            onClick={() => pick(j)} onKeyDown={e => onKey(e, j)}
          >
            {i === j && <motion.span layoutId="tab-ind" className="tab-ind" transition={{ type: 'spring', stiffness: 380, damping: 34 }} />}
            <b>{t.name}</b>
            <span className="sub">{t.sub}</span>
            <span className="bar"><i ref={i === j ? el => { barRef.current = el; } : undefined} /></span>
          </button>
        ))}
      </div>
      <div className="window">
        <div className="rail" aria-hidden="true">
          <svg fill="#4434dd" width="28" height="32" className="rail-logo"><use href="#logo" /></svg>
          {TABS.map((t, j) => (
            <span key={t.name} className="rail-dot">
              {i === j && <motion.i layoutId="rail-on" className="on" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />}
            </span>
          ))}
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={i} className="pane" id="pane" role="tabpanel" aria-labelledby={`tab-${i}`} tabIndex={0}
            variants={stagger(0.07)} initial="hidden" animate="show"
            exit={{ opacity: 0, y: -10, filter: 'blur(4px)', transition: { duration: 0.2 } }}
          >
            {TABS[i].body()}
          </motion.div>
        </AnimatePresence>
      </div>
      <p className="sample">All names and figures in the tour are sample data.</p>
    </div>
  );
}
