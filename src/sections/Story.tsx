import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode } from 'react';
import { AnimatePresence, LayoutGroup, motion, useScroll, useTransform } from 'motion/react';
import { AFTER, ANSWERS, BEFORE, FAQS } from '../data/content';
import { CountUp, EASE, Reveal, rise, stagger } from '../lib/motion';
import { Icon } from '../components/Icon';

/* ───────────── Before / after Monday ───────────── */
export function Monday() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const afterY = useTransform(scrollYProgress, [0, 1], [80, -30]);
  const beforeY = useTransform(scrollYProgress, [0, 1], [0, 20]);

  const list = (rows: [string, string][], delay: number) => (
    <motion.ol variants={stagger(0.12, delay)} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }}>
      {rows.map(([t, s]) => <motion.li key={t} variants={rise(10)}><time>{t}</time><span>{s}</span></motion.li>)}
    </motion.ol>
  );
  return (
    <div className="ba" ref={ref}>
      <motion.div className="before" style={{ y: beforeY }}>
        <span className="label">Before</span>
        <h3>Sampling recordings and guessing</h3>
        {list(BEFORE, 0)}
        <div className="total"><b className="num">3h</b><span>to review a small sample</span></div>
      </motion.div>
      <motion.div className="after" style={{ y: afterY }}>
        <span className="label">With Data Vault</span>
        <h3>Every call read before you log in</h3>
        {list(AFTER, 0.5)}
        <div className="total"><b className="num"><CountUp value="10" /> min</b><span>with every call covered</span></div>
      </motion.div>
    </div>
  );
}

/* ───────────── Ask your calls ───────────── */
export function Ask() {
  const [i, setI] = useState(1);
  const [thinking, setThinking] = useState(false);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) { first.current = false; return; }
    setThinking(true);
    const t = setTimeout(() => setThinking(false), 800);
    return () => clearTimeout(t);
  }, [i]);

  const a = ANSWERS[i];
  return (
    <div className="ask">
      <Reveal>
        <LayoutGroup id="questions">
          <div className="questions" role="group" aria-label="Sample questions">
            {ANSWERS.map((x, j) => (
              <motion.button key={x.q} className="q" type="button" aria-pressed={i === j} onClick={() => setI(j)} whileHover={{ x: i === j ? 0 : 4 }}>
                {i === j && <motion.span layoutId="q-on" className="q-on" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
                <Icon id="i-msg" />
                <span className="q-text">{x.q}</span>
              </motion.button>
            ))}
          </div>
        </LayoutGroup>
        <p className="sample">Sample answers from demo data.</p>
      </Reveal>
      <Reveal className="chat" delay={0.1}>
        <div className="chat-top">Data Vault Chat<div className="ctx"><span>Project: Electronics</span><span>Last 7 days</span></div></div>
        <AnimatePresence mode="wait">
          <motion.div key={`q${i}`} className="msg-user" initial={{ opacity: 0, x: 24, scale: 0.96 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, ease: EASE }}>
            {a.q}
          </motion.div>
        </AnimatePresence>
        <AnimatePresence mode="wait">
          {thinking ? (
            <motion.span key="typing" className="typing" aria-label="Thinking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><i /><i /><i /></motion.span>
          ) : (
            <motion.div key={`a${i}`} className="msg-ai" variants={stagger(0.09)} initial="hidden" animate="show" exit={{ opacity: 0 }} aria-live="polite">
              <motion.div className="ans-num" variants={rise(10)}>{a.big}</motion.div>
              <motion.p variants={rise(10)}>{a.lead}</motion.p>
              <ul>{a.items.map(t => <motion.li key={t} variants={rise(8)}>{t}</motion.li>)}</ul>
              <motion.span className="src" variants={rise(8)}>{a.src}</motion.span>
            </motion.div>
          )}
        </AnimatePresence>
      </Reveal>
    </div>
  );
}

/* ───────────── Roles ───────────── */
const SEATS: { role: string; sub: string; title: string; points: string[]; route: string; mini: () => ReactNode }[] = [
  {
    role: 'Team lead', sub: 'Coach agents and chase hot leads', title: 'Know which calls need you before stand-up.',
    points: ['Daily Snapshot shows sentiment and top issues for every call', 'Hot leads arrive with a suggested next step', 'Open the exact moment a deal went wrong'],
    route: 'Daily Snapshot · Lead Management · Agent Calls',
    mini: () => (
      <>
        <motion.div className="card" variants={rise(16)}><small>Today’s calls</small><div className="row"><CountUp className="big" value="1,284" /><span className="prio hot">57 HOT</span></div></motion.div>
        <motion.div className="card" variants={rise(16)}><small>Needs your attention</small>
          <div className="row"><b>Imran Shaikh</b><span className="down-txt">Sentiment ↓</span></div>
          <div className="row"><b>Sneha Rao</b><span>Callback 6 pm</span></div>
          <div className="row"><b>Rohan Kapoor</b><span>Offer by Fri</span></div>
        </motion.div>
      </>
    ),
  },
  {
    role: 'Admin', sub: 'Run projects, products and access', title: 'See every project, product and campaign in one place.',
    points: ['Compare projects and products on enquiries and sentiment', 'Control who sees which project', 'Track WhatsApp campaign delivery, reads and replies'],
    route: 'Performance Report · Product Insights · Retargeting',
    mini: () => (
      <>
        <motion.div className="card" variants={rise(16)}><small>Positive sentiment by project</small>
          {([['Electronics', 68, 'var(--violet)'], ['Home appliances', 61, 'var(--violet-2)'], ['Kitchen', 54, '#975cd7']] as const).map(([n, v, c], k) => (
            <div key={n} className="proj">
              <div className="row"><span>{n}</span><b className="num"><CountUp value={`${v}%`} /></b></div>
              <div className="track"><motion.i style={{ width: `${v}%`, background: c }} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.8, delay: 0.2 + k * 0.1, ease: EASE }} /></div>
            </div>
          ))}
        </motion.div>
        <div className="two">
          <motion.div className="card" variants={rise(16)}><small>Campaigns live</small><CountUp className="big" value="6" /></motion.div>
          <motion.div className="card" variants={rise(16)}><small>Reply rate</small><CountUp className="big" value="29%" /></motion.div>
        </div>
      </>
    ),
  },
  {
    role: 'Sales agent', sub: 'Prepare for the next call', title: 'Walk into every callback knowing the last conversation.',
    points: ['Search any lead by name, phone or ID', 'Read a two-line summary instead of replaying the call', 'See the objection to handle and the offer to make'],
    route: 'Lead Search · Data Vault',
    mini: () => (
      <>
        <motion.div className="card" variants={rise(16)}><small>Before you call Rohan</small><p className="note">Online price was lower than your quote. Offer free installation and the 5-year warranty.</p><div className="topics"><span className="topic">Price objection</span><span className="topic">Warranty</span></div></motion.div>
        <motion.div className="card" variants={rise(16)}><div className="row"><b className="wa-last"><svg width="16" height="16" aria-hidden="true"><use href="#i-wa" /></svg>Last message</b><span>Read 10:42</span></div></motion.div>
      </>
    ),
  },
];

export function Seats() {
  const [i, setI] = useState(0);
  const onKey = (e: KeyboardEvent<HTMLButtonElement>, j: number) => {
    if (!['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft'].includes(e.key)) return;
    e.preventDefault();
    const k = (j + (e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : -1) + SEATS.length) % SEATS.length;
    setI(k);
    document.getElementById(`seat-${k}`)?.focus();
  };
  const s = SEATS[i];
  return (
    <Reveal className="seats">
      <LayoutGroup id="seats">
        <div className="seat-list" role="tablist" aria-label="Roles">
          {SEATS.map((x, j) => (
            <button key={x.role} id={`seat-${j}`} className="seat" type="button" role="tab" aria-selected={i === j} tabIndex={i === j ? 0 : -1} onClick={() => setI(j)} onKeyDown={e => onKey(e, j)}>
              {i === j && <motion.span layoutId="seat-on" className="seat-on" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
              <b>{x.role}</b><span>{x.sub}</span>
            </button>
          ))}
        </div>
      </LayoutGroup>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={i} className="seat-view" role="tabpanel" aria-labelledby={`seat-${i}`} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35, ease: EASE }}>
          <motion.div className="seat-copy" variants={stagger(0.05)} initial="hidden" animate="show">
            <motion.span className="eyebrow" variants={rise(10)}>{s.role}</motion.span>
            <motion.h3 variants={rise(10)}>{s.title}</motion.h3>
            <ul>{s.points.map(p => <motion.li key={p} variants={rise(10)}><Icon id="i-check" /><span>{p}</span></motion.li>)}</ul>
            <motion.span className="route" variants={rise(10)}>{s.route}</motion.span>
          </motion.div>
          <motion.div className="mini" variants={stagger(0.1, 0.1)} initial="hidden" animate="show">{s.mini()}</motion.div>
        </motion.div>
      </AnimatePresence>
    </Reveal>
  );
}

/* ───────────── FAQ + demo form ───────────── */
function Faq({ q, a, defaultOpen }: { q: string; a: string; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const id = `faq-${q.length}-${q.charCodeAt(0)}`;
  return (
    <div className="faq-item">
      <h3>
        <button type="button" className="faq-q" aria-expanded={open} aria-controls={id} onClick={() => setOpen(o => !o)}>
          {q}
          <motion.span className="faq-plus" animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.25, ease: EASE }} aria-hidden="true">+</motion.span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div id={id} className="faq-a" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: EASE }}>
            <p>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Close() {
  const [msg, setMsg] = useState<{ cls: '' | 'err' | 'ok'; text: string }>({ cls: '', text: 'We reply within one business day.' });
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = nameRef.current;
    const email = emailRef.current;
    if (!name || !email) return;
    if (!name.value.trim()) { setMsg({ cls: 'err', text: 'Enter your name.' }); name.focus(); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { setMsg({ cls: 'err', text: 'Enter a work email like you@company.com.' }); email.focus(); return; }
    setMsg({ cls: 'ok', text: 'Looks good. This preview doesn’t send requests yet; connect the form to your sales inbox.' });
  };

  return (
    <div className="wrap close">
      <Reveal>
        <div className="head head-1"><div><span className="eyebrow">FAQ</span><h2>Before you book</h2></div></div>
        <div className="faq">{FAQS.map(([q, a], j) => <Faq key={q} q={q} a={a} defaultOpen={j === 0} />)}</div>
      </Reveal>
      <Reveal className="demo-card" id="demo" delay={0.1}>
        <span className="eyebrow">Book a demo</span>
        <h2>Bring three recordings. We’ll analyse them live.</h2>
        <p>In 30 minutes you’ll see the sentiment, lead ranking and follow-ups Data Vault finds in your own calls.</p>
        <form className="form" noValidate onSubmit={submit}>
          <div className="row2">
            <div className="field"><label htmlFor="name">Name</label><input id="name" ref={nameRef} autoComplete="name" /></div>
            <div className="field"><label htmlFor="email">Work email</label><input id="email" ref={emailRef} type="email" autoComplete="email" placeholder="you@company.com" /></div>
          </div>
          <div className="field">
            <label htmlFor="size">Sales team size</label>
            <select id="size" defaultValue="11–50 agents"><option>1–10 agents</option><option>11–50 agents</option><option>51–200 agents</option><option>200+ agents</option></select>
          </div>
          <motion.button className="btn btn-primary" type="submit" whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>Request demo</motion.button>
          <p className={`fmsg ${msg.cls}`} role="status">
            <motion.span key={msg.text} className="fmsg-in" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>{msg.text}</motion.span>
          </p>
        </form>
      </Reveal>
    </div>
  );
}
