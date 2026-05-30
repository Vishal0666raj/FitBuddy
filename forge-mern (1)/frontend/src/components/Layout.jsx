import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Dumbbell, LayoutDashboard, ClipboardList, CalendarDays, History, User } from 'lucide-react';
import { fetchTemplates } from '../features/templates/templatesSlice';
import { fetchSchedule } from '../features/schedule/scheduleSlice';
import { fetchWater } from '../features/water/waterSlice';
import { fetchStats } from '../features/stats/statsSlice';
import { fetchSessions } from '../features/sessions/sessionsSlice';
import { getProfile } from '../features/profile/profileSlice';

const links = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/templates', icon: ClipboardList, label: 'Templates' },
  { to: '/schedule', icon: CalendarDays, label: 'Schedule' },
  { to: '/history', icon: History, label: 'History' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export default function Layout() {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);
  useEffect(() => {
    dispatch(getProfile());
    dispatch(fetchTemplates());
    dispatch(fetchSchedule());
    dispatch(fetchWater());
    dispatch(fetchStats(120));
    dispatch(fetchSessions({ limit: 50 }));
  }, [dispatch]);

  return (
    <Shell>
      <Sidebar>
        <Brand>
          <BrandLogo><Dumbbell size={18} /></BrandLogo>
          <BrandText>FITBuddy</BrandText>
        </Brand>
        <Nav>
          {links.map((l) => (
            <NavItem key={l.to} to={l.to}>
              <l.icon size={18} />
              <span>{l.label}</span>
            </NavItem>
          ))}
        </Nav>
        <UserCard>
          <Avatar>{user?.name?.[0] || '?'}</Avatar>
          <div style={{ minWidth: 0 }}>
            <Name>{user?.name || 'Athlete'}</Name>
            <Email>{user?.email}</Email>
          </div>
        </UserCard>
      </Sidebar>
      <Main>
        <Outlet />
      </Main>
      <MobileNav>
        {links.map((l) => (
          <MobileNavItem key={l.to} to={l.to}>
            <l.icon size={20} />
            <span>{l.label}</span>
          </MobileNavItem>
        ))}
      </MobileNav>
    </Shell>
  );
}

const Shell = styled.div`
  display: grid;
  grid-template-columns: 248px 1fr;
  min-height: 100vh;
  @media (max-width: 900px) { grid-template-columns: 1fr; }
`;
const Sidebar = styled.aside`
  position: sticky; top: 0; align-self: start;
  height: 100vh; padding: 24px 18px;
  display: flex; flex-direction: column; gap: 18px;
  background: rgba(13,15,26,0.7);
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  backdrop-filter: blur(20px);
  @media (max-width: 900px) { display: none; }
`;
const Brand = styled.div` display: flex; align-items: center; gap: 10px; padding: 4px 8px; `;
const BrandLogo = styled.div`
  width: 36px; height: 36px; border-radius: 12px;
  display: grid; place-items: center;
  background: ${({ theme }) => theme.gradient.primary};
  color: #0d0f1a; box-shadow: ${({ theme }) => theme.shadow.glow};
`;
const BrandText = styled.div` font-family: ${({ theme }) => theme.font.display}; font-weight: 700; letter-spacing: 0.02em; `;
const Nav = styled.nav` display: flex; flex-direction: column; gap: 4px; margin-top: 8px; `;
const NavItem = styled(NavLink)`
  display: flex; align-items: center; gap: 12px;
  padding: 10px 12px; border-radius: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px; font-weight: 500;
  transition: all .15s ease;
  &:hover { background: rgba(255,255,255,0.04); color: ${({ theme }) => theme.colors.text}; }
  &.active {
    background: rgba(249,115,22,0.12);
    color: ${({ theme }) => theme.colors.primary};
    border: 1px solid rgba(249,115,22,0.2);
  }
`;
const UserCard = styled.div`
  margin-top: auto;
  display: flex; align-items: center; gap: 10px;
  padding: 10px; border-radius: 14px;
  background: rgba(255,255,255,0.04);
  border: 1px solid ${({ theme }) => theme.colors.border};
`;
const Avatar = styled.div`
  width: 36px; height: 36px; border-radius: 12px; flex-shrink: 0;
  background: ${({ theme }) => theme.gradient.primary};
  color: #0d0f1a; display: grid; place-items: center; font-weight: 700;
`;
const Name = styled.div` font-size: 13px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; `;
const Email = styled.div` font-size: 11px; color: ${({ theme }) => theme.colors.textDim}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; `;
const Main = styled.main` min-width: 0; padding-bottom: 80px; `;
const MobileNav = styled.nav`
  display: none;
  @media (max-width: 900px) {
    display: grid; grid-template-columns: repeat(5, 1fr);
    position: fixed; bottom: 0; left: 0; right: 0;
    background: rgba(13,15,26,0.85);
    backdrop-filter: blur(20px);
    border-top: 1px solid ${({ theme }) => theme.colors.border};
    padding: 8px 4px env(safe-area-inset-bottom);
    z-index: 50;
  }
`;
const MobileNavItem = styled(NavLink)`
  display: flex; flex-direction: column; align-items: center; gap: 4px;
  padding: 8px 4px; border-radius: 10px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 10px; font-weight: 500;
  &.active { color: ${({ theme }) => theme.colors.primary}; }
`;
