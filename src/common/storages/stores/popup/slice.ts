import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState, AppThunk } from '../index'
import { fetchCount } from './api'

export type Panel = 'home' | 'nft' | 'transaction' | 'settings'

export interface State {
  panel: Panel // main panel state
  conn: boolean // connected state
}

// typically used to make async requests.
export const makeAsync = createAsyncThunk('counter/fetchCount', async (amount: number) => {
  const response = await fetchCount(amount)
  return response.data
})

const initialState: State = {
  panel: 'home',
  conn: false
}

export const slice = createSlice({
  name: 'popup',
  initialState,
  reducers: {
    handleSetPanel: (state, action: PayloadAction<Panel>) => {
      state.panel = action.payload
    },
    setConn: (state, action) => {
      console.log(action.payload)
      state.conn = action.payload
    }
  }
})

export const { handleSetPanel, setConn } = slice.actions

export const getPanel = (state: RootState) => state.popup.panel
export const getConn = (state: RootState) => state.popup.conn

export const setPanel =
  (panel: Panel): AppThunk =>
  (dispatch, getState) => {
    const current = getPanel(getState())
    if (current != panel) {
      dispatch(handleSetPanel(panel))
    }
  }

export default slice.reducer
