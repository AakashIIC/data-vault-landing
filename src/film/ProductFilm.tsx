import type { CSSProperties, ReactNode } from 'react';
import { AbsoluteFill, Easing, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { waveform } from '../lib/motion';

export const FILM = { fps: 30, width: 1280, height: 720, durationInFrames: 540 } as const;

const C = {
  navy: '#1f2858', deep: '#161d45', violet: '#4434dd', violet2: '#8076ee', ink: '#c9c4ff',
  onNavy: '#c3c9e6', pos: '#8cca81', neg: '#f86565', neu: '#f5a623', white: '#ffffff',
};
const SANS = 'Geist, system-ui, sans-serif';
const MONO = '"Geist Mono", ui-monospace, monospace';
const ease = Easing.bezier(0.22, 1, 0.36, 1);
const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

// Fades a scene in and out over its own local timeline
function Scene({ children, duration }: { children: ReactNode; duration: number }) {
  const f = useCurrentFrame();
  const opacity = interpolate(f, [0, 12, duration - 12, duration], [0, 1, 1, 0], clamp);
  const scale = interpolate(f, [0, duration], [1.02, 1], clamp);
  return <AbsoluteFill style={{ opacity, transform: `scale(${scale})`, fontFamily: SANS, color: C.white }}>{children}</AbsoluteFill>;
}

const rise = (f: number, at: number, dist = 30): CSSProperties => {
  const p = interpolate(f, [at, at + 18], [0, 1], { ...clamp, easing: ease });
  return { opacity: p, transform: `translateY(${(1 - p) * dist}px)` };
};

const Label = ({ children, style }: { children: ReactNode; style?: CSSProperties }) => (
  <div style={{ font: `600 18px/1 ${MONO}`, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.ink, ...style }}>{children}</div>
);

/* 1 · Volume of calls */
const TILES = Array.from({ length: 40 }, (_, i) => waveform(14, i + 3));
function Volume() {
  const f = useCurrentFrame();
  const n = Math.round(interpolate(f, [10, 70], [0, 1284], { ...clamp, easing: ease }));
  return (
    <Scene duration={100}>
      <AbsoluteFill style={{ padding: 80, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <Label style={rise(f, 0)}>Monday · 9:00 am</Label>
        <div style={{ ...rise(f, 6), font: `800 120px/1 ${SANS}`, letterSpacing: '-0.04em' }}>{n.toLocaleString('en-IN')}</div>
        <div style={{ ...rise(f, 12), font: `500 32px/1.3 ${SANS}`, color: C.onNavy }}>sales calls recorded last week. Nobody has time to hear them.</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 10, marginTop: 30 }}>
          {TILES.map((bars, i) => {
            const p = interpolate(f, [20 + i * 1.2, 32 + i * 1.2], [0, 1], clamp);
            return (
              <div key={i} style={{ height: 52, borderRadius: 10, background: '#ffffff0f', display: 'flex', alignItems: 'center', gap: 2, padding: '0 8px', opacity: p, transform: `scale(${0.6 + p * 0.4})` }}>
                {bars.map((h, k) => <span key={k} style={{ flex: 1, height: `${h * 0.7}%`, borderRadius: 2, background: i % 7 === 0 ? C.violet2 : '#ffffff40' }} />)}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </Scene>
  );
}

/* 2 · One call, transcribed */
const CALL = waveform(90, 11, [34, 44]);
const LINES = [
  { at: 18, who: 'Customer', text: 'I saw the 1.5 ton inverter AC in your store last week.' },
  { at: 48, who: 'Customer', text: 'The price online was lower than what I was quoted.' },
  { at: 78, who: 'Agent', text: 'We can include free installation and a 5-year warranty.' },
];
function Transcribe() {
  const f = useCurrentFrame();
  const head = interpolate(f, [0, 120], [0.02, 0.9], clamp);
  return (
    <Scene duration={130}>
      <AbsoluteFill style={{ padding: 80, display: 'flex', flexDirection: 'column', gap: 26 }}>
        <Label style={rise(f, 0)}>Call 4,812 · Rohan Kapoor · Inverter AC</Label>
        <div style={{ position: 'relative', height: 120, display: 'flex', alignItems: 'center', gap: 3 }}>
          {CALL.map((h, i) => (
            <span key={i} style={{ flex: 1, height: `${h}%`, borderRadius: 3, background: i / CALL.length <= head ? C.violet2 : '#ffffff2a', transform: `scaleY(${interpolate(f, [i * 0.15, i * 0.15 + 10], [0, 1], clamp)})` }} />
          ))}
          <div style={{ position: 'absolute', top: -6, bottom: -6, left: `${head * 100}%`, width: 3, background: C.white, boxShadow: `0 0 16px ${C.ink}` }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {LINES.map(l => {
            const shown = Math.max(0, Math.floor((f - l.at) * 2.2));
            if (f < l.at) return null;
            const agent = l.who === 'Agent';
            return (
              <div key={l.at} style={{ ...rise(f, l.at, 16), alignSelf: agent ? 'flex-end' : 'flex-start', maxWidth: 760, padding: '16px 22px', borderRadius: 18, background: agent ? C.violet : '#ffffff14', font: `500 26px/1.35 ${SANS}` }}>
                <div style={{ font: `600 14px/1 ${MONO}`, color: agent ? C.ink : C.onNavy, marginBottom: 8 }}>{l.who.toUpperCase()}</div>
                {l.text.slice(0, shown)}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </Scene>
  );
}

/* 3 · AI tags and sentiment */
const TAGS = [
  { at: 8, text: 'Product · Inverter AC', bg: '#f5f3ff', fg: '#6d28d9', x: 120, y: 170 },
  { at: 20, text: 'Price objection', bg: '#fff1f2', fg: '#9f1239', x: 640, y: 130 },
  { at: 32, text: 'Competitor · online store', bg: '#f5f3ff', fg: '#6d28d9', x: 200, y: 290 },
  { at: 44, text: 'Objection handled', bg: '#ecfdf5', fg: '#047857', x: 700, y: 260 },
  { at: 56, text: 'HOT lead', bg: '#fff1f2', fg: '#9f1239', x: 470, y: 210 },
];
function Analyse() {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const draw = interpolate(f, [30, 100], [1, 0], { ...clamp, easing: ease });
  return (
    <Scene duration={120}>
      <AbsoluteFill style={{ padding: 80 }}>
        <Label style={rise(f, 0)}>What Data Vault found</Label>
        <div style={{ ...rise(f, 4), font: `700 54px/1.1 ${SANS}`, letterSpacing: '-0.03em', marginTop: 16, maxWidth: 900 }}>Every moment that matters, tagged.</div>
        {TAGS.map(t => {
          const s = spring({ frame: f - t.at, fps, config: { damping: 12, stiffness: 180 } });
          return (
            <div key={t.text} style={{ position: 'absolute', left: t.x, top: t.y + 160, padding: '12px 20px', borderRadius: 999, background: t.bg, color: t.fg, font: `700 24px/1 ${SANS}`, transform: `scale(${s})`, opacity: Math.min(1, s * 1.5), boxShadow: '0 20px 40px -20px #0008' }}>
              {t.text}
            </div>
          );
        })}
        <svg viewBox="0 0 1120 140" style={{ position: 'absolute', left: 80, right: 80, bottom: 60, width: 1120 }}>
          <path d="M0 70 C120 66 180 40 280 46 S420 120 520 110 S760 30 1120 18" fill="none" stroke={C.violet2} strokeWidth="6" strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={draw} />
          <text x="0" y="135" fill={C.onNavy} style={{ font: `600 16px ${MONO}` }}>SENTIMENT THROUGH THE CALL</text>
        </svg>
      </AbsoluteFill>
    </Scene>
  );
}

/* 4 · Leads ranked */
const LEADS = [
  { name: 'Sneha Rao', product: 'Front-load washer', score: 91, from: 0, to: 1 },
  { name: 'Kavita Iyer', product: 'Refrigerator', score: 89, from: 1, to: 2 },
  { name: 'Rohan Kapoor', product: 'Inverter AC · 1.5 ton', score: 94, from: 3, to: 0 },
  { name: 'Manish Gupta', product: '55" 4K TV', score: 87, from: 2, to: 3 },
];
function Rank() {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const move = spring({ frame: f - 50, fps, config: { damping: 16, stiffness: 120 } });
  return (
    <Scene duration={130}>
      <AbsoluteFill style={{ padding: 80, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Label style={rise(f, 0)}>Hot leads · ranked for you</Label>
        <div style={{ position: 'relative', height: 420, marginTop: 12 }}>
          {LEADS.map((l, i) => {
            const slot = l.from + (l.to - l.from) * move;
            const hero = l.name === 'Rohan Kapoor';
            const score = Math.round(interpolate(f, [10 + i * 4, 50 + i * 4], [0, l.score], { ...clamp, easing: ease }));
            return (
              <div key={l.name} style={{ ...rise(f, 6 + i * 5), position: 'absolute', left: 0, right: 0, top: slot * 102, height: 88, borderRadius: 20, display: 'grid', gridTemplateColumns: '64px 1fr 340px 80px', alignItems: 'center', gap: 20, padding: '0 28px', background: hero && move > 0.5 ? C.white : '#ffffff12', color: hero && move > 0.5 ? C.navy : C.white, boxShadow: hero ? `0 0 0 ${3 * move}px ${C.violet2}` : 'none' }}>
                <span style={{ font: `700 22px/1 ${MONO}`, opacity: 0.7 }}>#{Math.round(slot) + 1}</span>
                <span><b style={{ display: 'block', font: `700 28px/1.1 ${SANS}` }}>{l.name}</b><span style={{ font: `500 18px/1.4 ${SANS}`, opacity: 0.7 }}>{l.product}</span></span>
                <span style={{ height: 12, borderRadius: 999, background: '#ffffff22', overflow: 'hidden' }}><span style={{ display: 'block', height: '100%', width: `${score}%`, background: C.violet2, borderRadius: 999 }} /></span>
                <b style={{ font: `800 34px/1 ${SANS}`, textAlign: 'right' }}>{score}</b>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </Scene>
  );
}

/* 5 · Follow-up and end card */
function Close() {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sent = spring({ frame: f - 10, fps, config: { damping: 14 } });
  const reply = spring({ frame: f - 34, fps, config: { damping: 14 } });
  const end = interpolate(f, [52, 66], [0, 1], { ...clamp, easing: ease });
  return (
    <Scene duration={100}>
      <AbsoluteFill style={{ padding: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ opacity: 1 - end, transform: `translateY(${-end * 40}px)`, width: 640, display: 'flex', flexDirection: 'column', gap: 14, background: '#f0f5ef', borderRadius: 28, padding: 28, position: 'absolute' }}>
          <div style={{ alignSelf: 'flex-start', background: C.white, color: C.navy, padding: '16px 20px', borderRadius: '6px 20px 20px 20px', font: `500 24px/1.35 ${SANS}`, transform: `scale(${sent})`, transformOrigin: 'left top' }}>Hi Rohan, your inverter AC comes with free installation and a 5-year warranty this week.</div>
          <div style={{ alignSelf: 'flex-end', background: '#d9fdd3', color: C.navy, padding: '16px 20px', borderRadius: '20px 6px 20px 20px', font: `500 24px/1.35 ${SANS}`, transform: `scale(${reply})`, transformOrigin: 'right top' }}>Can someone visit on Saturday?</div>
        </div>
        <div style={{ opacity: end, transform: `scale(${0.92 + end * 0.08})`, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
          <svg viewBox="-5 -5 56 63" width="72" height="80" fill={C.ink}><use href="#logo" /></svg>
          <div style={{ font: `800 72px/1.05 ${SANS}`, letterSpacing: '-0.04em' }}>Every call. Every lead.<br /><span style={{ color: C.ink }}>Before stand-up.</span></div>
          <div style={{ font: `600 22px/1 ${SANS}`, padding: '18px 30px', borderRadius: 12, background: `linear-gradient(90deg, ${C.violet}, ${C.violet2})` }}>Data Vault AI · Book a demo</div>
        </div>
      </AbsoluteFill>
    </Scene>
  );
}

export function ProductFilm() {
  const f = useCurrentFrame();
  const glow = interpolate(Math.sin(f / 30), [-1, 1], [0.35, 0.6]);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(120% 90% at 50% 0%, ${C.navy}, ${C.deep})` }}>
      <AbsoluteFill style={{ background: `radial-gradient(50% 45% at 50% 110%, rgba(68,52,221,${glow}), transparent)` }} />
      <Sequence from={0} durationInFrames={100}><Volume /></Sequence>
      <Sequence from={90} durationInFrames={130}><Transcribe /></Sequence>
      <Sequence from={210} durationInFrames={120}><Analyse /></Sequence>
      <Sequence from={320} durationInFrames={130}><Rank /></Sequence>
      <Sequence from={440} durationInFrames={100}><Close /></Sequence>
    </AbsoluteFill>
  );
}
