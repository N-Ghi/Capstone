import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getLanguages } from '../../services/choiceService';

interface Language { id: string; name: string; code: string; }

interface LanguagesState {
  items: Language[];
  loading: boolean;
  error: string | null;
}

const initialState: LanguagesState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchLanguages = createAsyncThunk('languages/fetchAll', async () => {
  const res = await getLanguages();
  return res.results ?? res;
});

const languagesSlice = createSlice({
  name: 'languages',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLanguages.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchLanguages.fulfilled, (state, action) => { state.items = action.payload; state.loading = false; })
      .addCase(fetchLanguages.rejected, (state, action) => { state.loading = false; state.error = action.error.message ?? 'Failed to load languages'; });
  },
});

export default languagesSlice.reducer;