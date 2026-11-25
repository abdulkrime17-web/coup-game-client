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
    default: 'bg-[#111115]/95 border-white/[0.12]',
    danger: 'bg-[#190D10]/95 border-red-500/35 shadow-[0_0_60px_-15px_rgba(239,68,68,0.45)]',
    gold: 'bg-[#15120B]/95 border-amber-500/35 shadow-[0_0_60px_-15px_rgba(245,158,11,0.35)]',
  };

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => dismissible && onClose?.()}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          />

          <motion.div
            initial={{ y: '100%', opacity: 0.6 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0.4 }}
            transition={{ type: 'spring', damping: 30, stiffness: 360 }}
            className={cn(
              'relative z-10 w-full max-w-lg max-h-[86dvh] flex flex-col overflow-hidden rounded-t-3xl sm:rounded-3xl border backdrop-blur-2xl safe-pb',
              toneClasses[tone] || toneClasses.default,
              className
            )}
          >
            {/* Mobile grab indicator */}
            <div className="flex justify-center pt-2.5 pb-1 sm:hidden">
              <div className="h-1 w-10 rounded-full bg-white/15" />
            </div>

            {(title || dismissible) && (
              <div className="flex items-start justify-between gap-3 px-5 pt-3 pb-3 border-b border-white/[0.08]">
                <div className="min-w-0">
                  {title && (
                    <h2 className="text-base sm:text-lg font-bold text-zinc-100 leading-snug">
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
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="إغلاق"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    <X className="h-4 w-4" strokeWidth={1.75} />
                  </button>
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
