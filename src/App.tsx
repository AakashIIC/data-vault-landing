import { MotionConfig } from 'motion/react';
import { Header } from './components/Header';
import { Marquee } from './components/Marquee';
import { Reveal } from './lib/motion';
import { useSmoothScroll } from './lib/lenis';
import { Hero } from './sections/Hero';
import { TopCalls } from './sections/TopCalls';
import { HowItWorks } from './sections/HowItWorks';
import { Modules } from './sections/Modules';
import { SearchDemo } from './sections/SearchDemo';
import { Tour } from './sections/Tour';
import { LazyFilm } from './sections/LazyFilm';
import { Ask, Close, Monday, Seats } from './sections/Story';

function Head({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <Reveal className="head">
      <div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2></div>
      <p>{text}</p>
    </Reveal>
  );
}

export default function App() {
  useSmoothScroll();
  return (
    <MotionConfig reducedMotion="user">
      <a className="skip" href="#main">Skip to content</a>
      <Header />
      <main id="main">
        <Hero />
        <Marquee />

        <section className="white" id="top-calls"><div className="wrap">
          <Head eyebrow="Top calls analysis" title="Your best and worst calls of the week, ranked." text="Every call gets a pitch score. Open any call to hear it and see exactly why it ranked where it did." />
          <Reveal><TopCalls /></Reveal>
          <p className="sample">Sample calls and scores.</p>
        </div></section>

        <HowItWorks />

        <section id="modules"><div className="wrap">
          <Head eyebrow="Modules" title="Data Vault + and every module your sales floor needs." text="One login, nine modules. Each one answers a question your team asks every day. Pick one to see it in the tour." />
          <Modules />
        </div></section>

        <section className="white" id="search"><div className="wrap">
          <Head eyebrow="Lead search" title="Find any customer’s calls in seconds." text="Type a name, phone number, lead ID or a problem like “EMI”. Every result comes with the AI summary and a next step." />
          <Reveal><SearchDemo /></Reveal>
          <p className="sample">Live demo with sample leads. Try typing “AC”, “Arjun” or “delivery”.</p>
        </div></section>

        <section className="film-sec on-dark" id="film"><div className="wrap">
          <Head eyebrow="The 18-second version" title="Watch one call become a follow-up." text="This film is a live Remotion composition, rendered in your browser frame by frame. Scrub it, pause it, replay it." />
          <LazyFilm />
        </div></section>

        <section id="tour"><div className="wrap">
          <Head eyebrow="Product tour" title="Five screens your sales floor will open every day." text="Pick a screen to see it with sample data. The tour moves on by itself; hover to pause it." />
          <Reveal><Tour /></Reveal>
        </div></section>

        <section className="white" id="monday"><div className="wrap">
          <Head eyebrow="Why teams switch" title="A team lead’s Monday, before and after." text="Reviewing last week’s calls used to take most of the morning. With Data Vault, it’s the first ten minutes." />
          <Monday />
        </div></section>

        <section className="ask-sec on-dark" id="ask"><div className="wrap">
          <Head eyebrow="Ask your calls" title="Ask a question. Get the answer from every call you’ve recorded." text="No dashboards to configure. Data Vault knows your project, products and date range, and points to the calls behind each answer." />
          <Ask />
        </div></section>

        <section id="roles"><div className="wrap">
          <Head eyebrow="For your team" title="Each seat opens to the answer it needs." text="Team leads, admins and agents look at the same calls with different questions. Pick a role." />
          <Seats />
        </div></section>

        <section className="white" id="faq"><Close /></section>
      </main>
      <footer><div className="wrap">
        <span>© 2026 V-Retail · Data Vault AI</span>
        <nav aria-label="Footer"><a href="#tour">Product tour</a><a href="#faq">FAQ</a><a href="#demo">Contact sales</a></nav>
      </div></footer>
    </MotionConfig>
  );
}
