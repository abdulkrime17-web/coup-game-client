import React from 'react';
import { motion } from 'framer-motion';
import { Check, Crown, X } from 'lucide-react';
import { CHARACTER_META } from '../../lib/constants';
import { cn } from '../../lib/utils';

/**
 * Luxury Coup Influence Card supporting 3 modes:
 * - "opponent": compact slot with 3D Framer Motion flip when revealed
 * - "hand": personal influence card with ability reminder and lost state
 * - "picker": interactive selectable card for Exchange / Influence Loss / Draft
 */
export function RoleCard({
  character,
  revealed = false,
  size = 'hand',
  selected = false,
  danger = false,
  disabled = false,
  onClick,
  className,
}) {
  const meta = character ? CHARACTER_META[character] : null;
  const Icon = meta?.icon || Crown;

  if (size === 'opponent') {
    const isFlipped = Boolean(revealed && meta);
    return (
      <div className={cn('perspective-800 h-11 sm:h-12 flex-1 min-w-0', className)}>
        <motion.div
          initial={false}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="relative h-full w-full preserve-3d"
        >
          {/* Concealed Card Back */}
          <div className="backface-hidden absolute inset-0 flex items-center justify-center rounded-xl border border-white/[0.12] card-back-pattern shadow-inner">
            <div className="flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">
              <Crown className="h-3 w-3 text-zinc-500" strokeWidth={1.75} />
            </div>
          </div>

          {/* Revealed (Lost) Card Face */}
          <div
            style={{ transform: 'rotateY(180deg)' }}
            className={cn(
              'backface-hidden absolute inset-0 flex items-center justify-center gap-1.5 overflow-hidden rounded-xl border px-1.5 bg-gradient-to-br',
              meta ? meta.gradient : 'from-zinc-800/70 to-zinc-950',
              meta ? meta.border : 'border-white/10'
            )}
          >
            <div className="absolute inset-0 bg-zinc-950/55" />
            <div className="relative z-10 flex items-center gap-1 min-w-0">
              {meta && (
                <Icon
                  className={cn('h-3.5 w-3.5 shrink-0 opacity-75', meta.textAccent)}
                  strokeWidth={1.75}
                />
              )}
              <span className="truncate text-[11px] font-bold text-zinc-300 line-through decoration-red-400/80 decoration-2">
                {meta?.nameAr || 'مكشوفة'}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (size === 'picker') {
    return (
      <motion.button
        type="button"
        whileTap={disabled ? undefined : { scale: 0.97 }}
        disabled={disabled}
        onClick={onClick}
        className={cn(
          'relative flex flex-col justify-between rounded-2xl border p-3.5 text-right transition-all duration-150 bg-gradient-to-br overflow-hidden min-h-[116px]',
          meta ? meta.gradient : 'from-zinc-800/50 to-zinc-950',
          selected
            ? danger
              ? 'border-red-400 ring-2 ring-red-500/50 shadow-[0_0_24px_-6px_rgba(239,68,68,0.6)]'
              : 'border-amber-300 ring-2 ring-amber-400/50 shadow-[0_0_24px_-6px_rgba(245,158,11,0.5)]'
            : meta
              ? cn(meta.border, 'hover:border-white/30')
              : 'border-white/10',
          disabled && 'opacity-45 pointer-events-none',
          className
        )}
      >
        <div className="flex items-start justify-between gap-2 w-full">
          <div
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-xl border',
              meta?.iconBg || 'bg-white/10 border-white/15 text-zinc-200'
            )}
          >
            <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
          </div>

          <div
            className={cn(
              'flex h-6 w-6 items-center justify-center rounded-full border transition-all',
              selected
                ? danger
                  ? 'bg-red-500 border-red-300 text-white'
                  : 'bg-amber-400 border-amber-200 text-zinc-950'
                : 'border-white/15 bg-black/30 text-transparent'
            )}
          >
            {danger && selected ? (
              <X className="h-3.5 w-3.5" strokeWidth={2.5} />
            ) : (
              <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
            )}
          </div>
        </div>

        <div className="mt-3">
          <div className="text-sm sm:text-base font-extrabold text-white">
            {meta?.nameAr || 'بطاقة'}
          </div>
          <div className="text-[11px] text-zinc-300/85 mt-0.5 leading-snug">
            {meta?.shortAbilityAr}
          </div>
        </div>
      </motion.button>
    );
  }

  // Default: size === 'hand' (player's personal luxury card)
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={cn(
        'relative flex flex-col justify-between overflow-hidden rounded-2xl border p-3 sm:p-3.5 bg-gradient-to-br transition-all',
        meta ? meta.gradient : 'from-zinc-800/50 to-zinc-950',
        revealed
          ? 'border-white/10 opacity-55 grayscale-[0.55]'
          : meta
            ? cn(meta.border, 'shadow-glass')
            : 'border-white/10',
        className
      )}
    >
      {/* Subtle top edge highlight */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-white/25 to-transparent" />

      <div className="flex items-start justify-between gap-2">
        <div
          className={cn(
            'flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl border',
            meta?.iconBg || 'bg-white/10 border-white/15 text-zinc-200'
          )}
        >
          <Icon className="h-4 w-4 sm:h-[18px] sm:w-[18px]" strokeWidth={1.75} />
        </div>

        {revealed ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-red-500/35 bg-red-500/15 px-2 py-0.5 text-[10px] font-bold text-red-300">
            مكشوفة
          </span>
        ) : (
          <span
            className="h-2 w-2 rounded-full mt-1"
            style={{ backgroundColor: meta?.hex || '#A1A1AA' }}
          />
        )}
      </div>

      <div className="mt-2.5 sm:mt-3">
        <div
          className={cn(
            'text-sm sm:text-base font-extrabold tracking-tight',
            revealed ? 'text-zinc-300 line-through decoration-red-400/80 decoration-2' : 'text-white'
          )}
        >
          {meta?.nameAr || 'بطاقة'}
        </div>
        <p className="mt-0.5 text-[11px] leading-snug text-zinc-300/85 line-clamp-1">
          {meta?.shortAbilityAr}
        </p>
      </div>
    </motion.div>
  );
}
