// ==================== 1. قاعدة البيانات المحلية الافتراضية (State) ====================
const STORAGE_KEY = 'MWS_AI_PLATFORM_V2';

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
      title: 'Microsoft Excel Expert (MO-211)',
      cost: '620 ر.س (مدعومة من هدف)',
      hadafStatus: 'studying',
      tasks: [
        { id: 't1', text: 'إتقان دوال البحث المتقدمة (XLOOKUP & INDEX/MATCH) لمطابقة فواتير السوبر ماركت', done: true },
        { id: 't2', text: 'تنظيف تسويات بوابات الدفع (تابي وتمارا ومدى) عبر Power Query', done: false },
        { id: 't3', text: 'بناء الجداول المحورية الديناميكية (PivotTables) لتقرير أعمار الديون', done: false }
      ]
    },
    {
      id: 'PL-300',
      title: 'Microsoft Power BI Data Analyst (PL-300)',
      cost: '620 ر.س (مدعومة من هدف)',
      hadafStatus: 'planned',
      tasks: [
        { id: 't4', text: 'ربط مصادر البيانات وبناء العلاقات (Data Modeling)', done: false },
        { id: 't5', text: 'كتابة معادلات DAX لحساب متوسط فترة التحصيل (DSO)', done: false },
        { id: 't6', text: 'تصميم لوحة مؤشرات تحصيل تفاعلية للإدارة المالية', done: false }
      ]
    },
    {
      id: 'CMA-P1',
      title: 'المحاسب الإداري المعتمد (CMA - Part 1)',
      cost: 'مدعومة بالكامل من هدف بعد الاجتياز',
      hadafStatus: 'planned',
      tasks: [
        { id: 't7', text: 'القوائم المالية الخارجية والاعتراف بالإيرادات', done: false },
        { id: 't8', text: 'التخطيط والموازنات التقديرية والتنبؤ النقدي', done: false },
        { id: 't9', text: 'إدارة التكاليف والرقابة الداخلية', done: false }
      ]
    }
  ],
  projects: [
    'أتمتة مطابقة حسابات السوبر ماركت وتقليص وقت الإقفال الشهري بنسبة 60% باستخدام Excel Power Query.'
  ],
  quizStats: {
    'MO-211': { correct: 2, wrong: 0 },
    'PL-300': { correct: 1, wrong: 1 },
    'CMA': { correct: 0, wrong: 1 }
  },
  abdulmalikMods: [], // الأدوات المعتمدة فقط من المستخدم
  pendingProposal: null,
  chatHistory: {
    fahad: [
      { sender: 'bot', text: 'يا هلا بصديقي! أنا فهد 🔥 جاهز نكسر حاجز التأجيل اليوم؟ 45 دقيقة بس تفرق معانا في طريق الـ 10,000 ريال!' }
    ],
    hazem: [
      { sender: 'bot', text: 'مرحباً. أنا المراقب التنفيذي "حازم" 📊. أراقب التزامك اليومي بدقة، وأحلل نقاط ضعفك في الاختبارات، وأرسل تقريرك إلى تيليجرام.' }
    ],
    abdulmalik: [
      { sender: 'bot', text: 'أهلاً بك يا بشمهندس! أنا عبدالملك 🛠️. أعمل وفق بروتوكول الصلاحيات الصارم: لن أضيف أي أداة إلا بطلبك وبعد ضغطك على زر (اعتماد ✅)، ويمكنك كتابة "احذف" أو "تراجع" في أي وقت لإلغاء أي تعديل فوراً.' }
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
  renderMarketValue();
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
    <span class="badge-pill">🔥 التزام: ${state.streak} يوم</span>
    <span class="badge-pill">⏱️ اليوم: ${state.studyMinutesToday} د</span>
    <span class="badge-pill">📊 تقييم حازم: ${grade}</span>
  `;
}

function renderMarketValue() {
  let totalTasks = 0;
  let doneTasks = 0;
  state.certificates.forEach(c => {
    c.tasks.forEach(t => {
      totalTasks++;
      if (t.done) doneTasks++;
    });
  });

  const progressRatio = totalTasks > 0 ? doneTasks / totalTasks : 0;
  const estimatedSalary = Math.round(5800 + progressRatio * 4700 + (state.projects.length * 150));
  const fillPercent = Math.min(100, Math.round(15 + progressRatio * 85));

  const label = document.getElementById('estimated-salary-label');
  const fill = document.getElementById('salary-progress-fill');
  const overallText = document.getElementById('overall-progress-text');

  if (label) label.innerHTML = `القيمة التقديرية: <strong>${estimatedSalary.toLocaleString()} ر.س</strong>`;
  if (fill) fill.style.width = `${fillPercent}%`;
  if (overallText) overallText.textContent = `${Math.round(progressRatio * 100)}% مكتمل`;
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
          <span class="badge-pill">${cert.cost}</span>
        </div>
        <div>${tasksHtml}</div>
        <select class="hadaf-select" onchange="updateHadafStatus(${cIdx}, this.value)">
          <option value="planned" ${cert.hadafStatus === 'planned' ? 'selected' : ''}>📌 حالة هدف: مخطط لها</option>
          <option value="studying" ${cert.hadafStatus === 'studying' ? 'selected' : ''}>📖 حالة هدف: قيد المذاكرة الآن</option>
          <option value="claimed" ${cert.hadafStatus === 'claimed' ? 'selected' : ''}>💰 حالة هدف: تم الاجتياز ورفع طلب التعويض</option>
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
    showToast('fahad', '🔥 كفو عليك يا بطل!', `أنجزت: "${task.text}" — خطوة أقرب لراتب الـ 10,000 ريال!`);
  }
}

function updateHadafStatus(certIdx, status) {
  state.certificates[certIdx].hadafStatus = status;
  saveState();
}

function renderProjects() {
  const container = document.getElementById('projects-list');
  if (!container) return;
  container.innerHTML = state.projects.map((p, idx) => `
    <div class="task-item" style="justify-content: space-between;">
      <span>✅ ${p}</span>
      <button class="btn-outline btn-sm" onclick="navigator.clipboard.writeText('${p}'); alert('تم نسخ الوصف الاحترافي للـ CV!')">📋 نسخ للـ CV</button>
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

// ==================== 3. المؤقت وصوت المطر ====================
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
      showToast('hazem', '📊 اكتملت جلسة الـ 45 دقيقة!', 'تم توثيق الجلسة في سجل حازم الرقابي ورفع تقييمك اليومي.');
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
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
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
    if (btn) btn.textContent = '🌧️ صوت المطر: يعمل الآن';
  } else {
    if (rainAudioCtx) rainAudioCtx.close();
    isRainPlaying = false;
    if (btn) btn.textContent = '🌧️ صوت المطر: متوقف';
  }
}

// ==================== 4. بنك الاختبارات ورادار نقاط الضعف ====================
const quizBank = {
  'MO-211': {
    q: 'أي دالة في Excel تُعتبر البديل الأحدث والأقوى لـ VLOOKUP وتبحث في أي اتجاه لمطابقة فواتير العملاء؟',
    options: ['XLOOKUP', 'SUMIFS', 'COUNTIF'],
    correct: 0,
    explain: 'دالة XLOOKUP تبحث يميناً ويساراً وتتعامل مع الأخطاء بمرونة عالية في مطابقات السوبر ماركت.'
  },
  'PL-300': {
    q: 'في Power BI، أي دالة DAX تُستخدم لتغيير سياق الفلتر عند حساب مؤشر التحصيل (DSO)؟',
    options: ['CALCULATE', 'CONCATENATE', 'LEFT'],
    correct: 0,
    explain: 'دالة CALCULATE هي أهم دالة في DAX لتعديل الفلاتر وحساب المؤشرات المالية.'
  },
  'CMA': {
    q: 'عندما تبيع الشركة بضاعة للسوبر ماركت بالأجل، كيف يُصنّف حساب "ذمم العملاء" (Accounts Receivable)؟',
    options: ['أصل متداول (Current Asset)', 'التزام متداول', 'مصروف تشغيلي'],
    correct: 0,
    explain: 'ذمم العملاء تمثل مبالغ مستحقة التحصيل خلال دورة التشغيل، لذا فهي أصل متداول.'
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
    fb.textContent = `❌ غير صحيح. ${item.explain} (تم تسجيل النقطة في رادار حازم للمراجعة).`;
  }
  saveState();
}

// ==================== 5. منظومة الوكلاء الثلاثة ونظام صلاحيات عبدالملك ====================
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
  const banner = document.getElementById('agent-info-banner');
  const box = document.getElementById('chat-messages');
  const prompts = document.getElementById('quick-prompts');

  const bannersInfo = {
    fahad: '🔥 <strong>فهد (صديق المذاكرة):</strong> يشرح لك المنهج ببساطة، يشجعك، ويختبرك سريعاً.',
    hazem: '📊 <strong>حازم (المراقب الصارم):</strong> يحاسبك على الدقائق، يكشف نقاط ضعفك، ويرسل تقارير تيليجرام.',
    abdulmalik: '🛠️ <strong>عبدالملك (المهندس المقيد بالصلاحيات):</strong> يقترح الأدوات التي تطلبها فقط، ولا ينفذها إلا بموافقتك، ويحذفها فوراً إذا كتبت "احذف" أو "تراجع".'
  };
  if (banner) banner.innerHTML = bannersInfo[agent];

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

  if (prompts) {
    if (agent === 'fahad') {
      prompts.innerHTML = `
        <button class="btn-outline btn-sm" onclick="sendQuickPrompt('حفزني أبدا جلسة اليوم')">🔥 حفزني أبدأ</button>
        <button class="btn-outline btn-sm" onclick="sendQuickPrompt('اشرح لي XLOOKUP في السوبر ماركت')">📘 اشرح XLOOKUP</button>
      `;
    } else if (agent === 'hazem') {
      prompts.innerHTML = `
        <button class="btn-outline btn-sm" onclick="sendQuickPrompt('اعطني تقييمي الصارم اليوم')">📊 تقييمي اليوم</button>
        <button class="btn-outline btn-sm" onclick="sendQuickPrompt('ما هي نقاط ضعفي؟')">🎯 رادار نقاط الضعف</button>
      `;
    } else {
      prompts.innerHTML = `
        <button class="btn-outline btn-sm" onclick="sendQuickPrompt('أضف حاسبة ضريبة القيمة المضافة 15%')">➕ أضف حاسبة ضريبة VAT</button>
        <button class="btn-outline btn-sm" onclick="sendQuickPrompt('أضف حاسبة ادخار الراتب')">➕ أضف حاسبة ادخار</button>
        <button class="btn-danger btn-sm" onclick="sendQuickPrompt('احذف آخر أداة وتراجع')">🗑️ احذف آخر تعديل</button>
      `;
    }
  }
}

function renderProposalButtons(proposalId) {
  if (!state.pendingProposal || state.pendingProposal.id !== proposalId) return '';
  return `
    <div class="proposal-box">
      <strong>🔒 بانتظار إذنك البرمجي لتنفيذ هذا الطلب فقط:</strong>
      <div class="proposal-actions">
        <button class="btn-primary btn-sm" onclick="approveAbdulmalikProposal('${proposalId}')">اعتماد وتنفيذ هذا فقط ✅</button>
        <button class="btn-danger btn-sm" onclick="rejectAbdulmalikProposal('${proposalId}')">رفض وإلغاء ❌</button>
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

function sendMessage() {
  const input = document.getElementById('chat-input');
  if (!input || !input.value.trim()) return;
  const userText = input.value.trim();
  input.value = '';

  const agent = state.currentAgent;
  state.chatHistory[agent].push({ sender: 'user', text: userText });

  if (agent === 'abdulmalik') {
    handleAbdulmalikLogic(userText);
  } else if (agent === 'hazem') {
    const grade = calculateDailyGrade();
    state.chatHistory.hazem.push({
      sender: 'bot',
      text: `📊 تقرير الرقابة اللحظي: ذاكرت اليوم (${state.studyMinutesToday}) دقيقة. تقييمك الحالي (${grade}). سلسلة الالتزام (${state.streak} أيام). استمر ولا تتهاون!`
    });
  } else {
    state.chatHistory.fahad.push({
      sender: 'bot',
      text: `يا بطل! بخصوص "${userText}" — تذكر أن كل معادلة تتقنها في Excel و Power BI لمطابقة تابي وتمارا والسوبر ماركت ترفع قيمتك السوقية مباشرة نحو الـ 10,000 ريال. شغل المؤقت الآن وخلنا ننجز! 🔥`
    });
  }

  saveState();
  renderChat();
}

// منطق المهندس عبدالملك المقيد بالصلاحيات والحذف الفوري
function handleAbdulmalikLogic(text) {
  const lower = text.toLowerCase();

  if (lower.includes('احذف') || lower.includes('حذف') || lower.includes('تراجع') || lower.includes('شيل') || lower.includes('الغ')) {
    if (state.abdulmalikMods.length === 0) {
      state.chatHistory.abdulmalik.push({
        sender: 'bot',
        text: '🛠️ لا توجد أي أدوات أو تعديلات مفعلة حالياً لحذفها.'
      });
    } else {
      const removed = state.abdulmalikMods.pop();
      state.chatHistory.abdulmalik.push({
        sender: 'bot',
        text: `🗑️ تم فوراً حذف الأداة "${removed.title}" وإزالتها من الصفحة الرئيسية ومن الذاكرة بناءً على أمرك.`
      });
    }
    return;
  }

  const propId = 'prop_' + Date.now();
  let toolType = 'vat_calc';
  let toolTitle = 'حاسبة ضريبة القيمة المضافة والخصم (15%)';

  if (lower.includes('ادخار') || lower.includes('راتب')) {
    toolType = 'saving_calc';
    toolTitle = 'حاسبة تقسيم الراتب وصندوق الطوارئ';
  }

  state.pendingProposal = {
    id: propId,
    type: toolType,
    title: toolTitle
  };

  state.chatHistory.abdulmalik.push({
    sender: 'bot',
    text: `🛠️ لقد جهزت مقترحاً لـ **${toolTitle}** فقط (دون أي إضافات جانبية). هل تأذن لي بتثبيتها في الصفحة الرئيسية؟`,
    proposalId: propId
  });
}

function approveAbdulmalikProposal(propId) {
  if (!state.pendingProposal || state.pendingProposal.id !== propId) return;
  const mod = state.pendingProposal;
  state.abdulmalikMods.push({
    id: mod.id,
    type: mod.type,
    title: mod.title
  });
  state.pendingProposal = null;
  state.chatHistory.abdulmalik.push({
    sender: 'bot',
    text: `✅ تم اعتماد وتثبيت "${mod.title}" في الصفحة الرئيسية بنجاح! يمكنك حذفها متى شئت.`
  });
  saveState();
  renderChat();
}

function rejectAbdulmalikProposal(propId) {
  state.pendingProposal = null;
  state.chatHistory.abdulmalik.push({
    sender: 'bot',
    text: '❌ تم إلغاء المقترح فوراً ولن يتم تعديل أي شيء.'
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
    if (mod.type === 'saving_calc') {
      return `
        <div class="card" style="border-color: #10b981;">
          <div class="card-header">
            <h2>🛠️ ${mod.title}</h2>
            <button class="btn-danger btn-sm" onclick="deleteAbdulmalikMod('${mod.id}')">🗑️ حذف هذه الأداة</button>
          </div>
          <div class="input-with-btn">
            <input type="text" id="sav-input-${mod.id}" placeholder="أدخل الراتب (مثلاً 5800)..." />
            <button class="btn-primary" onclick="calcSaving('${mod.id}')">احسب الادخار</button>
          </div>
          <p id="sav-res-${mod.id}" style="margin-top:8px; font-size:0.85rem; color:#10b981;"></p>
        </div>
      `;
    }
    return `
      <div class="card" style="border-color: #3b82f6;">
        <div class="card-header">
          <h2>🛠️ ${mod.title}</h2>
          <button class="btn-danger btn-sm" onclick="deleteAbdulmalikMod('${mod.id}')">🗑️ حذف هذه الأداة</button>
        </div>
        <div class="input-with-btn">
          <input type="text" id="vat-input-${mod.id}" placeholder="أدخل مبلغ الفاتورة قبل الضريبة..." />
          <button class="btn-primary" onclick="calcVat('${mod.id}')">احسب VAT 15%</button>
        </div>
        <p id="vat-res-${mod.id}" style="margin-top:8px; font-size:0.85rem; color:#60a5fa;"></p>
      </div>
    `;
  }).join('');
}

function calcVat(id) {
  const val = parseFloat(document.getElementById(`vat-input-${id}`)?.value || 0);
  const vat = (val * 0.15).toFixed(2);
  const total = (val * 1.15).toFixed(2);
  document.getElementById(`vat-res-${id}`).textContent = `الضريبة (15%): ${vat} ر.س | الإجمالي شامل الضريبة: ${total} ر.س`;
}

function calcSaving(id) {
  const val = parseFloat(document.getElementById(`sav-input-${id}`)?.value || 5800);
  const emergency = Math.round(val * 0.16);
  const travel = Math.round(val * 0.09);
  document.getElementById(`sav-res-${id}`).textContent = `صندوق الطوارئ المقترح: ${emergency} ر.س | محفظة السفر والهوايات: ${travel} ر.س`;
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
    box.innerHTML = '<p style="font-size:0.85rem; color:#94a3b8;">لا توجد أي أدوات مضافة حالياً.</p>';
    return;
  }
  box.innerHTML = state.abdulmalikMods.map(m => `
    <div class="task-item" style="justify-content:space-between;">
      <span>🛠️ ${m.title}</span>
      <button class="btn-danger btn-sm" onclick="deleteAbdulmalikMod('${m.id}')">🗑️ حذف</button>
    </div>
  `).join('');
}

// ==================== 6. تقييم حازم وتقارير تيليجرام والإعدادات ====================
function calculateDailyGrade() {
  if (state.studyMinutesToday >= 45) return 'A+ ممتاز';
  if (state.studyMinutesToday >= 20) return 'B جيد';
  return '⚠️ بانتظار جلسة اليوم';
}

function renderHazemReportAndRadar() {
  const evalBox = document.getElementById('hazem-evaluation-summary');
  const radarBox = document.getElementById('weakness-radar-box');
  if (evalBox) {
    evalBox.innerHTML = `
      <p>⏱️ دقائق المذاكرة اليوم: <strong>${state.studyMinutesToday} دقيقة</strong> (الهدف: 45 دقيقة)</p>
      <p>📈 التقييم اليومي الصارم: <strong>${calculateDailyGrade()}</strong></p>
    `;
  }
  if (radarBox) {
    const entries = Object.entries(state.quizStats).map(([k, v]) => {
      const status = v.wrong > v.correct ? '⚠️ يحتاج مراجعة مركزة' : '✅ متقن';
      return `<li><strong>${k}:</strong> صح (${v.correct}) | خطأ (${v.wrong}) — ${status}</li>`;
    }).join('');
    radarBox.innerHTML = `<ul style="margin:10px 18px; font-size:0.85rem;">${entries}</ul>`;
  }
}

function saveSettings() {
  state.settings.apiKey = document.getElementById('api-key-input')?.value.trim() || '';
  state.settings.tgToken = document.getElementById('tg-token-input')?.value.trim() || '';
  state.settings.tgChatId = document.getElementById('tg-chatid-input')?.value.trim() || '';
  saveState();
  alert('✅ تم حفظ إعدادات الربط بنجاح!');
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
  const text = `📊 *تقرير المراقب حازم اليومي*\n🔥 سلسلة الالتزام: ${state.streak} يوم\n⏱️ مذاكرة اليوم: ${state.studyMinutesToday} دقيقة\n📈 التقييم: ${calculateDailyGrade()}`;
  try {
    await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: tgChatId, text, parse_mode: 'Markdown' })
    });
    alert('📲 تم إرسال التقرير إلى حسابك في تيليجرام بنجاح!');
  } catch (e) {
    alert('حدث خطأ أثناء الإرسال إلى تيليجرام.');
  }
}

// ==================== 7. الإشعارات، الصوت، والنسخ الاحتياطي ====================
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
    showToast('fahad', '🔥 رسالة من صديقك فهد', 'اضغط هنا لندخل غرفة المذاكرة ونحل سؤال سريع في Excel!');
  } else {
    showToast('hazem', '📊 تنبيه رقابي من حازم', 'لم تكمل الـ 45 دقيقة اليوم بعد! اضغط لمراجعة تقييمك.');
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
  a.download = 'mws-study-backup.json';
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

// تشغيل التطبيق عند فتح الصفحة
window.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('api-key-input')) {
    document.getElementById('api-key-input').value = state.settings.apiKey || '';
    document.getElementById('tg-token-input').value = state.settings.tgToken || '';
    document.getElementById('tg-chatid-input').value = state.settings.tgChatId || '';
  }
  renderAll();
  loadQuizQuestion();
});
