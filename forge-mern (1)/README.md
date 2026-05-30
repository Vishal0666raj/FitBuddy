# Forge — Fitness Tracking (MERN, JavaScript)

A complete production-style MERN stack fitness tracker. Same design language as the Lovable preview build (dark glass UI, ember orange + aqua, Space Grotesk display font).

## Stack
- **Frontend**: React 18, Redux Toolkit, React Router v6, styled-components, Recharts, Axios, lucide-react
- **Backend**: Node.js, Express, MongoDB + Mongoose, JWT, bcryptjs
- **Patterns**: REST API, clean MVC backend, feature slices on frontend

## Features
- Email/password auth with JWT (persisted in localStorage)
- Profile with BMI calculator
- Workout templates (Push/Pull/Legs/custom) with exercise editor
- Weekly schedule
- Live workout session logger (stepper buttons, set completion, notes, finish)
- Workout history with full filtering (text, type, status, date range) and aggregate stats
- Dashboard with: streak, calories, total volume, BMI, hydration ring, volume line-chart (per workout type), LeetCode-style activity heatmap, weekly schedule, recent sessions
- Browser notifications for hourly hydration and morning workout reminders

## Run locally

```bash
# 1. Backend
cd backend
cp .env.example .env   # set MONGO_URI + JWT_SECRET
npm install
npm run dev            # http://localhost:5000

# 2. Frontend (new terminal)
cd frontend
cp .env.example .env   # VITE_API_URL=http://localhost:5000/api
npm install
npm run dev            # http://localhost:5173
```

## Project structure
```
backend/
  src/
    config/db.js
    models/        User, Profile, Template, Session, Schedule, Water
    controllers/   auth, profile, template, session, schedule, water, stats
    routes/        REST endpoints under /api/*
    middleware/    auth (JWT), error
    utils/         token signer
    server.js
frontend/
  src/
    app/store.js
    api/client.js
    features/      auth, profile, templates, sessions, schedule, water, stats
    components/    Layout, ActivityHeatmap, VolumeChart
    pages/         Landing, Auth, Dashboard, Templates, Schedule, History, SessionDetail, Profile
    styles/        theme.js (styled-components ThemeProvider) + ui.js (primitives)
    utils/         fitness math, notifications
```
