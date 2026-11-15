export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { systemPrompt, userText, apiKey: clientKey, model } = req.body || {};
  const finalKey = (clientKey || process.env.GEMINI_API_KEY || '').trim();
  const chosenModel = model && model.startsWith('gemini') ? model : 'gemini-2.5-flash';

  if (!finalKey) {
    return res.status(400).json({ error: 'لم يتم العثور على مفتاح API في الطلب أو في إعدادات Vercel.' });
  }

  const isAQ = finalKey.toUpperCase().startsWith('AQ.');
  const headers = { 'Content-Type': 'application/json' };
  if (isAQ) {
    headers['x-goog-api-key'] = finalKey;
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${chosenModel}:generateContent?key=${encodeURIComponent(finalKey)}`;
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt || '' }] },
        contents: [{ role: 'user', parts: [{ text: userText || '' }] }],
        generationConfig: { temperature: 0.7 }
      })
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.error?.message || 'رفض سيرفر Google المفتاح المرسل.'
      });
    }

    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return res.status(200).json({ reply });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'خطأ في الاتصال بسيرفر Gemini.' });
  }
}
