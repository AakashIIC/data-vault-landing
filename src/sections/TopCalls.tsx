import { useState } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'motion/react';
import { BOTTOM_CALLS, SENT, TC_SIDE, TOP_CALLS, scoreColor } from '../data/content';
import { CountUp, EASE, rise, stagger } from '../lib/motion';
import { Icon } from '../components/Icon';

type Mode = 'top' | 'bottom';

export function TopCalls() {
  const [mode, setMode] = useState<Mode>('top');
  const [open, setOpen] = useState(0);
  const rows = mode === 'top' ? TOP_CALLS : BOTTOM_CALLS;
  const side = TC_SIDE[mode];

  const switchMode = (m: Mode) => {
    if (m === mode) return;
    setMode(m);
    setOpen(0);
  };

  return (
    <div className="tc-wrap">
      <div className="tc">
        <div className="tc-bar">
          <h3>Top Calls Analysis</h3>
          <span className="pill">This week · 1,284 calls</span>
          <LayoutGroup id="tc-seg">
            <div className="seg" role="group" aria-label="Show top or bottom calls">
              {(['top', 'bottom'] as const).map(m => (
                <button key={m} type="button" aria-pressed={mode === m} onClick={() => switchMode(m)}>
                  {mode === m && <motion.span layoutId="seg-thumb" className="seg-thumb" transition={{ type: 'spring', stiffness: 420, damping: 32 }} />}
                  <span className="seg-label">{m === 'top' ? 'Top 10' : 'Bottom 10'}</span>
                </button>
              ))}
            </div>
          </LayoutGroup>
        </div>
        <div className="tc-head" aria-hidden="true">
          <span>#</span><span>Call</span><span>Agent</span><span className="c-dur">Length</span><span>Pitch score</span><span className="c-sent">Sentiment</span><span />
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.ol
            key={mode}
            className="tc-list"
            variants={stagger(0.04)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            exit={{ opacity: 0, y: -8, transition: { duration: 0.18 } }}
          >
            {rows.map((r, i) => (
              <motion.li key={r.customer} variants={rise(10)}>
                <button type="button" className="tc-row" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
                  <span className={`rank num${mode === 'top' && i < 3 ? ` r${i + 1}` : ''}`}>{i + 1}</span>
                  <span className="tc-call"><b>{r.customer}</b><small>{r.product}</small></span>
                  <span className="tc-agent">{r.agent}</span>
                  <span className="tc-dur num">{r.length}</span>
                  <span className="score">
                    <div>
                      <motion.i
                        style={{ width: `${r.score}%`, background: scoreColor(r.score) }}
                        variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 0.9, ease: EASE, delay: 0.1 } } }}
                      />
                    </div>
                    <CountUp value={String(r.score)} className="score-n" />
                  </span>
                  <span className="sent"><span className="dot" style={{ background: SENT[r.sentiment][0] }} />{SENT[r.sentiment][1]}</span>
                  <Icon id="i-chev" className="chev" />
                </button>
                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div
                      className="tc-more-wrap"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: EASE }}
                    >
                      <div className="tc-more">
                        <span className="play-btn" aria-hidden="true"><Icon id="i-play" /></span>
                        <div>
                          <p><b>Why it ranked {mode === 'top' ? 'high' : 'low'}:</b> {r.why}</p>
                          <div className="topics">{r.topics.map(t => <span className="topic" key={t}>{t}</span>)}</div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.li>
            ))}
          </motion.ol>
        </AnimatePresence>
      </div>

      <aside className="tc-side" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={mode} className="tc-side-in" variants={stagger(0.08)} initial="hidden" animate="show" exit={{ opacity: 0, transition: { duration: 0.15 } }}>
            <motion.small variants={rise(8)}>{side.label}</motion.small>
            <motion.div className="avg" variants={rise(8)}><CountUp value={String(side.avg)} /><span>/ 100</span></motion.div>
            <motion.h4 variants={rise(8)}>{side.title}</motion.h4>
            <ul>
              {side.items.map(t => (
                <motion.li key={t} variants={rise(8)}>
                  <svg aria-hidden="true" style={{ color: side.color }}><use href={`#${side.icon}`} /></svg>
                  <span>{t}</span>
                </motion.li>
              ))}
            </ul>
            <motion.span className="src" variants={rise(8)}>Scores come from pitch quality, objection handling and next steps.</motion.span>
          </motion.div>
        </AnimatePresence>
      </aside>
    </div>
  );
}
