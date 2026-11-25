import React from 'react';
import { ScrollText } from 'lucide-react';
import { Sheet } from '../ui/Sheet';
import { formatTimeArabic } from '../../lib/utils';

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
            <li
              key={entry.id || `${entry.timestamp}-${idx}`}
              className="flex items-start justify-between gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2.5"
            >
              <div className="flex items-start gap-2.5 min-w-0">
                <span
                  className={
                    idx === 0
                      ? 'mt-1.5 h-2 w-2 shrink-0 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]'
                      : 'mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-600'
                  }
                />
                <p className="text-xs sm:text-sm leading-relaxed text-zinc-200">{entry.textAr}</p>
              </div>
              {entry.timestamp && (
                <span className="shrink-0 text-[10px] text-zinc-500 tabular-nums pt-0.5">
                  {formatTimeArabic(entry.timestamp)}
                </span>
              )}
            </li>
          ))}
        </ol>
      )}
    </Sheet>
  );
}
