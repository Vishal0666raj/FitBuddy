import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useMemo, useState, useEffect } from 'react';
import styled from 'styled-components';
import toast from 'react-hot-toast';
import { Flame, TrendingUp, Droplets, Activity, Plus, Bell, BellOff, Play } from 'lucide-react';
import { addWater } from '../features/water/waterSlice';
import { startSession } from '../features/sessions/sessionsSlice';
import { Card, Button, Gradient, Select, Label, Badge, Row } from '../styles/ui';
import { calcBMI, bmiCategory, estimateCalories, DAYS } from '../utils/fitness';
import { requestNotifPermission, setNotifEnabled, notifyEnabled } from '../utils/notifications';
import ActivityHeatmap from '../components/ActivityHeatmap';
import VolumeChart from '../components/VolumeChart';

export default function Dashboard() {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const user = useSelector((s) => s.auth.user);
  const profile = useSelector((s) => s.profile.data);
  const water = useSelector((s) => s.water);
  const stats = useSelector((s) => s.stats.data);
  const schedule = useSelector((s) => s.schedule.items);
  const sessions = useSelector((s) => s.sessions.items);
  const templates = useSelector((s) => s.templates.items);
  const [notif, setNotif] = useState(notifyEnabled());

  const today = new Date();
  const todayDow = today.getDay();
  const todayPlan = schedule.find((s) => s.dayOfWeek === todayDow);

  const bmi = calcBMI(profile?.weightKg, profile?.heightCm);
  const goal = profile?.dailyWaterGoalMl || 2500;
  const hydration = Math.min(100, Math.round(((water.total || 0) / goal) * 100));
  const recentSessions = sessions.slice(0, 4);
  const todayCalories = useMemo(() => {
    const todayKey = today.toDateString();
    const todaySession = sessions.find((s) => new Date(s.date).toDateString() === todayKey);
    if (!todaySession || !profile?.weightKg) return 0;
    return estimateCalories({ weightKg: profile.weightKg, durationMin: todaySession.durationMin || 45 });
  }, [sessions, profile]);

  async function toggleNotif() {
    if (!notif) {
      const p = await requestNotifPermission();
      if (p === 'granted') { setNotifEnabled(true); setNotif(true); toast.success('Reminders enabled'); }
      else toast.error('Permission denied');
    } else { setNotifEnabled(false); setNotif(false); toast('Reminders off'); }
  }

  async function startToday() {
    if (!todayPlan?.template) { toast.error('No workout scheduled today'); return; }
    const r = await dispatch(startSession(todayPlan.template._id));
    if (r.payload?._id) nav(`/sessions/${r.payload._id}`);
  }

  return (
    <Container>
      <Header>
        <div>
          <Greeting>Welcome back, <Gradient>{user?.name?.split(' ')[0] || 'Athlete'}</Gradient></Greeting>
          <Sub>{today.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</Sub>
        </div>
        <Row $gap="10px">
          <Button $variant="ghost" $sm onClick={toggleNotif}>
            {notif ? <Bell size={14} /> : <BellOff size={14} />} {notif ? 'Reminders on' : 'Enable reminders'}
          </Button>
          {todayPlan?.template && (
            <Button $variant="primary" $sm onClick={startToday}>
              <Play size={14} /> Start {todayPlan.template.name}
            </Button>
          )}
        </Row>
      </Header>

      <Stats>
        <StatCard label="Streak" value={stats?.streak || 0} suffix="days" icon={Flame} color="#f97316" />
        <StatCard label="Calories today" value={todayCalories} suffix="kcal" icon={Activity} color="#ef4444" />
        <StatCard label="Total volume" value={Math.round((stats?.totals?.volume || 0) / 1000)} suffix="t" icon={TrendingUp} color="#22d3ee" />
        <StatCard label="BMI" value={bmi ?? '—'} suffix={bmi ? bmiCategory(bmi) : 'Set profile'} icon={Activity} color="#34d399" />
      </Stats>

      <Two>
        <Card $pad="24px">
          <SectionHead>
            <h3>Volume by day</h3>
            <Badge>Last 14 days</Badge>
          </SectionHead>
          <VolumeChart volumeByDay={stats?.volumeByDay || {}} templates={templates} />
        </Card>

        <Card $pad="24px">
          <SectionHead>
            <h3>Hydration</h3>
            <Badge $variant="primary">{water.total || 0}/{goal} ml</Badge>
          </SectionHead>
          <Ring>
            <svg viewBox="0 0 120 120" width="160" height="160">
              <defs>
                <linearGradient id="hg" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#22d3ee" /><stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
              </defs>
              <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
              <circle cx="60" cy="60" r="52" fill="none" stroke="url(#hg)" strokeWidth="10" strokeLinecap="round"
                strokeDasharray={`${(hydration / 100) * 326.7} 326.7`} transform="rotate(-90 60 60)" />
            </svg>
            <RingLabel><strong>{hydration}%</strong><span>of daily</span></RingLabel>
          </Ring>
          <Row $gap="8px" $wrap style={{ marginTop: 14, justifyContent: 'center' }}>
            {[250, 500, 750].map((ml) => (
              <Button key={ml} $variant="ghost" $sm onClick={() => dispatch(addWater(ml))}>
                <Droplets size={14} /> +{ml}ml
              </Button>
            ))}
          </Row>
        </Card>
      </Two>

      <Card $pad="24px">
        <SectionHead>
          <h3>Activity</h3>
          <Badge>Last 17 weeks</Badge>
        </SectionHead>
        <ActivityHeatmap heat={stats?.heat || {}} />
      </Card>

      <Two>
        <Card $pad="24px">
          <SectionHead><h3>This week</h3></SectionHead>
          <Week>
            {DAYS.map((d, i) => {
              const plan = schedule.find((s) => s.dayOfWeek === i);
              const isToday = i === todayDow;
              return (
                <DayCell key={d} $today={isToday}>
                  <DayName>{d}</DayName>
                  <DayTpl>{plan?.template?.name || 'Rest'}</DayTpl>
                </DayCell>
              );
            })}
          </Week>
        </Card>
        <Card $pad="24px">
          <SectionHead>
            <h3>Recent sessions</h3>
            <Button $variant="ghost" $sm onClick={() => nav('/history')}>View all</Button>
          </SectionHead>
          {recentSessions.length === 0 && <Empty>No sessions yet. Start your first workout.</Empty>}
          <List>
            {recentSessions.map((s) => (
              <ListItem key={s._id} onClick={() => nav(`/sessions/${s._id}`)}>
                <div>
                  <div style={{ fontWeight: 600 }}>{s.templateName || 'Workout'}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                    {new Date(s.date).toLocaleDateString()} · {s.logs?.length || 0} exercises
                  </div>
                </div>
                <Badge $variant={s.completed ? 'primary' : undefined}>{s.completed ? 'Done' : 'In progress'}</Badge>
              </ListItem>
            ))}
          </List>
        </Card>
      </Two>
    </Container>
  );
}

function StatCard({ label, value, suffix, icon: Icon, color }) {
  return (
    <Card $pad="20px">
      <Row $justify="space-between">
        <div>
          <StatLabel>{label}</StatLabel>
          <StatValue>{value}<StatSuffix>{suffix}</StatSuffix></StatValue>
        </div>
        <IconBox style={{ background: `${color}22`, color }}><Icon size={20} /></IconBox>
      </Row>
    </Card>
  );
}

const Container = styled.div` padding: 28px 24px; display: flex; flex-direction: column; gap: 20px; max-width: 1200px; `;
const Header = styled.div` display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; flex-wrap: wrap; `;
const Greeting = styled.h1` font-size: clamp(28px, 4vw, 38px); `;
const Sub = styled.div` color: ${({ theme }) => theme.colors.textMuted}; font-size: 14px; margin-top: 4px; `;
const Stats = styled.div`
  display: grid; gap: 16px;
  grid-template-columns: repeat(4, 1fr);
  @media (max-width: 900px) { grid-template-columns: repeat(2, 1fr); }
`;
const StatLabel = styled.div` font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: ${({ theme }) => theme.colors.textMuted}; font-weight: 600; `;
const StatValue = styled.div` font-family: ${({ theme }) => theme.font.display}; font-size: 30px; font-weight: 700; margin-top: 6px; line-height: 1; `;
const StatSuffix = styled.span` font-size: 12px; color: ${({ theme }) => theme.colors.textDim}; margin-left: 6px; font-weight: 500; `;
const IconBox = styled.div` width: 42px; height: 42px; border-radius: 12px; display: grid; place-items: center; `;
const Two = styled.div`
  display: grid; gap: 18px; grid-template-columns: 2fr 1fr;
  @media (max-width: 900px) { grid-template-columns: 1fr; }
`;
const SectionHead = styled.div` display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; h3 { font-size: 16px; } `;
const Ring = styled.div` position: relative; display: grid; place-items: center; margin: 8px auto; `;
const RingLabel = styled.div`
  position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center;
  strong { font-family: ${({ theme }) => theme.font.display}; font-size: 30px; }
  span { font-size: 11px; color: ${({ theme }) => theme.colors.textMuted}; }
`;
const Week = styled.div` display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px; `;
const DayCell = styled.div`
  padding: 10px 6px; border-radius: 12px; text-align: center;
  background: ${(p) => p.$today ? 'rgba(249,115,22,0.12)' : 'rgba(255,255,255,0.03)'};
  border: 1px solid ${(p) => p.$today ? 'rgba(249,115,22,0.3)' : 'transparent'};
`;
const DayName = styled.div` font-size: 10px; color: ${({ theme }) => theme.colors.textMuted}; text-transform: uppercase; font-weight: 600; `;
const DayTpl = styled.div` font-size: 12px; margin-top: 4px; font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; `;
const List = styled.div` display: flex; flex-direction: column; gap: 8px; `;
const ListItem = styled.button`
  display: flex; justify-content: space-between; align-items: center; gap: 12px;
  width: 100%; padding: 12px 14px; border-radius: 12px; text-align: left;
  background: rgba(255,255,255,0.03);
  border: 1px solid transparent;
  transition: all .15s ease;
  &:hover { background: rgba(255,255,255,0.06); border-color: ${({ theme }) => theme.colors.border}; }
`;
const Empty = styled.div` color: ${({ theme }) => theme.colors.textMuted}; font-size: 14px; padding: 16px 0; text-align: center; `;
