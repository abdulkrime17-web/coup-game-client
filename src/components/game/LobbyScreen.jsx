import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BookOpen,
  Check,
  Clock,
  Copy,
  Crown,
  Link2,
  LogOut,
  Play,
  Settings2,
  Share2,
  UserX,
  Users,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { toast } from 'sonner';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Switch } from '../ui/Switch';
import { cn, copyToClipboard } from '../../lib/utils';
import { sound } from '../../lib/sound';

export function LobbyScreen({
  room,
  self,
  isHost,
  busyAction,
  muted,
  onToggleMute,
  onOpenRules,
  onKickPlayer,
  onUpdateSettings,
  onStartGame,
  onLeaveRoom,
}) {
  const [copiedType, setCopiedType] = useState(null);
  const playerCount = room.players.length;
  const canStart = isHost && playerCount >= 2 && playerCount <= 6;
  const isTwoPlayers = playerCount === 2;
  const digits = String(room.code || '').split('');

  const markCopied = (type) => {
    setCopiedType(type);
    setTimeout(() => setCopiedType((prev) => (prev === type ? null : prev)), 1800);
  };

  const handleCopyCode = async () => {
    sound.playClick();
    const ok = await copyToClipboard(room.code);
    if (ok) {
      markCopied('code');
      toast.success(`تم نسخ رمز الغرفة: ${room.code}`);
    } else {
      toast.error('تعذّر نسخ الرمز');
    }
  };

  const canNativeShare =
    typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  const handleShareInvite = async () => {
    sound.playClick();
    const inviteUrl = `${window.location.origin}/?room=${room.code}`;

    if (canNativeShare) {
      try {
        await navigator.share({
          title: 'انضم إليّ في لعبة كوب (انقلاب)',
          text: `انضم لغرفتي في لعبة كوب • رمز الغرفة: ${room.code}`,
          url: inviteUrl,
        });
        markCopied('shared');
        return;
      } catch (err) {
        if (err?.name === 'AbortError') return;
      }
    }

    const ok = await copyToClipboard(inviteUrl);
    if (ok) {
      markCopied('link');
      toast.success('تم نسخ رابط الدعوة المباشر');
    } else {
      toast.error('تعذّر مشاركة أو نسخ رابط الدعوة');
    }
  };

  return (
    <div className="relative min-h-[100dvh] w-full overflow-hidden bg-obsidian-stage flex flex-col px-4 py-4 safe-pt safe-pb">
      <div className="pointer-events-none absolute inset-0 bg-luxury-grid opacity-35" />

      {/* Top Bar */}
      <header className="relative z-10 mx-auto flex w-full max-w-lg items-center justify-between gap-2 mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onLeaveRoom}
          loading={busyAction === 'leave_room'}
          className="text-zinc-400 hover:text-rose-300"
        >
          <LogOut className="h-4 w-4" strokeWidth={1.75} />
          <span>مغادرة</span>
        </Button>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={onOpenRules}>
            <BookOpen className="h-3.5 w-3.5 text-indigo-300" strokeWidth={1.75} />
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

      <main className="relative z-10 mx-auto flex w-full max-w-lg flex-1 flex-col gap-4 pb-6">
        {/* Room Code Hero Card with Individual Digit Tiles */}
        <Card className="p-5 text-center overflow-hidden">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-indigo-300/60 to-transparent" />
          <p className="text-xs font-bold text-zinc-400">رمز الغرفة</p>

          <div dir="ltr" className="mt-3 flex items-center justify-center gap-2.5">
            {digits.map((digit, i) => (
              <motion.div
                key={`${digit}-${i}`}
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: i * 0.06, type: 'spring', stiffness: 360, damping: 24 }}
                className="flex h-14 w-[52px] items-center justify-center rounded-2xl border border-indigo-300/25 bg-gradient-to-b from-indigo-500/15 to-[#090B14] text-3xl font-black text-white shadow-[inset_0_1px_0_rgba(224,231,255,0.2)] tabular-nums"
              >
                {digit}
              </motion.div>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <Button variant="secondary" size="sm" onClick={handleCopyCode}>
              {copiedType === 'code' ? (
                <Check className="h-3.5 w-3.5 text-emerald-400" strokeWidth={2.25} />
              ) : (
                <Copy className="h-3.5 w-3.5 text-zinc-300" strokeWidth={1.75} />
              )}
              <span>{copiedType === 'code' ? 'تم النسخ!' : 'نسخ الرمز'}</span>
            </Button>
            <Button variant="secondary" size="sm" onClick={handleShareInvite}>
              {copiedType === 'link' || copiedType === 'shared' ? (
                <Check className="h-3.5 w-3.5 text-emerald-400" strokeWidth={2.25} />
              ) : canNativeShare ? (
                <Share2 className="h-3.5 w-3.5 text-indigo-300" strokeWidth={1.75} />
              ) : (
                <Link2 className="h-3.5 w-3.5 text-indigo-300" strokeWidth={1.75} />
              )}
              <span>
                {copiedType === 'shared'
                  ? 'تمت المشاركة!'
                  : copiedType === 'link'
                    ? 'تم النسخ!'
                    : canNativeShare
                      ? 'مشاركة رابط الدعوة'
                      : 'نسخ رابط الدعوة'}
              </span>
            </Button>
          </div>
        </Card>

        {/* Players List Card */}
        <Card className="p-4 sm:p-5">
          <div className="mb-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-indigo-300" strokeWidth={1.75} />
              <h2 className="text-sm font-bold text-white">اللاعبون في الطاولة</h2>
            </div>
            <Badge variant={playerCount >= 2 ? 'gold' : 'muted'} className="tabular-nums">
              {playerCount} / 6
            </Badge>
          </div>

          {/* Seat Capacity Bar */}
          <div className="mb-3.5 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
            <motion.div
              animate={{ width: `${Math.min(100, (playerCount / 6) * 100)}%` }}
              transition={{ type: 'spring', stiffness: 280, damping: 28 }}
              className={cn(
                'h-full rounded-full',
                playerCount >= 2
                  ? 'bg-gradient-to-l from-indigo-400 to-violet-500'
                  : 'bg-zinc-600'
              )}
            />
          </div>

          <div className="space-y-2">
            <AnimatePresence initial={false} mode="popLayout">
              {room.players.map((player) => {
                const isMe = player.id === self?.playerId;
                const isPlayerHost = player.id === room.hostPlayerId;
                const isReconnecting = player.status === 'reconnecting';

                return (
                  <motion.div
                    layout
                    key={player.id}
                    initial={{ opacity: 0, y: 10, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.94, x: 16 }}
                    transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                    className={cn(
                      'flex items-center justify-between gap-3 rounded-2xl border px-3.5 py-2.5 transition-colors',
                      isMe
                        ? 'border-indigo-400/35 bg-gradient-to-l from-indigo-500/15 to-transparent'
                        : 'border-white/[0.08] bg-white/[0.025]'
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={cn(
                          'relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border text-sm font-extrabold',
                          isPlayerHost
                            ? 'border-indigo-400/40 bg-indigo-500/20 text-indigo-200'
                            : 'border-white/10 bg-zinc-800/90 text-zinc-100'
                        )}
                      >
                        {player.name.slice(0, 1)}
                        <span
                          className={cn(
                            'absolute -bottom-0.5 -left-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#0D1019]',
                            isReconnecting ? 'bg-sky-400 animate-pulse' : 'bg-emerald-400'
                          )}
                        />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-sm font-bold text-white truncate">
                            {player.name}
                          </span>
                          {isMe && (
                            <Badge variant="default" className="text-[10px] px-1.5 py-0">
                              أنت
                            </Badge>
                          )}
                          {isPlayerHost && (
                            <Badge variant="gold" className="text-[10px] px-1.5 py-0">
                              <Crown className="h-2.5 w-2.5" strokeWidth={2} />
                              المضيف
                            </Badge>
                          )}
                        </div>
                        {isReconnecting && (
                          <span className="text-[11px] text-sky-300">يعيد الاتصال...</span>
                        )}
                      </div>
                    </div>

                    {isHost && !isMe && (
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`طرد ${player.name}`}
                        loading={busyAction === `kick_${player.id}`}
                        onClick={() => onKickPlayer(player.id)}
                        className="h-8 w-8 text-zinc-400 hover:bg-rose-500/15 hover:text-rose-300"
                      >
                        <UserX className="h-4 w-4" strokeWidth={1.75} />
                      </Button>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {playerCount < 2 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-2xl border border-dashed border-white/15 bg-white/[0.015] px-4 py-3 text-center text-xs text-zinc-400"
              >
                شارك رمز الغرفة مع صديقك للبدء (الحد الأدنى لاعبان)
              </motion.div>
            )}
          </div>
        </Card>

        {/* Host Settings Card */}
        <Card className="p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings2 className="h-4 w-4 text-zinc-400" strokeWidth={1.75} />
              <h2 className="text-sm font-bold text-white">إعدادات الجولة</h2>
            </div>
            {!isHost && (
              <span className="text-[11px] text-zinc-500">يتحكم بها المضيف</span>
            )}
          </div>

          {/* Server Response Timers Overview */}
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/[0.08] bg-[#080A12]/80 px-3.5 py-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <Clock className="h-4 w-4 text-zinc-400 shrink-0" strokeWidth={1.75} />
              <div className="min-w-0">
                <div className="text-xs font-semibold text-zinc-200">مؤقتات الاستجابة</div>
                <div className="text-[11px] text-zinc-500">
                  التحدّي والصدّ • اختيار البطاقات
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <Badge variant="muted" className="tabular-nums text-[11px]">
                12ث
              </Badge>
              <Badge variant="muted" className="tabular-nums text-[11px]">
                15ث
              </Badge>
            </div>
          </div>

          {/* 2-Player Draft Variant Switch */}
          <div
            className={cn(
              'flex items-center justify-between gap-3 rounded-2xl border px-3.5 py-3 transition-colors',
              isTwoPlayers
                ? 'border-indigo-400/35 bg-indigo-500/10'
                : 'border-white/[0.08] bg-[#080A12]/80'
            )}
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-zinc-100">
                  وضع السحب المسبق للاعبَين
                </span>
                {isTwoPlayers && (
                  <Badge variant="gold" className="text-[10px] px-1.5 py-0">
                    متاح الآن
                  </Badge>
                )}
              </div>
              <p className="mt-0.5 text-[11px] text-zinc-400 leading-relaxed">
                {isTwoPlayers
                  ? 'يختار كل لاعب بطاقته الأولى من 5 شخصيات قبل بدء الجولة.'
                  : 'ينطبق تلقائياً عند اللعب بلاعبَين فقط (2 لاعبين).'}
              </p>
            </div>

            <Switch
              ariaLabel="تفعيل وضع السحب المسبق للاعبَين"
              checked={Boolean(room.settings?.twoPlayerDraft)}
              disabled={!isHost || busyAction === 'update_settings'}
              onCheckedChange={(checked) => onUpdateSettings({ twoPlayerDraft: checked })}
            />
          </div>
        </Card>

        {/* Start Action Footer */}
        <div className="mt-auto pt-1">
          {isHost ? (
            <Button
              variant="gold"
              size="lg"
              shimmer={canStart}
              disabled={!canStart}
              loading={busyAction === 'start_game'}
              onClick={onStartGame}
              className="w-full h-[52px] text-base"
            >
              <Play className="h-[18px] w-[18px] fill-current" strokeWidth={1.75} />
              <span>ابدأ اللعبة</span>
            </Button>
          ) : (
            <div className="flex items-center justify-center gap-2.5 rounded-2xl border border-white/[0.1] bg-[#0D1019]/85 py-3.5 px-4 text-sm font-semibold text-zinc-300 backdrop-blur-xl">
              <span className="h-2 w-2 rounded-full bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.9)] animate-pulse" />
              <span>بانتظار المضيف لبدء اللعبة...</span>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
