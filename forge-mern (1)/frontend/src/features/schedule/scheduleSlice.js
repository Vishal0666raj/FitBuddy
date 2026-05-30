import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/client';

export const fetchSchedule = createAsyncThunk('schedule/fetch', async () => (await api.get('/schedule')).data);
export const setSchedule = createAsyncThunk('schedule/set', async ({ dayOfWeek, templateId }) => (await api.put('/schedule', { dayOfWeek, templateId })).data);

const slice = createSlice({
  name: 'schedule',
  initialState: { items: [] },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchSchedule.fulfilled, (s, a) => { s.items = a.payload; });
    b.addCase(setSchedule.fulfilled, () => { /* refetch on caller */ });
  },
});
export default slice.reducer;
