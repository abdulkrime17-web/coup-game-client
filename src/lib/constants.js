import {
  Anchor,
  Coins,
  Crown,
  HandCoins,
  RefreshCw,
  Shield,
  Skull,
  Zap,
} from 'lucide-react';

export const COUP_CHARACTERS = ['duke', 'assassin', 'ambassador', 'captain', 'contessa'];

export const COUP_ACTION_CLAIMED_ROLE = {
  tax: 'duke',
  assassinate: 'assassin',
  steal: 'captain',
  exchange: 'ambassador',
};

export const COUP_ACTION_BLOCKERS = {
  foreign_aid: ['duke'],
  assassinate: ['contessa'],
  steal: ['ambassador', 'captain'],
};

export const PHASE_DEFAULT_DURATIONS = {
  ACTION_CHALLENGE_WINDOW: 12_000,
  BLOCK_WINDOW: 12_000,
  BLOCK_CHALLENGE_WINDOW: 12_000,
  CHOOSE_INFLUENCE_LOSS: 15_000,
  EXCHANGE_SELECT: 15_000,
  DRAFT_SETUP: 20_000,
};

export const CHARACTER_META = {
  duke: {
    id: 'duke',
    nameAr: 'الدوق',
    hex: '#E879F9',
    glowRgba: 'rgba(217, 70, 239, 0.34)',
    icon: Crown,
    gradient: 'from-fuchsia-500/25 via-purple-950/45 to-[#0D0B14]',
    border: 'border-fuchsia-400/35',
    hoverBorder: 'hover:border-fuchsia-300/60',
    activeRing: 'ring-fuchsia-400/55 border-fuchsia-300/70',
    badgeBg: 'bg-fuchsia-500/20 text-fuchsia-200 border-fuchsia-400/35',
    iconBg: 'bg-fuchsia-500/20 text-fuchsia-200 border-fuchsia-400/35 shadow-[0_0_16px_-4px_rgba(217,70,239,0.55)]',
    textAccent: 'text-fuchsia-300',
    dotBg: 'bg-fuchsia-400',
    actionNameAr: 'ضريبة',
    actionEffectAr: 'احصل على 3 عملات من الخزينة',
    blockAr: 'يصدّ المساعدة الخارجية',
    shortAbilityAr: '+3 عملات • يصدّ المساعدة',
    blockButtonAr: 'صدّ بالدوق',
  },
  assassin: {
    id: 'assassin',
    nameAr: 'السفاح',
    hex: '#D4D4D8',
    glowRgba: 'rgba(161, 161, 170, 0.28)',
    icon: Skull,
    gradient: 'from-zinc-400/25 via-zinc-800/50 to-[#0B0B0F]',
    border: 'border-zinc-300/30',
    hoverBorder: 'hover:border-zinc-200/55',
    activeRing: 'ring-zinc-200/50 border-zinc-200/65',
    badgeBg: 'bg-zinc-400/20 text-zinc-100 border-zinc-300/35',
    iconBg: 'bg-zinc-400/20 text-zinc-100 border-zinc-300/35 shadow-[0_0_16px_-4px_rgba(212,212,216,0.4)]',
    textAccent: 'text-zinc-200',
    dotBg: 'bg-zinc-300',
    actionNameAr: 'اغتيال',
    actionEffectAr: 'ادفع 3 عملات لإسقاط نفوذ خصم',
    blockAr: '—',
    shortAbilityAr: '-3 عملات لإسقاط خصم',
    blockButtonAr: 'صدّ بالسفاح',
  },
  ambassador: {
    id: 'ambassador',
    nameAr: 'السفير',
    hex: '#A3E635',
    glowRgba: 'rgba(132, 204, 22, 0.30)',
    icon: RefreshCw,
    gradient: 'from-lime-500/25 via-emerald-950/45 to-[#0A100D]',
    border: 'border-lime-400/35',
    hoverBorder: 'hover:border-lime-300/60',
    activeRing: 'ring-lime-400/55 border-lime-300/70',
    badgeBg: 'bg-lime-500/20 text-lime-200 border-lime-400/35',
    iconBg: 'bg-lime-500/20 text-lime-200 border-lime-400/35 shadow-[0_0_16px_-4px_rgba(132,204,22,0.5)]',
    textAccent: 'text-lime-300',
    dotBg: 'bg-lime-400',
    actionNameAr: 'تبديل',
    actionEffectAr: 'اسحب بطاقتين من الديوان وبدّل بطاقاتك',
    blockAr: 'يصدّ السرقة',
    shortAbilityAr: 'تبديل أوراق • يصدّ السرقة',
    blockButtonAr: 'صدّ بالسفير',
  },
  captain: {
    id: 'captain',
    nameAr: 'القبطان',
    hex: '#38BDF8',
    glowRgba: 'rgba(14, 165, 233, 0.34)',
    icon: Anchor,
    gradient: 'from-sky-500/25 via-blue-950/45 to-[#090E16]',
    border: 'border-sky-400/35',
    hoverBorder: 'hover:border-sky-300/60',
    activeRing: 'ring-sky-400/55 border-sky-300/70',
    badgeBg: 'bg-sky-500/20 text-sky-200 border-sky-400/35',
    iconBg: 'bg-sky-500/20 text-sky-200 border-sky-400/35 shadow-[0_0_16px_-4px_rgba(14,165,233,0.55)]',
    textAccent: 'text-sky-300',
    dotBg: 'bg-sky-400',
    actionNameAr: 'سرقة',
    actionEffectAr: 'اسرق حتى عملتين من أي خصم',
    blockAr: 'يصدّ السرقة',
    shortAbilityAr: '+2 سرقة • يصدّ السرقة',
    blockButtonAr: 'صدّ بالقبطان',
  },
  contessa: {
    id: 'contessa',
    nameAr: 'الكونتيسا',
    hex: '#FB7185',
    glowRgba: 'rgba(239, 68, 68, 0.36)',
    icon: Shield,
    gradient: 'from-rose-500/25 via-red-950/45 to-[#140A0D]',
    border: 'border-rose-400/35',
    hoverBorder: 'hover:border-rose-300/60',
    activeRing: 'ring-rose-400/55 border-rose-300/70',
    badgeBg: 'bg-rose-500/20 text-rose-200 border-rose-400/35',
    iconBg: 'bg-rose-500/20 text-rose-200 border-rose-400/35 shadow-[0_0_16px_-4px_rgba(239,68,68,0.55)]',
    textAccent: 'text-rose-300',
    dotBg: 'bg-rose-400',
    actionNameAr: '—',
    actionEffectAr: 'تحميك من محاولة الاغتيال',
    blockAr: 'تصدّ الاغتيال',
    shortAbilityAr: 'تصدّ الاغتيال فقط',
    blockButtonAr: 'صدّ بالكونتيسا',
  },
};

export const ACTIONS_LIST = [
  {
    id: 'income',
    labelAr: 'دخل',
    deltaAr: '+1',
    sublabelAr: 'آمن • لا يُصدّ',
    icon: Coins,
    cost: 0,
    requiresTarget: false,
    role: null,
    category: 'general',
  },
  {
    id: 'foreign_aid',
    labelAr: 'مساعدة خارجية',
    deltaAr: '+2',
    sublabelAr: 'يصدّها الدوق',
    icon: HandCoins,
    cost: 0,
    requiresTarget: false,
    role: null,
    category: 'general',
  },
  {
    id: 'coup',
    labelAr: 'انقلاب',
    deltaAr: '-7',
    sublabelAr: 'إسقاط فوري',
    icon: Zap,
    cost: 7,
    requiresTarget: true,
    role: null,
    category: 'coup',
  },
  {
    id: 'tax',
    labelAr: 'ضريبة',
    deltaAr: '+3',
    sublabelAr: 'الدوق',
    icon: Crown,
    cost: 0,
    requiresTarget: false,
    role: 'duke',
    category: 'role',
  },
  {
    id: 'assassinate',
    labelAr: 'اغتيال',
    deltaAr: '-3',
    sublabelAr: 'السفاح',
    icon: Skull,
    cost: 3,
    requiresTarget: true,
    role: 'assassin',
    category: 'role',
  },
  {
    id: 'steal',
    labelAr: 'سرقة',
    deltaAr: '+2',
    sublabelAr: 'القبطان',
    icon: Anchor,
    cost: 0,
    requiresTarget: true,
    targetNeedsCoins: true,
    role: 'captain',
    category: 'role',
  },
  {
    id: 'exchange',
    labelAr: 'تبديل',
    deltaAr: '⇄',
    sublabelAr: 'السفير',
    icon: RefreshCw,
    cost: 0,
    requiresTarget: false,
    role: 'ambassador',
    category: 'role',
  },
];

export const ACTION_LABELS_AR = {
  income: 'دخل (+1)',
  foreign_aid: 'مساعدة خارجية (+2)',
  coup: 'انقلاب (-7)',
  tax: 'ضريبة (+3)',
  assassinate: 'اغتيال (-3)',
  steal: 'سرقة (+2)',
  exchange: 'تبديل أوراق',
};

export const ERROR_MESSAGES_AR = {
  RATE_LIMITED: 'أنت ترسل الطلبات بسرعة كبيرة، انتظر لحظة.',
  INTERNAL_ERROR: 'حدث خطأ غير متوقع في الخادم.',
  INVALID_SESSION: 'جلسة اللعب غير صالحة، جرّب إعادة الاتصال.',
  INVALID_NAME: 'الاسم غير صالح (2 إلى 16 حرفاً بدون رموز ممنوعة).',
  INVALID_ROOM_CODE: 'رمز الغرفة يجب أن يتكون من 4 أرقام.',
  ROOM_NOT_FOUND: 'لم يتم العثور على الغرفة. تأكد من الرمز.',
  GAME_IN_PROGRESS: 'اللعبة بدأت بالفعل في هذه الغرفة.',
  ROOM_FULL: 'الغرفة ممتلئة (الحد الأقصى 6 لاعبين).',
  NAME_TAKEN: 'هذا الاسم مستخدم بالفعل داخل الغرفة، اختر اسماً آخر.',
  NOT_IN_ROOM: 'أنت لست داخل أي غرفة حالياً.',
  FORBIDDEN: 'ليس لديك صلاحية لتنفيذ هذا الإجراء.',
  PLAYER_NOT_FOUND: 'اللاعب غير موجود في الغرفة.',
  INVALID_PHASE: 'لا يمكن تنفيذ هذا الإجراء في المرحلة الحالية.',
  INVALID_PLAYER_COUNT: 'عدد اللاعبين يجب أن يكون بين 2 و 6.',
  NOT_ENOUGH_PLAYERS: 'تحتاج إلى لاعبين اثنين على الأقل لبدء اللعبة.',
  INVALID_STATE: 'حالة اللعبة تغيّرت، يرجى المحاولة مجدداً.',
  INVALID_ACTION: 'هذه الحركة غير متاحة حالياً.',
  INVALID_CHARACTER: 'الشخصية المختارة غير صالحة.',
  NOT_PARTICIPANT: 'لست مشاركاً في هذه الخطوة.',
  ALREADY_PICKED: 'لقد اخترت بطاقتك بالفعل.',
  NOT_YOUR_TURN: 'ليس دورك الآن.',
  NOT_ALIVE: 'تم إقصاؤك من الجولة.',
  MANDATORY_COUP: 'لديك 10 عملات أو أكثر! يجب تنفيذ انقلاب.',
  INVALID_TARGET: 'الهدف المختار غير صالح.',
  INSUFFICIENT_COINS: 'لا تملك عملات كافية لهذه الحركة.',
  TARGET_HAS_NO_COINS: 'هذا اللاعب لا يملك أي عملات لسرقتها.',
  NOT_FOUND: 'العنصر المطلوب غير موجود.',
  ALREADY_BLOCKED: 'تم صدّ هذه الحركة بالفعل.',
  INVALID_BLOCK_ROLE: 'هذه الشخصية لا يمكنها صدّ الحركة الحالية.',
  INVALID_SELECTION: 'يرجى اختيار العدد الصحيح من البطاقات.',
  INVALID_CARD: 'البطاقة المختارة غير صالحة.',
};

export function getArabicErrorMessage(err) {
  if (!err) return 'حدث خطأ غير متوقع.';
  if (err.code && ERROR_MESSAGES_AR[err.code]) {
    return ERROR_MESSAGES_AR[err.code];
  }
  if (typeof err.message === 'string' && /[\u0600-\u06FF]/.test(err.message)) {
    return err.message;
  }
  return 'تعذّر تنفيذ الإجراء، حاول مجدداً.';
}

export function formatLossReasonAr(reason) {
  if (!reason) return 'يجب عليك كشف إحدى بطاقاتك وخسارة نفوذها.';
  if (/[\u0600-\u06FF]/.test(reason)) return reason;

  const lower = String(reason).toLowerCase();
  if (lower.includes('coup')) return 'تعرّضت لانقلاب لا يمكن صدّه!';
  if (lower.includes('assassin')) return 'نجحت محاولة اغتيالك!';
  if (lower.includes('challenge')) return 'خسرت التحدّي وعليك كشف بطاقة نفوذ.';
  if (lower.includes('block')) return 'فشل ادّعاؤك في الصدّ وعليك كشف بطاقة.';
  return 'يجب عليك كشف إحدى بطاقاتك وخسارة نفوذها.';
}
