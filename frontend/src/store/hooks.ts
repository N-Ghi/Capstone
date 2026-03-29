/**
 * Store hooks
 *
 * Typed wrappers around `useDispatch` and `useSelector` for TypeScript.
 */
import { type TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './index';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;