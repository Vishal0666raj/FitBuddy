import { configureStore } from '@reduxjs/toolkit';
import auth from '../features/auth/authSlice';
import profile from '../features/profile/profileSlice';
import templates from '../features/templates/templatesSlice';
import sessions from '../features/sessions/sessionsSlice';
import schedule from '../features/schedule/scheduleSlice';
import water from '../features/water/waterSlice';
import stats from '../features/stats/statsSlice';

export const store = configureStore({
  reducer: { auth, profile, templates, sessions, schedule, water, stats },
});
