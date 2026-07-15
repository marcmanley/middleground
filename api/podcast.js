const FEED_URL = 'https://api.substack.com/feed/podcast/584248.rss';

function extractTag(xml, tag) {
  const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
  if (!match) return null;
  return match[1].replace(/^<!\[CDATA\[([\s\S]*?)\]\]>$/, '$1').trim();
}

function extractAttr(xml, tag, attr) {
  const match = xml.match(new RegExp(`<${tag}[^>]*\\s${attr}="([^"]*)"`));
  return match ? match[1] : null;
}

module.exports = async (req, res) => {
  try {
    const response = await fetch(FEED_URL);
    if (!response.ok) {
      throw new Error(`Feed request failed (${response.status})`);
    }
    const xml = await response.text();

    const firstItemMatch = xml.match(/<item>([\s\S]*?)<\/item>/);
    if (!firstItemMatch) {
      throw new Error('No episodes found in feed');
    }
    const item = firstItemMatch[1];

    const audioUrl = extractAttr(item, 'enclosure', 'url');
    const title = extractTag(item, 'title');
    const pubDate = extractTag(item, 'pubDate');
    const durationRaw = extractTag(item, 'itunes:duration');

    if (!audioUrl) {
      throw new Error('No audio enclosure found in latest episode');
    }

    res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=3600');
    return res.status(200).json({
      title,
      audioUrl,
      pubDate,
      duration: durationRaw ? Number(durationRaw) : null,
    });
  } catch (err) {
    console.error('Podcast feed error:', err);
    return res.status(502).json({ error: 'Could not load the latest episode.' });
  }
};
