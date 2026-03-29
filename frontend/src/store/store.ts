/**
 * Redux Store
 *
 * Central store configuration used by the app. This file exports the store
 * and useful TypeScript types for `RootState` and `AppDispatch`.
 */
import { configureStore } from '@reduxjs/toolkit';
import experiencesReducer from './slices/searchSlice';

export const store = configureStore({
    reducer: {
        experiences: experiencesReducer,
    },
    
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;