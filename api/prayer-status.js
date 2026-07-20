const { createClient } = require('redis');
const { get } = require('@vercel/edge-config');

const PRAYERS = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
const CLAIM_TTL_SECONDS = 30 * 60 * 60; // just over a day, so a claim always outlives its own prayer day
const MAX_NAME_LENGTH = 60;

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
        await redis.set(key, trimmedName, { EX: CLAIM_TTL_SECONDS });
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
