import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import toast from 'react-hot-toast';
import { Plus, Trash2, Play, Edit2, X, Save } from 'lucide-react';
import { createTemplate, updateTemplate, deleteTemplate } from '../features/templates/templatesSlice';
import { startSession } from '../features/sessions/sessionsSlice';
import { Card, Button, Input, Label, Select, Badge, Row, Gradient } from '../styles/ui';

const TYPES = ['push', 'pull', 'legs', 'upper', 'lower', 'full', 'cardio', 'custom'];
const MUSCLES = ['chest', 'back', 'shoulders', 'biceps', 'triceps', 'legs', 'core', 'cardio', 'other'];

export default function Templates() {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const templates = useSelector((s) => s.templates.items);
  const [editing, setEditing] = useState(null);

  function newTemplate() {
    setEditing({ name: '', type: 'push', exercises: [{ name: '', muscleGroup: 'chest', defaultSets: 3, defaultReps: 10 }] });
  }

  async function save() {
    if (!editing.name.trim()) { toast.error('Name required'); return; }
    if (editing._id) await dispatch(updateTemplate({ id: editing._id, data: editing }));
    else await dispatch(createTemplate(editing));
    setEditing(null);
    toast.success('Template saved');
  }

  async function remove(id) {
    if (!confirm('Delete this template?')) return;
    await dispatch(deleteTemplate(id));
    toast.success('Deleted');
  }

  async function start(t) {
    const r = await dispatch(startSession(t._id));
    if (r.payload?._id) nav(`/sessions/${r.payload._id}`);
  }

  return (
    <Wrap>
      <Header>
        <div>
          <h1>Workout <Gradient>templates</Gradient></h1>
          <Sub>Build once. Reuse forever. Push, Pull, Legs — your call.</Sub>
        </div>
        <Button $variant="primary" onClick={newTemplate}><Plus size={16} /> New template</Button>
      </Header>

      {templates.length === 0 && !editing && (
        <Card $pad="48px">
          <EmptyTitle>No templates yet.</EmptyTitle>
          <EmptyBody>Templates are reusable workout routines. Create one for each training day.</EmptyBody>
          <Button $variant="primary" onClick={newTemplate} style={{ marginTop: 16 }}><Plus size={16} /> Create your first</Button>
        </Card>
      )}

      <Grid>
        {templates.map((t) => (
          <Card key={t._id} $pad="22px">
            <Row $justify="space-between" $align="flex-start">
              <div>
                <h3 style={{ fontSize: 18, marginBottom: 6 }}>{t.name}</h3>
                <Badge>{t.type}</Badge>
              </div>
              <Row $gap="6px">
                <IconBtn onClick={() => setEditing(t)} title="Edit"><Edit2 size={14} /></IconBtn>
                <IconBtn onClick={() => remove(t._id)} title="Delete"><Trash2 size={14} /></IconBtn>
              </Row>
            </Row>
            <ExList>
              {t.exercises.slice(0, 5).map((e) => (
                <ExItem key={e._id || e.name}>
                  <span>{e.name}</span>
                  <span style={{ color: '#9aa3b8', fontSize: 12 }}>{e.defaultSets}×{e.defaultReps}</span>
                </ExItem>
              ))}
              {t.exercises.length > 5 && <ExMuted>+{t.exercises.length - 5} more</ExMuted>}
            </ExList>
            <Button $variant="primary" $full onClick={() => start(t)} style={{ marginTop: 14 }}><Play size={14} /> Start workout</Button>
          </Card>
        ))}
      </Grid>

      {editing && (
        <Overlay onClick={(e) => e.target === e.currentTarget && setEditing(null)}>
          <Modal>
            <ModalHead>
              <h2>{editing._id ? 'Edit template' : 'New template'}</h2>
              <IconBtn onClick={() => setEditing(null)}><X size={16} /></IconBtn>
            </ModalHead>
            <ModalBody>
              <Row $gap="12px" $wrap>
                <div style={{ flex: 2, minWidth: 200 }}>
                  <Label>Name</Label>
                  <Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} placeholder="Push Day A" />
                </div>
                <div style={{ flex: 1, minWidth: 140 }}>
                  <Label>Type</Label>
                  <Select value={editing.type} onChange={(e) => setEditing({ ...editing, type: e.target.value })}>
                    {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </Select>
                </div>
              </Row>

              <div style={{ marginTop: 24 }}>
                <Row $justify="space-between" style={{ marginBottom: 10 }}>
                  <Label style={{ marginBottom: 0 }}>Exercises</Label>
                  <Button $variant="ghost" $sm onClick={() => setEditing({ ...editing, exercises: [...editing.exercises, { name: '', muscleGroup: 'other', defaultSets: 3, defaultReps: 10 }] })}>
                    <Plus size={14} /> Add exercise
                  </Button>
                </Row>
                <ExEditor>
                  {editing.exercises.map((ex, i) => (
                    <ExRow key={i}>
                      <Input placeholder="Exercise name" value={ex.name} onChange={(e) => {
                        const next = [...editing.exercises]; next[i] = { ...ex, name: e.target.value };
                        setEditing({ ...editing, exercises: next });
                      }} />
                      <Select value={ex.muscleGroup} onChange={(e) => {
                        const next = [...editing.exercises]; next[i] = { ...ex, muscleGroup: e.target.value };
                        setEditing({ ...editing, exercises: next });
                      }}>{MUSCLES.map((m) => <option key={m} value={m}>{m}</option>)}</Select>
                      <NumInput type="number" min="1" value={ex.defaultSets} onChange={(e) => {
                        const next = [...editing.exercises]; next[i] = { ...ex, defaultSets: +e.target.value };
                        setEditing({ ...editing, exercises: next });
                      }} />
                      <NumInput type="number" min="1" value={ex.defaultReps} onChange={(e) => {
                        const next = [...editing.exercises]; next[i] = { ...ex, defaultReps: +e.target.value };
                        setEditing({ ...editing, exercises: next });
                      }} />
                      <IconBtn onClick={() => setEditing({ ...editing, exercises: editing.exercises.filter((_, j) => j !== i) })}>
                        <Trash2 size={14} />
                      </IconBtn>
                    </ExRow>
                  ))}
                </ExEditor>
              </div>
            </ModalBody>
            <ModalFoot>
              <Button $variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
              <Button $variant="primary" onClick={save}><Save size={14} /> Save template</Button>
            </ModalFoot>
          </Modal>
        </Overlay>
      )}
    </Wrap>
  );
}

const Wrap = styled.div` padding: 28px 24px; display: flex; flex-direction: column; gap: 22px; max-width: 1200px; `;
const Header = styled.div`
  display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap;
  h1 { font-size: clamp(28px, 4vw, 36px); }
`;
const Sub = styled.div` color: ${({ theme }) => theme.colors.textMuted}; font-size: 14px; margin-top: 4px; `;
const Grid = styled.div`
  display: grid; gap: 18px;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
`;
const ExList = styled.div` display: flex; flex-direction: column; gap: 6px; margin-top: 14px; `;
const ExItem = styled.div` display: flex; justify-content: space-between; font-size: 13px; padding: 6px 0; border-bottom: 1px solid rgba(255,255,255,0.04); `;
const ExMuted = styled.div` font-size: 12px; color: ${({ theme }) => theme.colors.textDim}; padding-top: 4px; `;
const IconBtn = styled.button`
  display: grid; place-items: center;
  width: 32px; height: 32px; border-radius: 10px;
  background: rgba(255,255,255,0.05); color: ${({ theme }) => theme.colors.textMuted};
  transition: all .15s ease;
  &:hover { background: rgba(255,255,255,0.1); color: ${({ theme }) => theme.colors.text}; }
`;
const EmptyTitle = styled.h3` font-size: 18px; text-align: center; `;
const EmptyBody = styled.p` color: ${({ theme }) => theme.colors.textMuted}; text-align: center; margin-top: 8px; font-size: 14px; `;
const Overlay = styled.div`
  position: fixed; inset: 0; background: rgba(5,7,15,0.7);
  backdrop-filter: blur(6px); display: grid; place-items: center;
  z-index: 100; padding: 20px;
`;
const Modal = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 20px;
  width: 100%; max-width: 760px;
  max-height: 90vh; display: flex; flex-direction: column;
  box-shadow: 0 20px 60px rgba(0,0,0,0.6);
`;
const ModalHead = styled.div` display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid ${({ theme }) => theme.colors.border}; h2 { font-size: 18px; } `;
const ModalBody = styled.div` padding: 24px; overflow-y: auto; `;
const ModalFoot = styled.div` display: flex; gap: 10px; justify-content: flex-end; padding: 16px 24px; border-top: 1px solid ${({ theme }) => theme.colors.border}; `;
const ExEditor = styled.div` display: flex; flex-direction: column; gap: 8px; `;
const ExRow = styled.div`
  display: grid; gap: 8px; align-items: center;
  grid-template-columns: 2fr 1fr 70px 70px 36px;
  @media (max-width: 640px) { grid-template-columns: 1fr 1fr; > :nth-child(5) { grid-column: 2; justify-self: end; } }
`;
const NumInput = styled(Input)` padding: 11px 8px; text-align: center; `;
