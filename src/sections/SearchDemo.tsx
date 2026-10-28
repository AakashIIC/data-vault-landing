import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'motion/react';
import { CHIPS, SENT, findLeads } from '../data/content';
import { rise, stagger } from '../lib/motion';
import { Icon } from '../components/Icon';

const SAMPLES: [string, string][] = [['price objection', 'price'], ['Priya S.', 'priya'], ['EMI', 'emi'], ['delivery', 'delivery']];

export function SearchDemo() {
  const reduce = useReducedMotion();
  const [query, setQuery] = useState('price objection');
  const [term, setTerm] = useState('price');
  const [sel, setSel] = useState(0);
  const [chip, setChip] = useState<string | null>(null);
  const [auto, setAuto] = useState(!reduce);
  const results = useMemo(() => findLeads(term), [term]);
  const lead = results[Math.min(sel, results.length - 1)];

  // Typed intro: cycles sample searches until the visitor interacts
  useEffect(() => {
    if (!auto) return;
    let qi = 0;
    let ci = SAMPLES[0][0].length;
    let deleting = true;
    let timer: number;
    const step = () => {
      const w = SAMPLES[qi][0];
      if (!deleting) {
        ci++;
        setQuery(w.slice(0, ci));
        if (ci === w.length) {
          setTerm(SAMPLES[qi][1]);
          setSel(0);
          deleting = true;
          timer = window.setTimeout(step, 2800);
          return;
        }
        timer = window.setTimeout(step, 75);
      } else {
        ci--;
        setQuery(w.slice(0, ci));
        if (ci === 0) {
          deleting = false;
          qi = (qi + 1) % SAMPLES.length;
          timer = window.setTimeout(step, 300);
          return;
        }
        timer = window.setTimeout(step, 28);
      }
    };
    timer = window.setTimeout(step, 3400);
    return () => clearTimeout(timer);
  }, [auto]);

  const stop = () => setAuto(false);

  return (
    <div className="search" role="search">
      <div className="search-bar">
        <Icon id="i-search" />
        <label htmlFor="q" className="sr">Search leads and calls</label>
        <input
          id="q"
          type="search"
          autoComplete="off"
          value={query}
          placeholder="Search by customer, agent, phone, lead ID or topic"
          onFocus={stop}
          onChange={e => { stop(); setChip(null); setQuery(e.target.value); setTerm(e.target.value); setSel(0); }}
        />
        {auto && <span className="caret" aria-hidden="true" />}
        <span className="kbd">Enter</span>
      </div>
      <div className="suggest">
        <span>Try</span>
        {CHIPS.map(([label, key]) => (
          <motion.button
            key={label}
            type="button"
            className="chip"
            aria-pressed={chip === label}
            whileTap={{ scale: 0.94 }}
            onClick={() => { stop(); setChip(label); setQuery(label); setTerm(key); setSel(0); }}
          >
            {label}
          </motion.button>
        ))}
      </div>
      <div className="results" onPointerDown={stop}>
        {results.length === 0 || !lead ? (
          <motion.div className="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <b>No leads match “{query}”.</b>Try a customer name, an agent, a product or a topic like EMI.
          </motion.div>
        ) : (
          <>
            <LayoutGroup id="hits">
              <motion.div className="list" role="listbox" aria-label="Matching leads" key={term} variants={stagger(0.05)} initial="hidden" animate="show">
                <span className="meta num">{results.length} lead{results.length > 1 ? 's' : ''} · sorted by priority</span>
                {results.map((l, i) => (
                  <motion.button key={l.id} className="hit" type="button" role="option" aria-selected={l === lead} onClick={() => setSel(i)} variants={rise(8)}>
                    {l === lead && <motion.span layoutId="hit-bg" className="hit-bg" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
                    <span className="av">{l.ini}</span>
                    <div><b>{l.name}</b><small>{l.product} · {l.agent}</small></div>
                    <span className={`prio ${l.prio}`}>{l.prio.toUpperCase()}</span>
                  </motion.button>
                ))}
              </motion.div>
            </LayoutGroup>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={lead.id} className="detail" aria-live="polite" variants={stagger(0.05)} initial="hidden" animate="show" exit={{ opacity: 0, x: 12, transition: { duration: 0.15 } }}>
                <motion.div className="d-head" variants={rise(10)}>
                  <h3>{lead.name}</h3>
                  <span className={`prio ${lead.prio}`}>{lead.prio.toUpperCase()}</span>
                  <span className="ids">{lead.id} · {lead.phone}</span>
                </motion.div>
                <motion.div className="facts" variants={rise(10)}>
                  <div className="fact"><small>Sentiment</small><b><span className="dot" style={{ background: SENT[lead.sent][0] }} />{SENT[lead.sent][1]}</b></div>
                  <div className="fact"><small>Product</small><b>{lead.product}</b></div>
                  <div className="fact"><small>Agent</small><b>{lead.agent}</b></div>
                  <div className="fact"><small>Calls</small><b className="num">{lead.calls}</b></div>
                </motion.div>
                <motion.p className="summary" variants={rise(10)}>
                  {lead.pre}
                  <motion.mark initial={{ backgroundSize: '0% 100%' }} animate={{ backgroundSize: '100% 100%' }} transition={{ duration: 0.6, delay: 0.35 }}>{lead.mark}</motion.mark>
                  {lead.post}
                </motion.p>
                <motion.div className="topics" variants={rise(10)}>{lead.topics.map(t => <span className="topic" key={t}>{t}</span>)}</motion.div>
                <motion.div className="nextstep" variants={rise(10)}><Icon id="i-spark" /><span><b>Next step:</b> {lead.next}</span></motion.div>
              </motion.div>
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
}
