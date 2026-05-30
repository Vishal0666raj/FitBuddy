import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import toast from 'react-hot-toast';
import { LogOut, Save } from 'lucide-react';
import { getProfile, updateProfile } from '../features/profile/profileSlice';
import { logout } from '../features/auth/authSlice';
import { Card, Button, Input, Label, Select, Badge, Row, Gradient } from '../styles/ui';
import { calcBMI, bmiCategory } from '../utils/fitness';

export default function Profile() {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const user = useSelector((s) => s.auth.user);
  const profile = useSelector((s) => s.profile.data);
  const [form, setForm] = useState({ name: '', age: '', gender: '', heightCm: '', weightKg: '', dailyWaterGoalMl: 2500 });

  useEffect(() => { dispatch(getProfile()); }, [dispatch]);
  useEffect(() => {
    if (profile) setForm({
      name: profile.name || '', age: profile.age || '', gender: profile.gender || '',
      heightCm: profile.heightCm || '', weightKg: profile.weightKg || '',
      dailyWaterGoalMl: profile.dailyWaterGoalMl || 2500,
    });
  }, [profile]);

  async function save() {
    await dispatch(updateProfile({
      ...form,
      age: form.age ? +form.age : undefined,
      heightCm: form.heightCm ? +form.heightCm : undefined,
      weightKg: form.weightKg ? +form.weightKg : undefined,
      dailyWaterGoalMl: +form.dailyWaterGoalMl,
    }));
    toast.success('Profile saved');
  }

  const bmi = calcBMI(+form.weightKg, +form.heightCm);

  return (
    <Wrap>
      <Head>
        <h1>Your <Gradient>profile</Gradient></h1>
        <Sub>{user?.email}</Sub>
      </Head>

      <Card $pad="28px">
        <Section>
          <Label>Name</Label>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </Section>
        <Row $gap="14px" $wrap>
          <Section style={{ flex: 1, minWidth: 120 }}>
            <Label>Age</Label>
            <Input type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
          </Section>
          <Section style={{ flex: 1, minWidth: 120 }}>
            <Label>Gender</Label>
            <Select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
              <option value="">—</option><option>Male</option><option>Female</option><option>Other</option>
            </Select>
          </Section>
        </Row>
        <Row $gap="14px" $wrap>
          <Section style={{ flex: 1, minWidth: 120 }}>
            <Label>Height (cm)</Label>
            <Input type="number" value={form.heightCm} onChange={(e) => setForm({ ...form, heightCm: e.target.value })} />
          </Section>
          <Section style={{ flex: 1, minWidth: 120 }}>
            <Label>Weight (kg)</Label>
            <Input type="number" step="0.1" value={form.weightKg} onChange={(e) => setForm({ ...form, weightKg: e.target.value })} />
          </Section>
        </Row>
        <Section>
          <Label>Daily water goal (ml)</Label>
          <Input type="number" step="100" value={form.dailyWaterGoalMl} onChange={(e) => setForm({ ...form, dailyWaterGoalMl: e.target.value })} />
        </Section>

        {bmi != null && (
          <BMIBox>
            <div>
              <Label style={{ margin: 0 }}>BMI</Label>
              <BMIVal>{bmi}</BMIVal>
            </div>
            <Badge $variant="primary">{bmiCategory(bmi)}</Badge>
          </BMIBox>
        )}

        <Row $gap="10px" style={{ marginTop: 22 }}>
          <Button $variant="primary" onClick={save}><Save size={14} /> Save profile</Button>
          <Button $variant="outline" onClick={() => { dispatch(logout()); nav('/'); }}><LogOut size={14} /> Sign out</Button>
        </Row>
      </Card>
    </Wrap>
  );
}

const Wrap = styled.div` padding: 28px 24px; display: flex; flex-direction: column; gap: 20px; max-width: 700px; `;
const Head = styled.div` h1 { font-size: clamp(28px, 4vw, 36px); } `;
const Sub = styled.div` color: ${({ theme }) => theme.colors.textMuted}; font-size: 14px; margin-top: 4px; `;
const Section = styled.div` margin-bottom: 16px; `;
const BMIBox = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 20px; margin-top: 8px;
  background: rgba(249,115,22,0.08);
  border: 1px solid rgba(249,115,22,0.2);
  border-radius: 14px;
`;
const BMIVal = styled.div` font-family: ${({ theme }) => theme.font.display}; font-size: 28px; font-weight: 700; margin-top: 4px; line-height: 1; `;
