export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { systemPrompt, userText, apiKey: clientKey, model } = req.body || {};
  const finalKey = (clientKey || process.env.GEMINI_API_KEY || '').trim();

  if (!finalKey) {
    return res.status(400).json({ error: 'لم يتم العثور على مفتاح API في الطلب أو في إعدادات Vercel.' });
  }

  // ترتيب الموديلات بدءاً من الجيل الأحدث الذي طلبته قوقل في رسالة الخطأ
  const candidateModels = [
    model,
    'gemini-3.8-flash',
    'gemini-3.8-flash-lite',
    'gemini-3.8-pro',
    
  ].filter(Boolean);

  const uniqueModels = [...new Set(candidateModels)];
  const isAQ = finalKey.toUpperCase().startsWith('AQ.');
  const headers = { 'Content-Type': 'application/json' };
  if (isAQ) {
    headers['x-goog-api-key'] = finalKey;
  }

  let lastErrorMsg = '';

  for (const mod of uniqueModels) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${mod}:generateContent?key=${encodeURIComponent(finalKey)}`;
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
      if (response.ok && data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        return res.status(200).json({
          reply: data.candidates[0].content.parts[0].text,
          usedModel: mod
        });
      }

      lastErrorMsg = data?.error?.message || `HTTP ${response.status}`;
    } catch (err) {
      lastErrorMsg = err.message;
    }
  }

  return res.status(400).json({
    error: lastErrorMsg || 'تعذر الاتصال بجميع موديلات Gemini المتاحة.'
  });
}
