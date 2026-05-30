import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/client';

export const fetchSessions = createAsyncThunk('sessions/fetch', async (params = {}) => (await api.get('/sessions', { params })).data);
export const fetchSession = createAsyncThunk('sessions/one', async (id) => (await api.get(`/sessions/${id}`)).data);
export const startSession = createAsyncThunk('sessions/start', async (templateId) => (await api.post('/sessions/start', { templateId })).data);
export const updateSession = createAsyncThunk('sessions/update', async ({ id, data }) => (await api.put(`/sessions/${id}`, data)).data);
export const deleteSession = createAsyncThunk('sessions/delete', async (id) => { await api.delete(`/sessions/${id}`); return id; });

const slice = createSlice({
  name: 'sessions',
  initialState: { items: [], current: null, status: 'idle' },
  reducers: { clearCurrent(s) { s.current = null; } },
  extraReducers: (b) => {
    b.addCase(fetchSessions.fulfilled, (s, a) => { s.items = a.payload; });
    b.addCase(fetchSession.fulfilled, (s, a) => { s.current = a.payload; });
    b.addCase(startSession.fulfilled, (s, a) => { s.current = a.payload; s.items.unshift(a.payload); });
    b.addCase(updateSession.fulfilled, (s, a) => {
      s.current = a.payload;
      const i = s.items.findIndex(x => x._id === a.payload._id); if (i >= 0) s.items[i] = a.payload;
    });
    b.addCase(deleteSession.fulfilled, (s, a) => { s.items = s.items.filter(x => x._id !== a.payload); });
  },
});
export const { clearCurrent } = slice.actions;
export default slice.reducer;
