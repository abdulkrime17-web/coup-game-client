import React from 'react';
import { motion } from 'framer-motion';
import {
  Coins,
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
import { cn } from '../../lib/utils';

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
    <div className="min-h-[100dvh] w-full bg-obsidian-stage px-4 py-6 safe-pt safe-pb">
      <div className="mx-auto flex w-full max-w-lg flex-col gap-4">
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
            className="text-zinc-400 hover:text-red-300"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.75} />
            <span>مغادرة</span>
          </Button>
        </div>

        {/* Celebratory Winner Showcase */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <Card className="relative overflow-hidden border-amber-400/35 bg-gradient-to-b from-amber-500/15 via-zinc-900/85 to-zinc-950/90 p-6 text-center">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-amber-300/70 to-transparent" />

            <motion.div
              initial={{ scale: 0.6, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 18, delay: 0.1 }}
              className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-300/40 bg-amber-400/20 text-amber-300 shadow-glow"
            >
              <Trophy className="h-8 w-8" strokeWidth={1.75} />
            </motion.div>

            <Badge variant="gold" className="mb-2">
              {iWon ? 'انتصار مستحق!' : 'انتهت الجولة'}
            </Badge>

            <h1 className="text-2xl sm:text-3xl font-black text-white">
              {winner ? winner.name : 'لا يوجد فائز'}
            </h1>
            <p className="mt-1 text-sm text-zinc-300">
              {iWon
                ? 'أحكمت سيطرتك على الديوان وانتصرت في الجولة!'
                : 'بقي آخر صاحب نفوذ على طاولة كوب'}
            </p>

            {winner && (
              <div className="mt-4 flex items-center justify-center gap-2">
                <Badge variant="gold" className="tabular-nums px-3 py-1">
                  <Coins className="h-3.5 w-3.5" strokeWidth={1.75} />
                  {winner.coins} عملات
                </Badge>
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
            {sortedPlayers.map((player) => {
              const isWinner = player.id === room.winnerId;
              const isMe = player.id === self?.playerId;

              return (
                <div
                  key={player.id}
                  className={cn(
                    'rounded-2xl border p-3',
                    isWinner
                      ? 'border-amber-400/35 bg-amber-400/[0.06]'
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
                      <Badge variant="gold" className="text-[11px] tabular-nums">
                        <Coins className="h-3 w-3" strokeWidth={1.75} />
                        {player.coins}
                      </Badge>
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
                </div>
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
                loading={busyAction === 'play_again'}
                disabled={Boolean(busyAction)}
                onClick={onPlayAgain}
                className="w-full"
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
            <div className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-zinc-900/70 py-3.5 px-4 text-sm font-semibold text-zinc-300">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              <span>بانتظار المضيف لبدء جولة جديدة...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
