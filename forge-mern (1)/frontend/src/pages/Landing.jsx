import { Link, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { Dumbbell, Flame, LineChart, Droplets, ArrowRight } from 'lucide-react';
import { Container, Card, Button, Gradient, Badge } from '../styles/ui';

export default function Landing() {
  const token = useSelector((s) => s.auth.token);
  if (token) return <Navigate to="/dashboard" replace />;
  return (
    <>
      <Header>
        <Container>
          <Row>
            <Brand>
              <Logo><Dumbbell size={20} /></Logo>
              <span>FORGE</span>
            </Brand>
            <Link to="/auth"><Button $variant="ghost" $sm>Sign in</Button></Link>
          </Row>
        </Container>
      </Header>
      <Hero>
        <Container>
          <Badge><Pulse />Built for the gym floor</Badge>
          <h1>Your workout, <Gradient>command center</Gradient>.</h1>
          <p>Log sets in two taps. Track every PR. See your progress in graphs that don't lie. One app, every rep.</p>
          <CTAs>
            <Link to="/auth"><Button $variant="primary">Start training free <ArrowRight size={16} /></Button></Link>
            <a href="#features"><Button $variant="outline">See features</Button></a>
          </CTAs>
        </Container>
      </Hero>
      <Features id="features">
        <Container>
          <Grid>
            {[
              { icon: Dumbbell, title: 'Templates', body: 'Push, Pull, Legs — build once, reuse forever.' },
              { icon: Flame, title: 'Live Logging', body: 'Big buttons, zero typing. Designed for sweaty hands.' },
              { icon: LineChart, title: 'Analytics', body: "Volume, PRs, streaks — see what's actually working." },
              { icon: Droplets, title: 'Hydration', body: 'Daily water goals and hourly reminders, baked in.' },
            ].map((f) => (
              <Card key={f.title} $pad="24px">
                <FIcon><f.icon size={20} /></FIcon>
                <h3 style={{ marginTop: 16, fontSize: 18 }}>{f.title}</h3>
                <p style={{ color: 'var(--muted)', marginTop: 6, fontSize: 14, opacity: 0.7 }}>{f.body}</p>
              </Card>
            ))}
          </Grid>
        </Container>
      </Features>
    </>
  );
}

const Header = styled.header` padding: 24px 0; `;
const Row = styled.div` display: flex; align-items: center; justify-content: space-between; `;
const Brand = styled.div`
  display: flex; align-items: center; gap: 10px;
  font-family: ${({ theme }) => theme.font.display};
  font-weight: 700; letter-spacing: 0.02em;
`;
const Logo = styled.div`
  width: 36px; height: 36px; border-radius: 12px;
  display: grid; place-items: center;
  background: ${({ theme }) => theme.gradient.primary};
  color: #0d0f1a; box-shadow: ${({ theme }) => theme.shadow.glow};
`;
const Hero = styled.section`
  padding: 80px 0 60px; text-align: center;
  h1 { font-size: clamp(40px, 7vw, 84px); font-weight: 700; margin: 24px auto 20px; max-width: 900px; line-height: 1.05; }
  p { max-width: 620px; margin: 0 auto; font-size: 18px; color: ${({ theme }) => theme.colors.textMuted}; line-height: 1.6; }
`;
const CTAs = styled.div` display: flex; gap: 12px; justify-content: center; margin-top: 36px; flex-wrap: wrap; `;
const Features = styled.section` padding: 80px 0 120px; `;
const Grid = styled.div`
  display: grid; gap: 18px;
  grid-template-columns: repeat(4, 1fr);
  @media (max-width: 900px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 540px) { grid-template-columns: 1fr; }
`;
const FIcon = styled.div`
  width: 44px; height: 44px; border-radius: 12px;
  display: grid; place-items: center;
  background: ${({ theme }) => theme.gradient.primary};
  color: #0d0f1a; box-shadow: ${({ theme }) => theme.shadow.glow};
`;
const Pulse = styled.span`
  width: 7px; height: 7px; border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  animation: pulse 1.6s ease-in-out infinite;
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
`;
