import React, { useEffect, useState } from 'react';
import { AlertTriangle, Coins, Layers, Sparkles, Target } from 'lucide-react';
import { Sheet } from '../ui/Sheet';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { RoleCard } from './RoleCard';
import { ACTION_LABELS_AR, formatLossReasonAr } from '../../lib/constants';
import { cn } from '../../lib/utils';

function ModalCountdownBar({ countdown, tone = 'amber' }) {
  if (!countdown?.active) return null;
  const barColor =
    countdown.isUrgent || tone === 'danger'
      ? 'bg-red-500'
      : tone === 'lime'
        ? 'bg-lime-400'
        : 'bg-amber-400';

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between text-xs mb-1.5">
        <span className="text-zinc-400">الوقت المتبقي</span>
        <span
          className={cn(
            'font-bold tabular-nums',
            countdown.isUrgent ? 'text-red-400' : 'text-zinc-200'
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
        {aliveOpponents.map((player) => {
          const noCoins = isSteal && player.coins < 1;
          return (
            <button
              key={player.id}
              type="button"
              disabled={noCoins || busy}
              onClick={() => onSelectTarget(player.id)}
              className={cn(
                'w-full flex items-center justify-between gap-3 rounded-2xl border p-3.5 text-right transition-all',
                noCoins
                  ? 'border-white/5 bg-white/[0.02] opacity-45 cursor-not-allowed'
                  : 'border-white/10 bg-white/[0.04] hover:border-amber-400/50 hover:bg-white/[0.08] active:scale-[0.99]'
              )}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-zinc-800/80 text-sm font-bold text-zinc-100">
                  {player.name.slice(0, 1)}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-white truncate">{player.name}</div>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-zinc-400">
                    <span className="inline-flex items-center gap-1 tabular-nums">
                      <Layers className="h-3 w-3" strokeWidth={1.75} />
                      {player.influenceCount === 1 ? 'بطاقة واحدة' : `${player.influenceCount} بطاقات`}
                    </span>
                    {noCoins && <span className="text-red-300">• لا يملك عملات</span>}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Badge variant="gold" className="tabular-nums">
                  <Coins className="h-3 w-3" strokeWidth={1.75} />
                  {player.coins}
                </Badge>
                {!noCoins && (
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.08] text-zinc-200">
                    <Target className="h-4 w-4" strokeWidth={1.75} />
                  </div>
                )}
              </div>
            </button>
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
        {(options || []).map((card) => (
          <RoleCard
            key={card.id}
            size="picker"
            character={card.character}
            selected={selectedIds.includes(card.id)}
            disabled={busy}
            onClick={() => toggleCard(card.id)}
          />
        ))}
      </div>

      <div className="flex items-center justify-between gap-3 pt-1">
        <span className="text-xs text-zinc-400 tabular-nums">
          تم اختيار <strong className="text-zinc-100">{selectedIds.length}</strong> من{' '}
          <strong className="text-zinc-100">{keepCount}</strong>
        </span>
        <Button
          variant="gold"
          disabled={!canConfirm}
          loading={busy}
          onClick={() => onConfirm(selectedIds)}
          className="min-w-[140px]"
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

      <div className="mb-3 flex items-center gap-2 rounded-xl border border-red-500/25 bg-red-500/10 px-3 py-2 text-xs text-red-200">
        <AlertTriangle className="h-4 w-4 shrink-0 text-red-400" strokeWidth={1.75} />
        <span>ستُكشف البطاقة المختارة أمام الجميع وتخرج من نفوذك نهائياً.</span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {hiddenCards.map((card) => (
          <RoleCard
            key={card.id}
            size="picker"
            danger
            character={card.character}
            selected={selectedId === card.id}
            disabled={busy}
            onClick={() => setSelectedId(card.id)}
          />
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
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-400/30 bg-amber-400/15 text-amber-300 mb-3">
            <Sparkles className="h-6 w-6 animate-pulse" strokeWidth={1.75} />
          </div>
          <p className="text-sm font-bold text-white">تم اختيار بطاقتك!</p>
          <p className="text-xs text-zinc-400 mt-1">ستبدأ الجولة تلقائياً فور اختيار خصمك</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-4">
            {(options || []).map((character, idx) => (
              <RoleCard
                key={`${character}-${idx}`}
                size="picker"
                character={character}
                selected={selectedChar === `${character}-${idx}`}
                disabled={busy}
                onClick={() => setSelectedChar(`${character}-${idx}`)}
              />
            ))}
          </div>

          <Button
            variant="gold"
            size="lg"
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
