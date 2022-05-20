import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import {default as popupReducer} from './popup/slice';

export const store = configureStore({
  reducer: {
    popup: popupReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
