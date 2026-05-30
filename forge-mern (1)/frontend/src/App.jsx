import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Templates from './pages/Templates';
import Schedule from './pages/Schedule';
import Sessions from './pages/Sessions';
import SessionDetail from './pages/SessionDetail';
import History from './pages/History';
import Profile from './pages/Profile';
import { fetchMe } from './features/auth/authSlice';
import { useReminders } from './utils/notifications';

function Protected({ children }) {
  const { token, status } = useSelector((s) => s.auth);
  if (!token) return <Navigate to="/auth" replace />;
  if (status === 'loading') return null;
  return children;
}

export default function App() {
  const dispatch = useDispatch();
  const token = useSelector((s) => s.auth.token);
  useEffect(() => { if (token) dispatch(fetchMe()); }, [token, dispatch]);
  useReminders();
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<Auth />} />
      <Route element={<Protected><Layout /></Protected>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/sessions/:id" element={<SessionDetail />} />
        <Route path="/history" element={<History />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
