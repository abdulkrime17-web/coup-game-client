import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Coins } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * Crisp dark-glass coin pill with pure yellow-gold coin icon and animated +/- delta pop.
 */
export function CoinBadge({ coins = 0, label, size = 'sm', className }) {
  const prevRef = useRef(coins);
  const [delta, setDelta] = useState(null);

  useEffect(() => {
    const diff = coins - prevRef.current;
    prevRef.current = coins;
    if (diff === 0) return undefined;

    setDelta({ value: diff, key: Date.now() });
    const timer = setTimeout(() => setDelta(null), 1300);
    return () => clearTimeout(timer);
  }, [coins]);

  const isLarge = size === 'md';

  return (
    <div className="relative inline-flex items-center">
      <motion.span
        key={coins}
        initial={delta ? { scale: 1.18 } : false}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 460, damping: 22 }}
        className={cn(
          'inline-flex items-center gap-1 rounded-full border border-white/15 bg-[#151824]/90 font-extrabold text-zinc-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] tabular-nums whitespace-nowrap',
          isLarge ? 'px-3 py-1 text-xs sm:text-sm' : 'px-2 py-0.5 text-[11px]',
          className
        )}
      >
        <Coins
          className={cn(
            'text-yellow-400 shrink-0 drop-shadow-[0_0_6px_rgba(250,204,21,0.55)]',
            isLarge ? 'h-3.5 w-3.5' : 'h-3 w-3'
          )}
          strokeWidth={2}
        />
        <span>{coins}</span>
        {label && <span className="text-[11px] font-semibold text-zinc-300">{label}</span>}
      </motion.span>

      <AnimatePresence>
        {delta && (
          <motion.span
            key={delta.key}
            initial={{ opacity: 0, y: 4, scale: 0.75 }}
            animate={{ opacity: 1, y: -18, scale: 1 }}
            exit={{ opacity: 0, y: -28, scale: 0.85 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            dir="ltr"
            className={cn(
              'pointer-events-none absolute -top-1 left-1/2 -translate-x-1/2 rounded-full px-1.5 py-0.5 text-[10px] font-black tabular-nums shadow-md backdrop-blur-md',
              delta.value > 0
                ? 'bg-emerald-400 text-zinc-950'
                : 'bg-rose-500 text-white'
            )}
          >
            {delta.value > 0 ? `+${delta.value}` : delta.value}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
