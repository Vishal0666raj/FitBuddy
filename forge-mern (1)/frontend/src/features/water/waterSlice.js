import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/client';

export const fetchWater = createAsyncThunk('water/fetch', async () => (await api.get('/water')).data);
export const addWater = createAsyncThunk('water/add', async (amountMl) => (await api.post('/water', { amountMl })).data);
export const removeWater = createAsyncThunk('water/remove', async (id) => { await api.delete(`/water/${id}`); return id; });

const slice = createSlice({
  name: 'water',
  initialState: { total: 0, entries: [], date: null },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchWater.fulfilled, (s, a) => { Object.assign(s, a.payload); });
    b.addCase(addWater.fulfilled, (s, a) => { s.entries.push(a.payload); s.total += a.payload.amountMl; });
    b.addCase(removeWater.fulfilled, (s, a) => {
      const e = s.entries.find(x => x._id === a.payload); if (e) s.total -= e.amountMl;
      s.entries = s.entries.filter(x => x._id !== a.payload);
    });
  },
});
export default slice.reducer;
