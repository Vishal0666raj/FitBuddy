import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/client';

const TOKEN_KEY = 'forge:token';

export const register = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try { const r = await api.post('/auth/register', data); return r.data; }
  catch (e) { 
    console.log("FULL ERROR:", e);
  console.log("RESPONSE:", e.response);
  console.log("DATA:", e.response?.data);
    
    return rejectWithValue(e.response?.data?.message || 'Register failed'); }
});
export const login = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
  try { const r = await api.post('/auth/login', data); return r.data; }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Login failed'); }
});
export const fetchMe = createAsyncThunk('auth/me', async (_, { rejectWithValue }) => {
  try { const r = await api.get('/auth/me'); return r.data; }
  catch (e) { return rejectWithValue('Session expired'); }
});

const slice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem(TOKEN_KEY) || null,
    user: null, status: 'idle', error: null,
  },
  reducers: {
    logout(state) {
      state.token = null; state.user = null;
      localStorage.removeItem(TOKEN_KEY);
    },
  },
  extraReducers: (b) => {
    const ok = (s, a) => {
      s.token = a.payload.token; s.user = { _id: a.payload._id, name: a.payload.name, email: a.payload.email };
      s.status = 'idle'; s.error = null;
      localStorage.setItem(TOKEN_KEY, a.payload.token);
    };
    b.addCase(login.fulfilled, ok);
    b.addCase(register.fulfilled, ok);
    b.addCase(fetchMe.fulfilled, (s, a) => { s.user = a.payload; });
    b.addCase(fetchMe.rejected, (s) => { s.token = null; s.user = null; localStorage.removeItem(TOKEN_KEY); });
    [login, register].forEach((t) => {
      b.addCase(t.pending, (s) => { s.status = 'loading'; s.error = null; });
      b.addCase(t.rejected, (s, a) => { s.status = 'idle'; s.error = a.payload; });
    });
  },
});

export const { logout } = slice.actions;
export default slice.reducer;
