import { createGlobalStyle } from 'styled-components';

export const theme = {
  colors: {
    bg: '#0d0f1a',
    bgElevated: '#141728',
    card: '#1a1d2e',
    cardSoft: 'rgba(26, 29, 46, 0.7)',
    border: 'rgba(255,255,255,0.08)',
    borderStrong: 'rgba(255,255,255,0.14)',
    text: '#f5f7fb',
    textMuted: '#9aa3b8',
    textDim: '#6b7390',
    primary: '#f97316',           // ember orange
    primaryGlow: '#fb923c',
    accent: '#22d3ee',             // aqua
    success: '#34d399',
    danger: '#f87171',
    warning: '#fbbf24',
    input: 'rgba(255,255,255,0.05)',
  },
  radius: { sm: '8px', md: '12px', lg: '16px', xl: '22px' },
  font: {
    display: "'Space Grotesk', system-ui, sans-serif",
    body: "'Inter', system-ui, sans-serif",
  },
  shadow: {
    glow: '0 10px 40px -10px rgba(249,115,22,0.55)',
    glass: '0 8px 32px rgba(0,0,0,0.45)',
    card: '0 4px 24px rgba(0,0,0,0.35)',
  },
  gradient: {
    primary: 'linear-gradient(135deg, #f97316 0%, #fb923c 60%, #ef4444 100%)',
    accent: 'linear-gradient(135deg, #22d3ee 0%, #6366f1 100%)',
    hero: `radial-gradient(ellipse at top left, rgba(249,115,22,0.22), transparent 55%),
           radial-gradient(ellipse at bottom right, rgba(34,211,238,0.18), transparent 55%)`,
  },
  breakpoint: { sm: '640px', md: '768px', lg: '1024px', xl: '1280px' },
};

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; }
  html, body, #root { height: 100%; margin: 0; }
  body {
    background: ${({ theme }) => theme.colors.bg};
    background-image: ${({ theme }) => theme.gradient.hero};
    background-attachment: fixed;
    color: ${({ theme }) => theme.colors.text};
    font-family: ${({ theme }) => theme.font.body};
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }
  h1, h2, h3, h4, h5 { font-family: ${({ theme }) => theme.font.display}; letter-spacing: -0.02em; margin: 0; }
  a { color: inherit; text-decoration: none; }
  button { font-family: inherit; cursor: pointer; border: none; background: none; color: inherit; }
  input, select, textarea { font-family: inherit; }
  ::-webkit-scrollbar { width: 10px; height: 10px; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 8px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.16); }
`;
