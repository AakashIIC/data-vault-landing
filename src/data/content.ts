// Sample data shown across the landing page. All names and figures are fictional.

export type TagKind = 'info' | 'neg' | 'pos' | 'hot';
export type Sentiment = 'pos' | 'neu' | 'neg';
export type Priority = 'hot' | 'warm' | 'cold';

export interface Moment {
  at: number;
  time: string;
  who: 'Customer' | 'Agent';
  quote: string;
  tag: [TagKind, string];
  title: string;
  body: string;
}

export const MOMENTS: Moment[] = [
  { at: 0.06, time: '00:24', who: 'Customer', quote: 'I saw the 1.5 ton inverter AC in your store last week.', tag: ['info', 'Product detected'], title: 'Inverter AC · 1.5 ton', body: 'Call filed under the right product, so it shows up in Product Insights.' },
  { at: 0.28, time: '01:52', who: 'Customer', quote: 'The price online was lower than what I was quoted.', tag: ['neg', 'Price objection'], title: 'Competitor: online stores', body: 'Counted toward this week’s top recurring issue. Sentiment dips here.' },
  { at: 0.47, time: '03:07', who: 'Agent', quote: 'We can include free installation and a 5-year compressor warranty.', tag: ['pos', 'Objection handled'], title: 'Value-first response', body: 'Scored as a strong pitch and shared as an example in Performance Report.' },
  { at: 0.84, time: '05:38', who: 'Customer', quote: 'Okay, send me the details. I’ll decide by the weekend.', tag: ['hot', 'HOT lead'], title: 'Next step: WhatsApp by Friday', body: 'Send the warranty offer before the weekend decision. Added to retargeting.' },
];

export interface CallRow {
  customer: string;
  product: string;
  agent: string;
  length: string;
  score: number;
  sentiment: Sentiment;
  why: string;
  topics: string[];
}

const row = (customer: string, product: string, agent: string, length: string, score: number, sentiment: Sentiment, why: string, topics: string[]): CallRow =>
  ({ customer, product, agent, length, score, sentiment, why, topics });

export const TOP_CALLS: CallRow[] = [
  row('Rohan Kapoor', 'Inverter AC · 1.5 ton', 'Priya S.', '6:42', 94, 'pos', 'Turned a price objection around with installation and warranty value, then agreed a decision date.', ['Objection handled', 'Clear next step']),
  row('Sneha Rao', 'Front-load washer', 'Priya S.', '5:18', 91, 'pos', 'Matched the EMI plan to her budget and booked a callback slot before hanging up.', ['EMI explained', 'Callback booked']),
  row('Kavita Iyer', 'Double-door refrigerator', 'Arjun N.', '7:05', 89, 'pos', 'Asked about family size first, then recommended the right capacity with confidence.', ['Needs discovery', 'Right product']),
  row('Manish Gupta', '55" 4K TV', 'Meera J.', '4:51', 87, 'pos', 'Confirmed stock at the nearest store and offered a same-week demo.', ['Stock confirmed', 'Demo offered']),
  row('Farah Khan', 'Split AC · 2 ton', 'Priya S.', '6:10', 86, 'pos', 'Compared energy ratings in plain numbers and showed the yearly saving.', ['Value framing']),
  row('Deepak Joshi', 'Microwave oven', 'Karan V.', '3:42', 84, 'pos', 'Short, warm call that ended with a WhatsApp catalogue and a visit date.', ['WhatsApp follow-up']),
  row('Neha Bansal', 'Washer-dryer', 'Arjun N.', '5:56', 83, 'pos', 'Handled the exchange question with a clear value for the old machine.', ['Exchange offer']),
  row('Suresh Nair', 'Inverter AC · 1 ton', 'Meera J.', '4:30', 81, 'neu', 'Good product knowledge; customer still comparing but agreed to a follow-up.', ['Follow-up agreed']),
  row('Pooja Menon', 'Dishwasher', 'Priya S.', '6:24', 80, 'pos', 'Answered installation and water-use questions without putting the customer on hold.', ['No hold time']),
  row('Arvind Rao', 'Air purifier', 'Karan V.', '3:58', 78, 'pos', 'Picked up on a health concern and recommended the right filter grade.', ['Needs discovery']),
];

export const BOTTOM_CALLS: CallRow[] = [
  row('Imran Shaikh', 'Refrigerator', 'Meera J.', '2:12', 31, 'neg', 'Delivery date was never confirmed and the customer ended the call frustrated.', ['Delivery unclear', 'No next step']),
  row('Rahul Verma', 'Split AC · 1.5 ton', 'Karan V.', '1:48', 34, 'neg', 'Price objection was met with a discount offer straight away, with no value shown first.', ['Discount too early']),
  row('Lata Pillai', '43" Smart TV', 'Arjun N.', '2:35', 38, 'neg', 'Customer asked about EMI twice; the agent did not have the plan details.', ['Information gap']),
  row('Vikas Sharma', 'Washing machine', 'Karan V.', '1:20', 41, 'neu', 'Call ended without asking for a visit or a callback time.', ['No next step']),
  row('Anjali Desai', 'Inverter AC · 1 ton', 'Meera J.', '3:02', 43, 'neg', 'Long hold while checking stock; the customer mentioned an online store twice.', ['Long hold', 'Competitor named']),
  row('Gaurav Patil', 'Chimney', 'Arjun N.', '2:08', 45, 'neu', 'Installation question went unanswered; promised a callback that was not logged.', ['Missed callback']),
  row('Ritu Agarwal', 'Refrigerator', 'Karan V.', '1:56', 47, 'neg', 'The agent talked over the customer while she explained her kitchen space.', ['Interruptions']),
  row('Sanjay Kulkarni', 'Water purifier', 'Meera J.', '2:44', 49, 'neu', 'Generic pitch that did not ask about water source or family size.', ['No discovery']),
  row('Meena Rao', 'Microwave oven', 'Arjun N.', '2:20', 52, 'neu', 'Customer wanted a demo; the agent did not offer a store visit.', ['Demo not offered']),
  row('Tarun Bhatia', 'Air cooler', 'Karan V.', '1:34', 54, 'neu', 'Rushed call; the warranty question was answered incorrectly.', ['Wrong information']),
];

export const TC_SIDE = {
  top: { avg: 85, label: 'Average score, top 10', title: 'What the top calls do', icon: 'i-check', color: '#8cca81', items: ['Ask about the customer’s needs before pitching', 'Show value before talking about discounts', 'End with a date: a visit, a callback or a decision'] },
  bottom: { avg: 43, label: 'Average score, bottom 10', title: 'Where the bottom calls slip', icon: 'i-x', color: '#f86565', items: ['No next step agreed before hanging up', 'Missing details on EMI, stock or delivery', 'Discount offered before any value is shown'] },
} as const;

export const SENT: Record<Sentiment, [string, string]> = {
  pos: ['var(--pos)', 'Positive'],
  neu: ['var(--neu)', 'Neutral'],
  neg: ['var(--neg)', 'Negative'],
};

export const scoreColor = (s: number) => (s >= 75 ? 'var(--violet)' : s >= 50 ? 'var(--neu)' : 'var(--neg)');

export interface Module {
  name: string;
  icon: string;
  text: string;
  who: string;
  tour?: number;
  href?: string;
}

export const MODULES: Module[] = [
  { name: 'Top Calls Analysis', icon: 'i-trophy', text: 'Your 10 best and 10 worst calls each week, with the reasons behind each score.', who: 'Team leads', href: '#top-calls' },
  { name: 'Daily Snapshot', icon: 'i-pulse', text: 'Sentiment, hot leads and top issues from yesterday’s calls, ready every morning.', who: 'Team leads', tour: 0 },
  { name: 'Manage Leads', icon: 'i-users', text: 'Every lead ranked hot, warm or cold, with Lead Search across names, phones and IDs.', who: 'Agents · Team leads', tour: 1 },
  { name: 'Retargeting', icon: 'i-send', text: 'WhatsApp campaigns for the leads worth a second try, with delivery, reads and replies.', who: 'Admins · Team leads', tour: 2 },
  { name: 'Performance Report', icon: 'i-chart', text: 'Compare agents on calls, talk time, sentiment and conversion. Export as PDF.', who: 'Admins', tour: 3 },
  { name: 'AI Chat', icon: 'i-msg', text: 'Ask about your calls in plain English and get answers with the calls behind them.', who: 'Everyone', tour: 4 },
  { name: 'Sales Agent Calls', icon: 'i-headset', text: 'Each agent’s calls in one list, so coaching starts from real conversations.', who: 'Team leads', href: '#roles' },
  { name: 'Overview', icon: 'i-grid', text: 'The home dashboard: conversations report, smart insights and areas to improve.', who: 'Admins · Team leads', href: '#top' },
];

export const DEMANDS: [string, number][] = [['EMI options', 38], ['Faster delivery', 27], ['Free installation', 19], ['Exchange offer', 16]];

export interface Lead {
  name: string;
  ini: string;
  phone: string;
  id: string;
  product: string;
  agent: string;
  prio: Priority;
  sent: Sentiment;
  calls: number;
  pre: string;
  mark: string;
  post: string;
  topics: string[];
  next: string;
  tags: string;
}

export const LEADS: Lead[] = [
  { name: 'Rohan Kapoor', ini: 'RK', phone: '+91 98201 •• 412', id: 'LD-20931', product: 'Inverter AC', agent: 'Priya S.', prio: 'hot', sent: 'pos', calls: 3,
    pre: 'Interested in the 1.5 ton inverter AC. ', mark: 'Online price was lower', post: ' than the store quote; softened once free installation and a 5-year compressor warranty were offered. Will decide by the weekend.',
    topics: ['Price objection', 'Installation', 'Warranty'], next: 'Send the warranty offer on WhatsApp by Friday.', tags: 'ac inverter priya price objection warranty rohan' },
  { name: 'Sneha Rao', ini: 'SR', phone: '+91 99674 •• 088', id: 'LD-20977', product: 'Front-load washer', agent: 'Priya S.', prio: 'hot', sent: 'pos', calls: 2,
    pre: 'Comparing two 8 kg models. Asked about ', mark: 'no-cost EMI', post: ' and exchange value for her old machine. Wants a callback after 6 pm.',
    topics: ['EMI', 'Exchange offer'], next: 'Call back after 6 pm with the EMI plan.', tags: 'washer emi priya exchange sneha' },
  { name: 'Anita Desai', ini: 'AD', phone: '+91 90040 •• 731', id: 'LD-20854', product: '55" 4K TV', agent: 'Arjun N.', prio: 'warm', sent: 'neu', calls: 1,
    pre: 'Asked whether the TV is in stock at the Andheri store and about ', mark: 'EMI eligibility', post: ' with her card. No commitment yet.',
    topics: ['Stock check', 'EMI'], next: 'Send EMI options and store stock on WhatsApp.', tags: 'tv emi arjun stock anita' },
  { name: 'Imran Shaikh', ini: 'IS', phone: '+91 98330 •• 265', id: 'LD-20712', product: 'Refrigerator', agent: 'Meera J.', prio: 'warm', sent: 'neg', calls: 2,
    pre: 'Frustrated that the ', mark: 'delivery date was not confirmed', post: ' on the first call. Still wants the double-door model if it arrives before the 2nd.',
    topics: ['Delivery delay', 'Complaint'], next: 'Confirm a delivery slot today.', tags: 'fridge refrigerator delivery meera imran complaint' },
  { name: 'Vikram Mehta', ini: 'VM', phone: '+91 97690 •• 540', id: 'LD-20603', product: 'Inverter AC', agent: 'Arjun N.', prio: 'cold', sent: 'neu', calls: 1,
    pre: 'Early research for next summer. Asked general questions about ', mark: 'energy ratings', post: '. No timeline.',
    topics: ['Energy rating', 'Research'], next: 'Add to the seasonal AC nurture list.', tags: 'ac inverter arjun energy vikram' },
];

export const CHIPS: [string, string][] = [['AC price objection', 'price'], ['Priya S.', 'priya'], ['EMI', 'emi'], ['Delivery delay', 'delivery'], ['Hot leads', '#hot']];

export const findLeads = (term: string): Lead[] => {
  const t = term.trim().toLowerCase();
  if (!t) return LEADS;
  if (['#hot', 'hot', 'hot leads'].includes(t)) return LEADS.filter(l => l.prio === 'hot');
  return LEADS.filter(l => [l.name, l.phone, l.id, l.product, l.agent, l.tags, l.topics.join(' ')].join(' ').toLowerCase().includes(t));
};

export const ANSWERS = [
  { q: 'Why did we lose leads on ACs last week?', big: '41 calls', lead: 'mentioned a lower online price before the customer went quiet. The top reasons were:', items: ['Online price lower than store quote (41)', 'Delivery date not confirmed on the call (23)', 'No demo unit available to see in store (12)'], src: 'Based on 312 AC enquiry calls · 14–20 Oct' },
  { q: 'Which agent handles price objections best?', big: 'Priya S.', lead: 'turned 58% of price objections into a positive close, against a team average of 34%. She leads with installation and warranty value before discussing discounts.', items: ['Priya S. · 58% (36 objections)', 'Arjun N. · 39% (28 objections)', 'Meera J. · 27% (22 objections)'], src: 'Based on 86 calls tagged “price objection”' },
  { q: 'Who should we retarget this weekend?', big: '18 hot leads', lead: 'said they would decide “by the weekend” or “after salary day”. 12 of them asked about EMI.', items: ['Send the EMI offer on WhatsApp to the 12 EMI leads', 'Call the other 6 directly; they asked for a callback'], src: 'Based on leads with buying intent · last 7 days' },
];

export const FAQS: [string, string][] = [
  ['Do agents need to change how they call?', 'No. Data Vault works on the recordings your telephony already produces.'],
  ['How is a lead marked hot, warm or cold?', 'The AI weighs buying intent, urgency, objections and sentiment across a customer’s calls. Each rating links to the calls behind it.'],
  ['Who can see which calls?', 'Admins see everything, team leads see their projects, and each project’s data stays separate.'],
  ['Can we send campaigns from Data Vault?', 'Yes. Build a retargeting list from your leads, send it on WhatsApp and track reads and replies.'],
];

export const BEFORE: [string, string][] = [['09:00', 'Download a handful of recordings from the dialler'], ['09:40', 'Listen at 1.5× and take notes in a spreadsheet'], ['11:15', 'Ask agents which leads felt promising'], ['12:00', 'Send a follow-up list that covers 1 in 20 calls']];
export const AFTER: [string, string][] = [['09:00', 'Open Daily Snapshot: sentiment and top issues for every call'], ['09:03', 'Sort leads by HOT and check the suggested next steps'], ['09:06', 'Open the two calls with the sharpest drop in sentiment'], ['09:10', 'Send a WhatsApp campaign to this week’s hot leads']];

export const PIPELINE = [
  { n: '01', title: 'Every call comes in', text: 'Recordings flow in from the telephony you already use. No new dialler, no change for agents.', stat: '1,284', statLabel: 'calls today' },
  { n: '02', title: 'Every word is transcribed', text: 'Customer and agent are separated, Hindi and English mixed in one call are handled, and every moment is timestamped.', stat: '6:42', statLabel: 'avg. call length' },
  { n: '03', title: 'The AI reads for intent', text: 'Sentiment, objections, products, competitors and buying intent are tagged on the exact moment they happen.', stat: '41', statLabel: 'price objections found' },
  { n: '04', title: 'Your team acts first', text: 'Hot leads are ranked with a next step, and a WhatsApp follow-up is one click away.', stat: '57', statLabel: 'hot leads to call' },
];
