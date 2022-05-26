import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import { default as popupReducer } from './popup/slice'
import { default as accountReducer } from './account/slice'

export const store = configureStore({
  reducer: {
    account: accountReducer,
    popup: popupReducer
  }
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>
