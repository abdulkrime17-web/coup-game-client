import React from 'react';
import { motion } from 'framer-motion';
import { Coins, HandCoins, Zap } from 'lucide-react';
import { Sheet } from '../ui/Sheet';
import { CHARACTER_META, COUP_CHARACTERS } from '../../lib/constants';
import { cn } from '../../lib/utils';

export function RulesSheet({ open, onClose }) {
  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="ورقة القواعد والشخصيات"
      subtitle="مرجع سريع لجميع الحركات والصدّات في لعبة كوب"
    >
      <div className="space-y-5">
        {/* Official Character Reference Table */}
        <div>
          <h3 className="text-xs font-bold text-zinc-400 mb-2.5">الشخصيات الخمس</h3>
          <div className="overflow-hidden rounded-2xl border border-white/[0.11] bg-[#0A0A0F]/80">
            <div className="grid grid-cols-[1.08fr_0.72fr_1.45fr_1.05fr] gap-2 border-b border-white/10 bg-white/[0.03] px-3 py-2 text-[11px] font-bold text-zinc-400">
              <span>الشخصية</span>
              <span>الحركة</span>
              <span>التأثير</span>
              <span>الصدّ</span>
            </div>

            <div className="divide-y divide-white/[0.08]">
              {COUP_CHARACTERS.map((key, idx) => {
                const c = CHARACTER_META[key];
                const Icon = c.icon;
                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04, duration: 0.22 }}
                    className="grid grid-cols-[1.08fr_0.72fr_1.45fr_1.05fr] items-center gap-2 px-3 py-2.5 text-xs hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span
                        className={cn(
                          'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border',
                          c.iconBg
                        )}
                      >
                        <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
                      </span>
                      <span className={cn('font-extrabold truncate', c.textAccent)}>
                        {c.nameAr}
                      </span>
                    </div>
                    <span className="font-bold text-zinc-100">{c.actionNameAr}</span>
                    <span className="text-[11px] text-zinc-300 leading-snug">
                      {c.actionEffectAr}
                    </span>
                    <span className="text-[11px] text-zinc-400 leading-snug">{c.blockAr}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* General Actions */}
        <div>
          <h3 className="text-xs font-bold text-zinc-400 mb-2.5">
            الحركات العامة (بدون ادّعاء شخصية)
          </h3>
          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-yellow-400/30 bg-yellow-400/10 text-yellow-400">
                <Coins className="h-4 w-4" strokeWidth={1.75} />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-zinc-100">دخل (+1 عملة)</div>
                <div className="text-[11px] text-zinc-400">
                  احصل على عملة واحدة من الخزينة. لا يمكن تحدّيها أو صدّها.
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-emerald-400/30 bg-emerald-400/15 text-emerald-300">
                <HandCoins className="h-4 w-4" strokeWidth={1.75} />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-zinc-100">مساعدة خارجية (+2 عملتان)</div>
                <div className="text-[11px] text-zinc-400">
                  احصل على عملتين، لكن يمكن لأي لاعب صدّها بادّعاء الدوق.
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/[0.08] p-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-rose-400/35 bg-rose-500/20 text-rose-300">
                <Zap className="h-4 w-4" strokeWidth={1.75} />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-zinc-100">انقلاب (-7 عملات)</div>
                <div className="text-[11px] text-zinc-300">
                  يُجبر خصماً على خسارة بطاقة فوراً ولا يُصدّ. يصبح{' '}
                  <strong className="text-rose-300">إجبارياً عند 10 عملات</strong>.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bluffing & Challenges tip */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-3.5 text-[11px] leading-relaxed text-zinc-400">
          <span className="font-bold text-zinc-100">التحدّي والخداع: </span>
          يمكنك ادّعاء أي شخصية حتى لو لم تكن تملكها. إذا تحدّاك خصم وكنت صادقاً، يخسر المتحدّي
          بطاقة وتُبدّل بطاقتك من الديوان. أما إذا كنت مخادعاً فتخسر أنت بطاقة وتفشل الحركة.
        </div>
      </div>
    </Sheet>
  );
}
