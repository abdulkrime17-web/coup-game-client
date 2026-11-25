import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  BookOpen,
  Crown,
  DoorOpen,
  Plus,
  Sparkles,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { CHARACTER_META, COUP_CHARACTERS } from '../../lib/constants';
import {
  STORAGE_KEYS,
  cn,
  isValidRoomCode,
  normalizeRoomCode,
  safeStorageGet,
} from '../../lib/utils';

const TABS = [
  { id: 'create', label: 'إنشاء غرفة', icon: Plus },
  { id: 'join', label: 'انضمام لغرفة', icon: DoorOpen },
];

const FAN_ANGLES = [-22, -11, 0, 11, 22];

export function HomeScreen({
  inviteRoomCode,
  connectionStatus,
  sessionReplaced,
  busyAction,
  muted,
  onToggleMute,
  onOpenRules,
  onCreateRoom,
  onJoinRoom,
}) {
  const [activeTab, setActiveTab] = useState(inviteRoomCode ? 'join' : 'create');
  const [playerName, setPlayerName] = useState(() =>
    safeStorageGet(STORAGE_KEYS.PLAYER_NAME, '')
  );
  const [roomCode, setRoomCode] = useState(inviteRoomCode || '');
  const [codeFocused, setCodeFocused] = useState(false);

  const isConnected = connectionStatus === 'connected';
  const isSubmitting = busyAction === 'create_room' || busyAction === 'join_room';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (activeTab === 'create') {
      await onCreateRoom({ playerName });
    } else {
      await onJoinRoom({ roomCode, playerName });
    }
  };

  return (
    <div className="relative min-h-[100dvh] w-full overflow-hidden bg-obsidian-stage flex flex-col justify-between px-4 py-5 safe-pt safe-pb">
      {/* Subtle Luxury Dot Grid & Breathing Ambient Orbs */}
      <div className="pointer-events-none absolute inset-0 bg-luxury-grid opacity-45" />
      <motion.div
        aria-hidden="true"
        animate={{ opacity: [0.35, 0.6, 0.35], scale: [1, 1.08, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-72 w-72 rounded-full bg-amber-400/15 blur-[100px]"
      />
      <motion.div
        aria-hidden="true"
        animate={{ opacity: [0.25, 0.45, 0.25], scale: [1, 1.1, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        className="pointer-events-none absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-fuchsia-500/15 blur-[110px]"
      />

      {/* Minimal Top Bar */}
      <header className="relative z-10 mx-auto flex w-full max-w-md items-center justify-between">
        <Badge
          variant={isConnected ? 'success' : 'muted'}
          className="px-2.5 py-1 text-[11px] backdrop-blur-md"
        >
          {isConnected ? (
            <>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
              <Wifi className="h-3 w-3" strokeWidth={1.75} />
              <span>متصل بالخادم</span>
            </>
          ) : (
            <>
              <WifiOff className="h-3 w-3 animate-pulse" strokeWidth={1.75} />
              <span>جاري الاتصال...</span>
            </>
          )}
        </Badge>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={onOpenRules}>
            <BookOpen className="h-3.5 w-3.5 text-amber-300" strokeWidth={1.75} />
            <span>ورقة القواعد</span>
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={onToggleMute}
            aria-label={muted ? 'تشغيل الصوت' : 'كتم الصوت'}
          >
            {muted ? (
              <VolumeX className="h-4 w-4 text-zinc-400" strokeWidth={1.75} />
            ) : (
              <Volume2 className="h-4 w-4 text-zinc-200" strokeWidth={1.75} />
            )}
          </Button>
        </div>
      </header>

      {/* Main Centered Luxury Glass Card */}
      <main className="relative z-10 mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-6">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Royal Brand Crest with 5 Fanned Character Mini-Cards */}
          <div className="mb-7 text-center">
            <div className="relative mx-auto mb-4 flex h-20 w-44 items-center justify-center">
              {COUP_CHARACTERS.map((charKey, idx) => {
                const c = CHARACTER_META[charKey];
                const angle = FAN_ANGLES[idx];
                return (
                  <motion.div
                    key={charKey}
                    initial={{ opacity: 0, rotate: 0, y: 12 }}
                    animate={{
                      opacity: 0.85,
                      rotate: angle,
                      y: Math.abs(idx - 2) * 3,
                    }}
                    transition={{
                      delay: 0.08 + idx * 0.05,
                      type: 'spring',
                      stiffness: 260,
                      damping: 22,
                    }}
                    className={cn(
                      'absolute h-14 w-10 rounded-xl border bg-gradient-to-b shadow-lg',
                      c.gradient,
                      c.border
                    )}
                    style={{
                      transformOrigin: '50% 130%',
                      zIndex: idx === 2 ? 5 : 4 - Math.abs(idx - 2),
                    }}
                  />
                );
              })}

              {/* Center Floating Crown Seal */}
              <motion.div
                initial={{ scale: 0.75, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 320, damping: 20 }}
                className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-300/45 bg-gradient-to-b from-[#1E1910] to-[#0B0A0F] shadow-glow"
              >
                <div className="pointer-events-none absolute -inset-[1px] rounded-2xl bg-gradient-to-tr from-amber-400/30 via-transparent to-fuchsia-400/30 opacity-75" />
                <Crown className="relative z-10 h-7 w-7 text-amber-300" strokeWidth={1.75} />
              </motion.div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              كوب{' '}
              <span className="bg-gradient-to-l from-amber-200 via-amber-400 to-fuchsia-300 bg-clip-text text-transparent">
                • انقلاب
              </span>
            </h1>
            <p className="mt-1.5 text-sm text-zinc-400">
              لعبة النفوذ، الخداع، والانقلابات السريعة
            </p>
          </div>

          <AnimatePresence>
            {sessionReplaced && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="mb-4 flex items-start gap-2.5 rounded-2xl border border-amber-500/35 bg-amber-500/10 p-3.5 text-xs text-amber-200 backdrop-blur-md"
              >
                <AlertCircle
                  className="h-4 w-4 shrink-0 text-amber-400 mt-0.5"
                  strokeWidth={1.75}
                />
                <span className="leading-relaxed">
                  تم نقل جلستك إلى نافذة أو جهاز آخر. يمكنك إنشاء غرفة جديدة أو الانضمام مجدداً.
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {inviteRoomCode && activeTab === 'join' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="mb-4 flex items-center justify-between gap-2 rounded-2xl border border-amber-400/30 bg-gradient-to-l from-amber-500/15 to-amber-500/5 px-3.5 py-2.5 text-xs text-amber-100 backdrop-blur-md"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-300 shrink-0" strokeWidth={1.75} />
                  <span className="font-semibold">دعوة مباشرة للغرفة</span>
                </div>
                <span
                  dir="ltr"
                  className="font-black tracking-[0.22em] text-amber-300 tabular-nums"
                >
                  {inviteRoomCode}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <Card className="p-5 sm:p-6 overflow-hidden">
            {/* Top Specular Hairline */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-amber-300/45 to-transparent" />

            {/* Animated Segmented Tabs */}
            <div className="relative mb-5 grid grid-cols-2 rounded-2xl border border-white/[0.1] bg-[#09090E]/90 p-1">
              {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'relative z-10 flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs sm:text-sm font-bold transition-colors duration-200',
                      isActive ? 'text-zinc-950' : 'text-zinc-400 hover:text-zinc-100'
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="home-tab-pill"
                        transition={{ type: 'spring', stiffness: 460, damping: 32 }}
                        className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-b from-white to-zinc-200 shadow-sm"
                      />
                    )}
                    <Icon className="h-3.5 w-3.5" strokeWidth={2} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Player Name Input */}
              <div>
                <label
                  htmlFor="coup-player-name"
                  className="mb-1.5 block text-xs font-semibold text-zinc-300"
                >
                  اسمك في الطاولة
                </label>
                <input
                  id="coup-player-name"
                  type="text"
                  maxLength={16}
                  autoComplete="nickname"
                  placeholder="مثال: خالد"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="h-12 w-full rounded-xl border border-white/[0.12] bg-[#09090E]/85 px-4 text-sm font-semibold text-white placeholder:text-zinc-600 focus:border-amber-400/65 focus:outline-none focus:ring-2 focus:ring-amber-400/20 transition-all"
                />
              </div>

              {/* Luxury 4-Digit Slot Room Code Input (Join tab only) */}
              <AnimatePresence initial={false}>
                {activeTab === 'join' && (
                  <motion.div
                    key="join-room-code-field"
                    initial={{ opacity: 0, height: 0, y: -6 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -6 }}
                    transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <label
                      htmlFor="coup-room-code"
                      className="mb-1.5 block text-xs font-semibold text-zinc-300"
                    >
                      رمز الغرفة (4 أرقام)
                    </label>
                    <div className="relative">
                      <input
                        id="coup-room-code"
                        type="text"
                        inputMode="numeric"
                        dir="ltr"
                        maxLength={4}
                        value={roomCode}
                        onFocus={() => setCodeFocused(true)}
                        onBlur={() => setCodeFocused(false)}
                        onChange={(e) => setRoomCode(normalizeRoomCode(e.target.value))}
                        aria-label="رمز الغرفة المكون من 4 أرقام"
                        className="absolute inset-0 z-10 h-full w-full cursor-text opacity-0"
                      />
                      <div dir="ltr" className="grid grid-cols-4 gap-2.5">
                        {[0, 1, 2, 3].map((slotIdx) => {
                          const digit = roomCode[slotIdx] || '';
                          const isCurrentSlot =
                            codeFocused &&
                            (slotIdx === roomCode.length ||
                              (roomCode.length === 4 && slotIdx === 3));
                          return (
                            <div
                              key={slotIdx}
                              className={cn(
                                'relative flex h-14 items-center justify-center rounded-2xl border bg-[#09090E]/90 text-2xl font-black tabular-nums transition-all duration-150',
                                isCurrentSlot
                                  ? 'border-amber-400/80 ring-2 ring-amber-400/25 shadow-[0_0_20px_-6px_rgba(251,191,36,0.45)]'
                                  : digit
                                    ? 'border-amber-400/35 text-amber-300'
                                    : 'border-white/[0.11] text-zinc-700'
                              )}
                            >
                              {digit ? (
                                <motion.span
                                  key={`${slotIdx}-${digit}`}
                                  initial={{ scale: 0.55, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  transition={{ type: 'spring', stiffness: 520, damping: 24 }}
                                  className="text-amber-300"
                                >
                                  {digit}
                                </motion.span>
                              ) : isCurrentSlot ? (
                                <span className="h-5 w-0.5 rounded-full bg-amber-300 animate-pulse" />
                              ) : (
                                <span className="text-base text-zinc-700">•</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <Button
                type="submit"
                variant="gold"
                size="lg"
                shimmer
                loading={isSubmitting}
                disabled={
                  !isConnected ||
                  playerName.trim().length < 2 ||
                  (activeTab === 'join' && !isValidRoomCode(roomCode))
                }
                className="w-full mt-2 h-[52px]"
              >
                {activeTab === 'create' ? 'إنشاء غرفة جديدة' : 'دخول الغرفة'}
              </Button>
            </form>
          </Card>
        </motion.div>
      </main>

      {/* Subtle Character Color Dots Footer */}
      <footer className="relative z-10 mx-auto flex w-full max-w-md flex-col items-center gap-2 text-center text-[11px] text-zinc-500">
        <div className="flex items-center gap-1.5">
          {COUP_CHARACTERS.map((charKey) => (
            <span
              key={charKey}
              className="h-1.5 w-1.5 rounded-full opacity-70"
              style={{ backgroundColor: CHARACTER_META[charKey].hex }}
            />
          ))}
        </div>
        <span>من 2 إلى 6 لاعبين • خداع واستراتيجية في جولات سريعة</span>
      </footer>
    </div>
  );
}
