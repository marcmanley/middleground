import { google } from 'googleapis';
import fs from 'fs';

const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID;
const SERVICE_ACCOUNT_KEY = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);

const auth = new google.auth.GoogleAuth({
  credentials: SERVICE_ACCOUNT_KEY,
  scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
});
const calendar = google.calendar({ version: 'v3', auth });

// Google Calendar returns event descriptions as HTML when they were entered
// via the web UI's rich-text editor (<br>, &#39;, etc.), not plain text.
function stripHtml(html) {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, ' ');
}

// Matches a line like "This week's khaṭīb: Sh. Ahmad Ali" (name inline), or
// "This week's khaṭīb:" with the name on the next non-empty line instead.
// Tolerant of spelling variants (khatib / khaṭīb / khateeb) and curly quotes.
const KHATIB_LABEL = /this\s+week['’]?s\s+kha(?:t|ṭ)(?:i|ī|ee)b\s*:?\s*(.*)/i;

function extractKhatib(description) {
  const lines = stripHtml(description).split(/\r?\n/).map(l => l.trim());
  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(KHATIB_LABEL);
    if (!match) continue;
    const inline = match[1].trim();
    if (inline) return inline;
    const nextNonEmpty = lines.slice(i + 1).find(l => l);
    if (nextNonEmpty) return nextNonEmpty;
  }
  return null;
}

function upcomingFridayWindow() {
  const now = new Date();
  const diff = (5 - now.getDay() + 7) % 7; // 5 = Friday
  const friday = new Date(now);
  friday.setDate(now.getDate() + diff);
  friday.setHours(0, 0, 0, 0);
  const next = new Date(friday);
  next.setDate(friday.getDate() + 1);
  return { timeMin: friday.toISOString(), timeMax: next.toISOString() };
}

async function main() {
  const { timeMin, timeMax } = upcomingFridayWindow();

  const res = await calendar.events.list({
    calendarId: CALENDAR_ID,
    timeMin,
    timeMax,
    singleEvents: true,
    orderBy: 'startTime',
  });

  const event = (res.data.items || []).find(e => (e.summary || '').toLowerCase().includes('jumu'));
  if (!event) throw new Error("No Jumu'ah event found for this Friday.");

  const khatib = extractKhatib(event.description || '') || 'TBD — check calendar';

  const template = fs.readFileSync('config/newsletter-template.txt', 'utf8');
  const draft = template.replace(/{{\s*KHATIB\s*}}/g, khatib);

  fs.mkdirSync('drafts', { recursive: true });
  fs.writeFileSync('drafts/mailchimp-newsletter.md', draft); // fixed name, overwritten weekly
  console.log(`Draft written — khatib: ${khatib}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
