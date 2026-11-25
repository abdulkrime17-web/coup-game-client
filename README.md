# Coup (كوب / انقلاب) — Arabic RTL Multiplayer Web Client

A standalone, mobile-first **Arabic (RTL)** React client for the multiplayer bluffing card game **Coup**, designed with a minimalist obsidian luxury aesthetic and connected to a Socket.io server on the `/coup` namespace.

## Tech Stack

- **React + Vite + Tailwind CSS** (dev server on port `5175`)
- **Framer Motion** — 3D card flips, segmented tab transitions, tactile buttons, and bottom sheets
- **Sonner** — Dark RTL toast notifications
- **Lucide React** — Crisp iconography (`strokeWidth={1.75}`)
- **Socket.io Client** — Strictly aligned to the `/coup` namespace contract
- **Web Audio API + Vibration API** — Synthesized sound cues (coin clink, challenge alert, card flip, victory) with mute toggle

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   Set `VITE_COUP_SERVER_URL` to your Coup Socket.io server base URL (trailing slashes and accidental `/coup` suffixes are stripped automatically):
   ```env
   VITE_COUP_SERVER_URL=http://localhost:3001
   ```
3. Run the development server (port `5175`):
   ```bash
   npm run dev
   ```

## Production Build & Vercel Deployment

```bash
npm run build
```

- Includes `vercel.json` SPA rewrites so direct invite links (`/?room=1234`) resolve cleanly.
- In Vercel Project Settings -> Environment Variables, add:
  - `VITE_COUP_SERVER_URL=https://server-production-0558125f.up.railway.app`

## Socket Contract Highlights

- Connects strictly to `${normalizedBaseUrl}/coup` (`transports: ['websocket', 'polling']`).
- Persists session identifiers under `coup_sessionId`, `coup_roomCode`, and `coup_playerName` for automatic rejoin after page refresh or transient disconnects.
- Supports all 16 client-to-server events (`coup:create_room`, `coup:join_room`, `coup:rejoin_room`, `coup:leave_room`, `coup:kick_player`, `coup:update_settings`, `coup:start_game`, `coup:draft_pick`, `coup:action`, `coup:challenge`, `coup:block`, `coup:pass`, `coup:choose_influence_loss`, `coup:exchange_select`, `coup:play_again`, `coup:return_to_lobby`) and all 3 server-to-client events (`coup:state`, `coup:kicked`, `coup:session_replaced`).
