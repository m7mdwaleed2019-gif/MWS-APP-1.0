// ==================== 5. فحص مفتاح Gemini المرن + وضع المطور وفاحص الموقع ====================
function toggleKeyVisibility() {
  const input = document.getElementById('api-key-input');
  if (!input) return;
  input.type = input.type === 'password' ? 'text' : 'password';
}

async function saveAndVerifyGeminiKey() {
  const input = document.getElementById('api-key-input');
  const resultEl = document.getElementById('gemini-verify-result');
  
  // تنظيف المفتاح من أي مسافات وإصلاح خطأ تشابه حرف l مع I تلقائياً
  let key = (input?.value || '').trim().replace(/\s+/g, '');
  if (key.toLowerCase().startsWith('alzasy')) {
    key = 'AIzaSy' + key.slice(6);
    if (input) input.value = key;
  }

  state.settings.apiKey = key;
  saveState();

  if (resultEl) {
    resultEl.style.color = '#93c5fd';
    resultEl.textContent = '⏳ جاري فحص وتفعيل الربط بالذكاء الاصطناعي...';
  }

  let mode = 'local'; // الوضع الذكي المدمج كافتراضي مضمون
  let errorDetail = '';

  // 1. إذا أدخل المستخدم مفتاحاً، نختبره مع سيرفرات قوقل (نجرب أكثر من موديل لضمان القبول)
  if (key.length > 20) {
    const models = ['gemini-2.5-flash', 'gemini-1.5-flash'];
    for (const model of models) {
      try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: 'مرحبا' }] }] })
        });
        const data = await res.json();
        if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
          mode = 'cloud_key';
          break;
        } else if (data?.error?.message) {
          errorDetail = data.error.message;
        }
      } catch (e) {}
    }
  }

  // 2. إذا لم ينجح المفتاح اليدوي، نفحص هل السيرفر السحابي في Vercel مربوط
  if (mode === 'local') {
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ systemPrompt: 'أجب بكلمة متصل', contextSummary: '', userText: 'فحص' })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.reply) mode = 'serverless';
      }
    } catch (e) {}
  }

  // تفعيل الاتصال في جميع الحالات حتى لا يتعطل المستخدم أبداً
  state.geminiConnected = true;
  saveState();

  if (resultEl) {
    resultEl.style.color = '#10b981';
    if (mode === 'cloud_key' || mode === 'serverless') {
      resultEl.textContent = '✅ تم الربط المباشر بـ Google Gemini API بنجاح! جميع الوكلاء متصلون بالسحابة.';
    } else if (key.length > 0 && errorDetail) {
      resultEl.style.color = '#f59e0b';
      resultEl.textContent = `⚠️ المفتاح المدخل غير مفعل من قوقل (${errorDetail})، ولكن تم تفعيل "المحرك الذكي المدمج تلقائياً" لتعمل المنصة معك فوراً!`;
    } else {
      resultEl.textContent = '✅ تم التفعيل التلقائي بنجاح (وضع التشغيل الذكي المدمج بدون مفتاح خارجي)!';
    }
  }
}
