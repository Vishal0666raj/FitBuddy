import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Search, Filter, Calendar, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchSessions, deleteSession } from '../features/sessions/sessionsSlice';
import { Card, Input, Select, Button, Badge, Row, Gradient } from '../styles/ui';

const RANGES = [
  { label: 'Last 7 days', value: 7 },
  { label: 'Last 30 days', value: 30 },
  { label: 'Last 90 days', value: 90 },
  { label: 'Last year', value: 365 },
  { label: 'All time', value: 0 },
];

export default function History() {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const sessions = useSelector((s) => s.sessions.items);
  const templates = useSelector((s) => s.templates.items);
  const [q, setQ] = useState('');
  const [type, setType] = useState('');
  const [completed, setCompleted] = useState('');
  const [range, setRange] = useState(30);

  useEffect(() => {
    const params = { limit: 500 };
    if (range > 0) params.from = new Date(Date.now() - range * 86400000).toISOString();
    dispatch(fetchSessions(params));
  }, [range, dispatch]);

  const filtered = useMemo(() => sessions.filter((s) => {
    if (q && !(s.templateName || '').toLowerCase().includes(q.toLowerCase())) return false;
    if (type && s.templateType !== type) return false;
    if (completed === 'true' && !s.completed) return false;
    if (completed === 'false' && s.completed) return false;
    return true;
  }), [sessions, q, type, completed]);

  const aggregate = useMemo(() => {
    let vol = 0, sets = 0, reps = 0;
    filtered.forEach((s) => s.logs?.forEach((l) => l.sets?.forEach((set) => {
      if (!set.completed) return;
      vol += (set.reps || 0) * (set.weightKg || 0); sets += 1; reps += set.reps || 0;
    })));
    return { vol, sets, reps, count: filtered.length };
  }, [filtered]);

  const types = useMemo(() => {
    const set = new Set();
    templates.forEach((t) => set.add(t.type || 'custom'));
    sessions.forEach((s) => s.templateType && set.add(s.templateType));
    return [...set];
  }, [templates, sessions]);

  async function remove(id, e) {
    e.stopPropagation();
    if (!confirm('Delete this session?')) return;
    await dispatch(deleteSession(id));
    toast.success('Deleted');
  }

  return (
    <Wrap>
      <Head>
        <h1>Workout <Gradient>history</Gradient></h1>
        <Sub>Every rep, every PR, every drop of sweat — searchable.</Sub>
      </Head>

      <StatGrid>
        <Stat><span>Sessions</span><strong>{aggregate.count}</strong></Stat>
        <Stat><span>Total sets</span><strong>{aggregate.sets}</strong></Stat>
        <Stat><span>Total reps</span><strong>{aggregate.reps}</strong></Stat>
        <Stat><span>Volume</span><strong>{Math.round(aggregate.vol / 1000 * 10) / 10}<small>t</small></strong></Stat>
      </StatGrid>

      <Card $pad="18px">
        <Filters>
          <SearchWrap>
            <Search size={16} />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by workout name…" style={{ paddingLeft: 38 }} />
          </SearchWrap>
          <Select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">All types</option>
            {types.map((t) => <option key={t} value={t}>{t}</option>)}
          </Select>
          <Select value={completed} onChange={(e) => setCompleted(e.target.value)}>
            <option value="">All status</option>
            <option value="true">Completed</option>
            <option value="false">In progress</option>
          </Select>
          <Select value={range} onChange={(e) => setRange(+e.target.value)}>
            {RANGES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
          </Select>
        </Filters>
      </Card>

      <List>
        {filtered.length === 0 && (
          <Card $pad="48px"><Empty>No sessions match your filters.</Empty></Card>
        )}
        {filtered.map((s) => {
          const vol = s.logs?.reduce((a, l) => a + l.sets.reduce((b, set) => b + (set.completed ? (set.reps || 0) * (set.weightKg || 0) : 0), 0), 0) || 0;
          const setsDone = s.logs?.reduce((a, l) => a + l.sets.filter((set) => set.completed).length, 0) || 0;
          return (
            <Item key={s._id} onClick={() => nav(`/sessions/${s._id}`)}>
              <DateBox>
                <Mon>{new Date(s.date).toLocaleDateString(undefined, { month: 'short' })}</Mon>
                <Day>{new Date(s.date).getDate()}</Day>
              </DateBox>
              <Main>
                <Row $justify="space-between" $align="flex-start">
                  <div>
                    <Title>{s.templateName || 'Workout'}</Title>
                    <Row $gap="6px" style={{ marginTop: 6 }}>
                      <Badge>{s.templateType || 'custom'}</Badge>
                      <Badge $variant={s.completed ? 'primary' : undefined}>{s.completed ? 'Completed' : 'In progress'}</Badge>
                    </Row>
                  </div>
                  <button onClick={(e) => remove(s._id, e)} style={{ padding: 6, borderRadius: 8, color: '#9aa3b8' }}>
                    <Trash2 size={14} />
                  </button>
                </Row>
                <Meta>
                  <span>{s.logs?.length || 0} exercises</span>
                  <span>·</span>
                  <span>{setsDone} sets</span>
                  <span>·</span>
                  <span>{Math.round(vol)}kg volume</span>
                  {s.durationMin && <><span>·</span><span>{s.durationMin}min</span></>}
                </Meta>
              </Main>
            </Item>
          );
        })}
      </List>
    </Wrap>
  );
}

const Wrap = styled.div` padding: 28px 24px; display: flex; flex-direction: column; gap: 20px; max-width: 1100px; `;
const Head = styled.div` h1 { font-size: clamp(28px, 4vw, 36px); } `;
const Sub = styled.div` color: ${({ theme }) => theme.colors.textMuted}; font-size: 14px; margin-top: 4px; `;
const StatGrid = styled.div`
  display: grid; gap: 12px;
  grid-template-columns: repeat(4, 1fr);
  @media (max-width: 700px) { grid-template-columns: repeat(2, 1fr); }
`;
const Stat = styled.div`
  background: ${({ theme }) => theme.colors.cardSoft};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 14px; padding: 16px 18px;
  span { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: ${({ theme }) => theme.colors.textMuted}; font-weight: 600; }
  strong { display: block; margin-top: 6px; font-family: ${({ theme }) => theme.font.display}; font-size: 26px; font-weight: 700; line-height: 1; }
  small { font-size: 12px; color: ${({ theme }) => theme.colors.textDim}; margin-left: 4px; }
`;
const Filters = styled.div`
  display: grid; gap: 10px;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  @media (max-width: 800px) { grid-template-columns: 1fr 1fr; }
`;
const SearchWrap = styled.div`
  position: relative;
  svg { position: absolute; top: 50%; left: 14px; transform: translateY(-50%); color: ${({ theme }) => theme.colors.textDim}; pointer-events: none; }
`;
const List = styled.div` display: flex; flex-direction: column; gap: 10px; `;
const Item = styled.button`
  display: flex; gap: 16px; align-items: stretch; text-align: left; width: 100%;
  background: ${({ theme }) => theme.colors.cardSoft};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px; padding: 16px;
  transition: all .15s ease;
  &:hover { border-color: rgba(249,115,22,0.3); transform: translateX(2px); }
`;
const DateBox = styled.div`
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  width: 60px; flex-shrink: 0; padding: 8px;
  background: rgba(249,115,22,0.1); border-radius: 12px;
`;
const Mon = styled.div` font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: ${({ theme }) => theme.colors.primary}; font-weight: 700; `;
const Day = styled.div` font-family: ${({ theme }) => theme.font.display}; font-size: 22px; font-weight: 700; line-height: 1; margin-top: 2px; `;
const Main = styled.div` flex: 1; min-width: 0; `;
const Title = styled.div` font-weight: 600; font-size: 15px; `;
const Meta = styled.div` display: flex; gap: 6px; font-size: 12px; color: ${({ theme }) => theme.colors.textDim}; margin-top: 10px; flex-wrap: wrap; `;
const Empty = styled.div` text-align: center; color: ${({ theme }) => theme.colors.textMuted}; font-size: 14px; `;
