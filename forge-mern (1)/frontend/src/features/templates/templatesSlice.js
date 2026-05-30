import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/client';

export const fetchTemplates = createAsyncThunk('templates/fetch', async () => (await api.get('/templates')).data);
export const createTemplate = createAsyncThunk('templates/create', async (data) => (await api.post('/templates', data)).data);
export const updateTemplate = createAsyncThunk('templates/update', async ({ id, data }) => (await api.put(`/templates/${id}`, data)).data);
export const deleteTemplate = createAsyncThunk('templates/delete', async (id) => { await api.delete(`/templates/${id}`); return id; });

const slice = createSlice({
  name: 'templates',
  initialState: { items: [], status: 'idle' },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchTemplates.fulfilled, (s, a) => { s.items = a.payload; });
    b.addCase(createTemplate.fulfilled, (s, a) => { s.items.unshift(a.payload); });
    b.addCase(updateTemplate.fulfilled, (s, a) => {
      const i = s.items.findIndex(x => x._id === a.payload._id); if (i >= 0) s.items[i] = a.payload;
    });
    b.addCase(deleteTemplate.fulfilled, (s, a) => { s.items = s.items.filter(x => x._id !== a.payload); });
  },
});
export default slice.reducer;
