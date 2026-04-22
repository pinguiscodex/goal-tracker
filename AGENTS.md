# Goal Tracker

## Architecture

- `app/backend/` - NestJS API (TypeORM, MySQL/MariaDB, bcrypt, JWT)
- `app/frontend/` - Next.js 16 app (React 19, Tailwind 4, Zustand)
- Each app is independent; run commands from its directory
- **Database**: MariaDB on `localhost:3306` (DB: `goal_tracker`, user: `root`, pass: `toor`)

## Developer Commands

**Backend** (`app/backend/`):
```bash
npm run start:dev   # watch mode (port 3001)
npm run build       # production build
npm run test        # unit tests (*.spec.ts)
npm run test:e2e    # e2e tests
npm run lint        # --fix included
npm run format      # prettier write
```

**Frontend** (`app/frontend/`):
```bash
npm run dev         # dev server (port 3000)
npm run build       # production build
npm run lint        # no --fix
npm run pretty      # prettier write
```

## API Endpoints

**Auth** (`/api/auth`):
- `POST /auth/register` - Register user (username, email, password)
- `POST /auth/login` - Login (returns JWT)
- `GET /auth/me` - Get current user (requires JWT)

**Clubs** (`/api/clubs`):
- `GET /clubs` - List all clubs
- `GET /clubs/subscribed` - Get user's subscribed clubs (requires JWT)
- `GET /clubs/:id` - Get club details
- `GET /clubs/:id/stats` - Get club statistics
- `POST /clubs` - Create club (requires JWT)
- `POST /clubs/:id/subscribe` - Subscribe to club (requires JWT)
- `POST /clubs/:id/unsubscribe` - Unsubscribe from club (requires JWT)

**Matches** (`/api/matches`):
- `GET /matches` - List matches (optional `?status=` filter)
- `GET /matches/ongoing` - Get live/halftime matches
- `GET /matches/:id` - Get match details
- `GET /matches/club/:clubId` - Get club matches
- `POST /matches` - Create match (requires JWT)
- `POST /matches/:id/start` - Start match
- `PATCH /matches/:id/goals` - Update goals
- `POST /matches/:id/halftime` - Set halftime
- `POST /matches/:id/resume` - Resume 2nd half
- `POST /matches/:id/end` - End match
- `POST /matches/:id/events` - Add match event (requires JWT)

**Tournaments** (`/api/tournaments`):
- `GET /tournaments` - List tournaments
- `GET /tournaments/:id` - Get tournament details
- `GET /tournaments/:id/standings` - Get standings by group
- `POST /tournaments` - Create tournament (requires JWT)

## Entrypoints

- Backend: `app/backend/src/main.ts` (port 3001)
- Frontend: `app/frontend/src/app/` (Next.js app router, port 3000)

## Frontend Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page (redirects to dashboard or login) |
| `/auth` | Login/Signup |
| `/dashboard` | Main dashboard with stats, live matches, recent matches |
| `/clubs` | Browse and subscribe to clubs |
| `/matches/create` | Create new match with full configuration |
| `/matches/:id` | Live match tracking view |
| `/tournaments` | List tournaments |
| `/tournaments/:id` | Tournament detail with standings |

## Security

- **Password hashing**: bcrypt (10 rounds) on backend
- **Authentication**: JWT tokens (7-day expiry)
- **Validation**: class-validator on all DTOs
- **CORS**: Enabled for frontend origin

## Quirks

- **No typecheck script** in either app - `nest build` / `next build` compile directly
- **Tailwind 4** uses CSS-based config (`@import "tailwindcss"`), not JS config
- **Backend test pattern**: `*.spec.ts` files in `src/`
- No root-level scripts; root `package.json` is metadata only
- **TypeORM synchronize**: Enabled for dev (auto-creates tables)