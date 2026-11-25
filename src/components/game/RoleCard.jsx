import React from 'react';
import { motion } from 'framer-motion';
import { Check, Crown, X } from 'lucide-react';
import { CHARACTER_META } from '../../lib/constants';
import { cn } from '../../lib/utils';

/**
 * Collectible Luxury Coup Influence Card supporting 3 modes:
 * - "opponent": compact slot with 3D Framer Motion spring flip when revealed
 * - "hand": personal influence card with inner frame, crest watermark, and lost state
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
          transition={{ type: 'spring', stiffness: 260, damping: 24 }}
          className="relative h-full w-full preserve-3d"
        >
          {/* Concealed Card Back */}
          <div className="backface-hidden absolute inset-0 flex items-center justify-center rounded-xl border border-indigo-300/20 card-back-pattern shadow-inner overflow-hidden">
            <div className="pointer-events-none absolute inset-1 rounded-lg border border-white/[0.06]" />
            <div className="flex h-6 w-6 items-center justify-center rounded-full border border-indigo-300/25 bg-indigo-400/10">
              <Crown className="h-3 w-3 text-indigo-300/75" strokeWidth={1.75} />
            </div>
          </div>

          {/* Revealed (Lost) Card Face */}
          <div
            style={{ transform: 'rotateY(180deg)' }}
            className={cn(
              'backface-hidden absolute inset-0 flex items-center justify-center gap-1.5 overflow-hidden rounded-xl border px-2 bg-gradient-to-br',
              meta ? meta.gradient : 'from-zinc-800/70 to-zinc-950',
              meta ? meta.border : 'border-white/10'
            )}
          >
            <div className="absolute inset-0 bg-zinc-950/55" />
            <div className="relative z-10 flex items-center gap-1.5 min-w-0">
              {meta && (
                <Icon
                  className={cn('h-3.5 w-3.5 shrink-0 opacity-85', meta.textAccent)}
                  strokeWidth={1.75}
                />
              )}
              <span className="truncate text-[11px] font-bold text-zinc-200 line-through decoration-rose-400/90 decoration-2">
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
        whileHover={disabled ? undefined : { y: -2, scale: 1.01 }}
        whileTap={disabled ? undefined : { scale: 0.965 }}
        transition={{ type: 'spring', stiffness: 450, damping: 26 }}
        disabled={disabled}
        onClick={onClick}
        style={
          selected && meta
            ? {
                boxShadow: danger
                  ? '0 0 28px -6px rgba(244, 63, 94, 0.65)'
                  : `0 0 28px -6px ${meta.glowRgba}`,
              }
            : undefined
        }
        className={cn(
          'relative flex flex-col justify-between rounded-2xl border p-3.5 text-right transition-colors duration-150 bg-gradient-to-br overflow-hidden min-h-[122px]',
          meta ? meta.gradient : 'from-zinc-800/50 to-zinc-950',
          selected
            ? danger
              ? 'border-rose-400 ring-2 ring-rose-500/50'
              : 'border-indigo-300 ring-2 ring-indigo-400/60'
            : meta
              ? cn(meta.border, meta.hoverBorder)
              : 'border-white/10',
          disabled && 'opacity-40 pointer-events-none',
          className
        )}
      >
        <div className="pointer-events-none absolute inset-1.5 rounded-xl border border-white/[0.06]" />
        <Icon
          className={cn(
            'pointer-events-none absolute -bottom-3 -left-3 h-20 w-20 opacity-[0.075]',
            meta?.textAccent || 'text-white'
          )}
          strokeWidth={1.25}
        />

        <div className="relative z-10 flex items-start justify-between gap-2 w-full">
          <div
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-xl border',
              meta?.iconBg || 'bg-white/10 border-white/15 text-zinc-200'
            )}
          >
            <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
          </div>

          <motion.div
            animate={selected ? { scale: [0.8, 1.12, 1] } : { scale: 1 }}
            transition={{ duration: 0.22 }}
            className={cn(
              'flex h-6 w-6 items-center justify-center rounded-full border transition-all',
              selected
                ? danger
                  ? 'bg-rose-500 border-rose-300 text-white shadow-sm'
                  : 'bg-indigo-400 border-indigo-200 text-zinc-950 shadow-sm'
                : 'border-white/15 bg-black/35 text-transparent'
            )}
          >
            {danger && selected ? (
              <X className="h-3.5 w-3.5" strokeWidth={2.5} />
            ) : (
              <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
            )}
          </motion.div>
        </div>

        <div className="relative z-10 mt-3.5">
          <div className="text-sm sm:text-base font-extrabold text-white tracking-tight">
            {meta?.nameAr || 'بطاقة'}
          </div>
          <div className="text-[11px] text-zinc-300/90 mt-0.5 leading-snug">
            {meta?.shortAbilityAr}
          </div>
        </div>
      </motion.button>
    );
  }

  // Default: size === 'hand' (player's personal luxury playing card)
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={revealed ? undefined : { y: -2 }}
      transition={{ type: 'spring', stiffness: 360, damping: 28 }}
      style={
        !revealed && meta
          ? {
              boxShadow: `0 16px 36px -20px ${meta.glowRgba}, inset 0 1px 0 rgba(255,255,255,0.14)`,
            }
          : undefined
      }
      className={cn(
        'relative flex flex-col justify-between overflow-hidden rounded-2xl border p-3 sm:p-3.5 bg-gradient-to-br transition-all',
        meta ? meta.gradient : 'from-zinc-800/50 to-zinc-950',
        revealed
          ? 'border-white/10 opacity-50 grayscale-[0.6]'
          : meta
            ? cn(meta.border, meta.hoverBorder)
            : 'border-white/10',
        className
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-white/30 to-transparent" />
      <div className="pointer-events-none absolute inset-1.5 rounded-xl border border-white/[0.06]" />
      <Icon
        className={cn(
          'pointer-events-none absolute -bottom-3 -left-3 h-20 w-20 opacity-[0.075]',
          meta?.textAccent || 'text-white'
        )}
        strokeWidth={1.25}
      />

      <div className="relative z-10 flex items-start justify-between gap-2">
        <div
          className={cn(
            'flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl border',
            meta?.iconBg || 'bg-white/10 border-white/15 text-zinc-200'
          )}
        >
          <Icon className="h-4 w-4 sm:h-[18px] sm:w-[18px]" strokeWidth={1.75} />
        </div>

        {revealed ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/40 bg-rose-500/20 px-2 py-0.5 text-[10px] font-bold text-rose-200">
            مكشوفة
          </span>
        ) : (
          <span
            className="mt-1.5 h-2 w-2 rounded-full shadow-sm"
            style={{
              backgroundColor: meta?.hex || '#A1A1AA',
              boxShadow: meta ? `0 0 10px ${meta.hex}` : undefined,
            }}
          />
        )}
      </div>

      <div className="relative z-10 mt-2.5 sm:mt-3">
        <div
          className={cn(
            'text-sm sm:text-base font-extrabold tracking-tight',
            revealed
              ? 'text-zinc-300 line-through decoration-rose-400/90 decoration-2'
              : 'text-white'
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
