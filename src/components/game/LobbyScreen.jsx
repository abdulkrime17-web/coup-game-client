import React from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Clock,
  Copy,
  Crown,
  Link2,
  LogOut,
  Play,
  Settings2,
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
  const playerCount = room.players.length;
  const canStart = isHost && playerCount >= 2 && playerCount <= 6;
  const isTwoPlayers = playerCount === 2;

  const handleCopyCode = async () => {
    sound.playClick();
    const ok = await copyToClipboard(room.code);
    if (ok) {
      toast.success(`تم نسخ رمز الغرفة: ${room.code}`);
    } else {
      toast.error('تعذّر نسخ الرمز');
    }
  };

  const handleCopyInvite = async () => {
    sound.playClick();
    const inviteUrl = `${window.location.origin}/?room=${room.code}`;
    const ok = await copyToClipboard(inviteUrl);
    if (ok) {
      toast.success('تم نسخ رابط الدعوة المباشر');
    } else {
      toast.error('تعذّر نسخ رابط الدعوة');
    }
  };

  return (
    <div className="min-h-[100dvh] w-full bg-obsidian-stage flex flex-col px-4 py-4 safe-pt safe-pb">
      {/* Top Bar */}
      <header className="mx-auto flex w-full max-w-lg items-center justify-between gap-2 mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onLeaveRoom}
          loading={busyAction === 'leave_room'}
          className="text-zinc-400 hover:text-red-300"
        >
          <LogOut className="h-4 w-4" strokeWidth={1.75} />
          <span>مغادرة</span>
        </Button>

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

      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-4 pb-6">
        {/* Room Code Hero Card */}
        <Card className="p-5 text-center relative overflow-hidden">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-amber-400/40 to-transparent" />
          <p className="text-xs font-semibold text-zinc-400">رمز الغرفة</p>
          <div
            dir="ltr"
            className="mt-1.5 text-4xl sm:text-5xl font-black tracking-[0.28em] text-white tabular-nums pl-[0.28em]"
          >
            {room.code}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <Button variant="secondary" size="sm" onClick={handleCopyCode}>
              <Copy className="h-3.5 w-3.5 text-zinc-300" strokeWidth={1.75} />
              <span>نسخ الرمز</span>
            </Button>
            <Button variant="secondary" size="sm" onClick={handleCopyInvite}>
              <Link2 className="h-3.5 w-3.5 text-amber-300" strokeWidth={1.75} />
              <span>نسخ رابط الدعوة</span>
            </Button>
          </div>
        </Card>

        {/* Players List Card */}
        <Card className="p-4 sm:p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-amber-300" strokeWidth={1.75} />
              <h2 className="text-sm font-bold text-white">اللاعبون</h2>
            </div>
            <Badge variant={playerCount >= 2 ? 'gold' : 'muted'} className="tabular-nums">
              {playerCount} / 6
            </Badge>
          </div>

          <div className="space-y-2">
            {room.players.map((player) => {
              const isMe = player.id === self?.playerId;
              const isPlayerHost = player.id === room.hostPlayerId;
              const isReconnecting = player.status === 'reconnecting';

              return (
                <motion.div
                  layout
                  key={player.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    'flex items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 transition-colors',
                    isMe
                      ? 'border-amber-400/25 bg-amber-400/[0.06]'
                      : 'border-white/[0.08] bg-white/[0.025]'
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-zinc-800/90 text-sm font-extrabold text-zinc-100">
                      {player.name.slice(0, 1)}
                      <span
                        className={cn(
                          'absolute -bottom-0.5 -left-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#121216]',
                          isReconnecting ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'
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
                        <span className="text-[11px] text-amber-300">يعيد الاتصال...</span>
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
                      className="h-8 w-8 text-zinc-400 hover:bg-red-500/15 hover:text-red-300"
                    >
                      <UserX className="h-4 w-4" strokeWidth={1.75} />
                    </Button>
                  )}
                </motion.div>
              );
            })}

            {playerCount < 2 && (
              <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.015] px-4 py-3 text-center text-xs text-zinc-500">
                بانتظار انضمام لاعب آخر على الأقل (الحد الأدنى لاعبان)
              </div>
            )}
          </div>
        </Card>

        {/* Host Settings Card */}
        <Card className="p-4 sm:p-5 space-y-3.5">
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
          <div className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-zinc-950/60 px-3.5 py-2.5">
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
              'flex items-center justify-between gap-3 rounded-xl border px-3.5 py-3 transition-colors',
              isTwoPlayers
                ? 'border-amber-400/25 bg-amber-400/[0.04]'
                : 'border-white/[0.08] bg-zinc-950/60'
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
        <div className="mt-auto pt-2">
          {isHost ? (
            <Button
              variant="gold"
              size="lg"
              disabled={!canStart}
              loading={busyAction === 'start_game'}
              onClick={onStartGame}
              className="w-full h-[52px] text-base"
            >
              <Play className="h-[18px] w-[18px] fill-current" strokeWidth={1.75} />
              <span>ابدأ اللعبة</span>
            </Button>
          ) : (
            <div className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-zinc-900/70 py-3.5 px-4 text-sm font-semibold text-zinc-300 backdrop-blur-xl">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              <span>بانتظار المضيف لبدء اللعبة...</span>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
