import React, { useEffect, useRef, useState } from 'react';
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

  return (
    <div dir="rtl" className="min-h-[100dvh] w-full bg-[#09090B] text-zinc-100 font-sans">
      <Toaster
        position="top-center"
        dir="rtl"
        theme="dark"
        richColors
        toastOptions={{
          style: {
            fontFamily: '"Cairo", system-ui, sans-serif',
            background: 'rgba(18, 18, 22, 0.94)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(16px)',
            borderRadius: '14px',
          },
        }}
      />

      {rejoinPending && !room ? (
        <div className="min-h-[100dvh] w-full bg-obsidian-stage flex flex-col items-center justify-center gap-3 px-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-400/30 bg-amber-400/10 text-amber-300 shadow-glow">
            <Crown className="h-7 w-7" strokeWidth={1.75} />
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold text-zinc-300">
            <Loader2 className="h-4 w-4 animate-spin text-amber-400" strokeWidth={2} />
            <span>جاري استعادة جلستك...</span>
          </div>
        </div>
      ) : !room ? (
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
      ) : room.phase === 'LOBBY' ? (
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
      ) : room.phase === 'GAME_OVER' ? (
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
      ) : (
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
      )}

      <RulesSheet open={rulesOpen} onClose={() => setRulesOpen(false)} />
      <ActionLogSheet
        open={logOpen}
        onClose={() => setLogOpen(false)}
        actionLog={room?.actionLog || []}
      />
    </div>
  );
}
