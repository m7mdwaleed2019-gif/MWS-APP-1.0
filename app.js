// ==================== 1. قاعدة البيانات والحالة المعرفية (State) ====================
const STORAGE_KEY = 'MWS_AI_ACADEMY_V3';

const defaultState = {
  streak: 1,
  studyMinutesToday: 0,
  totalStudyMinutes: 45,
  currentAgent: 'fahad',
  devMode: false,
  settings: {
    apiKey: '',
    tgToken: '',
    tgChatId: ''
  },
  certificates: [
    {
      id: 'MO-211',
      title: 'تحليل البيانات المتقدم وهندسة الجداول (Excel Expert MO-211)',
      badge: 'المسار التأسيسي الأول',
      status: 'studying',
      tasks: [
        { id: 't1', text: 'إتقان دوال البحث المرجعي الديناميكي (XLOOKUP & INDEX/MATCH) لمعالجة قواعد البيانات الكبيرة', done: true },
        { id: 't2', text: 'أتمتة استيراد وتنظيف البيانات المالية والتشغيلية عبر محرك Power Query', done: false },
        { id: 't3', text: 'تصميم النماذج التحليلية والجداول المحورية المتقدمة (PivotTables & Dynamic Arrays)', done: false }
      ]
    },
    {
      id: 'PL-300',
      title: 'ذكاء الأعمال ونمذجة البيانات التفاعلية (Power BI Data Analyst PL-300)',
      badge: 'مسار التحليل المتقدم',
      status: 'planned',
      tasks: [
        { id: 't4', text: 'هندسة العلاقات بين الجداول وبناء نموذج النجمة (Star Schema Data Modeling)', done: false },
        { id: 't5', text: 'كتابة معادلات التحليل الزمني والمالي المتقدمة باستخدام لغة DAX', done: false },
        { id: 't6', text: 'تصميم لوحات المؤشرات القياسية (Executive Dashboards) لدعم اتخاذ القرار', done: false }
      ]
    },
    {
      id: 'CMA-P1',
      title: 'التخطيط المالي، الرقابة، وتحليل الأداء (CMA - Part 1)',
      badge: 'العمق الاستراتيجي والمالي',
      status: 'planned',
      tasks: [
        { id: 't7', text: 'تحليل القوائم المالية ومعايير الاعتراف بالإيرادات وتقييم الأصول', done: false },
        { id: 't8', text: 'بناء الموازنات التقديرية المرنة (Flexible Budgets) والتنبؤ بالتدفقات النقدية', done: false },
        { id: 't9', text: 'إدارة التكاليف التشغيلية، تحليل الانحرافات، وأطر الرقابة الداخلية', done: false }
      ]
    }
  ],
  projects: [
    'تصميم نموذج Power Query مؤتمت لتنظيف ومطابقة بيانات العمليات اليومية وتقليص زمن المعالجة بنسبة 60%.'
  ],
  quizStats: {
    'MO-211': { correct: 2, wrong: 0 },
    'PL-300': { correct: 1, wrong: 1 },
    'CMA': { correct: 0, wrong: 1 }
  },
  abdulmalikMods: [],
  pendingProposal: null,
  chatHistory: {
    fahad: [
      {
        sender: 'bot',
        text: 'أهلاً بك يا صديقي! معك فهد 💡. أنا هنا لنفكك أي مفهوم معقد في تحليل البيانات أو المالية ونحوله إلى فكرة بسيطة وممتعة. اختر أي مهارة من مهاراتي بالأعلى أو حدثني عفوياً عما تدرسه اليوم!'
      }
    ],
    hazem: [
      {
        sender: 'bot',
        text: 'مرحباً بك. معك حازم 📊، محلل الأداء وجودة التعلم. مهمتي ليست الضغط عليك، بل قراءة أرقامك بهدوء وموضوعية لنكتشف معاً أين تكمن نقاط قوتك وأي المهارات تحتاج منا تركيزاً أعمق.'
      }
    ],
    abdulmalik: [
      {
        sender: 'bot',
        text: 'حياك الله يا بشمهندس! معك عبدالملك 🛠️، مهندس النظم والأدوات الذكية. يسعدني بناء أي أداة برمجية تفاعلية تخدم تعلمك داخل المنصة. تذكر أنني أعمل تحت إشرافك الكامل: أقترح الأداة أولاً، ولا أثبتها إلا بعد اعتمادك، ويمكنك التراجع عنها أو حذفها في أي لحظة.'
      }
    ]
  }
};

// تعريف الشخصيات والمهارات التخصصية لكل وكيل (Human-like Personas & Skills)
const agentProfiles = {
  fahad: {
    name: 'فهد — المرشد المعرفي وشريك التعلم',
    bio: '💡 <strong>أسلوب فهد:</strong> حواري، قريب للنفس، يربط النظريات بالواقع العملي، ويبسط أعقد المفاهيم بدون تعقيد أكاديمي.',
    systemPrompt: 'أنت "فهد"، مرشد معرفي وصديق دراسة ذكي وودود جداً. تتحدث بعربية طبيعية راقية ودافئة (بأسلوب بشري غير آلي). هدفك مساعدة المستخدم على الفهم العميق لتحليل البيانات (Excel, Power BI) والمحاسبة الإدارية (CMA) وهندسة الذكاء الاصطناعي، دون ذكر أي أرقام عن الرواتب. استخدم الأمثلة الواقعية والقصص المبسطة.',
    skills: [
      { label: '🧩 تبسيط مفهوم معقد بأمثلة واقعية', prompt: 'استخدم مهارة التبسيط الواقعي: اشرح لي الفرق العملي بين Power Query ولغة DAX في Power BI كأننا نرتب مكتبة أو متجر.' },
      { label: '🧠 جلسة عصف وسؤال سقراطي', prompt: 'استخدم مهارة الحوار السقراطي: اطرح عليّ سيناريو عملياً ذكياً في تحليل البيانات وناقشني في طريقة حله خطوة بخطوة.' },
      { label: '📝 تلخيص ذكي لدرس اليوم', prompt: 'استخدم مهارة التلخيص الذهبي: أعطني خلاصة مركزة في 3 نقاط ذهبية حول كيفية بناء نموذج بيانات نظيف (Star Schema).' }
    ]
  },
  hazem: {
    name: 'حازم — محلل الأداء وجودة التعلم',
    bio: '📊 <strong>أسلوب حازم:</strong> موضوعي، رصين، يقرأ البيانات بهدوء ليقدم لك تشخيصاً دقيقاً لجودة استيعابك واستمراريتك.',
    systemPrompt: 'أنت "حازم"، محلل أداء ومستشار جودة تعلم ذو شخصية هادئة، رصينة، وموضوعية جداً. تتحدث بأسلوب بشري احترافي يحترم عقل المتعلم. لا تتحدث عن الرواتب، بل تركز على جودة التركيز، تشخيص الفجوات المعرفية من إحصائيات الاختبارات، وتصميم خطط مراجعة ذكية.',
    skills: [
      { label: '🔍 تشخيص الفجوات المعرفية', prompt: 'استخدم مهارة التشخيص المعرفي: بناءً على أدائي في الاختبارات والمحاور، حلل نقاط قوتي والفجوات التي تحتاج مراجعة.' },
      { label: '📈 تقييم جودة التركيز والاستمرارية', prompt: 'استخدم مهارة تحليل الأداء: قيّم مستوى التزامي وجودة جلسات التعلم العميق الخاصة بي وقدم لي توصية عملية.' },
      { label: '🗓️ تصميم خطة مراجعة أسبوعية', prompt: 'استخدم مهارة التخطيط الدراسي: صمم لي جدولاً مرناً ومقسماً لتوزيع جلسات الـ 45 دقيقة خلال هذا الأسبوع.' }
    ]
  },
  abdulmalik: {
    name: 'عبدالملك — مهندس النظم والأدوات الذكية',
    bio: '🛠️ <strong>أسلوب عبدالملك:</strong> مهندس برمجيات محترف، واضح، يبني لك أدوات تفاعلية مخصصة داخل بيئة معزولة (Sandbox) بعد موافقتك.',
    systemPrompt: 'أنت "عبدالملك"، مهندس برمجيات ونظم ذكاء اصطناعي محترف ولبق. تساعد المستخدم في فهم بنية تطبيقاته وبناء أدوات تفاعلية مساعدة داخل المنصة.',
    skills: [
      { label: '➕ بناء بطاقات استذكار (Flashcards)', prompt: 'أضف أداة بطاقات الاستذكار السريعة للمفاهيم' },
      { label: '➕ بناء مختبر محاكاة الدوال (Excel/DAX)', prompt: 'أضف أداة مرجع ومحاكاة دوال التحليل' },
      { label: '➕ بناء حاسبة الضريبة والنسب المالية', prompt: 'أضف حاسبة التحليل المالي والضريبي' },
      { label: '🗑️ التراجع وحذف آخر أداة', prompt: 'احذف آخر أداة وتراجع عن التعديل' }
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

// ==================== 2. دوال رسم وتحديث الواجهة (UI Rendering) ====================
function renderAll() {
  renderHeaderBadges();
  renderMasteryIndex();
  renderCertificates();
  renderProjects();
  renderAbdulmalikSandbox();
  renderAbdulmalikModsManager();
  renderHazemReportAndRadar();
}

function renderHeaderBadges() {
  const container = document.getElementById('header-badges');
  if (!container) return;
  const grade = calculateDailyGrade();
  container.innerHTML = `
    <span class="badge-pill">🔥 الاستمرارية: ${state.streak} يوم</span>
    <span class="badge-pill">⏱️ تركيز اليوم: ${state.studyMinutesToday} د</span>
    <span class="badge-pill">📊 مؤشر الجودة: ${grade}</span>
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
  const overallText = document.getElementById('overall-progress-text');

  if (titleEl) titleEl.textContent = levelTitle;
  if (scoreEl) scoreEl.innerHTML = `مؤشر الإتقان المعرفي: <strong>${masteryPercent}%</strong>`;
  if (fillEl) fillEl.style.width = `${Math.max(8, masteryPercent)}%`;
  if (overallText) overallText.textContent = `${Math.round(progressRatio * 100)}% من المنهج مكتمل`;
}

function renderCertificates() {
  const container = document.getElementById('certificates-list');
  if (!container) return;

  container.innerHTML = state.certificates.map((cert, cIdx) => {
    const tasksHtml = cert.tasks.map((t, tIdx) => `
      <label class="task-item ${t.done ? 'done' : ''}">
        <input type="checkbox" ${t.done ? 'checked' : ''} onchange="toggleTask(${cIdx}, ${tIdx})" />
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
        <select class="hadaf-select" onchange="updateCertStatus(${cIdx}, this.value)">
          <option value="planned" ${cert.status === 'planned' ? 'selected' : ''}>📌 حالة المسار: ضمن الخطة القادمة</option>
          <option value="studying" ${cert.status === 'studying' ? 'selected' : ''}>📖 حالة المسار: قيد الدراسة والتطبيق الفعلي</option>
          <option value="mastered" ${cert.status === 'mastered' ? 'selected' : ''}>🏆 حالة المسار: تم الإتقان واجتياز التقييم</option>
        </select>
      </div>
    `;
  }).join('');
}

function toggleTask(certIdx, taskIdx) {
  const task = state.certificates[certIdx].tasks[taskIdx];
  task.done = !task.done;
  saveState();
  if (task.done) {
    showToast('fahad', '💡 خطوة معرفية رائعة!', `إتقانك لـ "${task.text}" يعزز بنيتك التحليلية بشكل ممتاز.`);
  }
}

function updateCertStatus(certIdx, status) {
  state.certificates[certIdx].status = status;
  saveState();
}

function renderProjects() {
  const container = document.getElementById('projects-list');
  if (!container) return;
  container.innerHTML = state.projects.map(p => `
    <div class="task-item" style="justify-content: space-between;">
      <span>✅ ${p}</span>
      <button class="btn-outline btn-sm" onclick="navigator.clipboard.writeText('${p}'); alert('تم نسخ التوثيق العلمي للمشروع!')">📋 نسخ التوثيق</button>
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

// ==================== 3. المؤقت والعزل الصوتي ====================
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
      showToast('hazem', '📊 اكتملت جلسة التعلم العميق!', 'سجّل حازم 45 دقيقة من التركيز الخالص في رصيدك المعرفي لهذا اليوم.');
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
    if (btn) btn.textContent = '🌧️ عزل صوتي (مطر): نشط';
  } else {
    if (rainAudioCtx) rainAudioCtx.close();
    isRainPlaying = false;
    if (btn) btn.textContent = '🌧️ عزل صوتي (مطر): متوقف';
  }
}

// ==================== 4. مختبر الفهم والاستيعاب ====================
const quizBank = {
  'MO-211': {
    q: 'ما الميزة الجوهرية لدالة XLOOKUP مقارنة بـ VLOOKUP عند بناء نماذج مطابقة البيانات الضخمة؟',
    options: ['القدرة على البحث في أي اتجاه وإرجاع مصفوفة نتائج دون الكسر عند إدراج أعمدة', 'تعمل فقط على الأرقام الصحيحة', 'تتطلب ترتيب البيانات أبجدياً دائماً'],
    correct: 0,
    explain: 'دالة XLOOKUP تفصل عمود البحث عن عمود النتيجة تماماً، مما يجعل النموذج صلباً أمام أي تغييرات هيكلية في الجدول.'
  },
  'PL-300': {
    q: 'في لغة DAX داخل Power BI، ما الوظيفة الأساسية لدالة CALCULATE؟',
    options: ['تعديل سياق الفلتر الحالي (Filter Context) لتنفيذ حسابات مشروطة ديناميكية', 'تغيير ألوان الرسوم البيانية تلقائياً', 'دمج ملفات النص الخارجية فقط'],
    correct: 0,
    explain: 'دالة CALCULATE هي حجر الزاوية في DAX لأنها تسمح لك بإعادة تعريف الفلاتر المؤثرة على أي مقياس (Measure).'
  },
  'CMA': {
    q: 'ما الهدف الرئيسي من استخدام "الموازنة المرنة" (Flexible Budget) بدلاً من الموازنة الثابتة عند تقييم الأداء؟',
    options: ['عزل أثر تغير حجم النشاط الفعلي لمقارنة التكاليف بعدالة ودقة', 'إلغاء جميع التكاليف الثابتة من القوائم', 'تثبيت سقف المبيعات طوال العام'],
    correct: 0,
    explain: 'الموازنة المرنة تُعدَّل وفق مستوى النشاط الفعلي، مما يتيح للمحلل معرفة هل الانحراف ناتج عن كفاءة التشغيل أم مجرد تغير في حجم المبيعات.'
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
    fb.textContent = `✅ استيعاب دقيق! ${item.explain}`;
  } else {
    state.quizStats[cat].wrong++;
    fb.style.color = '#ef4444';
    fb.textContent = `❌ نقطة جديرة بالمراجعة: ${item.explain} (سجّلها حازم في رادار الفجوات المعرفية).`;
  }
  saveState();
}

// ==================== 5. منظومة الوكلاء الأذكياء (المهارات التخصصية والأسلوب البشري) ====================
function switchView(viewName) {
  document.querySelectorAll('.view-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  document.getElementById(`view-${viewName}`)?.classList.add('active');
  document.getElementById(`nav-${viewName}`)?.classList.add('active');
  if (viewName === 'chat') renderChat();
}

function switchAgent(agentKey) {
  state.currentAgent = agentKey;
  document.querySelectorAll('.agent-tab').forEach(t => t.classList.remove('active'));
  document.getElementById(`tab-${agentKey}`)?.classList.add('active');
  renderChat();
}

function renderChat() {
  const agent = state.currentAgent;
  const profile = agentProfiles[agent];
  const banner = document.getElementById('agent-info-banner');
  const skillsBar = document.getElementById('agent-skills-bar');
  const box = document.getElementById('chat-messages');

  if (banner && profile) {
    banner.innerHTML = `<div>${profile.bio}</div>`;
  }

  if (skillsBar && profile) {
    skillsBar.innerHTML = profile.skills.map(s => `
      <button class="btn-outline btn-sm" onclick="sendQuickPrompt('${s.prompt}')">${s.label}</button>
    `).join('');
  }

  const msgs = state.chatHistory[agent] || [];
  if (box) {
    box.innerHTML = msgs.map(m => `
      <div class="msg ${m.sender}">
        <div>${m.text}</div>
        ${m.proposalId ? renderProposalButtons(m.proposalId) : ''}
      </div>
    `).join('');
    box.scrollTop = box.scrollHeight;
  }
}

function renderProposalButtons(proposalId) {
  if (!state.pendingProposal || state.pendingProposal.id !== proposalId) return '';
  return `
    <div class="proposal-box">
      <strong>🔒 تصريح هندسي — بانتظار موافقتك لتثبيت هذه الأداة فقط:</strong>
      <div class="proposal-actions">
        <button class="btn-primary btn-sm" onclick="approveAbdulmalikProposal('${proposalId}')">اعتماد وتثبيت الأداة ✅</button>
        <button class="btn-danger btn-sm" onclick="rejectAbdulmalikProposal('${proposalId}')">إلغاء المقترح ❌</button>
      </div>
    </div>
  `;
}

function sendQuickPrompt(text) {
  const input = document.getElementById('chat-input');
  if (input) {
    input.value = text;
    sendMessage();
  }
}

async function sendMessage() {
  const input = document.getElementById('chat-input');
  if (!input || !input.value.trim()) return;
  const userText = input.value.trim();
  input.value = '';

  const agent = state.currentAgent;
  state.chatHistory[agent].push({ sender: 'user', text: userText });
  renderChat();

  // المهندس عبدالملك يعمل بنظام الصلاحيات والـ Sandbox المباشر
  if (agent === 'abdulmalik') {
    handleAbdulmalikLogic(userText);
    saveState();
    renderChat();
    return;
  }

  // إذا وضع المستخدم مفتاح Gemini API في الإعدادات، نستخدم الذكاء الاصطناعي الحي
  if (state.settings.apiKey && state.settings.apiKey.startsWith('AIza')) {
    try {
      const reply = await callGeminiAgent(agent, userText);
      state.chatHistory[agent].push({ sender: 'bot', text: reply });
      saveState();
      renderChat();
      return;
    } catch (e) {
      // في حال فشل الاتصال ننتقل للرد الذكي المحلي بسلاسة
    }
  }

  // محرك الردود البشرية المحلي الذكي (Human-like Contextual Engine)
  const smartReply = generateHumanLikeReply(agent, userText);
  state.chatHistory[agent].push({ sender: 'bot', text: smartReply });
  saveState();
  renderChat();
}

function generateHumanLikeReply(agent, userText) {
  const lower = userText.toLowerCase();

  if (agent === 'fahad') {
    if (lower.includes('تبسيط') || lower.includes('power query') || lower.includes('dax')) {
      return `تخيل أنك تدير مطبخاً احترافياً يا صديقي 💡:\n• **Power Query** هو مرحلة "تجهيز المكونات وغسلها وتقطيعها" قبل الطبخ؛ يأخذ الجداول الفوضوية وينظفها ويرتبها.\n• أما **لغة DAX** فهي "الوصفة والنكهة النهائية"؛ تحسب لك المؤشرات الذكية اللحظية (مثل مقارنة أداء هذا الشهر بالشهر الماضي) فوق البيانات النظيفة.\n\nأي الجزأين تحب أن نطبق عليه مثالاً عملياً الآن؟`;
    }
    if (lower.includes('سقراط') || lower.includes('سيناريو')) {
      return `جميل جداً، أحب هذا النوع من التفكير العميق 🧠!\nتخيل أن لديك جدول مبيعات يضم 50,000 عملية، وطُلب منك معرفة سبب تراجع التحصيل في فرع واحد فقط دون بقية الفروع.\nلو كنتَ ستبدأ بفحص البيانات، **ما أول عمودين ستقارن بينهما؟** خذ راحتك وفكر فيها كمحلل!`;
    }
    if (lower.includes('تلخيص') || lower.includes('خلاصة')) {
      return `إليك الخلاصة الذهبية في 3 نقاط لا تُنسى 📝:\n1. **افصل الحقائق عن الأوصاف:** ضع العمليات الرقمية في جدول (Fact Table)، وبيانات العملاء والأصناف في جداول مرجعية (Dimension Tables).\n2. **نظّف عند المصدر:** كل خطوة تنظيف تقوم بها في Power Query توفر عليك عشر معادلات معقدة لاحقاً.\n3. **اجعل اللوحة تجيب في 5 ثوانٍ:** التصميم الجيد في Power BI يبرز القرار ولا يغرق القارئ في الأرقام.`;
    }
    return `أعجبني سؤالك حول "${userText}" 💡. الفكرة كلها في التعلم التطبيقي هي أن نربط كل أداة بمشكلة حقيقية؛ عندما تفهم "لماذا" صُممت الدالة، يصبح "كيف" تكتبها أمراً بديهياً جداً. هل تحب أن نفكك هذه النقطة لمثال خطوة بخطوة أو نختبرها بسؤال تطبيقي؟`;
  }

  if (agent === 'hazem') {
    const doneCount = state.certificates.reduce((acc, c) => acc + c.tasks.filter(t => t.done).length, 0);
    const totalCount = state.certificates.reduce((acc, c) => acc + c.tasks.length, 0);
    const weakTopics = Object.entries(state.quizStats)
      .filter(([, v]) => v.wrong > 0)
      .map(([k]) => k);

    if (lower.includes('فجوات') || lower.includes('تشخيص')) {
      return `بعد مراجعة سجلك المعرفي بهدوء 📊:\n• أتممت حتى الآن **${doneCount} من أصل ${totalCount}** محاور تأسيسية.\n• يظهر في رادار الاختبارات أنك متمكن في الأساسيات، لكن هناك حاجة لمراجعة مركزة في: **(${weakTopics.join('، ') || 'لا توجد فجوات حرجة حالياً'})**.\nنصيحتي التحليلية: خصص أول 15 دقيقة من جلستك القادمة لحل تطبيق عملي واحد في هذا المحور قبل الانتقال لدرس جديد.`;
    }
    if (lower.includes('جدول') || lower.includes('خطة')) {
      return `خطة المراجعة الموصى بها لهذا الأسبوع 🗓️:\n• **الأحد والثلاثاء (45 د):** تطبيق عملي على تنظيف البيانات ومعادلات الربط.\n• **الإثنين والأربعاء (45 د):** فهم المفاهيم التحليلية وحل سؤالين في مختبر الاستيعاب.\n• **الخميس (30 د):** توثيق نموذج عملي واحد في سجل المشاريع لترسيخ المعلومة.`;
    }
    return `قراءة موضوعية لوضعك الحالي 📊: لديك استمرارية لمدة **${state.streak} يوم**، ورصيد تركيز اليوم هو **${state.studyMinutesToday} دقيقة** (التقييم: ${calculateDailyGrade()}). تذكر دائماً أن العبرة ليست بكثرة الساعات المتقطعة، بل بجودة الـ 45 دقيقة الخالية من المشتتات.`;
  }
}

async function callGeminiAgent(agent, userText) {
  const profile = agentProfiles[agent];
  const contextSummary = `بيانات المتعلم الحالية: الاستمرارية=${state.streak} يوم، دقائق الدراسة اليوم=${state.studyMinutesToday} دقيقة.`;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${state.settings.apiKey}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: `${profile.systemPrompt}\n${contextSummary}\nرسالة المتعلم: ${userText}` }]
      }]
    })
  });
  const data = await response.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || generateHumanLikeReply(agent, userText);
}

// ==================== 6. نظام المهندس عبدالملك ومهاراته البرمجية المعزولة ====================
function handleAbdulmalikLogic(text) {
  const lower = text.toLowerCase();

  if (lower.includes('احذف') || lower.includes('حذف') || lower.includes('تراجع') || lower.includes('شيل') || lower.includes('الغ')) {
    if (state.abdulmalikMods.length === 0) {
      state.chatHistory.abdulmalik.push({
        sender: 'bot',
        text: '🛠️ راجعت البيئة المعزولة (Sandbox)؛ لا توجد أي أدوات مفعلة حالياً لحذفها.'
      });
    } else {
      const removed = state.abdulmalikMods.pop();
      state.chatHistory.abdulmalik.push({
        sender: 'bot',
        text: `🗑️ تم تنفيذ أمر التراجع فوراً: حذفت أداة "${removed.title}" من بيئة التعلم ومن الذاكرة بنجاح.`
      });
    }
    return;
  }

  const propId = 'prop_' + Date.now();
  let toolType = 'vat_calc';
  let toolTitle = 'حاسبة التحليل المالي والضريبي (VAT 15%)';

  if (lower.includes('بطاقات') || lower.includes('flash')) {
    toolType = 'flashcards';
    toolTitle = 'أداة بطاقات الاستذكار السريع للمفاهيم (Flashcards)';
  } else if (lower.includes('دوال') || lower.includes('محاكاة') || lower.includes('مرجع')) {
    toolType = 'formula_lab';
    toolTitle = 'مختبر مرجع الدوال التحليلية (Excel & DAX)';
  }

  state.pendingProposal = {
    id: propId,
    type: toolType,
    title: toolTitle
  };

  state.chatHistory.abdulmalik.push({
    sender: 'bot',
    text: `🛠️ بصفتي مهندس النظم، جهزت لك الكود البرمجي المعزول لـ **${toolTitle}** فقط دون المساس بأي جزء آخر من المنصة. هل تعتمد تثبيتها في بيئة التعلم؟`,
    proposalId: propId
  });
}

function approveAbdulmalikProposal(propId) {
  if (!state.pendingProposal || state.pendingProposal.id !== propId) return;
  const mod = state.pendingProposal;
  state.abdulmalikMods.push({ id: mod.id, type: mod.type, title: mod.title });
  state.pendingProposal = null;
  state.chatHistory.abdulmalik.push({
    sender: 'bot',
    text: `✅ تم تثبيت "${mod.title}" في الصفحة الرئيسية داخل الصندوق المعزول بنجاح!`
  });
  saveState();
  renderChat();
}

function rejectAbdulmalikProposal(propId) {
  state.pendingProposal = null;
  state.chatHistory.abdulmalik.push({
    sender: 'bot',
    text: '❌ تم إلغاء المقترح البرمجي بناءً على توجيهك.'
  });
  saveState();
  renderChat();
}

function renderAbdulmalikSandbox() {
  const container = document.getElementById('abdulmalik-sandbox-container');
  if (!container) return;

  if (state.abdulmalikMods.length === 0) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = state.abdulmalikMods.map(mod => {
    if (mod.type === 'flashcards') {
      return `
        <div class="card" style="border-color: #10b981;">
          <div class="card-header">
            <h2>🛠️ ${mod.title}</h2>
            <button class="btn-danger btn-sm" onclick="deleteAbdulmalikMod('${mod.id}')">🗑️ حذف الأداة</button>
          </div>
          <p id="fc-text-${mod.id}" style="padding:12px; background:#0b1120; border-radius:8px; margin-bottom:8px;">
            <strong>مفهوم: Star Schema</strong> — نموذج بيانات يفصل جدول العمليات الرقمية (Fact) عن جداول الأوصاف (Dimensions) لتسريع Power BI.
          </p>
          <button class="btn-secondary btn-sm" onclick="flipFlashcard('${mod.id}')">🔄 تقليب لبطاقة مفهوم آخر</button>
        </div>
      `;
    }
    if (mod.type === 'formula_lab') {
      return `
        <div class="card" style="border-color: #f59e0b;">
          <div class="card-header">
            <h2>🛠️ ${mod.title}</h2>
            <button class="btn-danger btn-sm" onclick="deleteAbdulmalikMod('${mod.id}')">🗑️ حذف الأداة</button>
          </div>
          <select onchange="showFormulaSyntax('${mod.id}', this.value)">
            <option value="xlookup">دالة XLOOKUP (بحث مرجعي متقدم)</option>
            <option value="calculate">دالة CALCULATE (تغيير سياق الفلتر في DAX)</option>
            <option value="sumifs">دالة SUMIFS (الجمع المشروط المتعدد)</option>
          </select>
          <p id="form-res-${mod.id}" style="margin-top:10px; font-family:monospace; color:#fcd34d; direction:ltr; text-align:left;">
            =XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found])
          </p>
        </div>
      `;
    }
    return `
      <div class="card" style="border-color: #3b82f6;">
        <div class="card-header">
          <h2>🛠️ ${mod.title}</h2>
          <button class="btn-danger btn-sm" onclick="deleteAbdulmalikMod('${mod.id}')">🗑️ حذف الأداة</button>
        </div>
        <div class="input-with-btn">
          <input type="text" id="vat-input-${mod.id}" placeholder="أدخل القيمة الأساسية قبل الضريبة..." />
          <button class="btn-primary" onclick="calcVat('${mod.id}')">تحليل القيمة والضريبة 15%</button>
        </div>
        <p id="vat-res-${mod.id}" style="margin-top:8px; font-size:0.85rem; color:#60a5fa;"></p>
      </div>
    `;
  }).join('');
}

function flipFlashcard(id) {
  const cards = [
    '<strong>مفهوم: Power Query</strong> — محرك ETL لاستخراج وتنظيف وتحويل البيانات آلياً قبل تحليلها.',
    '<strong>مفهوم: DSO</strong> — متوسط فترة التحصيل، ويقيس عدد الأيام اللازمة لتحويل المبيعات الآجلة إلى نقد.',
    '<strong>مفهوم: Flexible Budget</strong> — موازنة تتكيف مع حجم النشاط الفعلي لعزل انحرافات الكفاءة بدقة.'
  ];
  const el = document.getElementById(`fc-text-${id}`);
  if (el) el.innerHTML = cards[Math.floor(Math.random() * cards.length)];
}

function showFormulaSyntax(id, key) {
  const map = {
    xlookup: '=XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found])',
    calculate: 'Measure = CALCULATE(SUM(Sales[Amount]), Sales[Region] = "Riyadh")',
    sumifs: '=SUMIFS(sum_range, criteria_range1, criteria1, [criteria_range2, criteria2])'
  };
  const el = document.getElementById(`form-res-${id}`);
  if (el) el.textContent = map[key] || '';
}

function calcVat(id) {
  const val = parseFloat(document.getElementById(`vat-input-${id}`)?.value || 0);
  const vat = (val * 0.15).toFixed(2);
  const total = (val * 1.15).toFixed(2);
  document.getElementById(`vat-res-${id}`).textContent = `مبلغ الضريبة (15%): ${vat} | الإجمالي الشامل: ${total}`;
}

function deleteAbdulmalikMod(modId) {
  state.abdulmalikMods = state.abdulmalikMods.filter(m => m.id !== modId);
  saveState();
}

function clearAllAbdulmalikMods() {
  state.abdulmalikMods = [];
  saveState();
}

function renderAbdulmalikModsManager() {
  const box = document.getElementById('abdulmalik-mods-list');
  if (!box) return;
  if (state.abdulmalikMods.length === 0) {
    box.innerHTML = '<p style="font-size:0.85rem; color:#94a3b8;">لا توجد أي أدوات برمجية مضافة حالياً.</p>';
    return;
  }
  box.innerHTML = state.abdulmalikMods.map(m => `
    <div class="task-item" style="justify-content:space-between;">
      <span>🛠️ ${m.title}</span>
      <button class="btn-danger btn-sm" onclick="deleteAbdulmalikMod('${m.id}')">🗑️ إزالة</button>
    </div>
  `).join('');
}

// ==================== 7. التقارير التحليلية والإعدادات ====================
function calculateDailyGrade() {
  if (state.studyMinutesToday >= 45) return 'A+ تركيز مكتمل';
  if (state.studyMinutesToday >= 20) return 'B تقدم جيد';
  return '⏳ قيد الإنجاز اليومي';
}

function renderHazemReportAndRadar() {
  const evalBox = document.getElementById('hazem-evaluation-summary');
  const radarBox = document.getElementById('weakness-radar-box');
  if (evalBox) {
    evalBox.innerHTML = `
      <p>⏱️ زمن التركيز الصافي اليوم: <strong>${state.studyMinutesToday} دقيقة</strong> (المعيار اليومي: 45 دقيقة)</p>
      <p>📈 تشخيص جودة التعلم: <strong>${calculateDailyGrade()}</strong></p>
    `;
  }
  if (radarBox) {
    const entries = Object.entries(state.quizStats).map(([k, v]) => {
      const status = v.wrong > v.correct ? '🔍 يوصى بمراجعة تطبيقية' : '✅ استيعاب متقن';
      return `<li><strong>${k}:</strong> إجابات دقيقة (${v.correct}) | أخطاء (${v.wrong}) — ${status}</li>`;
    }).join('');
    radarBox.innerHTML = `<ul style="margin:10px 18px; font-size:0.85rem;">${entries}</ul>`;
  }
}

function saveSettings() {
  state.settings.apiKey = document.getElementById('api-key-input')?.value.trim() || '';
  state.settings.tgToken = document.getElementById('tg-token-input')?.value.trim() || '';
  state.settings.tgChatId = document.getElementById('tg-chatid-input')?.value.trim() || '';
  saveState();
  alert('✅ تم حفظ إعدادات المنصة بنجاح!');
}

async function autoFetchChatId() {
  const token = document.getElementById('tg-token-input')?.value.trim();
  if (!token) return alert('يرجى إدخال Bot Token أولاً ثم إرسال رسالة /start لبوتك في تيليجرام.');
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/getUpdates`);
    const data = await res.json();
    const chatId = data?.result?.[data.result.length - 1]?.message?.chat?.id;
    if (chatId) {
      document.getElementById('tg-chatid-input').value = chatId;
      saveSettings();
    } else {
      alert('لم يتم العثور على رسالة حديثة. افتح البوت في تيليجرام واضغط Start ثم جرب مرة أخرى.');
    }
  } catch (e) {
    alert('تعذر الاتصال بتيليجرام، تأكد من صحة الـ Token.');
  }
}

async function sendTelegramReport() {
  const { tgToken, tgChatId } = state.settings;
  if (!tgToken || !tgChatId) {
    return alert('يرجى حفظ رمز البوت ومعرف المحادثة (Chat ID) في الإعدادات أولاً.');
  }
  const text = `📊 *التقرير التحليلي اليومي — بإشراف حازم*\n🔥 الاستمرارية المعرفية: ${state.streak} يوم\n⏱️ زمن التركيز الصافي: ${state.studyMinutesToday} دقيقة\n📈 مؤشر الجودة: ${calculateDailyGrade()}`;
  try {
    await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: tgChatId, text, parse_mode: 'Markdown' })
    });
    alert('📲 تم إرسال التقرير التحليلي إلى تيليجرام بنجاح!');
  } catch (e) {
    alert('حدث خطأ أثناء الإرسال إلى تيليجرام.');
  }
}

function showToast(agent, title, message) {
  lastToastAgent = agent;
  const toast = document.getElementById('toast-notification');
  document.getElementById('toast-title').textContent = title;
  document.getElementById('toast-message').textContent = message;
  toast?.classList.remove('hidden');
  setTimeout(() => toast?.classList.add('hidden'), 6000);
}

function handleToastClick() {
  document.getElementById('toast-notification')?.classList.add('hidden');
  switchView('chat');
  switchAgent(lastToastAgent);
}

function triggerTestNotification(agent) {
  if (agent === 'fahad') {
    showToast('fahad', '💡 إضاءة معرفية من فهد', 'اضغط هنا لنناقش مفهوماً تطبيقياً جديداً بأسلوب مبسط!');
  } else {
    showToast('hazem', '📊 مراجعة أداء من حازم', 'اضغط للاطلاع على تشخيص جودة التعلم وخطة المراجعة.');
  }
}

function toggleDevMode() {
  const checked = document.getElementById('dev-mode-checkbox')?.checked;
  state.devMode = !!checked;
  document.getElementById('dev-lab-panel')?.classList.toggle('hidden', !checked);
  saveState();
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
      alert('✅ تم استيراد قاعدة البيانات بنجاح!');
    } catch (err) {
      alert('ملف غير صالح.');
    }
  };
  reader.readAsText(file);
}

function startVoiceInput() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) return alert('متصفحك لا يدعم الإدخال الصوتي المباشر.');
  const recognition = new SpeechRecognition();
  recognition.lang = 'ar-SA';
  recognition.onresult = event => {
    document.getElementById('chat-input').value = event.results[0][0].transcript;
  };
  recognition.start();
}

window.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('api-key-input')) {
    document.getElementById('api-key-input').value = state.settings.apiKey || '';
    document.getElementById('tg-token-input').value = state.settings.tgToken || '';
    document.getElementById('tg-chatid-input').value = state.settings.tgChatId || '';
  }
  renderAll();
  loadQuizQuestion();
});