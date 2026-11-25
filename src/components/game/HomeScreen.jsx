import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
    <div className="min-h-[100dvh] w-full bg-obsidian-stage flex flex-col justify-between px-4 py-5 safe-pt safe-pb">
      {/* Minimal Top Bar */}
      <header className="mx-auto flex w-full max-w-md items-center justify-between">
        <Badge
          variant={isConnected ? 'success' : 'muted'}
          className="px-2.5 py-1 text-[11px]"
        >
          {isConnected ? (
            <>
              <Wifi className="h-3 w-3" strokeWidth={1.75} />
              <span>متصل</span>
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

      {/* Main Centered Glass Card */}
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-6">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Brand Header */}
          <div className="mb-7 text-center">
            <div className="mx-auto mb-3.5 flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-400/30 bg-gradient-to-br from-amber-400/20 via-fuchsia-500/15 to-zinc-900 shadow-glow">
              <Crown className="h-7 w-7 text-amber-300" strokeWidth={1.75} />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              كوب <span className="text-amber-400/90 font-extrabold">• انقلاب</span>
            </h1>
            <p className="mt-1.5 text-sm text-zinc-400">
              لعبة النفوذ، الخداع، والانقلابات السريعة
            </p>
          </div>

          {sessionReplaced && (
            <div className="mb-4 flex items-start gap-2.5 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-200">
              <AlertCircle className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" strokeWidth={1.75} />
              <span className="leading-relaxed">
                تم نقل جلستك إلى نافذة أو جهاز آخر. يمكنك إنشاء غرفة جديدة أو الانضمام مجدداً.
              </span>
            </div>
          )}

          {inviteRoomCode && activeTab === 'join' && (
            <div className="mb-4 flex items-center justify-between gap-2 rounded-2xl border border-amber-400/25 bg-amber-400/10 px-3.5 py-2.5 text-xs text-amber-200">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-300 shrink-0" strokeWidth={1.75} />
                <span>دعوة مباشرة للغرفة</span>
              </div>
              <span dir="ltr" className="font-extrabold tracking-[0.2em] text-amber-300 tabular-nums">
                {inviteRoomCode}
              </span>
            </div>
          )}

          <Card className="p-5 sm:p-6">
            {/* Animated Segmented Tabs */}
            <div className="relative mb-5 grid grid-cols-2 rounded-xl border border-white/10 bg-zinc-950/75 p-1">
              {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'relative z-10 flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-xs sm:text-sm font-bold transition-colors',
                      isActive ? 'text-zinc-950' : 'text-zinc-400 hover:text-zinc-200'
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="home-tab-pill"
                        transition={{ type: 'spring', stiffness: 460, damping: 34 }}
                        className="absolute inset-0 -z-10 rounded-lg bg-zinc-100 shadow-sm"
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
                  className="h-12 w-full rounded-xl border border-white/[0.12] bg-zinc-950/75 px-4 text-sm font-semibold text-white placeholder:text-zinc-600 focus:border-amber-400/60 focus:outline-none focus:ring-2 focus:ring-amber-400/20 transition-all"
                />
              </div>

              {/* Room Code Input (Join tab only) */}
              {activeTab === 'join' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <label
                    htmlFor="coup-room-code"
                    className="mb-1.5 block text-xs font-semibold text-zinc-300"
                  >
                    رمز الغرفة (4 أرقام)
                  </label>
                  <input
                    id="coup-room-code"
                    type="text"
                    inputMode="numeric"
                    dir="ltr"
                    maxLength={4}
                    placeholder="0000"
                    value={roomCode}
                    onChange={(e) => setRoomCode(normalizeRoomCode(e.target.value))}
                    className="h-12 w-full rounded-xl border border-white/[0.12] bg-zinc-950/75 px-4 text-center text-xl font-black tracking-[0.45em] text-amber-300 placeholder:text-zinc-700 placeholder:tracking-[0.35em] tabular-nums focus:border-amber-400/60 focus:outline-none focus:ring-2 focus:ring-amber-400/20 transition-all"
                  />
                </motion.div>
              )}

              <Button
                type="submit"
                variant="gold"
                size="lg"
                loading={isSubmitting}
                disabled={
                  !isConnected ||
                  playerName.trim().length < 2 ||
                  (activeTab === 'join' && !isValidRoomCode(roomCode))
                }
                className="w-full mt-2"
              >
                {activeTab === 'create' ? 'إنشاء غرفة جديدة' : 'دخول الغرفة'}
              </Button>
            </form>
          </Card>
        </motion.div>
      </main>

      {/* Subtle Footer */}
      <footer className="mx-auto w-full max-w-md text-center text-[11px] text-zinc-500">
        من 2 إلى 6 لاعبين • خداع واستراتيجية في جولات سريعة
      </footer>
    </div>
  );
}
