import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/client';

export const getProfile = createAsyncThunk('profile/get', async () => (await api.get('/profile')).data);
export const updateProfile = createAsyncThunk('profile/update', async (data) => (await api.put('/profile', data)).data);

const slice = createSlice({
  name: 'profile',
  initialState: { data: null, status: 'idle' },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(getProfile.fulfilled, (s, a) => { s.data = a.payload; });
    b.addCase(updateProfile.fulfilled, (s, a) => { s.data = a.payload; });
  },
});
export default slice.reducer;
