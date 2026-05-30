import { useMemo, useState } from 'react';
import styled from 'styled-components';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Select } from '../styles/ui';

export default function VolumeChart({ volumeByDay, templates }) {
  const types = useMemo(() => {
    const set = new Set(['all']);
    templates.forEach((t) => set.add(t.type || 'custom'));
    Object.values(volumeByDay).forEach((m) => Object.keys(m).forEach((k) => set.add(k)));
    return [...set];
  }, [volumeByDay, templates]);
  const [type, setType] = useState('all');

  const data = useMemo(() => {
    const out = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const k = d.toISOString().slice(0, 10);
      const dayMap = volumeByDay[k] || {};
      const v = type === 'all' ? Object.values(dayMap).reduce((a, b) => a + b, 0) : (dayMap[type] || 0);
      out.push({ day: d.toLocaleDateString(undefined, { weekday: 'short' }), volume: Math.round(v / 1000 * 10) / 10 });
    }
    return out;
  }, [volumeByDay, type]);

  return (
    <>
      <SelectWrap>
        <Select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="all">All workouts</option>
          {types.filter(t => t !== 'all').map((t) => <option key={t} value={t}>{t}</option>)}
        </Select>
      </SelectWrap>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="lg" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#f97316" /><stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis dataKey="day" tick={{ fill: '#9aa3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#9aa3b8', fontSize: 11 }} axisLine={false} tickLine={false} unit="t" />
          <Tooltip contentStyle={{ background: '#1a1d2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }} formatter={(v) => [`${v}t`, 'Volume']} />
          <Line type="monotone" dataKey="volume" stroke="url(#lg)" strokeWidth={3} dot={{ r: 3, fill: '#f97316' }} activeDot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
}

const SelectWrap = styled.div` max-width: 220px; margin-bottom: 14px; `;
