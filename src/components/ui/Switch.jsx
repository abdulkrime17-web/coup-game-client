import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export function Switch({ checked = false, onCheckedChange, disabled = false, className, ariaLabel }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => !disabled && onCheckedChange?.(!checked)}
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border p-0.5 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/70 disabled:cursor-not-allowed disabled:opacity-45',
        checked
          ? 'justify-end bg-indigo-500 border-indigo-300/60 shadow-[0_0_16px_-4px_rgba(129,140,248,0.8)]'
          : 'justify-start bg-zinc-800 border-white/15',
        className
      )}
    >
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 520, damping: 32 }}
        className={cn(
          'pointer-events-none block h-[18px] w-[18px] rounded-full shadow-sm',
          checked ? 'bg-white' : 'bg-zinc-400'
        )}
      />
    </button>
  );
}
