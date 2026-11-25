import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { coupSocket, emitCoupEvent } from '../lib/socket';
import {
  STORAGE_KEYS,
  getOrCreateSessionId,
  isValidRoomCode,
  normalizeRoomCode,
  safeStorageGet,
  safeStorageSet,
  validatePlayerName,
} from '../lib/utils';
import { getArabicErrorMessage } from '../lib/constants';
import { sound } from '../lib/sound';

function readInviteRoomFromUrl() {
  try {
    const params = new URLSearchParams(window.location.search);
    const code = normalizeRoomCode(params.get('room') || '');
    return isValidRoomCode(code) ? code : '';
  } catch {
    return '';
  }
}

export function useCoupGame() {
  const sessionIdRef = useRef(getOrCreateSessionId());
  const [inviteRoomCode] = useState(() => readInviteRoomFromUrl());
  const [room, setRoom] = useState(null);
  const [self, setSelf] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState(
    coupSocket.connected ? 'connected' : 'connecting'
  );
  const [rejoinPending, setRejoinPending] = useState(() => {
    const savedRoom = normalizeRoomCode(safeStorageGet(STORAGE_KEYS.ROOM_CODE, ''));
    const urlRoom = readInviteRoomFromUrl();
    return Boolean(savedRoom && (!urlRoom || urlRoom === savedRoom));
  });
  const [sessionReplaced, setSessionReplaced] = useState(false);
  const [busyAction, setBusyAction] = useState(null);

  const roomRef = useRef(null);
  const selfRef = useRef(null);
  const sessionReplacedRef = useRef(false);
  const prevRoomRef = useRef(null);

  useEffect(() => {
    roomRef.current = room;
  }, [room]);

  useEffect(() => {
    selfRef.current = self;
  }, [self]);

  useEffect(() => {
    sessionReplacedRef.current = sessionReplaced;
  }, [sessionReplaced]);

  const applySessionPayload = useCallback((payload, savedName) => {
    if (!payload?.room || !payload?.self) return;
    setSessionReplaced(false);
    setRoom(payload.room);
    setSelf(payload.self);
    safeStorageSet(STORAGE_KEYS.ROOM_CODE, payload.self.roomCode);
    safeStorageSet(STORAGE_KEYS.SESSION_ID, payload.self.sessionId);
    sessionIdRef.current = payload.self.sessionId;
    if (savedName) {
      safeStorageSet(STORAGE_KEYS.PLAYER_NAME, savedName);
    }
  }, []);

  const clearRoomSession = useCallback((clearStoredRoom = true) => {
    setRoom(null);
    setSelf(null);
    prevRoomRef.current = null;
    if (clearStoredRoom) {
      safeStorageSet(STORAGE_KEYS.ROOM_CODE, '');
    }
  }, []);

  // Subtle sound & haptic cues on key state changes
  const handleStateAudioCues = useCallback((nextRoom) => {
    const prev = prevRoomRef.current;
    prevRoomRef.current = nextRoom;
    const myId = selfRef.current?.playerId;
    if (!prev || !nextRoom || !myId) return;

    const prevMe = prev.players?.find((p) => p.id === myId);
    const nextMe = nextRoom.players?.find((p) => p.id === myId);

    // Victory / Game Over
    if (prev.phase !== 'GAME_OVER' && nextRoom.phase === 'GAME_OVER') {
      if (nextRoom.winnerId === myId) {
        sound.playVictory();
      } else {
        sound.playCardFlip();
      }
      return;
    }

    // Card reveal count increased anywhere on table -> crisp card flip
    const countRevealed = (r) =>
      (r.players || []).reduce(
        (acc, p) => acc + (p.cards || []).filter((c) => c.revealed).length,
        0
      );
    if (countRevealed(nextRoom) > countRevealed(prev)) {
      if (nextMe && prevMe && nextMe.influenceCount < prevMe.influenceCount) {
        sound.playLoss();
      } else {
        sound.playCardFlip();
      }
    }

    // Coin change for me
    if (prevMe && nextMe && nextMe.coins !== prevMe.coins) {
      sound.playCoin();
    }

    // Phase-specific cues
    if (prev.phase !== nextRoom.phase) {
      if (
        nextRoom.phase === 'TURN_ACTION' &&
        nextRoom.currentTurnPlayerId === myId
      ) {
        sound.playTurn();
      } else if (
        nextRoom.phase === 'ACTION_CHALLENGE_WINDOW' ||
        nextRoom.phase === 'BLOCK_CHALLENGE_WINDOW'
      ) {
        if (nextRoom.eligibleResponderIds?.includes(myId)) {
          sound.playChallenge();
        }
      } else if (nextRoom.phase === 'BLOCK_WINDOW') {
        if (nextRoom.eligibleResponderIds?.includes(myId)) {
          sound.playBlock();
        }
      } else if (
        nextRoom.phase === 'CHOOSE_INFLUENCE_LOSS' &&
        nextRoom.pendingInfluenceLoss?.playerId === myId
      ) {
        sound.playLoss();
      }
    }
  }, []);

  // Attempt auto-rejoin on connect/reconnect
  const attemptAutoRejoin = useCallback(async () => {
    if (sessionReplacedRef.current) {
      setRejoinPending(false);
      return;
    }

    const activeRoomCode =
      roomRef.current?.code ||
      normalizeRoomCode(safeStorageGet(STORAGE_KEYS.ROOM_CODE, ''));

    // If user clicked a DIFFERENT room invite link while having an old saved room,
    // do not hijack them back to the old room — let them join the invited room.
    if (!roomRef.current && inviteRoomCode && activeRoomCode && inviteRoomCode !== activeRoomCode) {
      setRejoinPending(false);
      return;
    }

    if (!activeRoomCode) {
      setRejoinPending(false);
      return;
    }

    const res = await emitCoupEvent('coup:rejoin_room', {
      sessionId: sessionIdRef.current,
      roomCode: activeRoomCode,
    });

    if (res.ok && res.data) {
      applySessionPayload(res.data);
      if (roomRef.current) {
        toast.success('تمت استعادة اتصالك بالغرفة');
      }
    } else {
      // Stale room or expired session
      clearRoomSession(true);
    }
    setRejoinPending(false);
  }, [applySessionPayload, clearRoomSession, inviteRoomCode]);

  // Socket lifecycle & server-to-client listeners (3 contract events)
  useEffect(() => {
    const onConnect = () => {
      setConnectionStatus('connected');
      attemptAutoRejoin();
    };

    const onDisconnect = () => {
      setConnectionStatus('reconnecting');
    };

    const onConnectError = () => {
      setConnectionStatus((prev) => (prev === 'connected' ? 'reconnecting' : 'disconnected'));
    };

    const onState = (nextRoom) => {
      if (!nextRoom) return;
      handleStateAudioCues(nextRoom);
      setRoom(nextRoom);
      setSelf((prevSelf) => {
        if (!prevSelf) return prevSelf;
        const meInRoom = nextRoom.players?.find((p) => p.id === prevSelf.playerId);
        if (!meInRoom) return prevSelf;
        return {
          ...prevSelf,
          seatIndex: meInRoom.seatIndex,
          isHost: nextRoom.hostPlayerId === prevSelf.playerId,
          roomCode: nextRoom.code,
        };
      });
    };

    const onKicked = (payload) => {
      sound.playLoss();
      clearRoomSession(true);
      const msg =
        payload?.reason && /[\u0600-\u06FF]/.test(payload.reason)
          ? payload.reason
          : 'تم طردك من الغرفة بواسطة المضيف';
      toast.error(msg);
    };

    const onSessionReplaced = () => {
      sessionReplacedRef.current = true;
      setSessionReplaced(true);
      clearRoomSession(false);
      toast.warning('تم فتح جلستك من نافذة أو جهاز آخر', {
        duration: 6000,
      });
    };

    coupSocket.on('connect', onConnect);
    coupSocket.on('disconnect', onDisconnect);
    coupSocket.on('connect_error', onConnectError);
    coupSocket.on('coup:state', onState);
    coupSocket.on('coup:kicked', onKicked);
    coupSocket.on('coup:session_replaced', onSessionReplaced);

    if (coupSocket.connected) {
      onConnect();
    } else {
      // Stop blocking Home screen if initial server connection takes >2.5s
      const fallbackTimer = setTimeout(() => setRejoinPending(false), 2500);
      return () => {
        clearTimeout(fallbackTimer);
        coupSocket.off('connect', onConnect);
        coupSocket.off('disconnect', onDisconnect);
        coupSocket.off('connect_error', onConnectError);
        coupSocket.off('coup:state', onState);
        coupSocket.off('coup:kicked', onKicked);
        coupSocket.off('coup:session_replaced', onSessionReplaced);
      };
    }

    return () => {
      coupSocket.off('connect', onConnect);
      coupSocket.off('disconnect', onDisconnect);
      coupSocket.off('connect_error', onConnectError);
      coupSocket.off('coup:state', onState);
      coupSocket.off('coup:kicked', onKicked);
      coupSocket.off('coup:session_replaced', onSessionReplaced);
    };
  }, [attemptAutoRejoin, clearRoomSession, handleStateAudioCues]);

  const runAction = useCallback(async (actionKey, fn) => {
    setBusyAction(actionKey);
    try {
      return await fn();
    } finally {
      setBusyAction(null);
    }
  }, []);

  // ==================== 16 Client -> Server Actions ====================

  const createRoom = useCallback(
    async ({ playerName, settings }) => {
      const check = validatePlayerName(playerName);
      if (!check.valid) {
        toast.error(check.error);
        return false;
      }

      return runAction('create_room', async () => {
        const payload = {
          playerName: check.value,
          sessionId: sessionIdRef.current,
          ...(settings ? { settings } : {}),
        };
        const res = await emitCoupEvent('coup:create_room', payload);
        if (!res.ok) {
          toast.error(getArabicErrorMessage(res.error));
          return false;
        }
        sound.playTurn();
        applySessionPayload(res.data, check.value);
        toast.success(`تم إنشاء الغرفة ${res.data.room.code}`);
        return true;
      });
    },
    [applySessionPayload, runAction]
  );

  const joinRoom = useCallback(
    async ({ roomCode, playerName }) => {
      const normalizedCode = normalizeRoomCode(roomCode);
      if (!isValidRoomCode(normalizedCode)) {
        toast.error('يرجى إدخال رمز غرفة مكون من 4 أرقام');
        return false;
      }
      const check = validatePlayerName(playerName);
      if (!check.valid) {
        toast.error(check.error);
        return false;
      }

      return runAction('join_room', async () => {
        const res = await emitCoupEvent('coup:join_room', {
          roomCode: normalizedCode,
          playerName: check.value,
          sessionId: sessionIdRef.current,
        });
        if (!res.ok) {
          toast.error(getArabicErrorMessage(res.error));
          return false;
        }
        sound.playTurn();
        applySessionPayload(res.data, check.value);
        toast.success(`انضممت إلى الغرفة ${res.data.room.code}`);
        return true;
      });
    },
    [applySessionPayload, runAction]
  );

  const rejoinRoom = useCallback(
    async (roomCode) => {
      return runAction('rejoin_room', async () => {
        const payload = {
          sessionId: sessionIdRef.current,
          ...(roomCode ? { roomCode: normalizeRoomCode(roomCode) } : {}),
        };
        const res = await emitCoupEvent('coup:rejoin_room', payload);
        if (!res.ok) {
          toast.error(getArabicErrorMessage(res.error));
          return false;
        }
        applySessionPayload(res.data);
        toast.success('تمت استعادة الجلسة بنجاح');
        return true;
      });
    },
    [applySessionPayload, runAction]
  );

  const leaveRoom = useCallback(async () => {
    return runAction('leave_room', async () => {
      sound.playClick();
      await emitCoupEvent('coup:leave_room');
      clearRoomSession(true);
      // Clean ?room= param from URL so refreshing doesn't feel stuck
      try {
        const url = new URL(window.location.href);
        if (url.searchParams.has('room')) {
          url.searchParams.delete('room');
          window.history.replaceState({}, '', url.pathname + url.search);
        }
      } catch {
        // ignore
      }
      return true;
    });
  }, [clearRoomSession, runAction]);

  const kickPlayer = useCallback(
    async (targetPlayerId) => {
      return runAction(`kick_${targetPlayerId}`, async () => {
        sound.playClick();
        const res = await emitCoupEvent('coup:kick_player', { targetPlayerId });
        if (!res.ok) {
          toast.error(getArabicErrorMessage(res.error));
          return false;
        }
        toast.info('تم إخراج اللاعب من الغرفة');
        return true;
      });
    },
    [runAction]
  );

  const updateSettings = useCallback(
    async (settings) => {
      return runAction('update_settings', async () => {
        sound.playClick();
        const res = await emitCoupEvent('coup:update_settings', { settings });
        if (!res.ok) {
          toast.error(getArabicErrorMessage(res.error));
          return false;
        }
        return true;
      });
    },
    [runAction]
  );

  const startGame = useCallback(async () => {
    return runAction('start_game', async () => {
      sound.playCardFlip();
      const res = await emitCoupEvent('coup:start_game');
      if (!res.ok) {
        toast.error(getArabicErrorMessage(res.error));
        return false;
      }
      return true;
    });
  }, [runAction]);

  const draftPick = useCallback(
    async (character) => {
      return runAction('draft_pick', async () => {
        sound.playCardFlip();
        const res = await emitCoupEvent('coup:draft_pick', { character });
        if (!res.ok) {
          toast.error(getArabicErrorMessage(res.error));
          return false;
        }
        return true;
      });
    },
    [runAction]
  );

  const performAction = useCallback(
    async (action, targetId) => {
      return runAction(`action_${action}`, async () => {
        const payload = targetId ? { action, targetId } : { action };
        const res = await emitCoupEvent('coup:action', payload);
        if (!res.ok) {
          toast.error(getArabicErrorMessage(res.error));
          return false;
        }
        if (action === 'income' || action === 'foreign_aid' || action === 'tax') {
          sound.playCoin();
        } else {
          sound.playClick();
        }
        return true;
      });
    },
    [runAction]
  );

  const challenge = useCallback(async () => {
    return runAction('challenge', async () => {
      sound.playChallenge();
      const res = await emitCoupEvent('coup:challenge');
      if (!res.ok) {
        toast.error(getArabicErrorMessage(res.error));
        return false;
      }
      return true;
    });
  }, [runAction]);

  const block = useCallback(
    async (claimedRole) => {
      return runAction(`block_${claimedRole}`, async () => {
        sound.playBlock();
        const res = await emitCoupEvent('coup:block', { claimedRole });
        if (!res.ok) {
          toast.error(getArabicErrorMessage(res.error));
          return false;
        }
        return true;
      });
    },
    [runAction]
  );

  const pass = useCallback(async () => {
    return runAction('pass', async () => {
      sound.playClick();
      const res = await emitCoupEvent('coup:pass');
      if (!res.ok) {
        toast.error(getArabicErrorMessage(res.error));
        return false;
      }
      return true;
    });
  }, [runAction]);

  const chooseInfluenceLoss = useCallback(
    async (cardId) => {
      return runAction('choose_loss', async () => {
        sound.playLoss();
        const res = await emitCoupEvent('coup:choose_influence_loss', { cardId });
        if (!res.ok) {
          toast.error(getArabicErrorMessage(res.error));
          return false;
        }
        return true;
      });
    },
    [runAction]
  );

  const exchangeSelect = useCallback(
    async (keepCardIds) => {
      return runAction('exchange_select', async () => {
        sound.playCardFlip();
        const res = await emitCoupEvent('coup:exchange_select', { keepCardIds });
        if (!res.ok) {
          toast.error(getArabicErrorMessage(res.error));
          return false;
        }
        return true;
      });
    },
    [runAction]
  );

  const playAgain = useCallback(async () => {
    return runAction('play_again', async () => {
      sound.playCardFlip();
      const res = await emitCoupEvent('coup:play_again');
      if (!res.ok) {
        toast.error(getArabicErrorMessage(res.error));
        return false;
      }
      return true;
    });
  }, [runAction]);

  const returnToLobby = useCallback(async () => {
    return runAction('return_to_lobby', async () => {
      sound.playClick();
      const res = await emitCoupEvent('coup:return_to_lobby');
      if (!res.ok) {
        toast.error(getArabicErrorMessage(res.error));
        return false;
      }
      return true;
    });
  }, [runAction]);

  // Derived table state
  const me = useMemo(() => {
    if (!room || !self) return null;
    return room.players.find((p) => p.id === self.playerId) || null;
  }, [room, self]);

  const opponents = useMemo(() => {
    if (!room || !self) return [];
    const sorted = [...room.players].sort((a, b) => a.seatIndex - b.seatIndex);
    const myIdx = sorted.findIndex((p) => p.id === self.playerId);
    if (myIdx === -1) return sorted;
    return [...sorted.slice(myIdx + 1), ...sorted.slice(0, myIdx)];
  }, [room, self]);

  const isHost = Boolean(room && self && room.hostPlayerId === self.playerId);
  const isMyTurn = Boolean(room && self && room.currentTurnPlayerId === self.playerId);
  const isEligibleResponder = Boolean(
    room && self && room.eligibleResponderIds?.includes(self.playerId)
  );
  const hasPassed = Boolean(
    room && self && room.passedPlayerIds?.includes(self.playerId)
  );
  const canRespond = isEligibleResponder && !hasPassed;

  return {
    room,
    self,
    me,
    opponents,
    isHost,
    isMyTurn,
    isEligibleResponder,
    hasPassed,
    canRespond,
    connectionStatus,
    rejoinPending,
    sessionReplaced,
    inviteRoomCode,
    busyAction,
    actions: {
      createRoom,
      joinRoom,
      rejoinRoom,
      leaveRoom,
      kickPlayer,
      updateSettings,
      startGame,
      draftPick,
      performAction,
      challenge,
      block,
      pass,
      chooseInfluenceLoss,
      exchangeSelect,
      playAgain,
      returnToLobby,
    },
  };
}
