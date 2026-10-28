import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { PIPELINE } from '../data/content';
import { waveform } from '../lib/motion';
import { Icon } from '../components/Icon';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const WAVE = waveform(48, 7);

function Visual({ step }: { step: number }) {
  switch (step) {
    case 0:
      return (
        <div className="hv hv-calls">
          {[['Rohan Kapoor', 'Inverter AC', '6:42'], ['Sneha Rao', 'Front-load washer', '5:18'], ['Imran Shaikh', 'Refrigerator', '2:12'], ['Kavita Iyer', 'Refrigerator', '7:05']].map(([n, p, d]) => (
            <div className="hv-call fx" key={n}>
              <span className="hv-ic"><Icon id="i-headset" /></span>
              <span><b>{n}</b><small>{p}</small></span>
              <span className="num">{d}</span>
            </div>
          ))}
        </div>
      );
    case 1:
      return (
        <div className="hv hv-transcript">
          <div className="hv-wave fx" aria-hidden="true">{WAVE.map((h, i) => <span key={i} style={{ height: `${h}%` }} />)}</div>
          <p className="fx"><b>Customer · 01:52</b>The price online was lower than what I was quoted.</p>
          <p className="fx agent"><b>Agent · 03:07</b>We can include free installation and a 5-year compressor warranty.</p>
        </div>
      );
    case 2:
      return (
        <div className="hv hv-tags">
          <span className="tag info fx">Product · Inverter AC</span>
          <span className="tag neg fx">Price objection</span>
          <span className="tag info fx">Competitor · online</span>
          <span className="tag pos fx">Objection handled</span>
          <span className="tag hot fx">Buying intent · high</span>
          <svg className="hv-line fx" viewBox="0 0 300 80" aria-hidden="true">
            <path d="M0 50 C40 48 60 30 90 34 S140 70 170 62 S230 20 300 14" fill="none" stroke="#8076ee" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
      );
    default:
      return (
        <div className="hv hv-act">
          <div className="hv-lead fx">
            <span className="av">RK</span>
            <span><b>Rohan Kapoor</b><small>Decides by the weekend</small></span>
            <span className="prio hot">HOT</span>
          </div>
          <div className="hv-next fx"><Icon id="i-spark" />Send the warranty offer on WhatsApp by Friday</div>
          <div className="hv-send fx"><Icon id="i-wa" />Send on WhatsApp</div>
        </div>
      );
  }
}

export function HowItWorks() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    // Desktop: pin the section and scrub the cards sideways
    mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
      const el = track.current!;
      const distance = () => el.scrollWidth - window.innerWidth + 80;
      const slide = gsap.to(el, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
      gsap.fromTo(bar.current, { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: () => `+=${distance()}`, scrub: true } });

      gsap.utils.toArray<HTMLElement>('.how-card', el).forEach(card => {
        gsap.from(card.querySelectorAll('.fx'), {
          y: 36, opacity: 0, scale: 0.94, stagger: 0.09, duration: 0.7, ease: 'back.out(1.6)',
          scrollTrigger: { trigger: card, containerAnimation: slide, start: 'left 78%', toggleActions: 'play none none reverse' },
        });
        gsap.from(card.querySelector('.how-n'), {
          xPercent: 40, opacity: 0,
          scrollTrigger: { trigger: card, containerAnimation: slide, start: 'left right', end: 'center center', scrub: true },
        });
      });
    });

    // Mobile and tablet: a normal vertical list with each card animating in
    mm.add('(max-width: 899px) and (prefers-reduced-motion: no-preference)', () => {
      gsap.utils.toArray<HTMLElement>('.how-card', track.current).forEach(card => {
        gsap.from(card.querySelectorAll('.fx'), {
          y: 24, opacity: 0, stagger: 0.08, duration: 0.6, ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 80%' },
        });
      });
    });
  }, { scope: root });

  return (
    <section className="how on-dark" id="how" ref={root}>
      <div className="wrap how-head">
        <div>
          <span className="eyebrow">How it works</span>
          <h2>From a ringing phone to a follow-up, without anyone replaying a call.</h2>
        </div>
        <div className="how-progress" aria-hidden="true"><div ref={bar} /></div>
      </div>
      <div className="how-track" ref={track}>
        {PIPELINE.map((p, i) => (
          <article className="how-card" key={p.n}>
            <span className="how-n" aria-hidden="true">{p.n}</span>
            <div className="how-copy">
              <h3>{p.title}</h3>
              <p>{p.text}</p>
              <div className="how-stat"><b className="num">{p.stat}</b><span>{p.statLabel}</span></div>
            </div>
            <Visual step={i} />
          </article>
        ))}
      </div>
    </section>
  );
}
