export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // قراءة المفتاح تلقائياً من بيئة السيرفر في Vercel
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY_MISSING' });
  }

  try {
    const { systemPrompt, contextSummary, userText } = req.body;
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${systemPrompt}\n\nسياق المتعلم الحالي: ${contextSummary}\n\nرسالة المتعلم: ${userText}`
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
    return res.status(200).json({ reply });
  } catch (err) {
    return res.status(500).json({ error: 'FAILED_TO_CONNECT_GEMINI' });
  }
}
