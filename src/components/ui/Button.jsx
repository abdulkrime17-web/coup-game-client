import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

const VARIANT_CLASSES = {
  primary:
    'bg-gradient-to-b from-white to-zinc-200 text-zinc-950 hover:from-white hover:to-white shadow-[0_10px_25px_-12px_rgba(255,255,255,0.45)] border border-white/40 font-bold',
  gold:
    'bg-gradient-to-b from-amber-200 via-amber-400 to-amber-500 text-zinc-950 hover:brightness-105 border border-amber-100/50 shadow-glow font-extrabold',
  secondary:
    'bg-[#14141B]/85 text-zinc-100 hover:bg-[#1C1C26]/95 border border-white/[0.11] hover:border-white/20 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] font-semibold',
  outline:
    'bg-transparent text-zinc-200 hover:bg-white/[0.06] border border-white/15 hover:border-white/25 font-semibold',
  ghost:
    'bg-transparent text-zinc-300 hover:text-white hover:bg-white/[0.08] border border-transparent font-medium',
  danger:
    'bg-gradient-to-b from-rose-500 via-red-500 to-red-600 text-white hover:brightness-110 border border-rose-300/40 shadow-crimsonGlow font-bold',
  dangerSoft:
    'bg-rose-500/15 text-rose-200 hover:bg-rose-500/25 border border-rose-400/35 font-semibold',
  success:
    'bg-gradient-to-b from-emerald-500/25 to-emerald-600/20 text-emerald-200 hover:from-emerald-500/35 hover:to-emerald-600/30 border border-emerald-400/35 shadow-[0_0_24px_-10px_rgba(16,185,129,0.55)] font-bold',
};

const SIZE_CLASSES = {
  xs: 'h-8 px-2.5 text-xs rounded-xl gap-1.5',
  sm: 'h-9 px-3.5 text-xs rounded-xl gap-1.5',
  md: 'h-11 px-4 text-sm rounded-xl gap-2',
  lg: 'h-12 px-5 text-base rounded-2xl gap-2',
  icon: 'h-9 w-9 p-0 rounded-xl',
};

export const Button = React.forwardRef(function Button(
  {
    className,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    shimmer = false,
    type = 'button',
    children,
    ...props
  },
  ref
) {
  const isDisabled = disabled || loading;

  return (
    <motion.button
      ref={ref}
      type={type}
      whileHover={isDisabled ? undefined : { y: -1 }}
      whileTap={isDisabled ? undefined : { scale: 0.965, y: 0 }}
      transition={{ type: 'spring', stiffness: 520, damping: 28 }}
      disabled={isDisabled}
      className={cn(
        'relative overflow-hidden inline-flex items-center justify-center whitespace-nowrap select-none transition-[background,border-color,box-shadow,filter] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07070A] disabled:opacity-40 disabled:pointer-events-none',
        VARIANT_CLASSES[variant] || VARIANT_CLASSES.primary,
        SIZE_CLASSES[size] || SIZE_CLASSES.md,
        shimmer && !isDisabled && 'foil-shimmer',
        className
      )}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin shrink-0" strokeWidth={1.75} />}
      {children}
    </motion.button>
  );
});
