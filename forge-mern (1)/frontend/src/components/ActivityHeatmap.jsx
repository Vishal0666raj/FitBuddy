import styled from 'styled-components';
import { useMemo } from 'react';

const WEEKS = 17;
const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

export default function ActivityHeatmap({ heat }) {
  const grid = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Anchor: most recent Saturday so the columns line up cleanly
    const end = new Date(today);
    end.setDate(end.getDate() + (6 - today.getDay()));
    const days = WEEKS * 7;
    const start = new Date(end);
    start.setDate(end.getDate() - days + 1);
    const cells = [];
    for (let i = 0; i < days; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const key =
  d.getFullYear() +
  '-' +
  String(d.getMonth() + 1).padStart(2, '0') +
  '-' +
  String(d.getDate()).padStart(2, '0');
      const v = heat[key] || 0;
      cells.push({ date: d, key, value: v, future: d > today });
    }
    return cells;
  }, [heat]);

  function level(v) {
    if (v <= 0) return 0;
    if (v === 1) return 1;
    if (v === 2) return 2;
    if (v === 3) return 3;
    return 4;
  }

  return (
    <Wrap>
      <DayCol>
        {DAY_LABELS.map((l, i) => <DayLabel key={i}>{l}</DayLabel>)}
      </DayCol>
      <Grid>
        {Array.from({ length: WEEKS }).map((_, w) => (
          <Col key={w}>
            {Array.from({ length: 7 }).map((__, d) => {
              const cell = grid[w * 7 + d];
              if (!cell) return <Cell key={d} $level={0} />;
              return <Cell key={d} $level={cell.future ? -1 : level(cell.value)} title={`${cell.key} · ${cell.value} workout${cell.value !== 1 ? 's' : ''}`} />;
            })}
          </Col>
        ))}
      </Grid>
      <Legend>
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((l) => <Cell key={l} $level={l} $static />)}
        <span>More</span>
      </Legend>
    </Wrap>
  );
}

const Wrap = styled.div` display: flex; gap: 8px; align-items: flex-start; overflow-x: auto; padding-bottom: 8px; `;
const DayCol = styled.div` display: flex; flex-direction: column; gap: 4px; padding-top: 2px; `;
const DayLabel = styled.div` height: 14px; font-size: 10px; color: ${({ theme }) => theme.colors.textDim}; `;
const Grid = styled.div` display: flex; gap: 4px; `;
const Col = styled.div` display: flex; flex-direction: column; gap: 4px; `;
const colorFor = (l) => {
  if (l === -1) return 'rgba(255,255,255,0.02)';
  if (l === 0) return 'rgba(255,255,255,0.05)';
  if (l === 1) return 'rgba(249,115,22,0.25)';
  if (l === 2) return 'rgba(249,115,22,0.45)';
  if (l === 3) return 'rgba(249,115,22,0.7)';
  return '#f97316';
};
const Cell = styled.div`
  width: 14px; height: 14px; border-radius: 3px;
  background: ${(p) => colorFor(p.$level)};
  flex-shrink: 0;
  ${(p) => !p.$static && `cursor: default; transition: transform .1s; &:hover { transform: scale(1.3); }`}
`;
const Legend = styled.div`
  display: flex; align-items: center; gap: 6px;
  margin-left: auto; padding-top: 4px;
  font-size: 11px; color: ${({ theme }) => theme.colors.textDim};
`;
