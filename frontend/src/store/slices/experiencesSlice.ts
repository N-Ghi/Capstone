import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { ExperienceListItem } from '../../@types/experience.types';
import { getAllExperiences } from '../../services/experienceService';
import type { ExperienceQueryParams } from '../../@types/experience.types';

interface FilterState {
  languages: string[];
  currentPage: number;
}

interface ExperiencesState {
  items: ExperienceListItem[];
  total: number;
  loading: boolean;
  error: string | null;
  filterState: FilterState;
  // Tracks whether the last fetch was a search fallback
  isFallbackSearch: boolean;
}

const initialState: ExperiencesState = {
  items: [],
  total: 0,
  loading: false,
  error: null,
  filterState: {
    languages: [],
    currentPage: 1,
  },
  isFallbackSearch: false,
};

export const fetchExperiences = createAsyncThunk(
  'experiences/fetchAll',
  async (params: ExperienceQueryParams = {}) => {
    const response = await getAllExperiences(params);
    return response;
  }
);

// API fallback — only called when client-side filter yields no results
export const fetchExperiencesBySearch = createAsyncThunk(
  'experiences/fetchBySearch',
  async (
    params: Pick<ExperienceQueryParams, 'guide_username' | 'title'>
  ) => {
    const response = await getAllExperiences(params);
    return response;
  }
);

const experiencesSlice = createSlice({
  name: 'experiences',
  initialState,
  reducers: {
    setLanguageFilter: (state, action: PayloadAction<string[]>) => {
      state.filterState.languages = action.payload;
      state.filterState.currentPage = 1;
    },
    toggleLanguage: (state, action: PayloadAction<string>) => {
      const lang = action.payload;
      const idx = state.filterState.languages.indexOf(lang);
      if (idx > -1) {
        state.filterState.languages.splice(idx, 1);
      } else {
        state.filterState.languages.push(lang);
      }
      state.filterState.currentPage = 1;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.filterState.currentPage = action.payload;
    },
    resetFilters: (state) => {
      state.filterState = { languages: [], currentPage: 1 };
      state.isFallbackSearch = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExperiences.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isFallbackSearch = false;
      })
      .addCase(fetchExperiences.fulfilled, (state, action) => {
        state.items = action.payload.results ?? action.payload;
        state.total = action.payload.count ?? state.items.length;
        state.loading = false;
      })
      .addCase(fetchExperiences.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to fetch experiences';
      })
      .addCase(fetchExperiencesBySearch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExperiencesBySearch.fulfilled, (state, action) => {
        state.items = action.payload.results ?? action.payload;
        state.total = action.payload.count ?? state.items.length;
        state.loading = false;
        state.isFallbackSearch = true;
      })
      .addCase(fetchExperiencesBySearch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to fetch experiences';
      });
  },
});

export const { setLanguageFilter, toggleLanguage, setPage, resetFilters } =
  experiencesSlice.actions;
export default experiencesSlice.reducer;