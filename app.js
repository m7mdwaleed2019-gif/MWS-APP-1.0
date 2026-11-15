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
  chatHistory
