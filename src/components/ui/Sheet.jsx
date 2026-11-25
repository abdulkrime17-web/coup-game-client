import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

export function Sheet({
  open,
  onClose,
  title,
  subtitle,
  dismissible = true,
  tone = 'default', // 'default' | 'danger' | 'gold'
  className,
  children,
}) {
  useEffect(() => {
    if (!open || !dismissible) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, dismissible, onClose]);

  const toneClasses = {
    default: 'bg-[#0D1019]/95 border-white/[0.12] shadow-[0_-18px_60px_-20px_rgba(0,0,0,0.92)]',
    danger:
      'bg-[#160A10]/95 border-rose-500/40 shadow-[0_0_70px_-15px_rgba(244,63,94,0.45)]',
    gold: 'bg-[#0F1124]/95 border-indigo-400/40 shadow-[0_0_70px_-15px_rgba(129,140,248,0.45)]',
  };

  const topLineClasses = {
    default: 'via-white/25',
    danger: 'via-rose-400/75',
    gold: 'via-indigo-300/80',
  };

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4"
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={() => dismissible && onClose?.()}
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
          />

          <motion.div
            initial={{ y: '100%', opacity: 0.5, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: '100%', opacity: 0.3, scale: 0.98 }}
            transition={{ type: 'spring', damping: 30, stiffness: 360, mass: 0.9 }}
            className={cn(
              'relative z-10 w-full max-w-lg max-h-[86dvh] flex flex-col overflow-hidden rounded-t-[28px] sm:rounded-[28px] border backdrop-blur-2xl safe-pb',
              toneClasses[tone] || toneClasses.default,
              className
            )}
          >
            {/* Top specular hairline */}
            <div
              className={cn(
                'pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent to-transparent',
                topLineClasses[tone] || topLineClasses.default
              )}
            />

            {/* Mobile grab indicator */}
            <div className="flex justify-center pt-2.5 pb-1 sm:hidden">
              <div className="h-1 w-11 rounded-full bg-white/20" />
            </div>

            {(title || dismissible) && (
              <div className="flex items-start justify-between gap-3 px-5 pt-3 pb-3.5 border-b border-white/[0.08]">
                <div className="min-w-0">
                  {title && (
                    <h2 className="text-base sm:text-lg font-extrabold text-zinc-50 leading-snug">
                      {title}
                    </h2>
                  )}
                  {subtitle && (
                    <p className="text-xs sm:text-sm text-zinc-400 mt-0.5 leading-relaxed">
                      {subtitle}
                    </p>
                  )}
                </div>

                {dismissible && onClose && (
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.92 }}
                    onClick={onClose}
                    aria-label="إغلاق"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/[0.12] bg-white/[0.05] text-zinc-400 hover:bg-white/[0.12] hover:text-white transition-colors"
                  >
                    <X className="h-4 w-4" strokeWidth={1.75} />
                  </motion.button>
                )}
              </div>
            )}

            <div className="overflow-y-auto px-5 py-4">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
