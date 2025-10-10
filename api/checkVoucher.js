export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ error: 'Missing code' });
  }

  // Google Apps Script WebApp URL (Deploy-Link)
  const scriptUrl = 'https://script.google.com/macros/s/DEIN_SCRIPT_ID/exec';
  const secret = process.env.GSHEET_SECRET;

  try {
    const response = await fetch(`${scriptUrl}?secret=${secret}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    });

    const data = await response.json();
    return res.status(200).json(data);

  } catch (err) {
    console.error('Error contacting Apps Script:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

