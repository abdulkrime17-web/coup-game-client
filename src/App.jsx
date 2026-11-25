import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { Toaster } from 'sonner';
import { Crown, Loader2 } from 'lucide-react';
import { useCoupGame } from './hooks/useCoupGame';
import { HomeScreen } from './components/game/HomeScreen';
import { LobbyScreen } from './components/game/LobbyScreen';
import { GameTable } from './components/game/GameTable';
import { GameOverScreen } from './components/game/GameOverScreen';
import { RulesSheet } from './components/game/RulesSheet';
import { ActionLogSheet } from './components/game/ActionLogSheet';
import { sound } from './lib/sound';

const SCREEN_TRANSITION = {
  initial: { opacity: 0, y: 10, scale: 0.99, filter: 'blur(4px)' },
  animate: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -8, scale: 0.99, filter: 'blur(4px)' },
  transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
};

export default function App() {
  const {
    room,
    self,
    me,
    opponents,
    isHost,
    isMyTurn,
    canRespond,
    hasPassed,
    connectionStatus,
    rejoinPending,
    sessionReplaced,
    inviteRoomCode,
    busyAction,
    actions,
  } = useCoupGame();

  const [muted, setMuted] = useState(() => sound.isMuted());
  const [rulesOpen, setRulesOpen] = useState(false);
  const [logOpen, setLogOpen] = useState(false);
  const [unreadLog, setUnreadLog] = useState(false);
  const lastSeenLogIdRef = useRef(null);

  // Track unread action log entries while the log sheet is closed
  useEffect(() => {
    const latest = room?.actionLog?.[room.actionLog.length - 1];
    if (!latest) {
      lastSeenLogIdRef.current = null;
      setUnreadLog(false);
      return;
    }
    if (logOpen) {
      lastSeenLogIdRef.current = latest.id;
      setUnreadLog(false);
    } else if (lastSeenLogIdRef.current && latest.id !== lastSeenLogIdRef.current) {
      setUnreadLog(true);
    } else if (!lastSeenLogIdRef.current) {
      lastSeenLogIdRef.current = latest.id;
    }
  }, [room?.actionLog, logOpen]);

  const handleToggleMute = () => {
    const nextMuted = sound.toggleMute();
    setMuted(nextMuted);
    if (!nextMuted) sound.playClick();
  };

  const handleOpenLog = () => {
    sound.playClick();
    setLogOpen(true);
    setUnreadLog(false);
  };

  const handleOpenRules = () => {
    sound.playClick();
    setRulesOpen(true);
  };

  const screenKey =
    rejoinPending && !room
      ? 'loading'
      : !room
        ? 'home'
        : room.phase === 'LOBBY'
          ? 'lobby'
          : room.phase === 'GAME_OVER'
            ? 'gameover'
            : 'table';

  return (
    <MotionConfig reducedMotion="user">
      <div dir="rtl" className="min-h-[100dvh] w-full bg-[#07070A] text-zinc-100 font-sans">
        <Toaster
          position="top-center"
          dir="rtl"
          theme="dark"
          richColors
          toastOptions={{
            style: {
              fontFamily: '"Cairo", system-ui, sans-serif',
              background: 'rgba(16, 16, 23, 0.94)',
              border: '1px solid rgba(255, 255, 255, 0.13)',
              backdropFilter: 'blur(18px)',
              borderRadius: '16px',
            },
          }}
        />

        <AnimatePresence mode="wait">
          {screenKey === 'loading' && (
            <motion.div
              key="loading"
              {...SCREEN_TRANSITION}
              className="min-h-[100dvh] w-full bg-obsidian-stage flex flex-col items-center justify-center gap-3.5 px-4"
            >
              <motion.div
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-400/35 bg-amber-400/15 text-amber-300 shadow-glow"
              >
                <Crown className="h-8 w-8" strokeWidth={1.75} />
              </motion.div>
              <div className="flex items-center gap-2 text-sm font-bold text-zinc-200">
                <Loader2 className="h-4 w-4 animate-spin text-amber-400" strokeWidth={2} />
                <span>جاري استعادة جلستك...</span>
              </div>
            </motion.div>
          )}

          {screenKey === 'home' && (
            <motion.div key="home" {...SCREEN_TRANSITION}>
              <HomeScreen
                inviteRoomCode={inviteRoomCode}
                connectionStatus={connectionStatus}
                sessionReplaced={sessionReplaced}
                busyAction={busyAction}
                muted={muted}
                onToggleMute={handleToggleMute}
                onOpenRules={handleOpenRules}
                onCreateRoom={actions.createRoom}
                onJoinRoom={actions.joinRoom}
              />
            </motion.div>
          )}

          {screenKey === 'lobby' && (
            <motion.div key="lobby" {...SCREEN_TRANSITION}>
              <LobbyScreen
                room={room}
                self={self}
                isHost={isHost}
                busyAction={busyAction}
                muted={muted}
                onToggleMute={handleToggleMute}
                onOpenRules={handleOpenRules}
                onKickPlayer={actions.kickPlayer}
                onUpdateSettings={actions.updateSettings}
                onStartGame={actions.startGame}
                onLeaveRoom={actions.leaveRoom}
              />
            </motion.div>
          )}

          {screenKey === 'gameover' && (
            <motion.div key="gameover" {...SCREEN_TRANSITION}>
              <GameOverScreen
                room={room}
                self={self}
                isHost={isHost}
                busyAction={busyAction}
                onOpenLog={handleOpenLog}
                onPlayAgain={actions.playAgain}
                onReturnToLobby={actions.returnToLobby}
                onLeaveRoom={actions.leaveRoom}
              />
            </motion.div>
          )}

          {screenKey === 'table' && (
            <motion.div key="table" {...SCREEN_TRANSITION}>
              <GameTable
                room={room}
                self={self}
                me={me}
                opponents={opponents}
                isMyTurn={isMyTurn}
                canRespond={canRespond}
                hasPassed={hasPassed}
                connectionStatus={connectionStatus}
                busyAction={busyAction}
                muted={muted}
                onToggleMute={handleToggleMute}
                onOpenRules={handleOpenRules}
                onOpenLog={handleOpenLog}
                unreadLog={unreadLog}
                actions={actions}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <RulesSheet open={rulesOpen} onClose={() => setRulesOpen(false)} />
        <ActionLogSheet
          open={logOpen}
          onClose={() => setLogOpen(false)}
          actionLog={room?.actionLog || []}
        />
      </div>
    </MotionConfig>
  );
}
