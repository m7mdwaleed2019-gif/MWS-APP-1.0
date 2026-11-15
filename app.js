// ==================== 1. قاعدة البيانات والحالة الصارمة (Strict State) ====================
const STORAGE_KEY = 'MWS_AI_ACADEMY_V7_STRICT';

const defaultState = {
  streak: 1,
  studyMinutesToday: 0,
  totalStudyMinutes: 45,
  currentAgent: 'fahad',
  devMode: false,
  // الحالة الافتراضية أوفلاين دائماً حتى يثبت الاتصال الفعلي بنموذج حقيقي
  geminiConnected: false,
  aiProviderName: 'Offline',
  lastAiError: 'لم يتم التحقق من اتصال نموذج الذكاء الاصطناعي بعد.',
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
    fahad: [],
    hazem: [],
    abdulmalik: []
  }
};

const agentProfiles = {
  fahad: {
    displayName: '💡 فهد',
    systemPrompt: `أنت "فهد"، مرشد أكاديمي وخبير عملي في تحليل البيانات (Excel المتقدم، Power Query، Power BI، DAX) والتحليل المالي (CMA) وهندسة الذكاء الاصطناعي.
تحدث بأسلوب بشري طبيعي وذكي ومفصل، واشرح بالأمثلة العملية والخطوات الواضحة.`,
    skills: [
      { label: '🧩 تبسيط مفهوم بعمق', prompt: 'اشرح لي بعمق وأمثلة عملية الفرق بين Power Query ولغة DAX ومتى أستخدم كلاً منهما.' },
      { label: '🧠 سيناريو تطبيقي', prompt: 'اطرح عليّ مشكلة عملية واقعية في تحليل البيانات وناقشني في خطوات حلها.' },
      { label: '📝 تلخيص احترافي', prompt: 'لخص لي أهم القواعد الهندسية لبناء نموذج Star Schema احترافي في Power BI.' }
    ]
  },
  hazem: {
    displayName: '📊 حازم',
    systemPrompt: `أنت "حازم"، مستشار ومحلل أداء أكاديمي ومهني رصين ودقيق جداً.
حلل أرقام المتعلم (الاستمرارية، دقائق التركيز، نتائج الاختبارات، وملفات المكتبة) لتقدم تشخيصاً حقيقياً وخطط عمل مخصصة.`,
    skills: [
      { label: '🔍 تشخيص الفجوات', prompt: 'حلل أدائي الحالي في الاختبارات والمحاور وحدد بدقة أين أحتاج مراجعة وكيف أعالجها.' },
      { label: '📈 تقييم التركيز', prompt: 'قيّم استمراريتي وجودة جلسات التركيز وقدم لي استراتيجية عملية لرفع الكفاءة.' },
      { label: '🗓️ جدول الأسبوع', prompt: 'صمم لي خطة مراجعة أسبوعية مفصلة لتوزيع جلسات الـ 45 دقيقة.' }
    ]
  },
  abdulmalik: {
    displayName: '🛠️ عبدالملك',
    systemPrompt: `أنت "عبدالملك"، كبير مهندسي البرمجيات ونظم الذكاء الاصطناعي.
اشرح الأكواد البرمجية، قواعد البيانات، الـ APIs، وهندسة الأوامر بأسلوب هندسي واضح وعميق. لا تقترح إضافة أدوات للموقع من تلقاء نفسك.`,
    skills: [
      { label: '💻 شرح معمارية الكود', prompt: 'اشرح لي كيف يعمل الكود البرمجي لهذا الموقع وكيف يتصل بـ API الذكاء الاصطناعي.' },
      { label: '🗄️ قواعد البيانات السحابية', prompt: 'اشرح لي بالتفصيل كيف نربط تطبيق ويب بقاعدة بيانات Supabase خطوة بخطوة.' },
      { label: '🤖 هندسة الوكلاء (Agents)', prompt: 'كيف أطور وكلاء ذكاء اصطناعي بذاكرة طويلة المدى ومهارات متقدمة؟' }
    ]
  }
};

let state = loadState();
// عند كل فتح للموقع نبدأ بحالة أوفلاين حتى يتم فحص المفتاح فعلياً
state.geminiConnected = false;

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

// ==================== 2. رسم الواجهة وحالة الأونلاين/أوفلاين ====================
function renderAll() {
  renderHeaderBadges();
  renderMasteryIndex();
  renderCertificates();
  renderProjects();
  renderLibrary();
  renderHazemReportAndRadar();
  updateAgentsOnlineOfflineUI();
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
  const statusPill = state.geminiConnected
    ? `<span class="badge-pill" style="border-color:#10b981; color:#10b981;">🟢 الوكلاء: أونلاين</span>`
    : `<span class="badge-pill" style="border-color:#ef4444; color:#fca5a5;">🔴 الوكلاء: أوفلاين</span>`;

  container.innerHTML = `
    ${statusPill}
    <span class="badge-pill">🔥 ${state.streak} يوم</span>
    <span class="badge-pill">⏱️ ${state.studyMinutesToday} د</span>
    <span class="badge-pill">📂 ${state.libraryFiles.length} ملفات</span>
  `;
}

function updateAgentsOnlineOfflineUI() {
  const isOnline = !!state.geminiConnected;
  const headerDot = document.getElementById('gemini-header-status');
  const settingsBadge = document.getElementById('gemini-status-badge');

  // تحديث شريط الهيدر والإعدادات
  if (isOnline) {
    if (headerDot) {
      headerDot.style.color = '#10b981';
      headerDot.innerHTML = `🟢 متصل بنموذج حقيقي (${state.aiProviderName})`;
    }
    if (settingsBadge) {
      settingsBadge.style.borderColor = '#10b981';
      settingsBadge.style.color = '#10b981';
      settingsBadge.textContent = `🟢 أونلاين (${state.aiProviderName})`;
    }
  } else {
    if (headerDot) {
      headerDot.style.color = '#ef4444';
      headerDot.innerHTML = '🔴 الوكلاء: أوفلاين (غير متصلين بنموذج حقيقي)';
    }
    if (settingsBadge) {
      settingsBadge.style.borderColor = '#ef4444';
      settingsBadge.style.color = '#fca5a5';
      settingsBadge.textContent = '🔴 أوفلاين (Offline)';
    }
  }

  // تحديث أسماء التبويبات للوكلاء الثلاثة لتوضيح الأونلاين والأوفلاين
  const statusTag = isOnline ? '🟢 أونلاين' : '🔴 أوفلاين';
  ['fahad', 'hazem', 'abdulmalik'].forEach(key => {
    const baseName = agentProfiles[key].displayName;
    const mainTab = document.getElementById(`tab-${key}`);
    const popTab = document.getElementById(`pop-tab-${key}`);
    if (mainTab) mainTab.innerHTML = `${baseName} <small style="display:block; font-size:0.7rem;">(${statusTag})</small>`;
    if (popTab) popTab.innerHTML = `${baseName} (${ isOnline ? '🟢' : '🔴' })`;
  });

  // قفل أو فتح حقول الإدخال في الدردشة بناءً على حالة الاتصال الحقيقية
  const mainInput = document.getElementById('chat-input');
  const popInput = document.getElementById('popup-chat-input');
  if (mainInput) {
    mainInput.disabled = !isOnline;
    mainInput.placeholder = isOnline
      ? `تحدث مباشرة مع ${agentProfiles[state.currentAgent].displayName} (متصل بـ ${state.aiProviderName})...`
      : '🔴 الوكيل أوفلاين حالياً — يرجى ربط مفتاح ذكاء اصطناعي فعال من صفحة الإعدادات...';
  }
  if (popInput) {
    popInput.disabled = !isOnline;
    popInput.placeholder = isOnline
      ? 'اكتب رسالتك هنا...'
      : '🔴 الوكيل أوفلاين (افتح الإعدادات للربط)';
  }
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

// ==================== 3. مكتبة الملفات والملاحظات ====================
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
  if (!state.geminiConnected) {
    renderChat();
    return;
  }
  const popInput = document.getElementById('popup-chat-input');
  if (popInput) {
    popInput.value = `لدي ملف بعنوان "${item.name}" في مسار (${item.category}) وملاحظاتي عليه: "${item.notes || 'لا توجد'}". اشرح لي أهم المفاهيم والتطبيقات العملية المرتبطة به بعمق.`;
    sendMessage('popup');
  }
}

// ==================== 4. الدردشة الصارمة (لا ردود وهمية أبداً - إما نموذج حقيقي أو أوفلاين) ====================
function switchAgent(agentKey) {
  state.currentAgent = agentKey;
  document.querySelectorAll('.agent-tab, .mini-tab').forEach(t => t.classList.remove('active'));
  document.getElementById(`tab-${agentKey}`)?.classList.add('active');
  document.getElementById(`pop-tab-${agentKey}`)?.classList.add('active');
  updateAgentsOnlineOfflineUI();
  renderChat();
}

function togglePopupChat() {
  const modal = document.getElementById('popup-chat-modal');
  modal?.classList.toggle('hidden');
  updateAgentsOnlineOfflineUI();
  renderChat();
}

function renderChat() {
  const agent = state.currentAgent;
  const profile = agentProfiles[agent];
  const skillsBar = document.getElementById('agent-skills-bar');
  const mainBox = document.getElementById('chat-messages');
  const popupBox = document.getElementById('popup-chat-messages');

  if (skillsBar && profile) {
    if (state.geminiConnected) {
      skillsBar.innerHTML = profile.skills.map(s => `
        <button class="btn-outline btn-sm" onclick="sendQuickPrompt('${s.prompt}')">${s.label}</button>
      `).join('');
    } else {
      skillsBar.innerHTML = `
        <button class="btn-danger btn-sm" onclick="switchView('settings')">🔴 الوكلاء أوفلاين — اضغط هنا لربط مفتاح الذكاء الاصطناعي وتفعيلهم</button>
      `;
    }
  }

  // إذا كان الوكيل أوفلاين، نعرض لافتة أوفلاين صريحة داخل صندوق الدردشة
  if (!state.geminiConnected) {
    const offlineHtml = `
      <div class="card" style="border-color:#ef4444; background:rgba(239,68,68,0.08); text-align:center; margin:auto;">
        <h2 style="color:#fca5a5; margin-bottom:8px;">🔴 ${profile.displayName} في وضع أوفلاين (Offline)</h2>
        <p style="font-size:0.85rem; color:#cbd5e1; margin-bottom:10px;">
          تم إيقاف الردود المبرمجة مسبقاً بناءً على طلبك. هذا الوكيل لا يعمل إلا عند اتصاله بنموذج ذكاء اصطناعي حقيقي (Live AI Model).
        </p>
        <p style="font-size:0.8rem; color:#f87171; margin-bottom:12px;">
          <strong>السبب الحالي:</strong> ${state.lastAiError}
        </p>
        <button class="btn-primary btn-sm" onclick="switchView('settings')">⚙️ الذهاب للإعدادات لتشغيل الوكلاء أونلاين</button>
      </div>
    `;
    if (mainBox) mainBox.innerHTML = offlineHtml;
    if (popupBox) popupBox.innerHTML = offlineHtml;
    return;
  }

  const msgs = state.chatHistory[agent] || [];
  if (msgs.length === 0) {
    const welcomeHtml = `
      <div class="msg bot">
        <div>🟢 <strong>${profile.displayName} (أونلاين — متصل فعلياً بـ ${state.aiProviderName}):</strong><br>أهلاً بك! أنا متصل الآن بنموذج الذكاء الاصطناعي الحقيقي وجاهز لأي حوار عميق.</div>
      </div>
    `;
    if (mainBox) mainBox.innerHTML = welcomeHtml;
    if (popupBox) popupBox.innerHTML = welcomeHtml;
    return;
  }

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
  if (!state.geminiConnected) {
    alert('🔴 الوكيل أوفلاين حالياً! يرجى تفعيل المفتاح من الإعدادات أولاً.');
    return;
  }
  const input = document.getElementById('chat-input');
  if (input) {
    input.value = text;
    sendMessage('main');
  }
}

async function sendMessage(source = 'main') {
  if (!state.geminiConnected) {
    alert('🔴 الوكلاء في وضع أوفلاين. يرجى تفعيل الاتصال من صفحة الإعدادات.');
    return;
  }

  const inputId = source === 'popup' ? 'popup-chat-input' : 'chat-input';
  const input = document.getElementById(inputId);
  if (!input || !input.value.trim()) return;
  const userText = input.value.trim();
  input.value = '';

  const agent = state.currentAgent;
  state.chatHistory[agent].push({ sender: 'user', text: userText });
  state.chatHistory[agent].push({ sender: 'bot', text: '⏳ جاري التوليد الحي من نموذج الذكاء الاصطناعي...' });
  renderChat();

  const result = await executeStrictAICall(agent, userText);
  state.chatHistory[agent].pop();

  if (result.ok) {
    state.chatHistory[agent].push({ sender: 'bot', text: result.reply });
  } else {
    // إذا انقطع الاتصال أثناء الحوار يتحول الوكيل فوراً إلى أوفلاين
    state.geminiConnected = false;
    state.lastAiError = result.error;
    updateAgentsOnlineOfflineUI();
  }

  saveState();
  renderChat();
}

// دالة الاتصال الصارم: إما رد حقيقي من النموذج (ok: true) أو إعلان أوفلاين صريح (ok: false)
async function executeStrictAICall(agent, userText) {
  const profile = agentProfiles[agent];
  const doneTasks = state.certificates.flatMap(c => c.tasks.filter(t => t.done).map(t => t.text));
  const filesSummary = state.libraryFiles.map(f => `${f.name} (${f.notes})`).join(' | ');
  const contextSummary = `بيانات المتعلم: الاستمرارية=${state.streak} يوم، تركيز اليوم=${state.studyMinutesToday} د، المهام المتقنة=${doneTasks.join('، ') || 'في البداية'}، ملفات المكتبة=${filesSummary || 'لا يوجد'}.`;

  const recentHistory = (state.chatHistory[agent] || [])
    .slice(-7, -1)
    .map(m => `${m.sender === 'user' ? 'المتعلم' : 'الوكيل'}: ${m.text}`)
    .join('\n');

  const key = (state.settings?.apiKey || '').trim();
  if (!key) {
    return { ok: false, error: 'لا يوجد مفتاح API محفوظ في الإعدادات.' };
  }

  // 1. إذا كان المفتاح من منصة Groq (يبدأ بـ gsk_)
  if (key.startsWith('gsk_')) {
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: `${profile.systemPrompt}\n\n${contextSummary}` },
            { role: 'user', content: `سجل الحوار:\n${recentHistory}\n\nالرسالة: ${userText}` }
          ],
          temperature: 0.7
        })
      });
      const data = await res.json();
      if (data?.choices?.[0]?.message?.content) {
        state.geminiConnected = true;
        state.aiProviderName = 'Groq Llama-3.3-70B';
        return { ok: true, reply: data.choices[0].message.content };
      }
      return { ok: false, error: `رفض سيرفر Groq المفتاح: ${data?.error?.message || 'Unknown error'}` };
    } catch (e) {
      return { ok: false, error: `تعذر الوصول لسيرفر Groq: ${e.message}` };
    }
  }

  // 2. إذا كان المفتاح من OpenAI (يبدأ بـ sk-)
  if (key.startsWith('sk-')) {
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: `${profile.systemPrompt}\n\n${contextSummary}` },
            { role: 'user', content: `سجل الحوار:\n${recentHistory}\n\nالرسالة: ${userText}` }
          ]
        })
      });
      const data = await res.json();
      if (data?.choices?.[0]?.message?.content) {
        state.geminiConnected = true;
        state.aiProviderName = 'OpenAI GPT-4o';
        return { ok: true, reply: data.choices[0].message.content };
      }
      return { ok: false, error: `رفض سيرفر OpenAI المفتاح: ${data?.error?.message || 'Invalid Key'}` };
    } catch (e) {
      return { ok: false, error: `خطأ اتصال بـ OpenAI: ${e.message}` };
    }
  }

  // 3. فحص الاتصال عبر سيرفر الموقع (/api/chat) أولاً ثم الاتصال المباشر بـ Google Gemini
  try {
    const serverRes = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemPrompt: profile.systemPrompt,
        contextSummary: `${contextSummary}\n${recentHistory}`,
        userText,
        clientKey: key
      })
    });
    if (serverRes.ok) {
      const serverData = await serverRes.json();
      if (serverData && serverData.reply) {
        state.geminiConnected = true;
        state.aiProviderName = 'Google Gemini (Server)';
        return { ok: true, reply: serverData.reply };
      }
    }
  } catch (e) {}

  // 4. الاتصال المباشر بسيرفر Google Gemini
  const geminiModels = ['gemini-3.8-flash'];
  let lastGoogleErr = '';

  for (const modelName of geminiModels) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${encodeURIComponent(key)}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: `${profile.systemPrompt}\n\n${contextSummary}\n\n${recentHistory}\n\nسؤال المتعلم: ${userText}` }]
          }]
        })
      });
      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        state.geminiConnected = true;
        state.aiProviderName = `Google ${modelName}`;
        return { ok: true, reply: text };
      }
      if (data?.error?.message) {
        lastGoogleErr = data.error.message;
      }
    } catch (e) {
      lastGoogleErr = e.message;
    }
  }

  // إذا وصلنا هنا يعني أن المفتاح لم ينجح مع أي نموذج حقيقي -> أوفلاين صريح
  if (key.startsWith('AQ.') || key.startsWith('aq.')) {
    return {
      ok: false,
      error: `مفتاح (${key.slice(0, 6)}...) مرفوض من Google Gemini API المباشر (${lastGoogleErr || 'API key not valid'}). لتشغيل الوكلاء أونلاين فوراً، استخرج مفتاحاً مجانياً يبدأ بـ (gsk_) من موقع console.groq.com/keys أو مفتاح Gemini قياسي يبدأ بـ (AIzaSy).`
    };
  }

  return {
    ok: false,
    error: `رفض سيرفر الذكاء الاصطناعي المفتاح المدخل (${lastGoogleErr || 'Invalid API Key'}).`
  };
}

// ==================== 5. فحص الاتصال الصارم في الإعدادات + وضع المطور ====================
function toggleKeyVisibility() {
  const input = document.getElementById('api-key-input');
  if (!input) return;
  input.type = input.type === 'password' ? 'text' : 'password';
}

async function saveAndVerifyGeminiKey() {
  const input = document.getElementById('api-key-input');
  const resultEl = document.getElementById('gemini-verify-result');
  const key = (input?.value || '').trim();

  state.settings.apiKey = key;

  if (!key) {
    state.geminiConnected = false;
    state.aiProviderName = 'Offline';
    state.lastAiError = 'لم يتم إدخال مفتاح API.';
    saveState();
    if (resultEl) {
      resultEl.style.color = '#ef4444';
      resultEl.innerHTML = '🔴 <strong>الوكلاء في وضع أوفلاين (Offline):</strong> الخانة فارغة، يرجى إدخال مفتاح API فعال.';
    }
    return;
  }

  if (resultEl) {
    resultEl.style.color = '#93c5fd';
    resultEl.textContent = '⏳ جاري إرسال نبضة اختبار حقيقية لسيرفر الذكاء الاصطناعي...';
  }

  const check = await executeStrictAICall('fahad', 'أجب بكلمة واحدة فقط: متصل');

  if (check.ok) {
    state.geminiConnected = true;
    state.lastAiError = '';
    saveState();
    if (resultEl) {
      resultEl.style.color = '#10b981';
      resultEl.innerHTML = `🟢 <strong>الوكلاء الآن أونلاين (Online)!</strong><br>تم الاتصال الفعلي بنموذج: <strong>${state.aiProviderName}</strong><br>رد النموذج المباشر: "${check.reply}"`;
    }
  } else {
    state.geminiConnected = false;
    state.aiProviderName = 'Offline';
    state.lastAiError = check.error;
    saveState();
    if (resultEl) {
      resultEl.style.color = '#ef4444';
      resultEl.innerHTML = `🔴 <strong>فشل الاتصال — الوكلاء الآن في وضع أوفلاين (Offline)</strong><br>السبب التقني: ${check.error}`;
    }
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
  const agentsStateText = state.geminiConnected
    ? `<span style="color:#10b981;">🟢 أونلاين — متصلون فعلياً بنموذج (${state.aiProviderName})</span>`
    : `<span style="color:#ef4444;">🔴 أوفلاين (Offline) — ${state.lastAiError}</span>`;

  out.innerHTML = `
    <p><strong>🩺 تقرير الفحص الهندسي الصارم للمنصة:</strong></p>
    <ul style="margin:8px 18px; line-height:1.8;">
      <li><strong>سلامة الصفحات المستقلة (4 صفحات):</strong> ${viewsOk ? '✅ تعمل بالكامل' : '❌ يوجد نقص'}</li>
      <li><strong>الذاكرة المحلية (LocalStorage):</strong> ✅ نشطة (${storageSize} KB)</li>
      <li><strong>مكتبة الملفات والملاحظات:</strong> ✅ جاهزة (${state.libraryFiles.length} ملفات)</li>
      <li><strong>الردود الوهمية/المبرمجة مسبقاً:</strong> 🚫 معطلة نهائياً (Strict Real-AI Only)</li>
      <li><strong>حالة الوكلاء الثلاثة (فهد، حازم، عبدالملك):</strong> ${agentsStateText}</li>
    </ul>
  `;
}

function clearChatHistory() {
  state.chatHistory = { fahad: [], hazem: [], abdulmalik: [] };
  saveState();
  renderChat();
  alert('تم مسح سجل المحادثات بالكامل.');
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
  if (!state.geminiConnected) return alert('🔴 الوكلاء في وضع أوفلاين حالياً.');
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

// عند تحميل الصفحة: نفحص تلقائياً هل المفتاح المحفوظ يتصل بنموذج حقيقي أم نعلن أوفلاين
window.addEventListener('DOMContentLoaded', async () => {
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

  // فحص تلقائي صامت عند فتح الموقع إذا كان هناك مفتاح محفوظ
  if (state.settings?.apiKey && state.settings.apiKey.length > 5) {
    const check = await executeStrictAICall('fahad', 'أجب بكلمة: متصل');
    state.geminiConnected = check.ok;
    if (!check.ok) state.lastAiError = check.error;
    renderAll();
  }
});
