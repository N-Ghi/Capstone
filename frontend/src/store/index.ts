import { configureStore } from '@reduxjs/toolkit';
import experiencesReducer from './slices/experiencesSlice';
import searchReducer from './slices/searchSlice';
import languagesReducer from './slices/languagesSlice';

export const store = configureStore({
  reducer: {
    experiences: experiencesReducer,
    search: searchReducer,
    languages: languagesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;