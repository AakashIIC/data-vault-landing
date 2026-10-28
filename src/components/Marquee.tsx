import { Icon } from './Icon';

const ITEMS = [
  ['i-pulse', '1,284 calls analysed today'],
  ['i-users', '57 hot leads ranked'],
  ['i-chart', '68% positive sentiment'],
  ['i-send', '214 WhatsApp follow-ups sent'],
  ['i-trophy', 'Top pitch score 94'],
  ['i-msg', 'Answers in plain English'],
  ['i-vault', 'Every call, every product'],
] as const;

// Endless ticker of live-looking stats; the list is doubled so the CSS loop is seamless
export function Marquee() {
  const row = ITEMS.map(([icon, text]) => (
    <span className="mq-item" key={text}><Icon id={icon} />{text}</span>
  ));
  return (
    <div className="marquee" role="region" aria-label="Today in Data Vault (sample data)">
      <div className="mq-track">
        <div className="mq-row">{row}</div>
        <div className="mq-row" aria-hidden="true">{row}</div>
      </div>
    </div>
  );
}
