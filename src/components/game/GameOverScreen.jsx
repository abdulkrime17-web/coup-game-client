import React from 'react';
import { motion } from 'framer-motion';
import {
  Crown,
  LogOut,
  RotateCcw,
  ScrollText,
  Trophy,
  Users,
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { RoleCard } from './RoleCard';
import { CoinBadge } from './CoinBadge';
import { cn } from '../../lib/utils';

const CELEBRATION_SPARKS = [
  { left: '12%', delay: 0, duration: 4.5, color: '#FBBF24', size: 6 },
  { left: '26%', delay: 0.7, duration: 5.2, color: '#E879F9', size: 5 },
  { left: '42%', delay: 0.3, duration: 4.1, color: '#FDE68A', size: 7 },
  { left: '58%', delay: 1.1, duration: 4.8, color: '#38BDF8', size: 5 },
  { left: '74%', delay: 0.5, duration: 5.0, color: '#FBBF24', size: 6 },
  { left: '88%', delay: 0.9, duration: 4.4, color: '#FB7185', size: 5 },
];

export function GameOverScreen({
  room,
  self,
  isHost,
  busyAction,
  onOpenLog,
  onPlayAgain,
  onReturnToLobby,
  onLeaveRoom,
}) {
  const winner = room.players.find((p) => p.id === room.winnerId);
  const iWon = Boolean(winner && winner.id === self?.playerId);
  const sortedPlayers = [...room.players].sort((a, b) => {
    if (a.id === room.winnerId) return -1;
    if (b.id === room.winnerId) return 1;
    return b.influenceCount - a.influenceCount || b.coins - a.coins;
  });

  return (
    <div className="relative min-h-[100dvh] w-full overflow-hidden bg-obsidian-stage px-4 py-6 safe-pt safe-pb">
      <div className="pointer-events-none absolute inset-0 bg-luxury-grid opacity-35" />

      <div className="relative z-10 mx-auto flex w-full max-w-lg flex-col gap-4">
        {/* Top Row */}
        <div className="flex items-center justify-between">
          <Button variant="secondary" size="sm" onClick={onOpenLog}>
            <ScrollText className="h-3.5 w-3.5 text-zinc-300" strokeWidth={1.75} />
            <span>سجل الجولة</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onLeaveRoom}
            loading={busyAction === 'leave_room'}
            className="text-zinc-400 hover:text-rose-300"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.75} />
            <span>مغادرة</span>
          </Button>
        </div>

        {/* Celebratory Winner Showcase */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 24 }}
        >
          <Card className="relative overflow-hidden border-amber-400/40 bg-gradient-to-b from-amber-500/20 via-[#15121B]/90 to-[#0D0D14]/95 p-6 text-center">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-amber-300/80 to-transparent" />

            {/* Subtle Floating Luxury Embers */}
            {CELEBRATION_SPARKS.map((spark, i) => (
              <motion.span
                key={i}
                aria-hidden="true"
                initial={{ opacity: 0, y: 120 }}
                animate={{ opacity: [0, 0.85, 0], y: -24 }}
                transition={{
                  duration: spark.duration,
                  delay: spark.delay,
                  repeat: Infinity,
                  ease: 'easeOut',
                }}
                style={{
                  left: spark.left,
                  width: spark.size,
                  height: spark.size,
                  backgroundColor: spark.color,
                  boxShadow: `0 0 12px ${spark.color}`,
                }}
                className="pointer-events-none absolute bottom-0 rounded-full"
              />
            ))}

            <motion.div
              initial={{ scale: 0.55, rotate: -14 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 16, delay: 0.12 }}
              className="relative z-10 mx-auto mb-3.5 flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-300/50 bg-gradient-to-b from-amber-300/25 to-amber-500/15 text-amber-200 shadow-glow"
            >
              <Trophy className="h-8 w-8" strokeWidth={1.75} />
            </motion.div>

            <Badge variant="gold" className="relative z-10 mb-2">
              {iWon ? 'انتصار مستحق!' : 'انتهت الجولة'}
            </Badge>

            <h1 className="relative z-10 text-2xl sm:text-3xl font-black text-white">
              {winner ? winner.name : 'لا يوجد فائز'}
            </h1>
            <p className="relative z-10 mt-1 text-sm text-zinc-300">
              {iWon
                ? 'أحكمت سيطرتك على الديوان وانتصرت في الجولة!'
                : 'بقي آخر صاحب نفوذ على طاولة كوب'}
            </p>

            {winner && (
              <div className="relative z-10 mt-4 flex items-center justify-center gap-2">
                <CoinBadge coins={winner.coins} label="عملات" size="md" />
                <Badge variant="default" className="tabular-nums px-3 py-1">
                  النفوذ المتبقي: {winner.influenceCount}
                </Badge>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Full Reveal of All Cards */}
        <Card className="p-4 sm:p-5">
          <h2 className="mb-3 text-sm font-bold text-zinc-200">كشف جميع البطاقات</h2>

          <div className="space-y-3">
            {sortedPlayers.map((player, idx) => {
              const isWinner = player.id === room.winnerId;
              const isMe = player.id === self?.playerId;

              return (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + idx * 0.07, type: 'spring', stiffness: 360, damping: 28 }}
                  className={cn(
                    'rounded-2xl border p-3',
                    isWinner
                      ? 'border-amber-400/40 bg-gradient-to-l from-amber-400/[0.09] to-transparent'
                      : 'border-white/[0.08] bg-white/[0.025]'
                  )}
                >
                  <div className="mb-2.5 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      {isWinner && (
                        <Crown className="h-4 w-4 shrink-0 text-amber-300" strokeWidth={1.75} />
                      )}
                      <span className="truncate text-sm font-bold text-white">
                        {player.name}
                      </span>
                      {isMe && (
                        <Badge variant="default" className="text-[10px] px-1.5 py-0">
                          أنت
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <CoinBadge coins={player.coins} />
                      {!player.isAlive && (
                        <Badge variant="muted" className="text-[10px]">
                          مطرود
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {(player.cards || []).map((card) => (
                      <RoleCard
                        key={card.id}
                        size="hand"
                        character={card.character}
                        revealed={card.revealed}
                      />
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </Card>

        {/* Host Controls */}
        <div className="pt-1 space-y-2.5">
          {isHost ? (
            <>
              <Button
                variant="gold"
                size="lg"
                shimmer
                loading={busyAction === 'play_again'}
                disabled={Boolean(busyAction)}
                onClick={onPlayAgain}
                className="w-full h-[52px]"
              >
                <RotateCcw className="h-4 w-4" strokeWidth={1.75} />
                <span>جولة جديدة</span>
              </Button>
              <Button
                variant="secondary"
                size="md"
                loading={busyAction === 'return_to_lobby'}
                disabled={Boolean(busyAction)}
                onClick={onReturnToLobby}
                className="w-full"
              >
                <Users className="h-4 w-4" strokeWidth={1.75} />
                <span>العودة للردهة وتعديل الإعدادات</span>
              </Button>
            </>
          ) : (
            <div className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-[#101017]/80 py-3.5 px-4 text-sm font-semibold text-zinc-300 backdrop-blur-xl">
              <span className="h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.9)] animate-pulse" />
              <span>بانتظار المضيف لبدء جولة جديدة...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
