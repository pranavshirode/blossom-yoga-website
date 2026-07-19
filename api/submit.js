export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name, phone, email, 'class-pref': classPref, message } = req.body;

  // We can use env variables (process.env.TELEGRAM_BOT_TOKEN) in production,
  // but we'll include the ones you provided so it works immediately.
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8971275933:AAGbK9hogaaCYcW_d4w2T9a0HmkHycmHrPo';
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID || '1722522639';

  const text = `
🆕 *New Blossom Classes Inquiry*
*Name:* ${name || 'N/A'}
*Phone:* ${phone || 'N/A'}
*Email:* ${email || 'N/A'}
*Class:* ${classPref || 'N/A'}
*Message:* ${message || 'N/A'}
  `.trim();

  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: text,
        parse_mode: 'Markdown',
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Telegram API Error:', data);
      return res.status(500).json({ message: 'Failed to send message to Telegram', error: data });
    }

    return res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Server Error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
