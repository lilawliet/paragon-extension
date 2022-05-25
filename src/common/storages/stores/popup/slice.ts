import { Account } from '@/background/service/preference'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunk, RootState } from '../index'
import { fetchCount } from './api'

export type Panel = 'home' | 'nft' | 'transaction' | 'settings'

export interface State {
  panel: Panel // main panel state
  conn: boolean // connected state
  account: Account | undefined
}

// typically used to make async requests.
export const makeAsync = createAsyncThunk('counter/fetchCount', async (amount: number) => {
  const response = await fetchCount(amount)
  return response.data
})

const initialState: State = {
  panel: 'home',
  conn: false,
  account: undefined
}

export const slice = createSlice({
  name: 'popup',
  initialState,
  reducers: {
    handleSetPanel: (state, action: PayloadAction<Panel>) => {
      state.panel = action.payload
    },
    setConn: (state, action) => {
      state.conn = action.payload
    },
    setAccount: (state, action) => {
      state.account = action.payload
    }
  }
})

export const { handleSetPanel, setConn, setAccount } = slice.actions

export const getPanel = (state: RootState) => state.popup.panel
export const getConn = (state: RootState) => state.popup.conn
export const getAccount = (state: RootState) => state.popup.account

export const setPanel = (panel: Panel): AppThunk => {
  return (dispatch, getState) => {
    const current = getPanel(getState())
    if (current != panel) {
      dispatch(handleSetPanel(panel))
    }
  }
}

export default slice.reducer
