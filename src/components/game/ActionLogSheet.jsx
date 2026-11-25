import React from 'react';
import { motion } from 'framer-motion';
import { ScrollText } from 'lucide-react';
import { Sheet } from '../ui/Sheet';
import { cn, formatTimeArabic } from '../../lib/utils';

export function ActionLogSheet({ open, onClose, actionLog = [] }) {
  const reversed = [...actionLog].reverse();

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="سجل الأحداث"
      subtitle={`آخر ${reversed.length} ${reversed.length === 1 ? 'حدث' : 'أحداث'} في الجولة`}
    >
      {reversed.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center text-zinc-500">
          <ScrollText className="h-8 w-8 mb-2 opacity-50" strokeWidth={1.75} />
          <p className="text-sm">لا توجد أحداث مسجّلة بعد</p>
        </div>
      ) : (
        <ol className="space-y-2">
          {reversed.map((entry, idx) => (
            <motion.li
              key={entry.id || `${entry.timestamp}-${idx}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(idx * 0.025, 0.25), duration: 0.2 }}
              className={cn(
                'flex items-start justify-between gap-3 rounded-2xl border px-3.5 py-2.5',
                idx === 0
                  ? 'border-indigo-400/35 bg-indigo-500/10'
                  : 'border-white/[0.08] bg-white/[0.03]'
              )}
            >
              <div className="flex items-start gap-2.5 min-w-0">
                <span
                  className={
                    idx === 0
                      ? 'mt-1.5 h-2 w-2 shrink-0 rounded-full bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.95)]'
                      : 'mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-600'
                  }
                />
                <p
                  className={cn(
                    'text-xs sm:text-sm leading-relaxed',
                    idx === 0 ? 'font-semibold text-white' : 'text-zinc-300'
                  )}
                >
                  {entry.textAr}
                </p>
              </div>
              {entry.timestamp && (
                <span className="shrink-0 text-[10px] text-zinc-500 tabular-nums pt-0.5">
                  {formatTimeArabic(entry.timestamp)}
                </span>
              )}
            </motion.li>
          ))}
        </ol>
      )}
    </Sheet>
  );
}
