import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

const VARIANT_CLASSES = {
  primary:
    'bg-zinc-100 text-zinc-950 hover:bg-white shadow-sm border border-white/20 font-bold',
  gold:
    'bg-gradient-to-b from-amber-300 to-amber-500 text-zinc-950 hover:from-amber-200 hover:to-amber-400 border border-amber-200/40 shadow-glow font-extrabold',
  secondary:
    'bg-zinc-900/80 text-zinc-100 hover:bg-zinc-800/90 border border-white/10 backdrop-blur-md font-semibold',
  outline:
    'bg-transparent text-zinc-200 hover:bg-white/5 border border-white/15 font-semibold',
  ghost:
    'bg-transparent text-zinc-300 hover:text-white hover:bg-white/[0.08] border border-transparent font-medium',
  danger:
    'bg-gradient-to-b from-red-500 to-red-600 text-white hover:from-red-400 hover:to-red-500 border border-red-400/35 shadow-[0_0_24px_-6px_rgba(239,68,68,0.55)] font-bold',
  dangerSoft:
    'bg-red-500/15 text-red-300 hover:bg-red-500/25 border border-red-500/30 font-semibold',
  success:
    'bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 border border-emerald-500/30 font-bold',
};

const SIZE_CLASSES = {
  xs: 'h-8 px-2.5 text-xs rounded-lg gap-1.5',
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
      whileTap={isDisabled ? undefined : { scale: 0.97 }}
      transition={{ duration: 0.12 }}
      disabled={isDisabled}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap select-none transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090B] disabled:opacity-40 disabled:pointer-events-none',
        VARIANT_CLASSES[variant] || VARIANT_CLASSES.primary,
        SIZE_CLASSES[size] || SIZE_CLASSES.md,
        className
      )}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin shrink-0" strokeWidth={1.75} />}
      {children}
    </motion.button>
  );
});
