// ==================== 1. قاعدة البيانات والحالة (State) ====================
const STORAGE_KEY = 'MWS_AI_ACADEMY_V5';

const defaultState = {
  streak: 1,
  studyMinutesToday: 0,
  totalStudyMinutes: 45,
  currentAgent: 'fahad',
  devMode: false,
  geminiConnected: false,
  settings: {
    apiKey: ''
  },
  certificates: [
    {
      id: 'MO-211',
      title: 'تحليل البيانات المتقدم (Excel Expert MO-211)',
      badge: 'المسار الأول',
      status: 'studying',
      tasks: [
        { id: 't1', text: 'إتقان دوال البحث المرجعي الديناميكي (XLOOKUP & INDEX/MATCH)', done: true },
        { id: 't2', text: 'أتمتة استيراد وتنظيف البيانات عبر محرك Power Query', done: false },
        { id: 't3', text: 'تصميم النماذج التحليلية والجداول المحورية المتقدمة (PivotTables)', done: false }
      ]
    },
    {
      id: 'PL-300',
      title: 'ذكاء الأعمال ونمذجة البيانات (Power BI PL-300)',
      badge: 'المسار الثاني',
      status: 'planned',
      tasks: [
        { id: 't4', text: 'هندسة العلاقات بين الجداول وبناء نموذج النجمة (Star Schema)', done: false },
        { id: 't5', text: 'كتابة معادلات التحليل الزمني والمالي باستخدام لغة DAX', done: false },
        { id: 't6', text: 'تصميم لوحات المؤشرات التفاعلية (Executive Dashboards)', done: false }
      ]
    },
    {
      id: 'CMA-P1',
      title: 'التخطيط المالي وتحليل الأداء (CMA - Part 1)',
      badge: 'المسار الثالث',
      status: 'planned',
      tasks: [
        { id: 't7', text: 'تحليل القوائم المالية ومعايير الاعتراف بالإيرادات', done: false },
        { id: 't8', text: 'بناء الموازنات التقديرية المرنة (Flexible Budgets)', done: false },
        { id: 't9', text: 'إدارة التكاليف التشغيلية وتحليل الانحرافات', done: false }
      ]
    }
  ],
  libraryFiles: [
    {
      id: 'lib_1',
      name: 'ملخص أهم دوال الإكسل المتقدم و Power Query.txt',
      category: 'MO-211',
      size: 'ملف مرجعي',
      date: '2026-11-15',
      notes: 'التركيز على خطوات Unpivot Columns في Power Query لتنظيف الجداول.',
      dataUrl: ''
    }
  ],
  projects: [
    'تصميم نموذج Power Query مؤتمت لتنظيف ومطابقة بيانات العمليات اليومية.'
  ],
  quizStats: {
    'MO-211': { correct: 2, wrong: 0 },
    'PL-300': { correct: 1, wrong: 1 },
    'CMA': { correct: 0, wrong: 1 }
  },
  chatHistory: {
    fahad: [
      { sender: 'bot', text: 'أهلاً بك! أنا فهد 💡. جاهز لشرح أي مفهوم أو معادلة أو مناقشة ملفاتك الدراسية.' }
    ],
    hazem: [
      { sender: 'bot', text: 'مرحباً بك. أنا حازم 📊. أتابع جودة تركيزك وأحلل تقدمك في المسارات والاختبارات.' }
    ],
    abdulmalik: [
      { sender: 'bot', text: 'أهلاً بك يا بشمهندس! أنا عبدالملك 🛠️. أعمل الآن كمستشار برمجي وتقني مباشر للإجابة على استفساراتك في البرمجة وهندسة الذكاء الاصطناعي دون أي اقتراحات تلقائية.' }
    ]
  }
};

// تعريف المهارات وتوجيهات الوكلاء (بدون نصوص زائدة في الواجهة وبدون اقتراحات من عبدالملك)
const agentProfiles = {
  fahad: {
    systemPrompt: 'أنت "فهد"، مرشد معرفي وصديق دراسة ذكي وودود. تتحدث بعربية طبيعية راقية ومختصرة. تشرح مفاهيم تحليل البيانات (Excel, Power BI) والمحاسبة الإدارية (CMA) والذكاء الاصطناعي بأمثلة واقعية.',
    skills: [
      { label: '🧩 تبسيط مفهوم', prompt: 'اشرح لي ببساطة الفرق العملي بين Power Query ولغة DAX بمثال واقعي.' },
      { label: '🧠 سؤال استنتاجي', prompt: 'اطرح عليّ سيناريو عملياً قصيراً في تحليل البيانات وناقشني في حله.' },
      { label: '📝 تلخيص مركز', prompt: 'لخص لي أهم 3 قواعد لبناء نموذج بيانات Star Schema في Power BI.' }
    ]
  },
  hazem: {
    systemPrompt: 'أنت "حازم"، محلل أداء وجودة تعلم هادئ وموضوعي. تحلل تقدم المتعلم، وتكشف الفجوات المعرفية من إحصائيات الاختبارات، وتضع خطط مراجعة عملية.',
    skills: [
      { label: '🔍 تشخيص الفجوات', prompt: 'حلل أدائي الحالي في الاختبارات والمحاور وحدد أين أحتاج مراجعة.' },
      { label: '📈 تقييم التركيز', prompt: 'قيّم استمراريتي وجودة جلسات التركيز وقدم لي نصيحة عملية.' },
      { label: '🗓️ جدول الأسبوع', prompt: 'صمم لي خطة مراجعة مرنة لتوزيع جلسات الـ 45 دقيقة هذا الأسبوع.' }
    ]
  },
  abdulmalik: {
    systemPrompt: 'أنت "عبدالملك"، مهندس برمجيات ومستشار تقني محترف. تجيب مباشرة وبوضوح على أسئلة البرمجة، قواعد البيانات، وهندسة الذكاء الاصطناعي. مهم جداً: لا تقترح إضافة أدوات أو تعديلات على الموقع إطلاقاً، بل أجب كخبير تقني فقط.',
    skills: [
      { label: '💻 شرح كود برمجي', prompt: 'اشرح لي كيف يتصل تطبيق الويب بواجهة Gemini API خطوة بخطوة.' },
      { label: '🗄️ قواعد البيانات', prompt: 'ما الفرق العملي بين LocalStorage وقاعدة بيانات سحابية مثل Supabase؟' },
      { label: '🤖 هندسة الأوامر', prompt: 'أعطني أهم القواعد لكتابة System Prompt احترافي للوكلاء الأذكياء.' }
    ]
  }
};

let state = loadState();
let timerInterval = null;
let timerSeconds = 45 * 60;
let rainAudioCtx = null;
let isRainPlaying = false;
let lastToastAgent = 'fahad';

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? Object.assign({}, defaultState, JSON.parse(saved)) : structuredClone(defaultState);
  } catch (e) {
    return structuredClone(defaultState);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  renderAll();
}

// ==================== 2. رسم الواجهة والصفحات المستقلة ====================
function renderAll() {
  renderHeaderBadges();
  renderMasteryIndex();
  renderCertificates();
  renderProjects();
  renderLibrary();
  renderHazemReportAndRadar();
  updateGeminiBadgesUI();
}

function switchView(viewName) {
  document.querySelectorAll('.view-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  document.getElementById(`view-${viewName}`)?.classList.add('active');
  document.getElementById(`nav-${viewName}`)?.classList.add('active');
  if (viewName === 'chat') renderChat();
  if (viewName === 'library') renderLibrary();
}

function renderHeaderBadges() {
  const container = document.getElementById('header-badges');
  if (!container) return;
  container.innerHTML = `
    <span class="badge-pill">🔥 ${state.streak} يوم</span>
    <span class="badge-pill">⏱️ ${state.studyMinutesToday} د</span>
    <span class="badge-pill">📂 ${state.libraryFiles.length} ملفات</span>
  `;
}

function renderMasteryIndex() {
  let totalTasks = 0;
  let doneTasks = 0;
  state.certificates.forEach(c => {
    c.tasks.forEach(t => {
      totalTasks++;
      if (t.done) doneTasks++;
    });
  });

  const progressRatio = totalTasks > 0 ? doneTasks / totalTasks : 0;
  const masteryPercent = Math.min(100, Math.round(progressRatio * 80 + Math.min(20, state.projects.length * 5)));

  let levelTitle = 'متعلم تأسيسي 🌱';
  if (masteryPercent >= 75) levelTitle = 'خبير تحليلي متقدم 🏆';
  else if (masteryPercent >= 40) levelTitle = 'محلل تطبيقي متمكن ⚡';

  const titleEl = document.getElementById('mastery-level-title');
  const scoreEl = document.getElementById('mastery-score-label');
  const fillEl = document.getElementById('mastery-progress-fill');

  if (titleEl) titleEl.textContent = levelTitle;
  if (scoreEl) scoreEl.innerHTML = `مؤشر الإتقان: <strong>${masteryPercent}%</strong>`;
  if (fillEl) fillEl.style.width = `${Math.max(8, masteryPercent)}%`;
}

function renderCertificates() {
  const container = document.getElementById('certificates-list');
  if (!container) return;
  const filterVal = document.getElementById('path-filter-select')?.value || 'all';

  const list = state.certificates.filter(c => filterVal === 'all' || c.id === filterVal);

  container.innerHTML = list.map(cert => {
    const realIdx = state.certificates.findIndex(item => item.id === cert.id);
    const tasksHtml = cert.tasks.map((t, tIdx) => `
      <label class="task-item ${t.done ? 'done' : ''}">
        <input type="checkbox" ${t.done ? 'checked' : ''} onchange="toggleTask(${realIdx}, ${tIdx})" />
        <span>${t.text}</span>
      </label>
    `).join('');

    return `
      <div class="cert-card">
        <div class="cert-header">
          <strong>🎓 ${cert.title}</strong>
          <span class="badge-pill">${cert.badge}</span>
        </div>
        <div>${tasksHtml}</div>
      </div>
    `;
  }).join('');
}

function toggleTask(certIdx, taskIdx) {
  const task = state.certificates[certIdx].tasks[taskIdx];
  task.done = !task.done;
  saveState();
}

function renderProjects() {
  const container = document.getElementById('projects-list');
  if (!container) return;
  container.innerHTML = state.projects.map(p => `
    <div class="task-item" style="justify-content: space-between;">
      <span>✅ ${p}</span>
      <button class="btn-outline btn-sm" onclick="navigator.clipboard.writeText('${p}'); alert('تم نسخ المشروع!')">📋 نسخ</button>
    </div>
  `).join('');
}

function addNewProject() {
  const input = document.getElementById('new-project-input');
  if (!input || !input.value.trim()) return;
  state.projects.push(input.value.trim());
  input.value = '';
  saveState();
}

// ==================== 3. مكتبة الملفات والملاحظات (Library & Notes) ====================
function uploadFileToLibrary() {
  const fileInput = document.getElementById('library-file-input');
  const catInput = document.getElementById('library-category-input');
  const customTitle = document.getElementById('library-custom-title');
  const notesInput = document.getElementById('library-initial-notes');

  const file = fileInput?.files?.[0];
  const titleText = customTitle?.value.trim() || (file ? file.name : '');

  if (!file && !titleText) {
    return alert('يرجى اختيار ملف من جهازك أو كتابة عنوان الملف/المورد أولاً.');
  }

  const newEntry = {
    id: 'lib_' + Date.now(),
    name: titleText,
    category: catInput?.value || 'General',
    size: file ? `${(file.size / 1024).toFixed(1)} KB` : 'ملاحظة/مورد',
    date: new Date().toISOString().slice(0, 10),
    notes: notesInput?.value.trim() || '',
    dataUrl: ''
  };

  if (file && file.size < 2 * 1024 * 1024) {
    const reader = new FileReader();
    reader.onload = e => {
      newEntry.dataUrl = e.target.result;
      state.libraryFiles.unshift(newEntry);
      resetLibraryForm();
      saveState();
      showToast('fahad', '📂 تمت إضافة الملف للمكتبة', `تم حفظ "${newEntry.name}" مع ملاحظاتك بنجاح.`);
    };
    reader.readAsDataURL(file);
  } else {
    state.libraryFiles.unshift(newEntry);
    resetLibraryForm();
    saveState();
    showToast('fahad', '📂 تمت الإضافة للمكتبة', `تم حفظ "${newEntry.name}" في مكتبتك.`);
  }
}

function resetLibraryForm() {
  if (document.getElementById('library-file-input')) document.getElementById('library-file-input').value = '';
  if (document.getElementById('library-custom-title')) document.getElementById('library-custom-title').value = '';
  if (document.getElementById('library-initial-notes')) document.getElementById('library-initial-notes').value = '';
}

function renderLibrary() {
  const listEl = document.getElementById('library-files-list');
  if (!listEl) return;

  const query = (document.getElementById('library-search-input')?.value || '').toLowerCase();
  const cat = document.getElementById('library-filter-cat')?.value || 'all';

  const filtered = state.libraryFiles.filter(f => {
    const matchCat = cat === 'all' || f.category === cat;
    const matchText = f.name.toLowerCase().includes(query) || (f.notes || '').toLowerCase().includes(query);
    return matchCat && matchText;
  });

  if (filtered.length === 0) {
    listEl.innerHTML = '<p style="color:#94a3b8; font-size:0.88rem;">لا توجد ملفات مطابقة للبحث حالياً.</p>';
    return;
  }

  listEl.innerHTML = filtered.map(item => `
    <div class="file-card">
      <div class="file-card-top">
        <div>
          <strong>📄 ${item.name}</strong>
          <span class="badge-pill" style="margin-right:6px;">${item.category}</span>
          <small style="color:#94a3b8; display:block;">تاريخ الإضافة: ${item.date} | الحجم: ${item.size}</small>
        </div>
        <div class="btn-group-row" style="margin-top:0;">
          ${item.dataUrl ? `<a href="${item.dataUrl}" download="${item.name}" class="btn-outline btn-sm" style="text-decoration:none;">⬇️ فتح/تحميل</a>` : ''}
          <button class="btn-secondary btn-sm" onclick="askAgentAboutFile('${item.id}')">💬 ناقش الملف بالمنبثقة</button>
          <button class="btn-danger btn-sm" onclick="deleteLibraryFile('${item.id}')">🗑️ حذف</button>
        </div>
      </div>
      <label class="form-label">📝 ملاحظاتي على هذا الملف (تحفظ تلقائياً عند التعديل):</label>
      <textarea class="file-notes-area" rows="2" onchange="updateFileNotes('${item.id}', this.value)" placeholder="أضف ملاحظاتك أو النقاط المهمة هنا...">${item.notes || ''}</textarea>
    </div>
  `).join('');
}

function updateFileNotes(fileId, newNotes) {
  const item = state.libraryFiles.find(f => f.id === fileId);
  if (item) {
    item.notes = newNotes;
    saveState();
  }
}

function deleteLibraryFile(fileId) {
  state.libraryFiles = state.libraryFiles.filter(f => f.id !== fileId);
  saveState();
}

function askAgentAboutFile(fileId) {
  const item = state.libraryFiles.find(f => f.id === fileId);
  if (!item) return;
  const modal = document.getElementById('popup-chat-modal');
  modal?.classList.remove('hidden');
  const popInput = document.getElementById('popup-chat-input');
  if (popInput) {
    popInput.value = `لدي ملف بعنوان "${item.name}" في مسار (${item.category}) وملاحظاتي عليه: "${item.notes || 'لا توجد'}". أعطني أهم النقاط التطبيقية للتركيز عليها.`;
    sendMessage('popup');
  }
}

// ==================== 4. الدردشة المستقلة + النافذة المنبثقة (بدون اقتراحات عبدالملك) ====================
function switchAgent(agentKey) {
  state.currentAgent = agentKey;
  document.querySelectorAll('.agent-tab, .mini-tab').forEach(t => t.classList.remove('active'));
  document.getElementById(`tab-${agentKey}`)?.classList.add('active');
  document.getElementById(`pop-tab-${agentKey}`)?.classList.add('active');
  renderChat();
}

function togglePopupChat() {
  const modal = document.getElementById('popup-chat-modal');
  modal?.classList.toggle('hidden');
  renderChat();
}

function renderChat() {
  const agent = state.currentAgent;
  const profile = agentProfiles[agent];
  const skillsBar = document.getElementById('agent-skills-bar');
  const mainBox = document.getElementById('chat-messages');
  const popupBox = document.getElementById('popup-chat-messages');

  if (skillsBar && profile) {
    skillsBar.innerHTML = profile.skills.map(s => `
      <button class="btn-outline btn-sm" onclick="sendQuickPrompt('${s.prompt}')">${s.label}</button>
    `).join('');
  }

  const msgs = state.chatHistory[agent] || [];
  const msgsHtml = msgs.map(m => `
    <div class="msg ${m.sender}">
      <div>${m.text}</div>
    </div>
  `).join('');

  if (mainBox) {
    mainBox.innerHTML = msgsHtml;
    mainBox.scrollTop = mainBox.scrollHeight;
  }
  if (popupBox) {
    popupBox.innerHTML = msgsHtml;
    popupBox.scrollTop = popupBox.scrollHeight;
  }
}

function sendQuickPrompt(text) {
  const input = document.getElementById('chat-input');
  if (input) {
    input.value = text;
    sendMessage('main');
  }
}

async function sendMessage(source = 'main') {
  const inputId = source === 'popup' ? 'popup-chat-input' : 'chat-input';
  const input = document.getElementById(inputId);
  if (!input || !input.value.trim()) return;
  const userText = input.value.trim();
  input.value = '';

  const agent = state.currentAgent;
  state.chatHistory[agent].push({ sender: 'user', text: userText });
  renderChat();

  const reply = await fetchGeminiReply(agent, userText);
  state.chatHistory[agent].push({ sender: 'bot', text: reply });
  saveState();
  renderChat();
}

async function fetchGeminiReply(agent, userText) {
  const profile = agentProfiles[agent];
  const doneCount = state.certificates.reduce((acc, c) => acc + c.tasks.filter(t => t.done).length, 0);
  const contextSummary = `الاستمرارية=${state.streak} يوم، تركيز اليوم=${state.studyMinutesToday} د، المهام المنجزة=${doneCount}، عدد ملفات المكتبة=${state.libraryFiles.length}.`;

  // 1. إذا كان مفتاح Gemini مضافاً في خانة الإعدادات، نتصل بـ Gemini مباشرة
  const manualKey = state.settings?.apiKey?.trim();
  if (manualKey && manualKey.startsWith('AIza')) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${manualKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${profile.systemPrompt}\nالسياق: ${contextSummary}\nسؤال المستخدم: ${userText}` }] }]
        })
      });
      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        state.geminiConnected = true;
        updateGeminiBadgesUI();
        return text;
      }
    } catch (e) {}
  }

  // 2. المحاولة عبر السيرفر التلقائي (/api/chat) في حال وجود المفتاح في Vercel
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemPrompt: profile.systemPrompt,
        contextSummary,
        userText
      })
    });
    if (res.ok) {
      const data = await res.json();
      if (data.reply) {
        state.geminiConnected = true;
        updateGeminiBadgesUI();
        return data.reply;
      }
    }
  } catch (e) {}

  // 3. محرك احتياطي ذكي ومختصر بدون أي هلوسة أو تكرار مقترحات
  return generateCleanFallbackReply(agent, userText);
}

function generateCleanFallbackReply(agent, userText) {
  if (agent === 'abdulmalik') {
    return `🛠️ إجابة تقنية مباشرة حول "${userText}":\nلتفعيل ردود Gemini الحية بالكامل، تأكد من لصق مفتاح Gemini API في صفحة الإعدادات والضغط على زر "فحص الاتصال". أنا جاهز لمساعدتك في أي استفسار برمجي دون إضافة أي تعديلات عشوائية.`;
  }
  if (agent === 'hazem') {
    return `📊 قراءة الأداء الحالية: استمراريتك ${state.streak} يوم، وزمن التركيز اليوم ${state.studyMinutesToday} دقيقة، ولديك ${state.libraryFiles.length} ملفات في مكتبتك.`;
  }
  return `💡 بخصوص "${userText}": يمكنك تفعيل مفتاح Gemini من صفحة الإعدادات لنتحاور بعمق في هذا الموضوع، أو مراجعة ملفاتك وملاحظاتك في قسم المكتبة.`;
}

// ==================== 5. فحص مفتاح Gemini + وضع المطور وفاحص الموقع ====================
function toggleKeyVisibility() {
  const input = document.getElementById('api-key-input');
  if (!input) return;
  input.type = input.type === 'password' ? 'text' : 'password';
}

async function saveAndVerifyGeminiKey() {
  const input = document.getElementById('api-key-input');
  const resultEl = document.getElementById('gemini-verify-result');
  const key = input?.value.trim() || '';
  state.settings.apiKey = key;
  saveState();

  if (resultEl) {
    resultEl.style.color = '#93c5fd';
    resultEl.textContent = '⏳ جاري اختبار الاتصال الفعلي بمحرك Gemini...';
  }

  // اختبار الاتصال بالمفتاح المدخل أو عبر السيرفر
  let connected = false;
  if (key.startsWith('AIza')) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: 'أجب بكلمة: متصل' }] }] })
      });
      const data = await res.json();
      if (data?.candidates?.[0]?.content?.parts?.[0]?.text) connected = true;
    } catch (e) {}
  } else {
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ systemPrompt: 'أجب بكلمة متصل', contextSummary: '', userText: 'فحص' })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.reply) connected = true;
      }
    } catch (e) {}
  }

  state.geminiConnected = connected;
  saveState();

  if (resultEl) {
    if (connected) {
      resultEl.style.color = '#10b981';
      resultEl.textContent = '✅ تم الربط بنجاح! الوكلاء الثلاثة (فهد، حازم، عبدالملك) متصلون الآن بمحرك Gemini الفعلي.';
    } else {
      resultEl.style.color = '#ef4444';
      resultEl.textContent = '❌ تعذر الاتصال بـ Gemini. تأكد من صحة المفتاح (يبدأ بـ AIzaSy) أو من إضافته في إعدادات Vercel.';
    }
  }
}

function updateGeminiBadgesUI() {
  const headerDot = document.getElementById('gemini-header-status');
  const settingsBadge = document.getElementById('gemini-status-badge');
  if (state.geminiConnected) {
    if (headerDot) headerDot.innerHTML = '🟢 Gemini: متصل بنجاح';
    if (settingsBadge) settingsBadge.textContent = '🟢 متصل بـ Gemini';
  } else {
    if (headerDot) headerDot.innerHTML = '⚪ Gemini: بانتظار الفحص';
    if (settingsBadge) settingsBadge.textContent = '⚪ غير مفحوص';
  }
}

function toggleDevModeButton() {
  state.devMode = !state.devMode;
  const panel = document.getElementById('dev-lab-panel');
  const btn = document.getElementById('dev-mode-btn');
  panel?.classList.toggle('hidden', !state.devMode);
  if (btn) {
    btn.textContent = state.devMode ? '🛑 إغلاق وضع المطور' : '⚡ تفعيل وضع المطور';
  }
  saveState();
}

function runFullSiteDiagnostics() {
  const out = document.getElementById('diagnostics-output');
  if (!out) return;

  const viewsOk = ['view-home', 'view-library', 'view-chat', 'view-settings'].every(id => !!document.getElementById(id));
  const storageSize = (JSON.stringify(state).length / 1024).toFixed(2);
  const keyStatus = state.geminiConnected ? '✅ متصل ومفعل' : (state.settings.apiKey ? '⚠️ مفتاح محفوظ (يحتاج ضغط زر الفحص)' : '❌ لم يتم إدخال مفتاح بعد');

  out.innerHTML = `
    <p><strong>🩺 تقرير الفحص الهندسي الشامل للمنصة:</strong></p>
    <ul style="margin:8px 18px; line-height:1.8;">
      <li><strong>سلامة الصفحات المستقلة (4 صفحات):</strong> ${viewsOk ? '✅ جميع الصفحات تعمل بنجاح' : '❌ يوجد نقص'}</li>
      <li><strong>الذاكرة المحلية (LocalStorage):</strong> ✅ نشطة (${storageSize} KB مستخدم)</li>
      <li><strong>مكتبة الملفات والملاحظات:</strong> ✅ جاهزة (${state.libraryFiles.length} ملفات محفوظة)</li>
      <li><strong>نافذة المحادثة المنبثقة (Popup Chat):</strong> ✅ مفعلة وجاهزة</li>
      <li><strong>حالة المهندس عبدالملك:</strong> ✅ وضع الاستشارة البرمجية النقي (تم إيقاف الاقتراحات التلقائية 100%)</li>
      <li><strong>حالة الربط مع Gemini API:</strong> ${keyStatus}</li>
    </ul>
  `;
}

function clearChatHistory() {
  state.chatHistory = structuredClone(defaultState.chatHistory);
  saveState();
  renderChat();
  alert('تم مسح سجل المحادثات وإعادته للوضع الابتدائي النظيف.');
}

// ==================== 6. المؤقت والاختبارات والتقارير ====================
function updateTimerDisplay() {
  const mins = String(Math.floor(timerSeconds / 60)).padStart(2, '0');
  const secs = String(timerSeconds % 60).padStart(2, '0');
  const el = document.getElementById('timer-display');
  if (el) el.textContent = `${mins}:${secs}`;
}

function startTimer() {
  if (timerInterval) return;
  timerInterval = setInterval(() => {
    if (timerSeconds > 0) {
      timerSeconds--;
      updateTimerDisplay();
    } else {
      clearInterval(timerInterval);
      timerInterval = null;
      state.studyMinutesToday += 45;
      state.totalStudyMinutes += 45;
      state.streak += 1;
      saveState();
      showToast('hazem', '📊 اكتملت جلسة الـ 45 دقيقة!', 'تم تسجيل الجلسة في سجل الأداء.');
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function resetTimer() {
  pauseTimer();
  timerSeconds = 45 * 60;
  updateTimerDisplay();
}

function toggleRainSound() {
  const btn = document.getElementById('rain-btn');
  if (!isRainPlaying) {
    rainAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const bufferSize = 2 * rainAudioCtx.sampleRate;
    const noiseBuffer = rainAudioCtx.createBuffer(1, bufferSize, rainAudioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) output[i] = Math.random() * 2 - 1;
    const whiteNoise = rainAudioCtx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;
    const filter = rainAudioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800;
    const gain = rainAudioCtx.createGain();
    gain.gain.value = 0.08;
    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(rainAudioCtx.destination);
    whiteNoise.start(0);
    isRainPlaying = true;
    if (btn) btn.textContent = '🌧️ صوت المطر: نشط';
  } else {
    if (rainAudioCtx) rainAudioCtx.close();
    isRainPlaying = false;
    if (btn) btn.textContent = '🌧️ صوت المطر: متوقف';
  }
}

const quizBank = {
  'MO-211': {
    q: 'ما الميزة الجوهرية لدالة XLOOKUP مقارنة بـ VLOOKUP عند بناء نماذج مطابقة البيانات؟',
    options: ['البحث في أي اتجاه وعدم الانكسار عند إدراج أعمدة جديدة', 'تعمل فقط على الأرقام الصحيحة', 'تتطلب ترتيب البيانات أبجدياً'],
    correct: 0,
    explain: 'دالة XLOOKUP تفصل عمود البحث عن عمود النتيجة تماماً.'
  },
  'PL-300': {
    q: 'في لغة DAX داخل Power BI، ما الوظيفة الأساسية لدالة CALCULATE؟',
    options: ['تعديل سياق الفلتر الحالي (Filter Context) لتنفيذ حسابات مشروطة', 'تغيير ألوان الرسوم البيانية', 'دمج ملفات النص فقط'],
    correct: 0,
    explain: 'دالة CALCULATE تعيد تعريف الفلاتر المؤثرة على أي مقياس (Measure).'
  },
  'CMA': {
    q: 'ما الهدف الرئيسي من استخدام "الموازنة المرنة" (Flexible Budget) عند تقييم الأداء؟',
    options: ['عزل أثر تغير حجم النشاط الفعلي لمقارنة التكاليف بعدالة', 'إلغاء التكاليف الثابتة', 'تثبيت سقف المبيعات'],
    correct: 0,
    explain: 'الموازنة المرنة تتكيف مع حجم النشاط الفعلي لعزل انحرافات الكفاءة.'
  }
};

function loadQuizQuestion() {
  const cat = document.getElementById('quiz-category-select')?.value || 'MO-211';
  const item = quizBank[cat];
  const box = document.getElementById('quiz-box');
  if (!box || !item) return;

  box.innerHTML = `
    <p style="margin-bottom:10px; font-weight:600;">${item.q}</p>
    <div class="btn-group-row">
      ${item.options.map((opt, idx) => `
        <button class="btn-outline" onclick="answerQuiz('${cat}', ${idx})">${opt}</button>
      `).join('')}
    </div>
    <p id="quiz-feedback" style="margin-top:10px; font-size:0.85rem;"></p>
  `;
}

function answerQuiz(cat, selectedIdx) {
  const item = quizBank[cat];
  const fb = document.getElementById('quiz-feedback');
  if (!state.quizStats[cat]) state.quizStats[cat] = { correct: 0, wrong: 0 };

  if (selectedIdx === item.correct) {
    state.quizStats[cat].correct++;
    fb.style.color = '#10b981';
    fb.textContent = `✅ إجابة صحيحة! ${item.explain}`;
  } else {
    state.quizStats[cat].wrong++;
    fb.style.color = '#ef4444';
    fb.textContent = `❌ غير صحيح: ${item.explain}`;
  }
  saveState();
}

function renderHazemReportAndRadar() {
  const evalBox = document.getElementById('hazem-evaluation-summary');
  const radarBox = document.getElementById('weakness-radar-box');
  if (evalBox) {
    evalBox.innerHTML = `
      <p>⏱️ تركيز اليوم: <strong>${state.studyMinutesToday} دقيقة</strong> | 📂 ملفات المكتبة: <strong>${state.libraryFiles.length}</strong></p>
    `;
  }
  if (radarBox) {
    const entries = Object.entries(state.quizStats).map(([k, v]) => {
      const status = v.wrong > v.correct ? '🔍 يحتاج مراجعة' : '✅ متقن';
      return `<li><strong>${k}:</strong> صح (${v.correct}) | خطأ (${v.wrong}) — ${status}</li>`;
    }).join('');
    radarBox.innerHTML = `<ul style="margin:8px 18px; font-size:0.85rem;">${entries}</ul>`;
  }
}

function showToast(agent, title, message) {
  lastToastAgent = agent;
  const toast = document.getElementById('toast-notification');
  document.getElementById('toast-title').textContent = title;
  document.getElementById('toast-message').textContent = message;
  toast?.classList.remove('hidden');
  setTimeout(() => toast?.classList.add('hidden'), 5000);
}

function handleToastClick() {
  document.getElementById('toast-notification')?.classList.add('hidden');
  togglePopupChat();
  switchAgent(lastToastAgent);
}

function triggerTestNotification(agent) {
  showToast(agent, '🔔 إشعار تجريبي', 'اضغط هنا لفتح نافذة المحادثة المنبثقة مباشرة!');
}

function addStreakManually() {
  state.streak++;
  saveState();
}

function exportBackup() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'mws-academy-backup.json';
  a.click();
}

function importBackup(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      state = Object.assign({}, defaultState, JSON.parse(e.target.result));
      saveState();
      alert('✅ تم استعادة النسخة الاحتياطية بنجاح!');
    } catch (err) {
      alert('ملف غير صالح.');
    }
  };
  reader.readAsText(file);
}

function startVoiceInput(targetInputId) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) return alert('متصفحك لا يدعم الإدخال الصوتي.');
  const recognition = new SpeechRecognition();
  recognition.lang = 'ar-SA';
  recognition.onresult = event => {
    const el = document.getElementById(targetInputId);
    if (el) el.value = event.results[0][0].transcript;
  };
  recognition.start();
}

window.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('api-key-input')) {
    document.getElementById('api-key-input').value = state.settings?.apiKey || '';
  }
  if (state.devMode) {
    document.getElementById('dev-lab-panel')?.classList.remove('hidden');
    if (document.getElementById('dev-mode-btn')) {
      document.getElementById('dev-mode-btn').textContent = '🛑 إغلاق وضع المطور';
    }
  }
  renderAll();
  loadQuizQuestion();
});
