import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import toast from 'react-hot-toast';
import { Check, Plus, Minus, Trash2, Save, ArrowLeft, Flag } from 'lucide-react';
import { fetchSession, updateSession, clearCurrent } from '../features/sessions/sessionsSlice';
import { Card, Button, Input, Label, Badge, Row, Gradient } from '../styles/ui';

export default function SessionDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const nav = useNavigate();
  const session = useSelector((s) => s.sessions.current);
  const [local, setLocal] = useState(null);

  useEffect(() => { dispatch(fetchSession(id)); return () => dispatch(clearCurrent()); }, [id, dispatch]);
  useEffect(() => { if (session && session._id === id) setLocal(JSON.parse(JSON.stringify(session))); }, [session, id]);

  if (!local) return <Loading>Loading…</Loading>;

  function patchSet(li, si, patch) {
    const next = { ...local, logs: local.logs.map((l, i) => i !== li ? l : { ...l, sets: l.sets.map((s, j) => j !== si ? s : { ...s, ...patch }) }) };
    setLocal(next);
  }
  function addSet(li) {
    const log = local.logs[li];
    const last = log.sets[log.sets.length - 1] || { reps: 10, weightKg: 0 };
    const next = { ...local, logs: local.logs.map((l, i) => i !== li ? l : { ...l, sets: [...l.sets, { reps: last.reps, weightKg: last.weightKg, completed: false }] }) };
    setLocal(next);
  }
  function removeSet(li, si) {
    const next = { ...local, logs: local.logs.map((l, i) => i !== li ? l : { ...l, sets: l.sets.filter((_, j) => j !== si) }) };
    setLocal(next);
  }

  async function save() {
    await dispatch(updateSession({ id, data: { logs: local.logs, notes: local.notes, durationMin: local.durationMin } }));
    toast.success('Saved');
  }

  async function finish() {
    await dispatch(updateSession({ id, data: { logs: local.logs, notes: local.notes, durationMin: local.durationMin, completed: true } }));
    toast.success('Workout completed');
    nav('/dashboard');
  }

  const totalVolume = local.logs.reduce((a, l) => a + l.sets.reduce((b, s) => b + (s.completed ? (s.reps || 0) * (s.weightKg || 0) : 0), 0), 0);
  const totalSets = local.logs.reduce((a, l) => a + l.sets.filter((s) => s.completed).length, 0);

  return (
    <Wrap>
      <TopBar>
        <Button $variant="ghost" $sm onClick={() => nav(-1)}><ArrowLeft size={14} /> Back</Button>
        <Row $gap="8px">
          <Button $variant="ghost" $sm onClick={save}><Save size={14} /> Save</Button>
          {!local.completed && <Button $variant="primary" $sm onClick={finish}><Flag size={14} /> Finish</Button>}
        </Row>
      </TopBar>

      <Head>
        <h1>{local.templateName || 'Workout'} {local.completed && <Gradient>· Done</Gradient>}</h1>
        <Row $gap="10px" $wrap style={{ marginTop: 10 }}>
          <Badge>{new Date(local.date).toLocaleDateString()}</Badge>
          <Badge $variant="primary">{Math.round(totalVolume / 1000 * 10) / 10}t volume</Badge>
          <Badge>{totalSets} sets done</Badge>
        </Row>
      </Head>

      <Logs>
        {local.logs.map((log, li) => (
          <Card key={li} $pad="20px">
            <LogHead>
              <div>
                <h3 style={{ fontSize: 17 }}>{log.exerciseName}</h3>
                <Muted>{log.muscleGroup}</Muted>
              </div>
              <Button $variant="ghost" $sm onClick={() => addSet(li)}><Plus size={14} /> Set</Button>
            </LogHead>
            <SetsHead>
              <span>#</span>
              <span>Weight (kg)</span>
              <span>Reps</span>
              <span></span>
              <span></span>
            </SetsHead>
            {log.sets.map((s, si) => (
              <SetRow key={si} $done={s.completed}>
                <Num>{si + 1}</Num>
                <Stepper>
                  <StepBtn onClick={() => patchSet(li, si, { weightKg: Math.max(0, (s.weightKg || 0) - 2.5) })}><Minus size={12} /></StepBtn>
                  <NumIn type="number" step="0.5" value={s.weightKg ?? ''} onChange={(e) => patchSet(li, si, { weightKg: +e.target.value || 0 })} />
                  <StepBtn onClick={() => patchSet(li, si, { weightKg: (s.weightKg || 0) + 2.5 })}><Plus size={12} /></StepBtn>
                </Stepper>
                <Stepper>
                  <StepBtn onClick={() => patchSet(li, si, { reps: Math.max(0, (s.reps || 0) - 1) })}><Minus size={12} /></StepBtn>
                  <NumIn type="number" value={s.reps ?? ''} onChange={(e) => patchSet(li, si, { reps: +e.target.value || 0 })} />
                  <StepBtn onClick={() => patchSet(li, si, { reps: (s.reps || 0) + 1 })}><Plus size={12} /></StepBtn>
                </Stepper>
                <DoneBtn $done={s.completed} onClick={() => patchSet(li, si, { completed: !s.completed })}>
                  <Check size={16} />
                </DoneBtn>
                <IconBtn onClick={() => removeSet(li, si)}><Trash2 size={14} /></IconBtn>
              </SetRow>
            ))}
          </Card>
        ))}
      </Logs>

      <Card $pad="20px">
        <Label>Notes</Label>
        <textarea
          value={local.notes || ''}
          onChange={(e) => setLocal({ ...local, notes: e.target.value })}
          placeholder="Felt strong on bench. Try +5kg next week."
          style={{ width: '100%', minHeight: 90, padding: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#f5f7fb', resize: 'vertical', fontFamily: 'inherit', fontSize: 14 }}
        />
        <Row $gap="10px" style={{ marginTop: 14 }}>
          <div style={{ flex: 1 }}>
            <Label>Duration (min)</Label>
            <Input type="number" value={local.durationMin || ''} onChange={(e) => setLocal({ ...local, durationMin: +e.target.value || null })} placeholder="45" />
          </div>
        </Row>
      </Card>
    </Wrap>
  );
}

const Wrap = styled.div` padding: 28px 24px; display: flex; flex-direction: column; gap: 18px; max-width: 900px; `;
const Loading = styled.div` padding: 60px; text-align: center; color: ${({ theme }) => theme.colors.textMuted}; `;
const TopBar = styled.div` display: flex; justify-content: space-between; `;
const Head = styled.div` h1 { font-size: clamp(26px, 4vw, 34px); } `;
const Muted = styled.div` font-size: 12px; color: ${({ theme }) => theme.colors.textMuted}; margin-top: 2px; `;
const Logs = styled.div` display: flex; flex-direction: column; gap: 14px; `;
const LogHead = styled.div` display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px; `;
const SetsHead = styled.div`
  display: grid; grid-template-columns: 30px 1fr 1fr 44px 32px; gap: 10px;
  font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em;
  color: ${({ theme }) => theme.colors.textDim};
  padding: 0 4px 8px; font-weight: 600;
`;
const SetRow = styled.div`
  display: grid; grid-template-columns: 30px 1fr 1fr 44px 32px; gap: 10px; align-items: center;
  padding: 8px 4px;
  border-radius: 10px;
  background: ${(p) => p.$done ? 'rgba(34,211,238,0.06)' : 'transparent'};
`;
const Num = styled.div` font-weight: 600; color: ${({ theme }) => theme.colors.textMuted}; font-size: 13px; text-align: center; `;
const Stepper = styled.div` display: flex; align-items: center; gap: 4px; `;
const StepBtn = styled.button`
  width: 28px; height: 32px; border-radius: 8px;
  background: rgba(255,255,255,0.05); color: ${({ theme }) => theme.colors.textMuted};
  display: grid; place-items: center;
  &:hover { background: rgba(255,255,255,0.1); color: ${({ theme }) => theme.colors.text}; }
`;
const NumIn = styled.input`
  flex: 1; min-width: 40px;
  background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08);
  color: ${({ theme }) => theme.colors.text};
  padding: 8px; border-radius: 8px; text-align: center; font-weight: 600;
  font-size: 14px;
  &:focus { outline: none; border-color: ${({ theme }) => theme.colors.primary}; }
`;
const DoneBtn = styled.button`
  width: 38px; height: 36px; border-radius: 10px;
  display: grid; place-items: center;
  background: ${(p) => p.$done ? p.theme.gradient.primary : 'rgba(255,255,255,0.05)'};
  color: ${(p) => p.$done ? '#0d0f1a' : p.theme.colors.textMuted};
  transition: all .15s ease;
  &:hover { transform: scale(1.05); }
`;
const IconBtn = styled.button`
  width: 30px; height: 30px; border-radius: 8px; display: grid; place-items: center;
  background: rgba(255,255,255,0.03); color: ${({ theme }) => theme.colors.textDim};
  &:hover { background: rgba(248,113,113,0.15); color: ${({ theme }) => theme.colors.danger}; }
`;
