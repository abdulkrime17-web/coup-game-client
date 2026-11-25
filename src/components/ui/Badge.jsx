import React from 'react';
import { cn } from '../../lib/utils';

const VARIANT_CLASSES = {
  default: 'bg-white/[0.08] text-zinc-200 border-white/[0.12]',
  gold: 'bg-indigo-500/20 text-indigo-200 border-indigo-400/35',
  danger: 'bg-rose-500/15 text-rose-200 border-rose-500/35',
  success: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  muted: 'bg-zinc-800/80 text-zinc-400 border-white/[0.08]',
  outline: 'bg-transparent text-zinc-300 border-white/15',
};

export function Badge({ className, variant = 'default', children, ...props }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold leading-5 whitespace-nowrap',
        VARIANT_CLASSES[variant] || VARIANT_CLASSES.default,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
