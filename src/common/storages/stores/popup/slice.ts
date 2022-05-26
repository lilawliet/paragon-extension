import { Account } from '@/background/service/preference'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunk, RootState } from '../index'

export type Panel = 'home' | 'nft' | 'transaction' | 'settings'
export type Sending = 'create' | 'confirm' | 'sending' | 'success' | 'error' | 'cancel' | ''

export interface State {
  panel: Panel // main panel state
  conn: boolean // connected state
  account: Account | null
  sending: Sending
}

const initialState: State = {
  panel: 'home',
  conn: false,
  account: null,
  sending: ''
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
    },
    handleSetSending: (state, action: PayloadAction<Sending>) => {
      state.sending = action.payload
    }
  }
})

export const { handleSetPanel, setConn, setAccount, handleSetSending } = slice.actions

export const getPanel = (state: RootState) => state.popup.panel
export const getConn = (state: RootState) => state.popup.conn
export const getAccount = (state: RootState) => state.popup.account
export const getSending = (state: RootState) => state.popup.sending

export const setPanel = (panel: Panel): AppThunk => {
  return (dispatch, getState) => {
    const current = getPanel(getState())
    if (current != panel) {
      dispatch(handleSetPanel(panel))
    }
  }
}

export const setSending = (sending: Sending): AppThunk => {
  return (dispatch, getState) => {
    const current = getSending(getState())
    if (current != sending) {
      dispatch(handleSetSending(sending))
    }
  }
}

export default slice.reducer
