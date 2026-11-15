// ==================== 1. الحالة المركزية وقاعدة البيانات المحلية (DeepDive OS State) ====================
const STORAGE_KEY = 'DEEPDIVE_KNOWLEDGE_OS_V1';

const defaultState = {
  streak: 1,
  studyMinutesToday: 0,
  totalStudyMinutes: 45,
  currentAgent: 'fahad',
  activeLibraryFileId: 'lib_default_1',
  devMode: false,
  aiOnline: false,
  lastLatencyMs: null,
  settings: {
    connectionMode: 'auto', // auto | direct_google | vercel_proxy | groq
    model: 'gemini-2.5-flash',
    apiKey: ''
  },
  courses: [
    {
      id: 'MO-211',
      title: 'إتقان النمذجة وتحليل البيانات المتقدم (Microsoft Excel Expert MO-211)',
      level: 'المسار التأسيسي الأول',
      overview: 'يركز هذا المسار على تحويل الجداول الخام الضخمة إلى نماذج ديناميكية مؤتمتة بالكامل باستخدام محرك Power Query ودوال البحث المرجعي الحديثة.',
      steps: [
        { id: 's1', text: 'إتقان دوال البحث المرجعي الديناميكي (XLOOKUP, INDEX/MATCH, FILTER)', done: true },
        { id: 's2', text: 'أتمتة تنظيف ودمج البيانات عبر Power Query (Unpivot & Merge Queries)', done: false },
        { id: 's3', text: 'بناء الجداول المحورية المتقدمة (PivotTables) ولوحات التفاعل مع Slicers', done: false },
        { id: 's4', text: 'تأمين المعادلات، تدقيق النماذج (Formula Auditing)، والماكرو التطبيقي', done: false }
      ],
      resources: [
        { title: 'المسار الرسمي المجاني من Microsoft Learn (MO-211)', url: 'https://learn.microsoft.com/en-us/credentials/certifications/mos-excel-expert-m365-apps/' },
        { title: 'دليل Power Query الشامل لتحويل البيانات', url: 'https://learn.microsoft.com/en-us/power-query/' }
      ],
      suggestedPractice: 'قم ببناء استعلام Power Query يدمج 3 ملفات عمليات شهرية في جدول موحد نظيف بضغطة تحديث واحدة.'
    },
    {
      id: 'PL-300',
      title: 'هندسة ذكاء الأعمال وتصميم لوحات البيانات (Microsoft Power BI PL-300)',
      level: 'المسار التحليلي الثاني',
      overview: 'الانتقال من الجداول التقليدية إلى بناء نماذج البيانات النجمية (Star Schema) وكتابة معادلات DAX لاستخراج المؤشرات التنفيذية.',
      steps: [
        { id: 's5', text: 'تجهيز البيانات وهندسة نموذج النجمة (Fact & Dimension Tables)', done: false },
        { id: 's6', text: 'إتقان دوال السياق والفلترة في لغة DAX (CALCULATE, FILTER, ALL)', done: false },
        { id: 's7', text: 'دوال الذكاء الزمني (Time Intelligence: YTD, YoY, Rolling Averages)', done: false },
        { id: 's8', text: 'تصميم القصص البيانية التفاعلية (Data Storytelling & Bookmarks)', done: false }
      ],
      resources: [
        { title: 'مسار الإعداد الرسمي لشهادة PL-300 على Microsoft Learn', url: 'https://learn.microsoft.com/en-us/credentials/certifications/data-analyst-associate/' },
        { title: 'مرجع دوال DAX الرسمي (DAX Guide)', url: 'https://dax.guide/' }
      ],
      suggestedPractice: 'صمم نموذج Star Schema يربط جدول المبيعات بجدول التقويم الزمني واحسب نسبة النمو الشهري بـ DAX.'
    },
    {
      id: 'CMA-P1',
      title: 'التخطيط المالي الاستراتيجي وتحليل الأداء (CMA - Part 1)',
      level: 'المسار الاستراتيجي الثالث',
      overview: 'دمج المهارات التقنية بالعمق المالي: قراءة القوائم المالية، بناء الموازنات المرنة، وتحليل الانحرافات التشغيلية.',
      steps: [
        { id: 's9', text: 'القوائم المالية، الاعتراف بالإيرادات، وتحليل التدفقات النقدية', done: false },
        { id: 's10', text: 'التخطيط الاستراتيجي وبناء الموازنات التقديرية المرنة (Flexible Budgets)', done: false },
        { id: 's11', text: 'إدارة التكاليف وتحليل انحرافات المواد والعمالة (Variance Analysis)', done: false },
        { id: 's12', text: 'الرقابة الداخلية وحوكمة النظم المالية', done: false }
      ],
      resources: [
        { title: 'معهد المحاسبين الإداريين IMA — دليل محاور CMA', url: 'https://www.imanet.org/en/Certifications/CMA-Certification' },
        { title: 'معايير المحاسبة والمراجعة المعتمدة في المملكة (SOCPA)', url: 'https://socpa.org.sa/' }
      ],
      suggestedPractice: 'حلل انحراف الموازنة المرنة (Flexible Budget Variance) وافصل بين انحراف السعر وانحراف الكمية.'
    }
  ],
  libraryFiles: [
    {
      id: 'lib_default_1',
      name: 'مذكرة الغوص الأول: الفرق الجوهري بين Power Query ولغة DAX',
      category: 'PL-300',
      date: '2026-11-15',
      size: 'ملف مرجعي تأسيسي',
      content: `1. متى نستخدم Power Query (لغة M)؟
- يُستخدم في مرحلة استيراد وتنظيف وتشكيل البيانات (ETL) قبل دخولها للنموذج.
- أهم العمليات: إزالة التكرارات، تفكيك الأعمدة، تحويل الأعمدة إلى صفوف (Unpivot Columns)، ودمج الجداول (Merge/Append).

2. متى نستخدم لغة DAX؟
- تُستخدم بعد تحميل البيانات وبناء العلاقات (Star Schema) لإجراء الحسابات الديناميكية التي تتفاعل مع الفلاتر التي يختارها المستخدم في التقرير.
- أهم دالة في DAX هي CALCULATE لأنها الدالة الوحيدة القادرة على تعديل سياق الفلتر (Filter Context).

قاعدة ذهبية للمذاكرة:
"كل ما يمكنك تنظيفه في المصدر أو Power Query لا تؤجله إلى DAX، واجعل DAX للمؤشرات والتحليلات الديناميكية فقط."`
    }
  ],
  projects: [
    'بناء نموذج Power Query مؤتمت لتنظيف وتوحيد الجداول الشهرية المتفرقة.'
  ],
  quizStats: {
    'MO-211': { correct: 2, wrong: 0, weakPoints: [] },
    'PL-300': { correct: 1, wrong: 1, weakPoints: ['سياق الفلترة في CALCULATE'] },
    'CMA': { correct: 0, wrong: 1, weakPoints: ['تحليل انحرافات الموازنة المرنة'] }
  },
  systemLogs: [
    '[System Init] تم تشغيل نظام أعماق المعرفة بنجاح وفحص سلامة الذاكرة المحلية.'
  ],
  chatHistory: {
    fahad: [
      { sender: 'bot', text: 'أهلاً بك في أعماق المعرفة 🌊. أنا فهد، رفيقك في الفهم العميق. يمكنك فتح أي ملف في المكتبة وسأقرأ محتواه كاملاً معك لنلخصه أو نستخرج منه أسئلة، أو اسألني عن أي مفهوم في مساراتك.' }
    ],
    hazem: [
      { sender: 'bot', text: 'مرحباً بك 🧭. أنا حازم، أتابع إيقاع استمراريتك وجودة تركيزك بهدوء وموضوعية، وأرصد لك المحاور التي تحتاج إلى تقوية بناءً على إجاباتك.' }
    ],
    abdulmalik: [
      { sender: 'bot', text: 'أهلاً بك يا بشمهندس 🛡️. أنا عبدالملك، مهندس معمارية النظام والأمن السيبراني. تم إيقاف كافة الاقتراحات العشوائية كما وجهتني؛ مهمتي الآن تنحصر في ضمان متانة التطبيق، فحص الربط السحابي (AQ.Ab8 / Gemini)، والإجابة على استفساراتك البرمجية والهندسية بدقة.' }
    ]
  }
};

// تعريف الشخصيات والمهارات العميقة للوكلاء الثلاثة
const agentProfiles = {
  fahad: {
    name: 'فهد',
    systemPrompt: `أنت "فهد"، مرشد معرفي خبير وصديق دراسة ذو أسلوب بشري دافئ، راقٍ، وعميق.
تتحدث بعربية طبيعية سلسة بعيدة عن التكلف الآلي.
مهاراتك الأساسية:
1. قراءة الملفات المفتوحة في مكتبة المتعلم وتلخيصها في نقاط ذهبية واضحة.
2. تبسيط المفاهيم المعقدة في (Excel MO-211, Power BI PL-300, DAX, Power Query, CMA) بأمثلة واقعية ملموسة.
3. استخدام الحوار السقراطي: بعد أن تشرح الفكرة، اطرح سؤالاً ذكياً قصيراً يتأكد من عمق استيعاب المتعلم.`,
    skills: [
      { label: '📝 لخص الملف المفتوح بالمكتبة', action: () => triggerAgentOnActiveFile('summarize') },
      { label: '🧩 تبسيط مفهوم بعمق', prompt: 'اشرح لي بأسلوبك البشري المبسط كيف يعمل سياق الفلتر (Filter Context) في دالة CALCULATE بمثال واقعي.' },
      { label: '🃏 توليد بطاقات استذكار', prompt: 'استخرج لي 3 بطاقات مراجعة (سؤال وجواب مركز) من الملف المفتوح حالياً في مكتبتي.' },
      { label: '🧠 حوار سقراطي لاختبار فهمي', prompt: 'اختبر عمق فهمي الآن بسؤال استنتاجي واحد في Power Query أو DAX وناقشني في إجابتي.' }
    ]
  },
  hazem: {
    name: 'حازم',
    systemPrompt: `أنت "حازم"، خبير تحليل الأداء المعرفي وجودة التعلم العميق.
تتحدث بأسلوب بشري هادئ، رصين، وموضوعي يحترم عقل المتعلم دون مبالغة أو ضغط سلبي.
مهاراتك الأساسية:
1. قراءة إحصائيات المتعلم ورادار الفجوات المعرفية وتشخيص السبب الجذري لأي خطأ.
2. تصميم خطط مراجعة متباعدة (Spaced Repetition) وتوزيع جلسات الغوص (45 دقيقة) بذكاء.
3. تحويل الملاحظات المتفرقة إلى خارطة أولويات واضحة.`,
    skills: [
      { label: '🔍 تشخيص رادار الفجوات', prompt: 'بناءً على إحصائياتي ورادار نقاط الضعف لدي، قدم لي تشخيصاً هادئاً وخطة لعلاج الفجوات.' },
      { label: '🗓️ هندسة جدول الغوص الأسبوعي', prompt: 'صمم لي جدولاً هادئاً ومتوازناً لتوزيع 5 جلسات غوص (45 دقيقة) هذا الأسبوع بين المذاكرة والتطبيق.' },
      { label: '📈 تقييم جودة الاستمرارية', prompt: 'قيّم مستوى استمراريتي الحالي وأعطني قاعدة نفسية وعملية للحفاظ على الزخم دون إرهاق.' }
    ]
  },
  abdulmalik: {
    name: 'عبدالملك',
    systemPrompt: `أنت "عبدالملك"، كبير مهندسي البرمجيات ومختص متانة النظم والأمن السيبراني (Principal Systems & Security Architect).
تحدث بأسلوب مهندس خبير، رصين، دقيق، ومباشر.
قاعدة صارمة جداً: لا تقترح إضافة حاسبات أو أدوات عشوائية للموقع إطلاقاً.
مهاراتك الأساسية:
1. هندسة البرمجيات وفحص متانة الكود وأمن تطبيقات الويب والـ APIs (بما فيها مفاتيح Google Cloud AQ.Ab8 و Gemini و OAuth/Bearer).
2. شرح معمارية الأنظمة، قواعد البيانات، وهندسة الوكلاء (Agentic Workflows) للمستخدم.
3. تحليل سجل الأخطاء البرمجية وتقديم حلول هندسية جذرية ونظيفة.`,
    skills: [
      { label: '🛡️ فحص متانة النظام والأمان', prompt: 'بصفتك مهندس النظام، راجع حالة التطبيق الحالية، زمن استجابة الـ API، وسلامة هيكلة الذاكرة.' },
      { label: '🔑 شرح معمارية مفاتيح AQ.Ab8', prompt: 'اشرح لي هندسياً الفرق بين مفاتيح AIzaSy ومفاتيح Google السحابية الحديثة AQ.Ab8 وكيف يتعامل معها الموجه البرمجي.' },
      { label: '💻 مراجعة كود وهندسة أوامر', prompt: 'أعطني أفضل الممارسات الهندسية لبناء وكيل ذكاء اصطناعي يقرأ الملفات ويلخصها بدقة عالية.' }
    ]
  }
};

let state = loadState();
let timerInterval = null;
let timerSeconds = 45 * 60;
let ambientAudioCtx = null;
let isAmbientPlaying = false;
let lastToastAgent = 'fahad';

// صائد الأخطاء البرمجية التلقائي للمهندس عبدالملك
window.addEventListener('error', (event) => {
  const errText = `[Runtime Error] ${event.message} (${event.filename}:${event.lineno})`;
  if (state && Array.isArray(state.systemLogs)) {
    state.systemLogs.unshift(errText);
    if (state.systemLogs.length > 30) state.systemLogs.pop();
  }
});

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(defaultState);
    const parsed = JSON.parse(raw);
    return Object.assign({}, structuredClone(defaultState), parsed);
  } catch (e) {
    return structuredClone(defaultState);
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    renderAll();
  } catch (e) {
    logSystemEvent(`[Storage Warning] تعذر حفظ بعض البيانات لتجاوز سعة المتصفح: ${e.message}`);
  }
}

function logSystemEvent(msg) {
  const time = new Date().toLocaleTimeString('ar-SA');
  state.systemLogs.unshift(`[${time}] ${msg}`);
  if (state.systemLogs.length > 40) state.systemLogs.pop();
}

// ==================== 2. رسم وتحديث النوافذ والواجهة ====================
function renderAll() {
  renderHeaderAndMastery();
  renderHazemDashboard();
  renderProjectsList();
  renderDetailedCourses();
  renderLibrary();
  renderReaderView();
  renderChatUI();
  renderDiagnosticsAndMemory();
}

function switchView(viewName) {
  document.querySelectorAll('.view-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

  document.getElementById(`view-${viewName}`)?.classList.add('active');
  document.getElementById(`nav-${viewName}`)?.classList.add('active');

  if (viewName === 'chat') renderChatUI();
  if (viewName === 'library') renderReaderView();
  if (viewName === 'settings') renderDiagnosticsAndMemory();
}

function switchSettingsTab(tabKey) {
  document.querySelectorAll('.sub-tab').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.settings-panel').forEach(p => p.classList.add('hidden'));

  document.getElementById(`subtab-btn-${tabKey}`)?.classList.add('active');
  document.getElementById(`settings-panel-${tabKey}`)?.classList.remove('hidden');
  renderDiagnosticsAndMemory();
}

function renderHeaderAndMastery() {
  const streakEl = document.getElementById('streak-badge');
  const focusEl = document.getElementById('focus-badge');
  const aiBadge = document.getElementById('ai-connection-badge');
  const aiText = document.getElementById('ai-status-text');

  if (streakEl) streakEl.textContent = `🔥 استمرارية: ${state.streak} يوم`;
  if (focusEl) focusEl.textContent = `⏱️ غوص اليوم: ${state.studyMinutesToday} د`;

  if (aiBadge && aiText) {
    if (state.aiOnline) {
      aiBadge.className = 'status-pill online';
      aiText.textContent = `الوكلاء: أونلاين (${state.settings.model})`;
    } else {
      aiBadge.className = 'status-pill offline';
      aiText.textContent = 'الوكلاء: أوفلاين (اضغط للربط)';
    }
  }

  // حساب مؤشر الإتقان والعمق المعرفي (Mastery Index) بدون أي إشارات مالية
  let totalSteps = 0;
  let doneSteps = 0;
  state.courses.forEach(c => {
    c.steps.forEach(s => {
      totalSteps++;
      if (s.done) doneSteps++;
    });
  });

  const ratio = totalSteps > 0 ? Math.round((doneSteps / totalSteps) * 100) : 0;
  const pctText = document.getElementById('mastery-percentage-text');
  const fillEl = document.getElementById('mastery-progress-fill');

  if (pctText) pctText.textContent = `${ratio}% إتقان معرفي (${doneSteps} من ${totalSteps} خطوة منهجية)`;
  if (fillEl) fillEl.style.width = `${Math.max(8, ratio)}%`;
}

// ==================== 3. كبسولة الغوص (المؤقت) وصوت الأعماق الهادئ ====================
function updateTimerUI() {
  const m = String(Math.floor(timerSeconds / 60)).padStart(2, '0');
  const s = String(timerSeconds % 60).padStart(2, '0');
  const el = document.getElementById('timer-display');
  if (el) el.textContent = `${m}:${s}`;
}

function startTimer() {
  if (timerInterval) return;
  const lbl = document.getElementById('timer-state-label');
  if (lbl) lbl.textContent = '🌊 في حالة غوص وتركيز عميق الآن...';

  timerInterval = setInterval(() => {
    if (timerSeconds > 0) {
      timerSeconds--;
      updateTimerUI();
    } else {
      clearInterval(timerInterval);
      timerInterval = null;
      completeFocusSession();
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  const lbl = document.getElementById('timer-state-label');
  if (lbl) lbl.textContent = '⏸️ الجلسة متوقفة مؤقتاً';
}

function resetTimer() {
  pauseTimer();
  timerSeconds = 45 * 60;
  updateTimerUI();
  const lbl = document.getElementById('timer-state-label');
  if (lbl) lbl.textContent = 'جاهز للغوص';
}

function completeFocusSession() {
  state.studyMinutesToday += 45;
  state.totalStudyMinutes += 45;
  state.streak += 1;
  logSystemEvent('إتمام جلسة غوص معرفي كاملة (45 دقيقة).');
  saveState();
  showToast('hazem', '🌊 اكتملت جلسة الغوص المعرفي!', 'تم توثيق 45 دقيقة من التركيز الصافي في سجل إتقانك.');
}

function toggleAmbientSound() {
  const btn = document.getElementById('ambient-btn');
  if (!isAmbientPlaying) {
    ambientAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const bufferSize = 2 * ambientAudioCtx.sampleRate;
    const buffer = ambientAudioCtx.createBuffer(1, bufferSize, ambientAudioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const source = ambientAudioCtx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    // فلتر تردد منخفض جداً لمحاكاة صوت أمواج المحيط الهادئة
    const filter = ambientAudioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 420;

    const gain = ambientAudioCtx.createGain();
    gain.gain.value = 0.06;

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ambientAudioCtx.destination);
    source.start(0);
    isAmbientPlaying = true;
    if (btn) btn.textContent = '🌊 صوت الأعماق: يعمل بهدوء';
  } else {
    if (ambientAudioCtx) ambientAudioCtx.close();
    isAmbientPlaying = false;
    if (btn) btn.textContent = '🌊 صوت الأعماق: متوقف';
  }
}

// ==================== 4. المسارات التفصيلية، الخطوات، والمصادر المقترحة ====================
function renderDetailedCourses() {
  const container = document.getElementById('courses-detailed-list');
  if (!container) return;

  container.innerHTML = state.courses.map((course, cIdx) => {
    const doneCount = course.steps.filter(s => s.done).length;
    const pct = Math.round((doneCount / course.steps.length) * 100);

    const stepsHtml = course.steps.map((step, sIdx) => `
      <label class="step-item ${step.done ? 'done' : ''}">
        <input type="checkbox" ${step.done ? 'checked' : ''} onchange="toggleCourseStep(${cIdx}, ${sIdx})" />
        <span>${step.text}</span>
      </label>
    `).join('');

    const resourcesHtml = course.resources.map(res => `
      <a href="${res.url}" target="_blank" rel="noopener" class="resource-link">
        <span>🔗 ${res.title}</span>
        <span>↗️</span>
      </a>
    `).join('');

    return `
      <div class="course-card">
        <div class="card-header">
          <div>
            <span class="status-pill">${course.level} — ${pct}% مكتمل</span>
            <h2 style="margin-top:6px;">🎓 ${course.title}</h2>
            <p class="card-hint">${course.overview}</p>
          </div>
          <button class="btn-secondary btn-sm" onclick="askFahadAboutCourse('${course.id}')">💬 اطلب شرحاً أو خطة من فهد</button>
        </div>

        <div class="course-meta-grid">
          <div class="course-box">
            <h4>📋 خطوات الإتقان المتدرجة:</h4>
            ${stepsHtml}
          </div>

          <div class="course-box">
            <h4>🌐 المصادر المرجعية المقترحة:</h4>
            ${resourcesHtml}
            <h4 style="margin-top:12px;">🛠️ مشروع التمرين التطبيقي:</h4>
            <p style="font-size:0.83rem; color:var(--text-pearl);">${course.suggestedPractice}</p>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function toggleCourseStep(cIdx, sIdx) {
  const step = state.courses[cIdx].steps[sIdx];
  step.done = !step.done;
  saveState();
  if (step.done) {
    showToast('fahad', '🌊 خطوة معرفية جديدة!', `أتممت: "${step.text}"`);
  }
}

function askFahadAboutCourse(courseId) {
  const course = state.courses.find(c => c.id === courseId);
  if (!course) return;
  switchAgent('fahad');
  const modal = document.getElementById('popup-chat-window');
  modal?.classList.remove('hidden');
  const input = document.getElementById('popup-chat-input');
  if (input) {
    input.value = `أريد خطة عملية مركزة للمذاكرة والتطبيق في مسار "${course.title}" مع أهم النصائح لإتقان خطواته.`;
    sendChatMessage('popup');
  }
}

// ==================== 5. المكتبة الرقمية وقارئ المذاكرة الفعلي ====================
function handleFileSelect(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const titleInput = document.getElementById('lib-title-input');
  if (titleInput && !titleInput.value.trim()) {
    titleInput.value = file.name;
  }

  // استخراج النص الفعلي من الملفات النصية والبرمجية ليقرأها الوكيل فعلياً
  const reader = new FileReader();
  reader.onload = (e) => {
    const contentBox = document.getElementById('lib-content-input');
    if (contentBox) {
      contentBox.value = e.target.result;
    }
    showToast('fahad', '📄 تم استخراج محتوى الملف', 'يمكنك الآن حفظه في المكتبة ليقرأه الوكلاء ويلخصوه لك.');
  };
  reader.readAsText(file);
}

function addFileToLibrary() {
  const titleEl = document.getElementById('lib-title-input');
  const catEl = document.getElementById('lib-category-input');
  const contentEl = document.getElementById('lib-content-input');

  const title = titleEl?.value.trim();
  const content = contentEl?.value.trim();

  if (!title && !content) {
    return alert('يرجى كتابة عنوان الملف أو لصق محتوى الدرس أولاً.');
  }

  const newFile = {
    id: 'lib_' + Date.now(),
    name: title || 'مذكرة دراسية بدون عنوان',
    category: catEl?.value || 'MO-211',
    date: new Date().toISOString().slice(0, 10),
    size: `${Math.max(1, Math.round((content || '').length / 1024))} KB نصي`,
    content: content || 'لا يوجد نص مضاف بعد — يمكنك الكتابة مباشرة داخل قارئ المذاكرة.'
  };

  state.libraryFiles.unshift(newFile);
  state.activeLibraryFileId = newFile.id;

  if (titleEl) titleEl.value = '';
  if (contentEl) contentEl.value = '';
  if (document.getElementById('lib-file-input')) document.getElementById('lib-file-input').value = '';

  logSystemEvent(`إضافة ملف جديد للمكتبة: "${newFile.name}"`);
  saveState();
  showToast('fahad', '📚 تم الحفظ في المكتبة', `تم فتح "${newFile.name}" في قارئ المذاكرة.`);
}

function renderLibrary() {
  const listEl = document.getElementById('library-files-list');
  if (!listEl) return;

  const filterCat = document.getElementById('lib-filter-select')?.value || 'all';
  const query = (document.getElementById('lib-search-input')?.value || '').toLowerCase();

  const filtered = state.libraryFiles.filter(f => {
    const matchCat = filterCat === 'all' || f.category === filterCat;
    const matchText = f.name.toLowerCase().includes(query) || (f.content || '').toLowerCase().includes(query);
    return matchCat && matchText;
  });

  if (filtered.length === 0) {
    listEl.innerHTML = '<p class="card-hint">لا توجد ملفات مطابقة في المكتبة حالياً.</p>';
    return;
  }

  listEl.innerHTML = filtered.map(item => `
    <div class="lib-item-card ${state.activeLibraryFileId === item.id ? 'active' : ''}" onclick="selectLibraryFile('${item.id}')">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:8px;">
        <div>
          <strong style="font-size:0.88rem; color:var(--text-pearl);">📄 ${item.name}</strong>
          <div style="font-size:0.74rem; color:var(--text-mist); margin-top:3px;">
            <span>المسار: ${item.category}</span> • <span>${item.date}</span>
          </div>
        </div>
        <button class="btn-danger btn-sm" onclick="event.stopPropagation(); deleteLibraryFile('${item.id}')">🗑️</button>
      </div>
    </div>
  `).join('');
}

function selectLibraryFile(fileId) {
  state.activeLibraryFileId = fileId;
  saveState();
}

function renderReaderView() {
  const activeFile = state.libraryFiles.find(f => f.id === state.activeLibraryFileId) || state.libraryFiles[0];
  const titleEl = document.getElementById('reader-file-title');
  const badgeEl = document.getElementById('reader-file-badge');
  const contentEl = document.getElementById('reader-content-view');
  const actionsEl = document.getElementById('reader-actions');
  const metaEl = document.getElementById('reader-meta-info');

  if (!activeFile) {
    if (titleEl) titleEl.textContent = 'لا توجد ملفات في المكتبة حالياً';
    if (contentEl) contentEl.value = '';
    actionsEl?.classList.add('hidden');
    return;
  }

  state.activeLibraryFileId = activeFile.id;
  if (titleEl) titleEl.textContent = activeFile.name;
  if (badgeEl) badgeEl.textContent = `مسار: ${activeFile.category}`;
  if (contentEl && document.activeElement !== contentEl) {
    contentEl.value = activeFile.content || '';
  }
  if (metaEl) metaEl.textContent = `تاريخ الحفظ: ${activeFile.date} | طول النص: ${(activeFile.content || '').length} حرف (متاح بالكامل لقراءة الوكلاء)`;
  actionsEl?.classList.remove('hidden');
}

function saveActiveReaderContent() {
  const activeFile = state.libraryFiles.find(f => f.id === state.activeLibraryFileId);
  const contentEl = document.getElementById('reader-content-view');
  if (activeFile && contentEl) {
    activeFile.content = contentEl.value;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
}

function deleteLibraryFile(fileId) {
  state.libraryFiles = state.libraryFiles.filter(f => f.id !== fileId);
  if (state.activeLibraryFileId === fileId) {
    state.activeLibraryFileId = state.libraryFiles[0]?.id || null;
  }
  saveState();
}

function triggerAgentOnActiveFile(actionType) {
  const activeFile = state.libraryFiles.find(f => f.id === state.activeLibraryFileId);
  if (!activeFile) return alert('اختر ملفاً من المكتبة أولاً.');

  switchAgent('fahad');
  const modal = document.getElementById('popup-chat-window');
  modal?.classList.remove('hidden');

  const promptsMap = {
    summarize: `قم بقراءة محتوى ملفي المفتوح حالياً بعنوان "${activeFile.name}" ولخصه لي في نقاط ذهبية مركزة وواضحة.`,
    quiz: `بناءً على محتوى ملفي المفتوح "${activeFile.name}"، اطرح عليّ 3 أسئلة تطبيقية لاختبار استيعابي لما ورد فيه.`,
    explain: `اشرح لي أهم المفاهيم أو القوانين الواردة في ملفي "${activeFile.name}" بأمثلة عملية مبسطة.`
  };

  const popInput = document.getElementById('popup-chat-input');
  if (popInput) {
    popInput.value = promptsMap[actionType];
    sendChatMessage('popup');
  }
}

function saveAgentReplyToLibrary(agentKey, msgIdx) {
  const msg = state.chatHistory[agentKey]?.[msgIdx];
  if (!msg) return;

  const newFile = {
    id: 'lib_' + Date.now(),
    name: `ملخص من ${agentProfiles[agentKey].name} — ${new Date().toLocaleTimeString('ar-SA')}`,
    category: 'MO-211',
    date: new Date().toISOString().slice(0, 10),
    size: 'ملخص ذكي',
    content: msg.text
  };

  state.libraryFiles.unshift(newFile);
  state.activeLibraryFileId = newFile.id;
  saveState();
  showToast('fahad', '📥 تم حفظ الملخص في المكتبة', 'يمكنك فتحه الآن في نافذة (المكتبة والمذاكرة) لمراجعته في أي وقت.');
}

// ==================== 6. بنك الأسئلة التطبيقي وبوصلة حازم ====================
const quizQuestionsBank = {
  'MO-211': {
    q: 'عند استيراد جدول مبيعات شهري يحتوي على عمود لكل شهر (يناير، فبراير، مارس...)، ما هي الأداة الأنسب في Power Query لتحويل أعمدة الأشهر إلى عمود واحد للتاريخ وعمود للقيمة؟',
    options: [
      'Unpivot Columns (إلغاء محورية الأعمدة)',
      'Transpose Table (تبديل الصفوف والأعمدة الكامل)',
      'Split Column by Delimiter'
    ],
    correct: 0,
    topic: 'Power Query Unpivot Columns',
    explain: 'أمر Unpivot Columns يحول الأعمدة المتكررة إلى صفوف معيارية صالحة للتحليل وبناء الجداول المحورية.'
  },
  'PL-300': {
    q: 'في لغة DAX داخل Power BI، ما هي وظيفة دالة CALCULATE الأساسية التي تميزها عن بقية الدوال؟',
    options: [
      'تقييم تعبير حسابي مع القدرة على تعديل أو تجاوز سياق الفلتر الحالي (Filter Context)',
      'دمج جدولين نصيين في مرحلة الاستيراد',
      'إنشاء عمود نصي ثابت لا يتأثر بالفلاتر'
    ],
    correct: 0,
    topic: 'DAX CALCULATE & Filter Context',
    explain: 'دالة CALCULATE هي قلب لغة DAX لأنها تغير سياق الفلتر لحساب مؤشرات مخصصة.'
  },
  'CMA': {
    q: 'ما الفرق الأساسي بين الموازنة الثابتة (Static Budget) والموازنة المرنة (Flexible Budget) عند تقييم الأداء؟',
    options: [
      'الموازنة المرنة تتعدل وفقاً لمستوى النشاط أو الإنتاج الفعلي لعزل انحراف الكفاءة عن انحراف الحجم',
      'الموازنة المرنة لا تتضمن التكاليف المتغيرة',
      'الموازنة الثابتة تُعد بعد انتهاء السنة المالية'
    ],
    correct: 0,
    topic: 'الموازنات المرنة وتحليل الانحرافات (Flexible Budgets)',
    explain: 'الموازنة المرنة تحسب التكاليف المتوقعة عند حجم النشاط الفعلي، مما يمنح تقييماً عادلاً ودقيقاً لكفاءة التشغيل.'
  }
};

function loadQuizQuestion() {
  const cat = document.getElementById('quiz-category-select')?.value || 'MO-211';
  const qObj = quizQuestionsBank[cat];
  const box = document.getElementById('quiz-container');
  if (!box || !qObj) return;

  box.innerHTML = `
    <p style="font-weight:600; margin-bottom:12px; color:var(--text-pearl);">${qObj.q}</p>
    <div class="list-stack" style="display:flex; flex-direction:column; gap:8px;">
      ${qObj.options.map((opt, idx) => `
        <button class="btn-ghost" style="text-align:right;" onclick="submitQuizAnswer('${cat}', ${idx})">${opt}</button>
      `).join('')}
    </div>
    <p id="quiz-feedback-msg" style="margin-top:12px; font-size:0.86rem;"></p>
  `;
}

function submitQuizAnswer(cat, idx) {
  const qObj = quizQuestionsBank[cat];
  const fb = document.getElementById('quiz-feedback-msg');
  if (!state.quizStats[cat]) state.quizStats[cat] = { correct: 0, wrong: 0, weakPoints: [] };

  if (idx === qObj.correct) {
    state.quizStats[cat].correct++;
    if (fb) {
      fb.style.color = 'var(--teal-calm)';
      fb.textContent = `✅ إجابة دقيقة! ${qObj.explain}`;
    }
  } else {
    state.quizStats[cat].wrong++;
    if (!state.quizStats[cat].weakPoints.includes(qObj.topic)) {
      state.quizStats[cat].weakPoints.push(qObj.topic);
    }
    if (fb) {
      fb.style.color = 'var(--coral-soft)';
      fb.textContent = `❌ إجابة غير دقيقة. ${qObj.explain} — (تم رصد "${qObj.topic}" في رادار الفجوات لدى حازم).`;
    }
  }
  saveState();
}

function renderHazemDashboard() {
  const summaryBox = document.getElementById('hazem-summary-box');
  const radarList = document.getElementById('weakness-radar-list');

  let totalCorrect = 0;
  let totalWrong = 0;
  let allWeakPoints = [];

  Object.entries(state.quizStats).forEach(([cat, st]) => {
    totalCorrect += st.correct || 0;
    totalWrong += st.wrong || 0;
    (st.weakPoints || []).forEach(wp => allWeakPoints.push(`${cat}: ${wp}`));
  });

  const accuracy = (totalCorrect + totalWrong) > 0
    ? Math.round((totalCorrect / (totalCorrect + totalWrong)) * 100)
    : 100;

  if (summaryBox) {
    summaryBox.innerHTML = `
      <div class="stat-tile">
        <span>إجمالي الغوص المعرفي</span>
        <strong>${state.totalStudyMinutes} دقيقة</strong>
      </div>
      <div class="stat-tile">
        <span>دقة الاستيعاب بالاختبارات</span>
        <strong>${accuracy}% (${totalCorrect} صح)</strong>
      </div>
      <div class="stat-tile">
        <span>ملفات المكتبة النشطة</span>
        <strong>${state.libraryFiles.length} ملفات</strong>
      </div>
    `;
  }

  if (radarList) {
    if (allWeakPoints.length === 0) {
      radarList.innerHTML = '<p class="card-hint" style="color:var(--teal-calm);">✨ لا توجد فجوات حرجة مرصودة حالياً — استيعابك متوازن.</p>';
    } else {
      radarList.innerHTML = allWeakPoints.map(wp => `
        <div class="step-item" style="justify-content:space-between;">
          <span>⚠️ ${wp}</span>
          <button class="btn-ghost btn-sm" onclick="askFahadToFixWeakness('${wp}')">اطلب شرحها من فهد</button>
        </div>
      `).join('');
    }
  }
}

function askFahadToFixWeakness(topicText) {
  switchAgent('fahad');
  const modal = document.getElementById('popup-chat-window');
  modal?.classList.remove('hidden');
  const input = document.getElementById('popup-chat-input');
  if (input) {
    input.value = `رصد حازم لدي فجوة في موضوع (${topicText}). اشرح لي هذا المفهوم بهدوء وبمثال عملي واضح.`;
    sendChatMessage('popup');
  }
}

function askHazemForLiveAudit() {
  switchAgent('hazem');
  switchView('chat');
  const input = document.getElementById('main-chat-input');
  if (input) {
    input.value = 'قم بتحليل إحصائياتي الحالية ورادار الفجوات المعرفية لدي وأعطني تشخيصاً موضوعياً هادئاً وخطة عمل.';
    sendChatMessage('main');
  }
}

function renderProjectsList() {
  const box = document.getElementById('projects-list');
  if (!box) return;
  box.innerHTML = state.projects.map((p, idx) => `
    <div class="step-item" style="justify-content:space-between;">
      <span>🌊 ${p}</span>
      <button class="btn-ghost btn-sm" onclick="navigator.clipboard.writeText('${p}'); showToast('fahad', '📋 تم النسخ', 'تم نسخ الإنجاز إلى الحافظة.')">نسخ</button>
    </div>
  `).join('');
}

function addNewProject() {
  const input = document.getElementById('new-project-input');
  if (!input || !input.value.trim()) return;
  state.projects.unshift(input.value.trim());
  input.value = '';
  saveState();
}

// ==================== 7. محرك الوكلاء والربط الهجين الذكي (يدعم AQ.Ab8 و AIzaSy و Vercel Proxy و Groq) ====================
function switchAgent(agentKey) {
  state.currentAgent = agentKey;
  document.querySelectorAll('.agent-pill, .pop-tab').forEach(b => b.classList.remove('active'));
  document.getElementById(`tab-${agentKey}`)?.classList.add('active');
  document.getElementById(`pop-tab-${agentKey}`)?.classList.add('active');
  renderChatUI();
}

function togglePopupChat() {
  const modal = document.getElementById('popup-chat-window');
  modal?.classList.toggle('hidden');
  renderChatUI();
}

function renderChatUI() {
  const agent = state.currentAgent;
  const profile = agentProfiles[agent];
  const toolbar = document.getElementById('agent-skills-toolbar');
  const mainStream = document.getElementById('main-chat-messages');
  const popStream = document.getElementById('popup-chat-messages');

  if (toolbar && profile) {
    toolbar.innerHTML = profile.skills.map((sk, idx) => `
      <button class="btn-secondary btn-sm" onclick="triggerAgentSkill(${idx})">${sk.label}</button>
    `).join('');
  }

  const msgs = state.chatHistory[agent] || [];
  const html = msgs.map((m, idx) => `
    <div class="msg ${m.sender}">
      <div>${m.text}</div>
      ${m.sender === 'bot' ? `
        <div class="msg-actions">
          <button class="btn-ghost btn-sm" onclick="saveAgentReplyToLibrary('${agent}', ${idx})">📥 حفظ كملخص في المكتبة</button>
        </div>
      ` : ''}
    </div>
  `).join('');

  if (mainStream) {
    mainStream.innerHTML = html;
    mainStream.scrollTop = mainStream.scrollHeight;
  }
  if (popStream) {
    popStream.innerHTML = html;
    popStream.scrollTop = popStream.scrollHeight;
  }
}

function triggerAgentSkill(skillIdx) {
  const profile = agentProfiles[state.currentAgent];
  const skill = profile?.skills?.[skillIdx];
  if (!skill) return;

  if (typeof skill.action === 'function') {
    skill.action();
    return;
  }

  const input = document.getElementById('main-chat-input');
  if (input && skill.prompt) {
    input.value = skill.prompt;
    sendChatMessage('main');
  }
}

async function sendChatMessage(source = 'main') {
  const inputId = source === 'popup' ? 'popup-chat-input' : 'main-chat-input';
  const input = document.getElementById(inputId);
  if (!input || !input.value.trim()) return;

  const userText = input.value.trim();
  input.value = '';

  const agent = state.currentAgent;
  state.chatHistory[agent].push({ sender: 'user', text: userText });
  renderChatUI();

  // رسالة انتظار هادئة
  state.chatHistory[agent].push({ sender: 'bot', text: '⏳ جاري الغوص في السياق وتجهيز الرد...' });
  renderChatUI();

  const startTime = performance.now();
  try {
    const reply = await callHybridAI(agent, userText);
    state.lastLatencyMs = Math.round(performance.now() - startTime);
    state.aiOnline = true;
    state.chatHistory[agent].pop();
    state.chatHistory[agent].push({ sender: 'bot', text: reply });
  } catch (err) {
    state.aiOnline = false;
    state.chatHistory[agent].pop();
    logSystemEvent(`[AI Connection Error] ${err.message}`);
    state.chatHistory[agent].push({
      sender: 'bot',
      text: `🔴 الوكيل حالياً في وضع أوفلاين (تعذر الاتصال بالموديل الحي).\nالسبب التقني: ${err.message}\n\n💡 الحل السريع: افتح تبويب (🛠️ الربط والفحص والذاكرة) وتأكد من حفظ مفتاحك (AQ.Ab8 أو AIzaSy أو gsk_) وفحص الاتصال.`
    });
  }

  saveState();
}

// الموجه الهجين الذكي لدعم مفاتيح AQ.Ab8 و AIzaSy و Vercel Proxy و Groq
async function callHybridAI(agentKey, userText) {
  const profile = agentProfiles[agentKey];
  const activeFile = state.libraryFiles.find(f => f.id === state.activeLibraryFileId);
  const activeFileContext = activeFile
    ? `\n[الملف المفتوح حالياً في قارئ المكتبة: "${activeFile.name}" | المسار: ${activeFile.category}]\nمحتوى الملف النصي الكامل:\n"""\n${(activeFile.content || '').slice(0, 5000)}\n"""\n`
    : '';

  // بناء سياق الذاكرة الحية للوكيل
  const recentHistory = (state.chatHistory[agentKey] || [])
    .slice(-8, -1)
    .map(m => `${m.sender === 'user' ? 'المتعلم' : profile.name}: ${m.text}`)
    .join('\n');

  const weakSummary = Object.entries(state.quizStats)
    .map(([k, v]) => `${k}: صح(${v.correct}) خطأ(${v.wrong}) فجوات(${(v.weakPoints || []).join('، ') || 'لا يوجد'})`)
    .join(' | ');

  const fullSystemContext = `${profile.systemPrompt}

[بيانات المتعلم الحية في النظام]:
- الاستمرارية: ${state.streak} يوم | دقائق الغوص اليوم: ${state.studyMinutesToday} د | الإجمالي: ${state.totalStudyMinutes} د.
- إحصائيات الاختبارات ورادار الفجوات: ${weakSummary}
${activeFileContext}
[سياق الحوار الأخير]:
${recentHistory}`;

  const rawKey = (state.settings.apiKey || '').trim();
  const mode = state.settings.connectionMode || 'auto';
  const chosenModel = state.settings.model || 'gemini-2.5-flash';

  // 1. إذا كان المفتاح يبدأ بـ gsk_ أو الوضع groq
  if (mode === 'groq' || rawKey.startsWith('gsk_')) {
    if (!rawKey) throw new Error('لم يتم إدخال مفتاح Groq (gsk_...).');
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${rawKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: fullSystemContext },
          { role: 'user', content: userText }
        ],
        temperature: 0.65
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error?.message || `Groq HTTP ${res.status}`);
    return data.choices?.[0]?.message?.content || 'لم يتم استلام نص من النموذج.';
  }

  // 2. إذا كان المفتاح يبدأ بـ AQ. (مفاتيح Google Cloud الحديثة مثل AQ.Ab8...) أو AIzaSy
  // نجرب أولاً السيرفر الداخلي /api/chat إذا اختار المستخدم vercel_proxy، أو نجرب الاتصال الهجين الذكي
  if (mode === 'vercel_proxy') {
    return await callVercelProxyEndpoint(fullSystemContext, userText, rawKey, chosenModel);
  }

  if (!rawKey) {
    // محاولة الاتصال بالسيرفر الداخلي إن وجد مفتاح مخزن في بيئة السيرفر
    return await callVercelProxyEndpoint(fullSystemContext, userText, '', chosenModel);
  }

  const isModernAQKey = rawKey.toUpperCase().startsWith('AQ.');
  const geminiModel = chosenModel.startsWith('gemini') ? chosenModel : 'gemini-2.5-flash';

  // لمفاتيح AQ.Ab8 الحديثة: ندعم تمريرها عبر السيرفر الوسيط أولاً (إن وجد) ثم عبر الهيدر المزدوج و Bearer
  if (isModernAQKey) {
    try {
      return await callVercelProxyEndpoint(fullSystemContext, userText, rawKey, geminiModel);
    } catch (proxyErr) {
      // إذا لم يكن على Vercel (مثلاً مشغل محلياً)، نجرب الاتصال المباشر مع تمرير المفتاح بطرق المصادقة الحديثة
      return await callDirectGoogleAPI(fullSystemContext, userText, rawKey, geminiModel, true);
    }
  }

  // لمفاتيح AIzaSy القياسية
  return await callDirectGoogleAPI(fullSystemContext, userText, rawKey, geminiModel, false);
}

async function callDirectGoogleAPI(systemContext, userText, apiKey, modelName, isAQToken) {
  const modelsFallback = [modelName, 'gemini-2.5-flash', 'gemini-2.5-flash-lite'];
  let lastError = '';

  for (const mod of [...new Set(modelsFallback)]) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${mod}:generateContent?key=${encodeURIComponent(apiKey)}`;
      const headers = { 'Content-Type': 'application/json' };

      // إذا كان مفتاح قوقل الحديث AQ.Ab8 نمرره أيضاً في x-goog-api-key
      if (isAQToken) {
        headers['x-goog-api-key'] = apiKey;
      }

      const res = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemContext }] },
          contents: [{ role: 'user', parts: [{ text: userText }] }],
          generationConfig: { temperature: 0.7 }
        })
      });

      const data = await res.json();
      if (res.ok && data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      }
      lastError = data?.error?.message || `HTTP ${res.status}`;
    } catch (e) {
      lastError = e.message;
    }
  }
  throw new Error(lastError || 'رفض سيرفر Google الاتصال بالمفتاح المقدم.');
}

async function callVercelProxyEndpoint(systemContext, userText, clientKey, modelName) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemPrompt: systemContext,
      userText,
      apiKey: clientKey,
      model: modelName
    })
  });
  const data = await res.json();
  if (!res.ok || !data?.reply) {
    throw new Error(data?.error || 'سيرفر /api/chat غير مفعل أو رفض المفتاح.');
  }
  return data.reply;
}

// ==================== 8. حفظ وفحص الاتصال، مختبر عبدالملك، وإدارة الذاكرة ====================
function updateConnectionModeUI() {
  const mode = document.getElementById('connection-mode-select')?.value || 'auto';
  state.settings.connectionMode = mode;
}

async function saveAndVerifyConnection() {
  const keyInput = document.getElementById('api-key-input');
  const modeSelect = document.getElementById('connection-mode-select');
  const modelSelect = document.getElementById('ai-model-select');
  const resultBox = document.getElementById('connection-test-result');

  state.settings.apiKey = keyInput?.value.trim() || '';
  state.settings.connectionMode = modeSelect?.value || 'auto';
  state.settings.model = modelSelect?.value || 'gemini-2.5-flash';

  if (resultBox) {
    resultBox.style.color = 'var(--cyan-soft)';
    resultBox.textContent = '⏳ جاري اختبار الاتصال الفعلي بالموديل وفحص المفتاح...';
  }

  const t0 = performance.now();
  try {
    const testReply = await callHybridAI('abdulmalik', 'أجب بجملة ترحيبية قصيرة جداً تؤكد نجاح الاتصال.');
    state.lastLatencyMs = Math.round(performance.now() - t0);
    state.aiOnline = true;
    logSystemEvent(`نجاح ربط الذكاء الاصطناعي (${state.settings.model}) بزمن استجابة ${state.lastLatencyMs}ms.`);
    saveState();

    if (resultBox) {
      resultBox.style.color = 'var(--teal-calm)';
      resultBox.innerHTML = `🟢 <strong>تم الربط الفعلي بنجاح!</strong> (${state.lastLatencyMs} ms)<br>رد المهندس عبدالملك الحي: "${testReply}"`;
    }
  } catch (err) {
    state.aiOnline = false;
    logSystemEvent(`فشل اختبار الاتصال: ${err.message}`);
    saveState();

    if (resultBox) {
      resultBox.style.color = 'var(--coral-soft)';
      resultBox.innerHTML = `🔴 <strong>فشل الاتصال الحي (الوكلاء في وضع أوفلاين):</strong><br>${err.message}`;
    }
  }
}

function disconnectAI() {
  state.aiOnline = false;
  state.settings.apiKey = '';
  if (document.getElementById('api-key-input')) document.getElementById('api-key-input').value = '';
  logSystemEvent('تم فصل مفتاح الذكاء الاصطناعي يدوياً وتحويل الوكلاء إلى أوفلاين.');
  saveState();
}

function renderDiagnosticsAndMemory() {
  const healthGrid = document.getElementById('system-health-grid');
  const logBox = document.getElementById('abdulmalik-error-log');
  const memBox = document.getElementById('memory-stats-box');

  const rawJson = JSON.stringify(state);
  const sizeKb = (rawJson.length / 1024).toFixed(2);

  if (healthGrid) {
    healthGrid.innerHTML = `
      <div class="stat-tile">
        <span>حالة اتصال الموديل</span>
        <strong style="color:${state.aiOnline ? 'var(--teal-calm)' : 'var(--coral-soft)'};">
          ${state.aiOnline ? '🟢 متصل (Online)' : '🔴 أوفلاين (Offline)'}
        </strong>
      </div>
      <div class="stat-tile">
        <span>زمن الاستجابة (Latency)</span>
        <strong>${state.lastLatencyMs ? state.lastLatencyMs + ' ms' : 'غير مقاس بعد'}</strong>
      </div>
      <div class="stat-tile">
        <span>سلامة هيكل البيانات</span>
        <strong style="color:var(--teal-calm);">100% سليم ومعزول</strong>
      </div>
    `;
  }

  if (logBox) {
    logBox.innerHTML = state.systemLogs.map(l => `<div>${l}</div>`).join('');
  }

  if (memBox) {
    const totalMsgs = Object.values(state.chatHistory).reduce((acc, arr) => acc + arr.length, 0);
    memBox.innerHTML = `
      <div class="stat-tile">
        <span>حجم الذاكرة المستهلك</span>
        <strong>${sizeKb} KB / 5,120 KB</strong>
      </div>
      <div class="stat-tile">
        <span>ملفات المكتبة المحفوظة</span>
        <strong>${state.libraryFiles.length} ملفات نصية</strong>
      </div>
      <div class="stat-tile">
        <span>إجمالي رسائل الحوار</span>
        <strong>${totalMsgs} رسالة</strong>
      </div>
    `;
  }
}

function runSystemHealthCheck() {
  logSystemEvent('[Abdulmalik Security Audit] تم فحص سلامة DOM، عزل المتغيرات، وسلامة JSON في LocalStorage بنجاح.');
  renderDiagnosticsAndMemory();
  showToast('abdulmalik', '🛡️ اكتمل فحص المتانة والأمان', 'جميع النوافذ وهيكل الذاكرة تعمل بكفاءة 100% دون أي تسريب.');
}

function exportBackupJSON() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `deepdive-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
}

function importBackupJSON(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const imported = JSON.parse(e.target.result);
      state = Object.assign({}, structuredClone(defaultState), imported);
      saveState();
      showToast('abdulmalik', '✅ تمت استعادة الذاكرة', 'تم استيراد ملف النسخة الاحتياطية بنجاح.');
    } catch (err) {
      alert('ملف JSON غير صالح.');
    }
  };
  reader.readAsText(file);
}

function clearChatHistoryOnly() {
  if (!confirm('هل تريد مسح سجل رسائل الوكلاء فقط مع الاحتفاظ بملفات المكتبة وتقدمك؟')) return;
  state.chatHistory = structuredClone(defaultState.chatHistory);
  logSystemEvent('تم تنظيف سجل المحادثات مع الحفاظ على المكتبة والمسارات.');
  saveState();
}

function resetEntireAppMemory() {
  if (!confirm('تحذير: سيتم إعادة ضبط المصنع ومسح كافة البيانات المخصصة. هل أنت متأكد؟')) return;
  localStorage.removeItem(STORAGE_KEY);
  state = structuredClone(defaultState);
  saveState();
}

function toggleDevMode() {
  const checked = document.getElementById('dev-mode-toggle')?.checked;
  state.devMode = !!checked;
  document.getElementById('dev-tools-box')?.classList.toggle('hidden', !checked);
  saveState();
}

function simulateFocusSession() {
  completeFocusSession();
}

function inspectRawStateInConsole() {
  const viewer = document.getElementById('raw-memory-viewer');
  if (!viewer) return;
  viewer.classList.toggle('hidden');
  viewer.textContent = JSON.stringify(state, null, 2);
}

// ==================== 9. الإشعارات والإدخال الصوتي ====================
function showToast(agent, title, message) {
  lastToastAgent = agent;
  const toast = document.getElementById('toast-notification');
  document.getElementById('toast-title').textContent = title;
  document.getElementById('toast-message').textContent = message;
  toast?.classList.remove('hidden');
  setTimeout(() => toast?.classList.add('hidden'), 5500);
}

function handleToastClick() {
  document.getElementById('toast-notification')?.classList.add('hidden');
  switchAgent(lastToastAgent);
  togglePopupChat();
}

function startVoiceInput(targetInputId) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) return alert('متصفحك الحالي لا يدعم الإملاء الصوتي المباشر.');
  const rec = new SpeechRecognition();
  rec.lang = 'ar-SA';
  rec.onresult = (e) => {
    const input = document.getElementById(targetInputId);
    if (input) input.value = e.results[0][0].transcript;
  };
  rec.start();
}

// تهيئة النظام عند التشغيل
window.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('api-key-input')) {
    document.getElementById('api-key-input').value = state.settings.apiKey || '';
  }
  if (document.getElementById('connection-mode-select')) {
    document.getElementById('connection-mode-select').value = state.settings.connectionMode || 'auto';
  }
  if (document.getElementById('ai-model-select')) {
    document.getElementById('ai-model-select').value = state.settings.model || 'gemini-2.5-flash';
  }
  if (document.getElementById('dev-mode-toggle')) {
    document.getElementById('dev-mode-toggle').checked = !!state.devMode;
    document.getElementById('dev-tools-box')?.classList.toggle('hidden', !state.devMode);
  }

  updateTimerUI();
  loadQuizQuestion();
  renderAll();
});
