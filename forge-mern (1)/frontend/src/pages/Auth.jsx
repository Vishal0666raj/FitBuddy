import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import toast from 'react-hot-toast';
import { Dumbbell, Loader2 } from 'lucide-react';
import { login, register } from '../features/auth/authSlice';
import { Card, Button, Input, Label } from '../styles/ui';

export default function Auth() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const dispatch = useDispatch();
  const nav = useNavigate();
  const { token, status, error } = useSelector((s) => s.auth);

  useEffect(() => { if (token) nav('/dashboard', { replace: true }); }, [token, nav]);
  useEffect(() => { if (error) toast.error(error); }, [error]);

  async function submit(e) {
    e.preventDefault();

  console.log("SUBMIT FUNCTION CALLED");
    const action = mode === 'login' ? login(form) : register(form);
    const res = await dispatch(action);
    console.log(res);
    if (res.meta.requestStatus === 'fulfilled') toast.success(mode === 'login' ? 'Welcome back' : 'Account created');
  }

  return (
    <Wrap>
      <Inner>
        <Link to="/" style={{ display: 'flex', gap: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 28 }}>
          <Logo><Dumbbell size={20} /></Logo>
          <BrandText>FORGE</BrandText>
        </Link>
        <Card $pad="32px">
          <Switcher>
            {['login', 'signup'].map((m) => (
              <SwitchBtn key={m} $active={mode === m} type="button" onClick={() => setMode(m)}>
                {m === 'login' ? 'Sign in' : 'Sign up'}
              </SwitchBtn>
            ))}
          </Switcher>
          <Form onSubmit={submit}>
            {mode === 'signup' && (
              <div>
                <Label>Name</Label>
                <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Jane Doe" />
              </div>
            )}
            <div>
              <Label>Email</Label>
              <Input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
            </div>
            <div>
              <Label>Password</Label>
              <Input required type="password" minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" />
            </div>
            <Button $variant="primary" $full disabled={status === 'loading'}>
              {status === 'loading' && <Loader2 size={16} className="spin" />}
              {mode === 'login' ? 'Sign in' : 'Create account'}
            </Button>
          </Form>
        </Card>
      </Inner>
      <style>{`.spin{animation:spin 1s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </Wrap>
  );
}

const Wrap = styled.div` min-height: 100vh; display: grid; place-items: center; padding: 24px; `;
const Inner = styled.div` width: 100%; max-width: 420px; `;
const Logo = styled.div`
  width: 40px; height: 40px; border-radius: 12px;
  display: grid; place-items: center;
  background: ${({ theme }) => theme.gradient.primary};
  color: #0d0f1a; box-shadow: ${({ theme }) => theme.shadow.glow};
`;
const BrandText = styled.div` font-family: ${({ theme }) => theme.font.display}; font-weight: 700; font-size: 22px; `;
const Switcher = styled.div`
  display: flex; gap: 4px; padding: 4px;
  background: rgba(255,255,255,0.05); border-radius: 12px; margin-bottom: 22px;
`;
const SwitchBtn = styled.button`
  flex: 1; padding: 9px; border-radius: 9px; font-size: 13px; font-weight: 600;
  color: ${(p) => p.$active ? p.theme.colors.text : p.theme.colors.textMuted};
  background: ${(p) => p.$active ? p.theme.colors.card : 'transparent'};
  transition: all .15s ease;
`;
const Form = styled.form` display: flex; flex-direction: column; gap: 14px; `;
