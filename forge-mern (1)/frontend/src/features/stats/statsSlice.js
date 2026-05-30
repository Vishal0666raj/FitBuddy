import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/client';

export const fetchStats = createAsyncThunk('stats/fetch', async (days = 120) => (await api.get('/stats/summary', { params: { days } })).data);

const slice = createSlice({
  name: 'stats',
  initialState: { data: null, status: 'idle' },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchStats.pending, (s) => { s.status = 'loading'; });
    b.addCase(fetchStats.fulfilled, (s, a) => { s.data = a.payload; s.status = 'idle'; });
  },
});
export default slice.reducer;
