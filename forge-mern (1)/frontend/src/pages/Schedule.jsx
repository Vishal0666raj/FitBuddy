import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import toast from 'react-hot-toast';
import { setSchedule, fetchSchedule } from '../features/schedule/scheduleSlice';
import { Card, Select, Gradient, Badge } from '../styles/ui';
import { DAYS_LONG } from '../utils/fitness';

export default function Schedule() {
  const dispatch = useDispatch();
  const templates = useSelector((s) => s.templates.items);
  const schedule = useSelector((s) => s.schedule.items);
  const todayDow = new Date().getDay();

  async function set(dow, templateId) {
    await dispatch(setSchedule({ dayOfWeek: dow, templateId: templateId || null }));
    dispatch(fetchSchedule());
    toast.success('Schedule updated');
  }

  return (
    <Wrap>
      <Head>
        <h1>Weekly <Gradient>schedule</Gradient></h1>
        <Sub>Assign templates to any day. Change anytime.</Sub>
      </Head>
      <Card $pad="20px">
        <List>
          {DAYS_LONG.map((name, dow) => {
            const current = schedule.find((s) => s.dayOfWeek === dow);
            const isToday = dow === todayDow;
            return (
              <Row key={dow} $today={isToday}>
                <DayInfo>
                  <DayName>{name}</DayName>
                  {isToday && <Badge $variant="primary">Today</Badge>}
                </DayInfo>
                <Select value={current?.template?._id || ''} onChange={(e) => set(dow, e.target.value || null)} style={{ maxWidth: 320 }}>
                  <option value="">Rest day</option>
                  {templates.map((t) => <option key={t._id} value={t._id}>{t.name}</option>)}
                </Select>
              </Row>
            );
          })}
        </List>
        {templates.length === 0 && <Empty>Create templates first to assign them here.</Empty>}
      </Card>
    </Wrap>
  );
}

const Wrap = styled.div` padding: 28px 24px; display: flex; flex-direction: column; gap: 22px; max-width: 800px; `;
const Head = styled.div` h1 { font-size: clamp(28px, 4vw, 36px); } `;
const Sub = styled.div` color: ${({ theme }) => theme.colors.textMuted}; font-size: 14px; margin-top: 4px; `;
const List = styled.div` display: flex; flex-direction: column; gap: 8px; `;
const Row = styled.div`
  display: flex; align-items: center; gap: 16px;
  padding: 14px 16px; border-radius: 14px;
  background: ${(p) => p.$today ? 'rgba(249,115,22,0.08)' : 'rgba(255,255,255,0.03)'};
  border: 1px solid ${(p) => p.$today ? 'rgba(249,115,22,0.2)' : 'transparent'};
  @media (max-width: 600px) { flex-wrap: wrap; }
`;
const DayInfo = styled.div` display: flex; align-items: center; gap: 10px; flex: 1; min-width: 120px; `;
const DayName = styled.div` font-weight: 600; font-size: 15px; `;
const Empty = styled.div` color: ${({ theme }) => theme.colors.textMuted}; font-size: 14px; padding: 16px 0; text-align: center; `;
