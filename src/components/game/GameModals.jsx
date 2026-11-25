import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Layers, Sparkles, Target } from 'lucide-react';
import { Sheet } from '../ui/Sheet';
import { Button } from '../ui/Button';
import { RoleCard } from './RoleCard';
import { CoinBadge } from './CoinBadge';
import { ACTION_LABELS_AR, formatLossReasonAr } from '../../lib/constants';
import { cn } from '../../lib/utils';

function ModalCountdownBar({ countdown, tone = 'amber' }) {
  if (!countdown?.active) return null;
  const barColor =
    countdown.isUrgent || tone === 'danger'
      ? 'bg-gradient-to-l from-rose-400 to-red-500 shadow-[0_0_12px_rgba(244,63,94,0.65)]'
      : tone === 'lime'
        ? 'bg-gradient-to-l from-lime-300 to-emerald-400 shadow-[0_0_12px_rgba(163,230,53,0.5)]'
        : 'bg-gradient-to-l from-amber-300 to-amber-500 shadow-[0_0_12px_rgba(251,191,36,0.5)]';

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between text-xs mb-1.5">
        <span className="text-zinc-400">الوقت المتبقي</span>
        <span
          className={cn(
            'font-extrabold tabular-nums',
            countdown.isUrgent ? 'text-rose-400 animate-pulse' : 'text-zinc-200'
          )}
        >
          {countdown.secondsLeft} ثانية
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className={cn('h-full rounded-full transition-[width] duration-75', barColor)}
          style={{ width: `${Math.round(countdown.progress * 100)}%` }}
        />
      </div>
    </div>
  );
}

/**
 * Target Picker Sheet for Coup, Assassinate, and Steal.
 */
export function TargetPickerSheet({
  actionType,
  opponents = [],
  onSelectTarget,
  onClose,
  busy = false,
}) {
  const isSteal = actionType === 'steal';
  const aliveOpponents = opponents.filter((p) => p.isAlive);
  const titleMap = {
    coup: 'اختر هدف الانقلاب (-7 عملات)',
    assassinate: 'اختر هدف الاغتيال (-3 عملات)',
    steal: 'اختر خصماً للسرقة (+2 عملتان)',
  };

  return (
    <Sheet
      open={Boolean(actionType)}
      onClose={onClose}
      title={titleMap[actionType] || 'اختر الهدف'}
      subtitle={
        isSteal
          ? 'يمكنك السرقة فقط من لاعب يملك عملة واحدة على الأقل'
          : 'اختر أحد اللاعبين المتبقين لتنفيذ الحركة عليه'
      }
      tone={actionType === 'coup' ? 'danger' : 'default'}
    >
      <div className="space-y-2.5">
        {aliveOpponents.map((player, idx) => {
          const noCoins = isSteal && player.coins < 1;
          return (
            <motion.button
              key={player.id}
              type="button"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.045, type: 'spring', stiffness: 420, damping: 28 }}
              whileHover={noCoins || busy ? undefined : { scale: 1.01 }}
              whileTap={noCoins || busy ? undefined : { scale: 0.98 }}
              disabled={noCoins || busy}
              onClick={() => onSelectTarget(player.id)}
              className={cn(
                'w-full flex items-center justify-between gap-3 rounded-2xl border p-3.5 text-right transition-all',
                noCoins
                  ? 'border-white/5 bg-white/[0.02] opacity-40 cursor-not-allowed'
                  : actionType === 'coup'
                    ? 'border-rose-500/25 bg-rose-500/[0.06] hover:border-rose-400/60 hover:bg-rose-500/[0.12]'
                    : 'border-white/10 bg-white/[0.04] hover:border-amber-400/55 hover:bg-white/[0.08]'
              )}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-zinc-800/90 text-sm font-extrabold text-zinc-100">
                  {player.name.slice(0, 1)}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-white truncate">{player.name}</div>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-zinc-400">
                    <span className="inline-flex items-center gap-1 tabular-nums">
                      <Layers className="h-3 w-3" strokeWidth={1.75} />
                      {player.influenceCount === 1
                        ? 'بطاقة واحدة'
                        : `${player.influenceCount} بطاقات`}
                    </span>
                    {noCoins && <span className="text-rose-300">• لا يملك عملات</span>}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <CoinBadge coins={player.coins} />
                {!noCoins && (
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.08] text-zinc-100">
                    <Target className="h-4 w-4" strokeWidth={1.75} />
                  </div>
                )}
              </div>
            </motion.button>
          );
        })}

        {aliveOpponents.length === 0 && (
          <p className="py-6 text-center text-sm text-zinc-400">
            لا يوجد خصوم متاحون حالياً لـ {ACTION_LABELS_AR[actionType]}
          </p>
        )}
      </div>
    </Sheet>
  );
}

/**
 * Ambassador Exchange Sheet (EXCHANGE_SELECT)
 */
export function AmbassadorExchangeSheet({
  open,
  options = [],
  keepCount = 1,
  countdown,
  onConfirm,
  busy = false,
}) {
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    if (open) {
      setSelectedIds([]);
    }
  }, [open, options?.length, keepCount]);

  const toggleCard = (cardId) => {
    setSelectedIds((prev) => {
      if (prev.includes(cardId)) {
        return prev.filter((id) => id !== cardId);
      }
      if (keepCount === 1) {
        return [cardId];
      }
      if (prev.length >= keepCount) {
        return [...prev.slice(1), cardId];
      }
      return [...prev, cardId];
    });
  };

  const canConfirm = selectedIds.length === keepCount;

  return (
    <Sheet
      open={open}
      dismissible={false}
      title="تبديل السفير"
      subtitle={`اختر ${keepCount === 1 ? 'بطاقة واحدة' : `${keepCount} بطاقات`} للاحتفاظ بها، وستعود البقية إلى الديوان`}
    >
      <ModalCountdownBar countdown={countdown} tone="lime" />

      <div className="grid grid-cols-2 gap-3 mb-4">
        {(options || []).map((card, idx) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 12, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: idx * 0.05, type: 'spring', stiffness: 380, damping: 26 }}
          >
            <RoleCard
              size="picker"
              character={card.character}
              selected={selectedIds.includes(card.id)}
              disabled={busy}
              onClick={() => toggleCard(card.id)}
              className="w-full"
            />
          </motion.div>
        ))}
      </div>

      <div className="flex items-center justify-between gap-3 pt-1">
        <span className="text-xs text-zinc-400 tabular-nums">
          تم اختيار <strong className="text-zinc-100">{selectedIds.length}</strong> من{' '}
          <strong className="text-zinc-100">{keepCount}</strong>
        </span>
        <Button
          variant="gold"
          shimmer={canConfirm}
          disabled={!canConfirm}
          loading={busy}
          onClick={() => onConfirm(selectedIds)}
          className="min-w-[148px]"
        >
          تأكيد الاحتفاظ
        </Button>
      </div>
    </Sheet>
  );
}

/**
 * Choose Influence to Lose Sheet (CHOOSE_INFLUENCE_LOSS)
 */
export function ChooseInfluenceLossSheet({
  open,
  cards = [],
  reason,
  countdown,
  onConfirm,
  busy = false,
}) {
  const hiddenCards = cards.filter((c) => !c.revealed);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    if (open) {
      setSelectedId(hiddenCards.length === 1 ? hiddenCards[0].id : null);
    }
  }, [open, hiddenCards.length]);

  return (
    <Sheet
      open={open}
      dismissible={false}
      tone="danger"
      title="اختر البطاقة التي ستكشفها وتخسرها"
      subtitle={formatLossReasonAr(reason)}
    >
      <ModalCountdownBar countdown={countdown} tone="danger" />

      <div className="mb-3.5 flex items-center gap-2 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-2.5 text-xs text-rose-200">
        <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400" strokeWidth={1.75} />
        <span>ستُكشف البطاقة المختارة أمام الجميع وتخرج من نفوذك نهائياً.</span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {hiddenCards.map((card, idx) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 12, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: idx * 0.06, type: 'spring', stiffness: 380, damping: 26 }}
          >
            <RoleCard
              size="picker"
              danger
              character={card.character}
              selected={selectedId === card.id}
              disabled={busy}
              onClick={() => setSelectedId(card.id)}
              className="w-full"
            />
          </motion.div>
        ))}
      </div>

      <Button
        variant="danger"
        size="lg"
        disabled={!selectedId}
        loading={busy}
        onClick={() => selectedId && onConfirm(selectedId)}
        className="w-full"
      >
        كشف البطاقة وخسارتها
      </Button>
    </Sheet>
  );
}

/**
 * 2-Player Draft Modal (DRAFT_SETUP)
 */
export function DraftSetupSheet({
  open,
  options = [],
  hasPicked = false,
  countdown,
  onPick,
  busy = false,
}) {
  const [selectedChar, setSelectedChar] = useState(null);

  useEffect(() => {
    if (open) {
      setSelectedChar(null);
    }
  }, [open]);

  return (
    <Sheet
      open={open}
      dismissible={false}
      tone="gold"
      title="السحب المسبق للاعبَين"
      subtitle={
        hasPicked
          ? 'تم تثبيت بطاقتك الأولى بنجاح، بانتظار اختيار اللاعب الآخر...'
          : 'اختر شخصية واحدة لتبدأ بها، وستُسحب بطاقتك الثانية عشوائياً'
      }
    >
      <ModalCountdownBar countdown={countdown} tone="amber" />

      {hasPicked ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-400/35 bg-amber-400/15 text-amber-300 shadow-glow mb-3"
          >
            <Sparkles className="h-6 w-6" strokeWidth={1.75} />
          </motion.div>
          <p className="text-sm font-extrabold text-white">تم اختيار بطاقتك!</p>
          <p className="text-xs text-zinc-400 mt-1">ستبدأ الجولة تلقائياً فور اختيار خصمك</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-4">
            {(options || []).map((character, idx) => (
              <motion.div
                key={`${character}-${idx}`}
                initial={{ opacity: 0, y: 12, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: idx * 0.045, type: 'spring', stiffness: 380, damping: 26 }}
              >
                <RoleCard
                  size="picker"
                  character={character}
                  selected={selectedChar === `${character}-${idx}`}
                  disabled={busy}
                  onClick={() => setSelectedChar(`${character}-${idx}`)}
                  className="w-full"
                />
              </motion.div>
            ))}
          </div>

          <Button
            variant="gold"
            size="lg"
            shimmer={Boolean(selectedChar)}
            disabled={!selectedChar}
            loading={busy}
            onClick={() => {
              if (!selectedChar) return;
              const charName = selectedChar.split('-')[0];
              onPick(charName);
            }}
            className="w-full"
          >
            تأكيد الشخصية المختارة
          </Button>
        </>
      )}
    </Sheet>
  );
}
