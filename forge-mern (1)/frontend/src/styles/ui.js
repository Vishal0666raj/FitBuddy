import styled, { css } from 'styled-components';

export const Container = styled.div`
  max-width: ${(p) => p.$max || '1180px'};
  margin: 0 auto;
  padding: 0 24px;
`;

export const Glass = styled.div`
  background: ${({ theme }) => theme.colors.cardSoft};
  backdrop-filter: blur(20px) saturate(140%);
  -webkit-backdrop-filter: blur(20px) saturate(140%);
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.xl};
  box-shadow: ${({ theme }) => theme.shadow.glass};
`;

export const Card = styled(Glass)`
  padding: ${(p) => p.$pad || '24px'};
`;

const variants = {
  primary: css`
    background: ${({ theme }) => theme.gradient.primary};
    color: #0d0f1a;
    box-shadow: ${({ theme }) => theme.shadow.glow};
    &:hover { filter: brightness(1.05); }
  `,
  ghost: css`
    background: ${({ theme }) => theme.colors.input};
    color: ${({ theme }) => theme.colors.text};
    border: 1px solid ${({ theme }) => theme.colors.border};
    &:hover { background: rgba(255,255,255,0.08); }
  `,
  outline: css`
    background: transparent;
    border: 1px solid ${({ theme }) => theme.colors.borderStrong};
    color: ${({ theme }) => theme.colors.text};
    &:hover { background: rgba(255,255,255,0.04); }
  `,
  danger: css`
    background: rgba(248,113,113,0.12);
    color: ${({ theme }) => theme.colors.danger};
    border: 1px solid rgba(248,113,113,0.3);
    &:hover { background: rgba(248,113,113,0.2); }
  `,
};

export const Button = styled.button`
  display: inline-flex; align-items: center; justify-content: center;
  gap: 8px; padding: ${(p) => p.$sm ? '8px 14px' : '11px 20px'};
  border-radius: ${({ theme }) => theme.radius.md};
  font-weight: 600; font-size: ${(p) => p.$sm ? '13px' : '14px'};
  transition: all .15s ease;
  white-space: nowrap;
  ${(p) => variants[p.$variant || 'ghost']}
  &:disabled { opacity: .5; cursor: not-allowed; }
  ${(p) => p.$full && 'width: 100%;'}
`;

export const Input = styled.input`
  width: 100%;
  padding: 11px 14px;
  background: ${({ theme }) => theme.colors.input};
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 14px;
  transition: border-color .15s ease, background .15s ease;
  &:focus { outline: none; border-color: ${({ theme }) => theme.colors.primary}; background: rgba(255,255,255,0.08); }
  &::placeholder { color: ${({ theme }) => theme.colors.textDim}; }
`;

export const Select = styled.select`
  width: 100%;
  padding: 11px 14px;
  background: ${({ theme }) => theme.colors.input};
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 14px;
  appearance: none;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239aa3b8' stroke-width='2'><polyline points='6 9 12 15 18 9'/></svg>");
  background-repeat: no-repeat;
  background-position: right 14px center;
  padding-right: 36px;
  &:focus { outline: none; border-color: ${({ theme }) => theme.colors.primary}; }
  option { background: #1a1d2e; color: #f5f7fb; }
`;

export const Label = styled.label`
  display: block;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 6px;
`;

export const Badge = styled.span`
  display: inline-flex; align-items: center; gap: 6px;
  padding: 4px 10px;
  border-radius: 999px;
  background: ${(p) => p.$variant === 'primary' ? p.theme.gradient.primary : p.theme.colors.input};
  color: ${(p) => p.$variant === 'primary' ? '#0d0f1a' : p.theme.colors.textMuted};
  font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em;
`;

export const Gradient = styled.span`
  background: ${({ theme }) => theme.gradient.primary};
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

export const Grid = styled.div`
  display: grid;
  gap: ${(p) => p.$gap || '20px'};
  grid-template-columns: repeat(${(p) => p.$cols || 1}, minmax(0, 1fr));
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

export const Row = styled.div`
  display: flex;
  align-items: ${(p) => p.$align || 'center'};
  justify-content: ${(p) => p.$justify || 'flex-start'};
  gap: ${(p) => p.$gap || '12px'};
  flex-wrap: ${(p) => p.$wrap ? 'wrap' : 'nowrap'};
`;
