const { createClient } = require('redis');
const { get } = require('@vercel/edge-config');

const PRAYERS = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
const MAX_NAME_LENGTH = 60;

// Today's prayer times, 24-hour "HH:MM", America/Los_Angeles. Update these as
// the times shift through the year — each prayer's claim automatically resets
// RESET_OFFSET_MINUTES after its own time, so nothing else needs adjusting.
const PRAYER_TIMES = {
  fajr: '05:30',
  dhuhr: '13:15',
  asr: '17:00',
  maghrib: '20:05',
  isha: '21:30',
};
// How long after each prayer's own time its claim stays open before resetting.
const RESET_OFFSET_MINUTES = {
  fajr: 60,
  dhuhr: 30,
  asr: 30,
  maghrib: 30,
  isha: 60,
};
const CLAIM_TTL_SECONDS = 30 * 60 * 60; // fallback if a reset moment can't be computed

let clientPromise;
function getRedis() {
  if (!clientPromise) {
    const client = createClient({ url: process.env.UPSTASH_REDIS_REST_REDIS_URL });
    client.on('error', (err) => console.error('Redis client error:', err));
    clientPromise = client.connect().then(() => client);
  }
  return clientPromise;
}

function todayKey() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Los_Angeles' }).format(new Date());
}

// Minutes that America/Los_Angeles is currently offset from UTC (negative — e.g. -420 during PDT).
function laOffsetMinutes(instant) {
  const part = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Los_Angeles',
    timeZoneName: 'shortOffset',
  }).formatToParts(instant).find((p) => p.type === 'timeZoneName').value;
  const match = part.match(/GMT([+-]\d+)/);
  return match ? parseInt(match[1], 10) * 60 : -480;
}

// UTC timestamp (ms) for RESET_OFFSET_MINUTES after a given prayer's time, on the given
// America/Los_Angeles calendar date (YYYY-MM-DD). Resolves DST by reading the actual LA
// offset for that date rather than assuming a fixed one.
function resetMomentMs(prayer, dateStr) {
  const time = PRAYER_TIMES[prayer];
  const offset = RESET_OFFSET_MINUTES[prayer];
  if (!time || offset == null) return null;
  const [hour, minute] = time.split(':').map(Number);
  const totalMinutes = hour * 60 + minute + offset;
  const dayCarry = Math.floor(totalMinutes / 1440);
  const h = Math.floor(totalMinutes / 60) % 24;
  const m = totalMinutes % 60;
  const naiveUtcMs = Date.parse(`${dateStr}T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00Z`)
    + dayCarry * 86400000;
  return naiveUtcMs - laOffsetMinutes(new Date(naiveUtcMs)) * 60000;
}

async function getStatus(date) {
  const redis = await getRedis();
  const values = await Promise.all(PRAYERS.map((p) => redis.get(`prayer:${date}:${p}`)));
  const status = { date };
  PRAYERS.forEach((p, i) => { status[p] = values[i] || null; });
  return status;
}

module.exports = async (req, res) => {
  const date = todayKey();

  if (req.method === 'GET') {
    try {
      const status = await getStatus(date);
      res.setHeader('Cache-Control', 's-maxage=15, stale-while-revalidate=45');
      return res.status(200).json(status);
    } catch (err) {
      console.error('Prayer status GET error:', err);
      return res.status(502).json({ error: 'Could not load prayer status.' });
    }
  }

  if (req.method === 'POST') {
    try {
      const body = req.body || {};
      const { prayer, name, passcode, action, company } = body;

      if (company) {
        return res.status(200).json(await getStatus(date));
      }

      if (!PRAYERS.includes(prayer)) {
        return res.status(400).json({ error: 'Unknown prayer.' });
      }
      if (action !== 'claim' && action !== 'release') {
        return res.status(400).json({ error: 'Unknown action.' });
      }

      const expectedPasscode = await get('prayerWidgetPasscode');
      if (!expectedPasscode || passcode !== expectedPasscode) {
        return res.status(403).json({ error: 'That passcode didn’t match.' });
      }

      const redis = await getRedis();
      const key = `prayer:${date}:${prayer}`;

      if (action === 'release') {
        await redis.del(key);
      } else {
        const trimmedName = String(name || '').trim().slice(0, MAX_NAME_LENGTH);
        if (!trimmedName) {
          return res.status(400).json({ error: 'Please enter a name.' });
        }
        const resetMs = resetMomentMs(prayer, date);
        const ttlSeconds = resetMs && resetMs > Date.now()
          ? Math.ceil((resetMs - Date.now()) / 1000)
          : CLAIM_TTL_SECONDS;
        await redis.set(key, trimmedName, { EX: ttlSeconds });
      }

      return res.status(200).json(await getStatus(date));
    } catch (err) {
      console.error('Prayer status POST error:', err);
      return res.status(502).json({ error: 'Something went wrong. Please try again.' });
    }
  }

  res.setHeader('Allow', 'GET, POST');
  return res.status(405).json({ error: 'Method not allowed.' });
};
