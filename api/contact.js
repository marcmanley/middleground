const RESEND_API_URL = 'https://api.resend.com/emails';
const FROM_ADDRESS = 'Middle Ground <contact@muslim.center>';
const NOTIFY_TO = 'mgmcupland@gmail.com';

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

async function sendEmail(apiKey, payload) {
  const response = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Resend error (${response.status}): ${errText}`);
  }
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, message, company } = req.body || {};

  // Honeypot: a hidden field real visitors never fill in. If it has a
  // value, silently pretend success so bots don't learn to look elsewhere.
  if (company) {
    return res.status(200).json({ ok: true });
  }

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Please fill in your name, email, and message.' });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY is not set');
    return res.status(500).json({ error: 'Email service is not configured yet.' });
  }

  const safeName = escapeHtml(name);
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');

  try {
    await sendEmail(apiKey, {
      from: FROM_ADDRESS,
      to: [NOTIFY_TO],
      reply_to: email,
      subject: `New contact form message from ${name}`,
      html: `
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Message:</strong></p>
        <p>${safeMessage}</p>
      `,
    });

    try {
      await sendEmail(apiKey, {
        from: FROM_ADDRESS,
        to: [email],
        subject: 'We received your message — Middle Ground',
        html: `
          <p>Assalamu alaikum ${safeName},</p>
          <p>Thank you for reaching out to Middle Ground. We&rsquo;ve received your message and will respond shortly, in sha Allah.</p>
          <p>For your records, here&rsquo;s what you sent us:</p>
          <blockquote style="margin:0;padding-left:12px;border-left:3px solid #E85610;color:#555;">
            ${safeMessage}
          </blockquote>
          <p>JazakumAllahu khairan,<br>Middle Ground</p>
        `,
      });
    } catch (confirmErr) {
      // The message reached us; the confirmation to the sender is a nicety,
      // so don't fail the request over it — just log it for follow-up.
      console.error('Confirmation email failed:', confirmErr);
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Contact form error:', err);
    return res.status(502).json({ error: 'Something went wrong sending your message. Please try again or email us directly.' });
  }
};
