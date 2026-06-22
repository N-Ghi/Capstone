import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type SearchType = 'experience' | 'guide';

interface SearchState {
  isSearching: boolean;
  query: string;
  searchType: SearchType;
}

const initialState: SearchState = {
  isSearching: false,
  query: '',
  searchType: 'experience',
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearch: (
      state,
      action: PayloadAction<{ query: string; searchType: SearchType }>
    ) => {
      state.query = action.payload.query;
      state.searchType = action.payload.searchType;
      state.isSearching = action.payload.query.trim().length > 0;
    },
    clearSearch: (state) => {
      state.query = '';
      state.searchType = 'experience';
      state.isSearching = false;
    },
  },
});

export const { setSearch, clearSearch } = searchSlice.actions;
export default searchSlice.reducer;