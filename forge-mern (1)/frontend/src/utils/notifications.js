import { useEffect } from 'react';
import { useSelector } from 'react-redux';

const LS = 'forge:reminders';

export function requestNotifPermission() {
  if (!('Notification' in window)) return Promise.resolve('denied');
  return Notification.requestPermission();
}
export function notifyEnabled() {
  return localStorage.getItem(LS) === '1' && typeof Notification !== 'undefined' && Notification.permission === 'granted';
}
export function setNotifEnabled(v) { localStorage.setItem(LS, v ? '1' : '0'); }

function notify(title, body) {
  if (notifyEnabled()) new Notification(title, { body, icon: '/favicon.svg' });
}

export function useReminders() {
  const water = useSelector((s) => s.water);
  const profile = useSelector((s) => s.profile.data);
  const schedule = useSelector((s) => s.schedule.items);
  const sessions = useSelector((s) => s.sessions.items);

  useEffect(() => {
    const id = setInterval(() => {
      if (!notifyEnabled()) return;
      const h = new Date().getHours();
      if (h >= 8 && h <= 22 && profile) {
        const goal = profile.dailyWaterGoalMl || 2500;
        if ((water.total || 0) < goal) {
          notify('Hydration check', `You're at ${water.total || 0}ml / ${goal}ml. Drink up.`);
        }
      }
    }, 60 * 60 * 1000); // hourly
    return () => clearInterval(id);
  }, [water.total, profile]);

  useEffect(() => {
    const tick = () => {
      if (!notifyEnabled()) return;
      const d = new Date();
      if (d.getHours() === 8 && d.getMinutes() < 5) {
        const today = schedule.find((s) => s.dayOfWeek === d.getDay());
        if (today?.template) {
          const startedToday = sessions.some((s) => new Date(s.date).toDateString() === d.toDateString());
          if (!startedToday) notify('Workout today', `Time for ${today.template.name}. Let's go.`);
        }
      }
    };
    const id = setInterval(tick, 60 * 1000);
    return () => clearInterval(id);
  }, [schedule, sessions]);
}
