# Reusable prompt — Forge (MERN, JavaScript)

Use this prompt to regenerate the same project from scratch.

---

Build a complete, production-style **Fitness Tracking Web Application** called **Forge** as a MERN stack.

## Stack — strict
- **Frontend**: React 18 + **JavaScript only** (no TypeScript). Vite. React Router v6. **Redux Toolkit** with one slice per domain. **styled-components** with a `ThemeProvider` and a global style. **Recharts** for graphs. **axios** for HTTP. **lucide-react** icons. **react-hot-toast** for toasts.
- **Backend**: Node.js + Express. **MongoDB with Mongoose**. **JWT** auth (Bearer header). **bcryptjs** for password hashing. Clean MVC: `models/`, `controllers/`, `routes/`, `middleware/`, `config/`. `cors`, `morgan`, `dotenv`, `express-async-handler`.
- **No TypeScript anywhere. JS only.** REST APIs only.

## Design system (must match exactly)
- Dark fitness theme: bg `#0d0f1a`, card `#1a1d2e`, soft borders `rgba(255,255,255,0.08)`.
- Accent gradient: ember orange `#f97316` → `#fb923c` → `#ef4444`. Secondary accent aqua `#22d3ee`.
- Glassmorphism cards: `backdrop-filter: blur(20px) saturate(140%)`, soft border, large radius (~22px).
- Fonts: **Space Grotesk** for headings, **Inter** for body (Google Fonts).
- Hero background = radial ember + aqua gradients, `background-attachment: fixed`.
- Buttons: primary uses the ember gradient with a glow shadow; ghost has subtle white-on-dark fill; outline uses border only.
- Stat numbers in Space Grotesk, 28–30px, weight 700.

## Features
1. **Auth**: register + login (name/email/password), JWT in `localStorage`, `/auth/me` to rehydrate.
2. **Profile**: name, age, gender, heightCm, weightKg, dailyWaterGoalMl. Compute & show BMI + category.
3. **Templates**: CRUD reusable workout routines. Each has `type` (push/pull/legs/upper/lower/full/cardio/custom) and a list of exercises (name, muscleGroup, defaultSets, defaultReps). Modal editor with add/remove exercise rows.
4. **Schedule**: assign one template (or rest) to each day of the week. Highlight today.
5. **Sessions**: start a session from a template (snapshots exercises into log entries with sets). Live session page with stepper buttons for weight/reps, a "set done" toggle, add/remove set, notes, duration, Finish button.
6. **History**: list of all sessions with **filters**: search by name, filter by type, completion status, and date range (7/30/90/365/all). Show aggregate totals (sessions, sets, reps, volume in tonnes).
7. **Water**: log intake with quick +250/+500/+750ml, show total vs goal as an SVG progress ring.
8. **Dashboard** must include:
   - Greeting + today's date + "Start today's workout" button if scheduled.
   - 4 stat cards: streak, today's calories (MET formula), total volume, BMI.
   - **Line chart** of volume by day (last 14 days) with a **selector to filter by workout type** (e.g. only "push").
   - Hydration ring.
   - **LeetCode-style activity heatmap** (17 weeks × 7 days) of completed sessions per day, with 5 intensity levels and a Less→More legend.
   - This-week strip (7 cells with template names).
   - Recent sessions list.
9. **Notifications**: opt-in browser notifications. Hourly hydration nudge (8am–10pm) when below goal. 8am workout reminder if scheduled today and not yet started.

## Backend API (mount under `/api`)
- `POST /auth/register`, `POST /auth/login`, `GET /auth/me`
- `GET/PUT /profile`
- `GET/POST/GET:id/PUT:id/DELETE:id /templates`
- `GET /sessions` (filters: from, to, type, completed, q, limit), `POST /sessions/start` (body: templateId), `GET/PUT/DELETE /sessions/:id`
- `GET /schedule`, `PUT /schedule` (body: dayOfWeek, templateId|null)
- `GET /water`, `POST /water`, `DELETE /water/:id`
- `GET /stats/summary?days=120` → totals, streak, per-day heat map, volumeByDay keyed by templateType, typeBreakdown.

Protect every non-auth route with a `protect` middleware that verifies JWT and attaches `req.user`.

## Frontend conventions
- One Redux slice per backend domain in `src/features/<name>/<name>Slice.js`.
- Axios client in `src/api/client.js` injects token from store and dispatches `logout()` on 401.
- All primitives (`Button`, `Card`, `Input`, `Select`, `Label`, `Badge`, `Gradient`, `Row`) live in `src/styles/ui.js` using `styled-components` and the theme.
- Routes wrapped in a `<Protected>` guard. Authenticated routes use a `<Layout>` with a sticky sidebar (desktop) + bottom tab bar (mobile, 5 columns).
- Pages: `Landing`, `Auth`, `Dashboard`, `Templates`, `Schedule`, `History`, `SessionDetail`, `Profile`.

## Deliverables
- `backend/` and `frontend/` folders, each runnable with `npm install && npm run dev`.
- `.env.example` in both.
- Top-level `README.md` with run instructions.
- No TypeScript. JavaScript everywhere.
- Responsive: works at 360px wide and up.
