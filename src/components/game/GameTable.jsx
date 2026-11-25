import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BookOpen,
  Check,
  Coins,
  Eye,
  EyeOff,
  Layers,
  LogOut,
  ScrollText,
  Shield,
  Skull,
  Volume2,
  VolumeX,
  WifiOff,
  Zap,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Sheet } from '../ui/Sheet';
import { RoleCard } from './RoleCard';
import {
  AmbassadorExchangeSheet,
  ChooseInfluenceLossSheet,
  DraftSetupSheet,
  TargetPickerSheet,
} from './GameModals';
import { useCountdown } from '../../hooks/useCountdown';
import {
  ACTIONS_LIST,
  CHARACTER_META,
  COUP_ACTION_BLOCKERS,
} from '../../lib/constants';
import { cn } from '../../lib/utils';

function getPlayerName(room, playerId) {
  if (!playerId) return '';
  return room.players.find((p) => p.id === playerId)?.name || 'لاعب';
}

function buildCenterBanner(room, selfId) {
  const { phase, pendingAction, pendingBlock, pendingInfluenceLoss, currentTurnPlayerId } = room;
  const turnName = getPlayerName(room, currentTurnPlayerId);
  const actorName = getPlayerName(room, pendingAction?.actorId);
  const targetName = getPlayerName(room, pendingAction?.targetId);
  const blockerName = getPlayerName(room, pendingBlock?.blockerId);
  const claimedMeta = pendingAction?.claimedRole
    ? CHARACTER_META[pendingAction.claimedRole]
    : null;
  const blockMeta = pendingBlock?.claimedRole
    ? CHARACTER_META[pendingBlock.claimedRole]
    : null;

  if (phase === 'DRAFT_SETUP') {
    return {
      key: 'draft',
      eyebrow: 'تجهيز الجولة',
      headline: room.draftHasPicked
        ? 'تم اختيار بطاقتك — بانتظار اللاعب الآخر'
        : 'اختر شخصيتك الأولى لبدء الجولة',
      accentRole: null,
      tone: 'gold',
    };
  }

  if (phase === 'TURN_ACTION') {
    const isMine = currentTurnPlayerId === selfId;
    return {
      key: `turn-${currentTurnPlayerId}`,
      eyebrow: isMine ? 'دورك الآن' : 'الدور الحالي',
      headline: isMine
        ? room.mandatoryCoup
          ? 'لديك 10 عملات أو أكثر — يجب تنفيذ انقلاب!'
          : 'اختر حركتك من شريط الأوامر بالأسفل'
        : `دور ${turnName} لاختيار حركته...`,
      accentRole: null,
      tone: isMine ? (room.mandatoryCoup ? 'danger' : 'gold') : 'default',
    };
  }

  if (phase === 'ACTION_CHALLENGE_WINDOW' && pendingAction) {
    let headline = `${actorName} ينفّذ حركة`;
    if (pendingAction.type === 'tax') {
      headline = `${actorName} يطالب بـ 3 عملات (يدّعي الدوق)`;
    } else if (pendingAction.type === 'assassinate') {
      headline = `${actorName} يحاول اغتيال ${targetName} (يدّعي السفاح)`;
    } else if (pendingAction.type === 'steal') {
      headline = `${actorName} يحاول سرقة عملتين من ${targetName} (يدّعي القبطان)`;
    } else if (pendingAction.type === 'exchange') {
      headline = `${actorName} يريد تبديل أوراقه (يدّعي السفير)`;
    }
    return {
      key: `acw-${pendingAction.actorId}-${pendingAction.type}`,
      eyebrow: 'نافذة التحدّي',
      headline,
      accentRole: claimedMeta,
      tone: 'challenge',
    };
  }

  if (phase === 'BLOCK_WINDOW' && pendingAction) {
    let headline = `هل يصدّ أحد حركة ${actorName}؟`;
    if (pendingAction.type === 'foreign_aid') {
      headline = `${actorName} يطلب مساعدة خارجية (+2 عملتان)`;
    } else if (pendingAction.type === 'assassinate') {
      headline = `${actorName} يغتال ${targetName} — هل تصدّ بالكونتيسا؟`;
    } else if (pendingAction.type === 'steal') {
      headline = `${actorName} يسرق من ${targetName} — يمكن الصدّ بالقبطان أو السفير`;
    }
    return {
      key: `bw-${pendingAction.actorId}-${pendingAction.type}`,
      eyebrow: 'نافذة الصدّ',
      headline,
      accentRole: null,
      tone: 'block',
    };
  }

  if (phase === 'BLOCK_CHALLENGE_WINDOW' && pendingBlock) {
    return {
      key: `bcw-${pendingBlock.blockerId}-${pendingBlock.claimedRole}`,
      eyebrow: 'تحدّي الصدّ',
      headline: `${blockerName} يصدّ الحركة (يدّعي ${blockMeta?.nameAr || ''})`,
      accentRole: blockMeta,
      tone: 'challenge',
    };
  }

  if (phase === 'EXCHANGE_SELECT') {
    const isMine = Boolean(room.exchangeOptions);
    return {
      key: `exch-${pendingAction?.actorId || 'me'}`,
      eyebrow: 'تبديل السفير',
      headline: isMine
        ? 'اختر البطاقات التي ستحتفظ بها...'
        : `${actorName || turnName} يبدّل بطاقاته مع الديوان...`,
      accentRole: CHARACTER_META.ambassador,
      tone: 'default',
    };
  }

  if (phase === 'CHOOSE_INFLUENCE_LOSS' && pendingInfluenceLoss) {
    const loserName = getPlayerName(room, pendingInfluenceLoss.playerId);
    const isMine = pendingInfluenceLoss.playerId === selfId;
    return {
      key: `loss-${pendingInfluenceLoss.playerId}`,
      eyebrow: 'خسارة نفوذ',
      headline: isMine
        ? 'اختر البطاقة التي ستكشفها وتخسرها'
        : `${loserName} يختار بطاقة لكشفها وخسارتها...`,
      accentRole: null,
      tone: 'danger',
    };
  }

  return {
    key: phase,
    eyebrow: 'جاري اللعب',
    headline: 'بانتظار الخطوة التالية...',
    accentRole: null,
    tone: 'default',
  };
}

export function GameTable({
  room,
  self,
  me,
  opponents,
  isMyTurn,
  canRespond,
  hasPassed,
  connectionStatus,
  busyAction,
  muted,
  onToggleMute,
  onOpenRules,
  onOpenLog,
  unreadLog,
  actions,
}) {
  const [privacyShield, setPrivacyShield] = useState(false);
  const [peeking, setPeeking] = useState(false);
  const [targetActionType, setTargetActionType] = useState(null);
  const [confirmLeaveOpen, setConfirmLeaveOpen] = useState(false);

  const countdown = useCountdown(room.phaseEndsAt, room.serverNow, room.phase);
  const banner = useMemo(
    () => buildCenterBanner(room, self?.playerId),
    [room, self?.playerId]
  );

  const currentTurnPlayer = room.players.find((p) => p.id === room.currentTurnPlayerId);
  const latestLog = room.actionLog?.[room.actionLog.length - 1];
  const aliveOpponentsWithCoins = opponents.some((p) => p.isAlive && p.coins >= 1);
  const isMandatoryCoup = Boolean(room.mandatoryCoup || (me && me.coins >= 10));
  const showActionBar = room.phase === 'TURN_ACTION' && isMyTurn && Boolean(me?.isAlive);

  // Valid block characters for BLOCK_WINDOW
  const validBlockRoles =
    room.phase === 'BLOCK_WINDOW' && room.pendingAction
      ? COUP_ACTION_BLOCKERS[room.pendingAction.type] || []
      : [];

  const isChallengeWindow =
    room.phase === 'ACTION_CHALLENGE_WINDOW' || room.phase === 'BLOCK_CHALLENGE_WINDOW';
  const isBlockWindow = room.phase === 'BLOCK_WINDOW';

  const handleActionClick = (actionDef) => {
    if (actionDef.requiresTarget) {
      setTargetActionType(actionDef.id);
    } else {
      actions.performAction(actionDef.id);
    }
  };

  const handleTargetConfirm = async (targetId) => {
    const type = targetActionType;
    setTargetActionType(null);
    if (type) {
      await actions.performAction(type, targetId);
    }
  };

  const showExchangeModal =
    room.phase === 'EXCHANGE_SELECT' &&
    Array.isArray(room.exchangeOptions) &&
    room.exchangeOptions.length > 0;

  const showLossModal =
    room.phase === 'CHOOSE_INFLUENCE_LOSS' &&
    room.pendingInfluenceLoss?.playerId === self?.playerId;

  const showDraftModal = room.phase === 'DRAFT_SETUP';

  const cardsBlurred = privacyShield && !peeking;

  const opponentGridClass =
    opponents.length === 1
      ? 'grid-cols-1 max-w-xs mx-auto w-full'
      : opponents.length === 2
        ? 'grid-cols-2'
        : opponents.length <= 4
          ? 'grid-cols-2'
          : 'grid-cols-2 sm:grid-cols-3';

  return (
    <div className="h-[100dvh] w-full overflow-hidden bg-obsidian-stage flex flex-col">
      <div className="mx-auto flex h-full w-full max-w-2xl flex-col px-3 sm:px-4 pt-2.5 safe-pt safe-pb gap-2.5">
        {/* 1. TOP COMPACT HUD */}
        <header className="flex shrink-0 items-center justify-between gap-2 rounded-2xl border border-white/10 bg-zinc-900/75 px-3 py-2 backdrop-blur-xl">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className={cn(
                'h-2 w-2 shrink-0 rounded-full',
                isMyTurn
                  ? 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.9)] animate-pulse'
                  : 'bg-zinc-500'
              )}
            />
            <div className="min-w-0">
              <div className="truncate text-xs sm:text-sm font-bold text-white leading-tight">
                {isMyTurn
                  ? 'دورك الآن'
                  : currentTurnPlayer
                    ? `دور ${currentTurnPlayer.name}`
                    : `غرفة ${room.code}`}
              </div>
              <div className="flex items-center gap-2 text-[10px] text-zinc-400 leading-tight mt-0.5">
                <span className="inline-flex items-center gap-1 tabular-nums">
                  <Layers className="h-2.5 w-2.5 text-zinc-400" strokeWidth={1.75} />
                  الديوان: {room.courtDeckCount}
                </span>
                <span dir="ltr" className="text-zinc-500 tabular-nums">
                  #{room.code}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <Button
              variant="secondary"
              size="xs"
              onClick={onOpenLog}
              className="relative"
            >
              <ScrollText className="h-3.5 w-3.5 text-zinc-300" strokeWidth={1.75} />
              <span className="hidden min-[380px]:inline">السجل</span>
              {unreadLog && (
                <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-amber-400" />
              )}
            </Button>

            <Button
              variant="secondary"
              size="xs"
              onClick={onOpenRules}
              className="border-amber-400/25 bg-amber-400/10 text-amber-200 hover:bg-amber-400/20"
            >
              <BookOpen className="h-3.5 w-3.5 text-amber-300" strokeWidth={1.75} />
              <span>ورقة القواعد</span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleMute}
              aria-label={muted ? 'تشغيل الصوت' : 'كتم الصوت'}
              className="h-8 w-8 text-zinc-300"
            >
              {muted ? (
                <VolumeX className="h-4 w-4 text-zinc-500" strokeWidth={1.75} />
              ) : (
                <Volume2 className="h-4 w-4" strokeWidth={1.75} />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setConfirmLeaveOpen(true)}
              aria-label="مغادرة الغرفة"
              className="h-8 w-8 text-zinc-400 hover:text-red-300"
            >
              <LogOut className="h-4 w-4" strokeWidth={1.75} />
            </Button>
          </div>
        </header>

        {/* Connection Reconnecting Ribbon */}
        {connectionStatus !== 'connected' && (
          <div className="flex shrink-0 items-center justify-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/15 px-3 py-1.5 text-xs font-semibold text-amber-200">
            <WifiOff className="h-3.5 w-3.5 animate-pulse" strokeWidth={1.75} />
            <span>انقطع الاتصال مؤقتاً — جاري إعادة الاتصال بالغرفة...</span>
          </div>
        )}

        {/* 2. OPPONENTS GRID */}
        <section
          aria-label="الخصوم"
          className={cn('grid shrink-0 gap-2 overflow-y-auto max-h-[34dvh] py-0.5', opponentGridClass)}
        >
          {opponents.map((opp) => {
            const isOppTurn = room.currentTurnPlayerId === opp.id;
            const oppPassed =
              (isChallengeWindow || isBlockWindow) &&
              room.passedPlayerIds?.includes(opp.id);
            const isTargeted =
              room.pendingAction?.targetId === opp.id &&
              (isChallengeWindow || isBlockWindow);

            return (
              <motion.div
                layout
                key={opp.id}
                className={cn(
                  'relative rounded-2xl border p-2.5 transition-all backdrop-blur-xl',
                  !opp.isAlive
                    ? 'border-white/5 bg-zinc-950/60 opacity-45'
                    : isOppTurn
                      ? 'border-amber-400/50 bg-zinc-900/85 ring-1 ring-amber-400/35 shadow-[0_0_24px_-10px_rgba(251,191,36,0.65)]'
                      : isTargeted
                        ? 'border-red-400/45 bg-red-950/20'
                        : 'border-white/10 bg-zinc-900/65'
                )}
              >
                <div className="flex items-center justify-between gap-1.5 mb-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span
                      className={cn(
                        'h-1.5 w-1.5 shrink-0 rounded-full',
                        !opp.isAlive
                          ? 'bg-zinc-600'
                          : opp.status === 'reconnecting'
                            ? 'bg-amber-400 animate-pulse'
                            : isOppTurn
                              ? 'bg-amber-400'
                              : 'bg-emerald-400/80'
                      )}
                    />
                    <span className="truncate text-xs sm:text-sm font-bold text-zinc-100">
                      {opp.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {!opp.isAlive ? (
                      <Badge variant="danger" className="text-[10px] px-1.5 py-0">
                        مطرود
                      </Badge>
                    ) : (
                      <>
                        {oppPassed && (
                          <span className="inline-flex items-center gap-0.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-1.5 py-0 text-[10px] font-bold text-emerald-300">
                            <Check className="h-2.5 w-2.5" strokeWidth={2.5} />
                            سمح
                          </span>
                        )}
                        <Badge variant="gold" className="px-2 py-0 text-[11px] tabular-nums">
                          <Coins className="h-3 w-3" strokeWidth={1.75} />
                          {opp.coins}
                        </Badge>
                      </>
                    )}
                  </div>
                </div>

                {/* 2 Influence Card Slots */}
                <div className="flex items-center gap-1.5">
                  {(opp.cards || []).map((card) => (
                    <RoleCard
                      key={card.id}
                      size="opponent"
                      character={card.character}
                      revealed={card.revealed}
                    />
                  ))}
                </div>
              </motion.div>
            );
          })}
        </section>

        {/* 3. CENTER STAGE (Live Action & Decision Banner) */}
        <section className="flex flex-1 min-h-0 flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={banner.key}
              initial={{ opacity: 0, y: 8, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.99 }}
              transition={{ duration: 0.2 }}
              className={cn(
                'relative overflow-hidden rounded-2xl border p-3.5 sm:p-4 backdrop-blur-xl shadow-glass',
                banner.tone === 'danger'
                  ? 'border-red-500/35 bg-gradient-to-b from-red-950/35 to-zinc-900/80'
                  : banner.tone === 'challenge'
                    ? 'border-amber-400/35 bg-gradient-to-b from-amber-950/25 to-zinc-900/85'
                    : banner.tone === 'block'
                      ? 'border-sky-400/35 bg-gradient-to-b from-sky-950/25 to-zinc-900/85'
                      : banner.tone === 'gold'
                        ? 'border-amber-400/30 bg-zinc-900/80'
                        : 'border-white/10 bg-zinc-900/70'
              )}
            >
              {/* Eyebrow + Countdown Seconds */}
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-zinc-400">
                    {banner.eyebrow}
                  </span>
                  {banner.accentRole && (
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 rounded-full border px-2 py-0 text-[10px] font-bold',
                        banner.accentRole.badgeBg
                      )}
                    >
                      <banner.accentRole.icon className="h-3 w-3" strokeWidth={1.75} />
                      {banner.accentRole.nameAr}
                    </span>
                  )}
                </div>

                {countdown.active && (
                  <span
                    className={cn(
                      'rounded-full border px-2 py-0.5 text-[11px] font-extrabold tabular-nums',
                      countdown.isUrgent
                        ? 'border-red-500/40 bg-red-500/15 text-red-300 animate-pulse'
                        : 'border-white/10 bg-white/5 text-zinc-200'
                    )}
                  >
                    {countdown.secondsLeft}ث
                  </span>
                )}
              </div>

              {/* Headline */}
              <p className="text-sm sm:text-base font-extrabold text-white leading-snug">
                {banner.headline}
              </p>

              {/* Smooth Countdown Bar */}
              {countdown.active && (
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className={cn(
                      'h-full rounded-full transition-[width] duration-75',
                      countdown.isUrgent
                        ? 'bg-red-500'
                        : banner.tone === 'block'
                          ? 'bg-sky-400'
                          : 'bg-amber-400'
                    )}
                    style={{ width: `${Math.round(countdown.progress * 100)}%` }}
                  />
                </div>
              )}

              {/* Interactive Response Buttons: Challenge Window */}
              {canRespond && isChallengeWindow && (
                <div className="mt-3.5 grid grid-cols-2 gap-2.5">
                  <Button
                    variant="success"
                    size="md"
                    loading={busyAction === 'pass'}
                    disabled={Boolean(busyAction)}
                    onClick={actions.pass}
                  >
                    <Check className="h-4 w-4" strokeWidth={2.25} />
                    <span>{room.phase === 'BLOCK_CHALLENGE_WINDOW' ? 'سماح بالصدّ' : 'سماح'}</span>
                  </Button>
                  <Button
                    variant="danger"
                    size="md"
                    loading={busyAction === 'challenge'}
                    disabled={Boolean(busyAction)}
                    onClick={actions.challenge}
                  >
                    <Zap className="h-4 w-4 fill-current" strokeWidth={1.75} />
                    <span>تحدّي!</span>
                  </Button>
                </div>
              )}

              {/* Interactive Response Buttons: Block Window */}
              {canRespond && isBlockWindow && (
                <div className="mt-3.5 flex flex-wrap gap-2">
                  <Button
                    variant="success"
                    size="md"
                    loading={busyAction === 'pass'}
                    disabled={Boolean(busyAction)}
                    onClick={actions.pass}
                    className="flex-1 min-w-[110px]"
                  >
                    <Check className="h-4 w-4" strokeWidth={2.25} />
                    <span>سماح</span>
                  </Button>

                  {validBlockRoles.map((roleKey) => {
                    const roleMeta = CHARACTER_META[roleKey];
                    const RoleIcon = roleMeta.icon;
                    return (
                      <Button
                        key={roleKey}
                        variant="secondary"
                        size="md"
                        loading={busyAction === `block_${roleKey}`}
                        disabled={Boolean(busyAction)}
                        onClick={() => actions.block(roleKey)}
                        className={cn(
                          'flex-1 min-w-[128px] border bg-gradient-to-b',
                          roleMeta.gradient,
                          roleMeta.border,
                          'text-white hover:brightness-110'
                        )}
                      >
                        <Shield className="h-3.5 w-3.5 opacity-80" strokeWidth={1.75} />
                        <RoleIcon className={cn('h-3.5 w-3.5', roleMeta.textAccent)} strokeWidth={1.75} />
                        <span>{roleMeta.blockButtonAr}</span>
                      </Button>
                    );
                  })}
                </div>
              )}

              {/* Calm status after passing */}
              {hasPassed && (isChallengeWindow || isBlockWindow) && (
                <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-emerald-300/90">
                  <Check className="h-3.5 w-3.5" strokeWidth={2.25} />
                  <span>سمحت بالحركة • بانتظار بقية اللاعبين...</span>
                </div>
              )}

              {/* Latest Event Whisper */}
              {latestLog && !canRespond && (
                <p className="mt-2.5 truncate border-t border-white/[0.08] pt-2 text-[11px] text-zinc-400">
                  آخر حدث: {latestLog.textAr}
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </section>

        {/* 4. YOUR HAND & ACTION CONTROLS (Bottom Area) */}
        <section className="shrink-0 space-y-2.5">
          {/* Action Bar — visible on your turn */}
          <AnimatePresence>
            {showActionBar && (
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="rounded-2xl border border-white/[0.12] bg-zinc-900/85 p-2.5 backdrop-blur-xl shadow-glass"
              >
                {isMandatoryCoup && (
                  <div className="mb-2 flex items-center justify-center gap-1.5 rounded-xl border border-red-500/35 bg-gradient-to-l from-amber-500/15 via-red-500/20 to-amber-500/15 px-3 py-1.5 text-xs font-extrabold text-amber-200">
                    <Zap className="h-3.5 w-3.5 text-red-400 fill-current" strokeWidth={1.75} />
                    <span>إجباري عند 10 عملات — نفّذ انقلاباً الآن</span>
                  </div>
                )}

                {/* Row 1: General Actions (3 cols) */}
                <div className="grid grid-cols-3 gap-1.5 mb-1.5">
                  {ACTIONS_LIST.slice(0, 3).map((act) => {
                    const Icon = act.icon;
                    const cantAfford = (me?.coins || 0) < act.cost;
                    const blockedByMandatory = isMandatoryCoup && act.id !== 'coup';
                    const isDisabled = cantAfford || blockedByMandatory || Boolean(busyAction);
                    const isCoupHighlight = act.id === 'coup' && isMandatoryCoup;

                    return (
                      <motion.button
                        key={act.id}
                        type="button"
                        whileTap={isDisabled ? undefined : { scale: 0.96 }}
                        disabled={isDisabled}
                        onClick={() => handleActionClick(act)}
                        className={cn(
                          'relative flex flex-col items-center justify-center rounded-xl border px-2 py-2 text-center transition-all',
                          isCoupHighlight
                            ? 'border-amber-300/70 bg-gradient-to-b from-red-500/35 via-red-600/30 to-amber-500/20 text-white shadow-[0_0_24px_-4px_rgba(239,68,68,0.65)] ring-1 ring-amber-400/50'
                            : act.id === 'coup'
                              ? 'border-red-500/25 bg-red-500/10 text-red-100 hover:bg-red-500/20'
                              : 'border-white/10 bg-white/[0.04] text-zinc-100 hover:bg-white/[0.09]',
                          isDisabled && 'opacity-35 pointer-events-none'
                        )}
                      >
                        <div className="flex items-center gap-1">
                          <Icon
                            className={cn(
                              'h-3.5 w-3.5',
                              act.id === 'coup' ? 'text-red-300' : 'text-amber-300'
                            )}
                            strokeWidth={1.75}
                          />
                          <span className="text-xs font-bold leading-none">{act.labelAr}</span>
                        </div>
                        <span className="mt-1 text-[10px] font-bold text-zinc-400 tabular-nums">
                          {act.deltaAr}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Row 2: Role Actions (4 cols) */}
                <div className="grid grid-cols-4 gap-1.5">
                  {ACTIONS_LIST.slice(3).map((act) => {
                    const roleMeta = CHARACTER_META[act.role];
                    const Icon = act.icon;
                    const cantAfford = (me?.coins || 0) < act.cost;
                    const noStealTargets = act.targetNeedsCoins && !aliveOpponentsWithCoins;
                    const isDisabled =
                      cantAfford ||
                      noStealTargets ||
                      isMandatoryCoup ||
                      Boolean(busyAction);

                    return (
                      <motion.button
                        key={act.id}
                        type="button"
                        whileTap={isDisabled ? undefined : { scale: 0.96 }}
                        disabled={isDisabled}
                        onClick={() => handleActionClick(act)}
                        className={cn(
                          'flex flex-col items-center justify-center rounded-xl border px-1.5 py-2 text-center transition-all bg-gradient-to-b',
                          roleMeta.gradient,
                          roleMeta.border,
                          'hover:brightness-110',
                          isDisabled && 'opacity-30 grayscale-[0.4] pointer-events-none'
                        )}
                      >
                        <Icon
                          className={cn('h-3.5 w-3.5 mb-0.5', roleMeta.textAccent)}
                          strokeWidth={1.75}
                        />
                        <span className="text-[11px] font-extrabold text-white leading-tight">
                          {act.labelAr}
                        </span>
                        <span className="text-[9.5px] font-semibold text-zinc-300/80 leading-tight mt-0.5 tabular-nums">
                          {act.deltaAr} • {roleMeta.nameAr}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Eliminated Notice */}
          {me && !me.isAlive && (
            <div className="flex items-center justify-center gap-2 rounded-xl border border-red-500/25 bg-red-500/10 px-3 py-2 text-xs font-bold text-red-200">
              <Skull className="h-4 w-4 text-red-400" strokeWidth={1.75} />
              <span>تم إقصاؤك من الجولة — تشاهد بقية اللعب</span>
            </div>
          )}

          {/* Your Hand Header + Coins + Privacy Shield */}
          <div className="rounded-2xl border border-white/10 bg-zinc-900/75 p-3 backdrop-blur-xl">
            <div className="mb-2.5 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Badge variant="gold" className="px-2.5 py-1 text-xs sm:text-sm font-extrabold tabular-nums">
                  <Coins className="h-3.5 w-3.5" strokeWidth={2} />
                  <span>{me?.coins ?? 0}</span>
                  <span className="text-[11px] font-semibold opacity-85">عملات</span>
                </Badge>
                <span className="text-xs font-semibold text-zinc-400">بطاقاتك</span>
              </div>

              <button
                type="button"
                onClick={() => setPrivacyShield((v) => !v)}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-xl border px-2.5 py-1 text-[11px] font-bold transition-colors',
                  privacyShield
                    ? 'border-amber-400/40 bg-amber-400/15 text-amber-200'
                    : 'border-white/10 bg-white/5 text-zinc-400 hover:text-zinc-200'
                )}
              >
                {privacyShield ? (
                  <EyeOff className="h-3.5 w-3.5" strokeWidth={1.75} />
                ) : (
                  <Eye className="h-3.5 w-3.5" strokeWidth={1.75} />
                )}
                <span>{privacyShield ? 'مخفية' : 'إخفاء البطاقات'}</span>
              </button>
            </div>

            {/* Your 2 Influence Cards with Privacy Shield Press-and-Hold */}
            <div
              onPointerDown={() => privacyShield && setPeeking(true)}
              onPointerUp={() => setPeeking(false)}
              onPointerLeave={() => setPeeking(false)}
              onPointerCancel={() => setPeeking(false)}
              onContextMenu={(e) => privacyShield && e.preventDefault()}
              className={cn(
                'relative grid grid-cols-2 gap-2.5',
                privacyShield && 'select-none touch-none cursor-pointer'
              )}
            >
              {(me?.cards || []).map((card) => (
                <div
                  key={card.id}
                  className={cn(
                    'transition-all duration-150',
                    cardsBlurred && !card.revealed && 'blur-md scale-[0.98] opacity-75'
                  )}
                >
                  <RoleCard
                    size="hand"
                    character={card.character}
                    revealed={card.revealed}
                  />
                </div>
              ))}

              {cardsBlurred && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-zinc-950/85 px-3.5 py-1.5 text-xs font-bold text-zinc-200 shadow-lg backdrop-blur-md">
                    <Eye className="h-3.5 w-3.5 text-amber-300" strokeWidth={1.75} />
                    اضغط مطوّلاً للكشف
                  </span>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Special Interactive Modals */}
      <TargetPickerSheet
        actionType={targetActionType}
        opponents={opponents}
        busy={Boolean(busyAction)}
        onSelectTarget={handleTargetConfirm}
        onClose={() => setTargetActionType(null)}
      />

      <AmbassadorExchangeSheet
        open={showExchangeModal}
        options={room.exchangeOptions}
        keepCount={room.exchangeKeepCount || 1}
        countdown={countdown}
        busy={busyAction === 'exchange_select'}
        onConfirm={actions.exchangeSelect}
      />

      <ChooseInfluenceLossSheet
        open={showLossModal}
        cards={me?.cards || []}
        reason={room.pendingInfluenceLoss?.reason}
        countdown={countdown}
        busy={busyAction === 'choose_loss'}
        onConfirm={actions.chooseInfluenceLoss}
      />

      <DraftSetupSheet
        open={showDraftModal}
        options={room.draftOptions}
        hasPicked={room.draftHasPicked}
        countdown={countdown}
        busy={busyAction === 'draft_pick'}
        onPick={actions.draftPick}
      />

      {/* Leave Room Confirm Sheet */}
      <Sheet
        open={confirmLeaveOpen}
        onClose={() => setConfirmLeaveOpen(false)}
        title="مغادرة الغرفة؟"
        subtitle="إذا غادرت أثناء الجولة الجارية ستفقد مكانك في الطاولة."
      >
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <Button variant="secondary" onClick={() => setConfirmLeaveOpen(false)}>
            البقاء في اللعبة
          </Button>
          <Button
            variant="danger"
            loading={busyAction === 'leave_room'}
            onClick={() => {
              setConfirmLeaveOpen(false);
              actions.leaveRoom();
            }}
          >
            نعم، مغادرة
          </Button>
        </div>
      </Sheet>
    </div>
  );
}
