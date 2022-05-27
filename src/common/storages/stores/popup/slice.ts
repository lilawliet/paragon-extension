import { Account } from '@/background/service/preference'
import { WalletController } from '@/ui/utils'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunk, RootState } from '../index'

export type Panel = 'home' | 'nft' | 'transaction' | 'settings'
export type Sending = 'create' | 'confirm' | 'sending' | 'success' | 'error' | 'cancel' | ''

export interface State {
  panel: Panel // main panel state
  conn: boolean // connected state
  currentAccount: Account | null
  sending: Sending
}

interface fetchCurrentAccountArgs {
  wallet: WalletController
}

export const fetchCurrentAccount = createAsyncThunk('fetchCurrentAccount', async (args: fetchCurrentAccountArgs, thunkAPI) => {
  const _current = args.wallet.getCurrentAccount()
  if (_current) {
    return _current
  }
  return thunkAPI.rejectWithValue(null)
})

interface updateAlianNameArgs {
  wallet: WalletController
  address: string
  alianName: string
}

export const updateAlianName = createAsyncThunk<string, updateAlianNameArgs>('updateAlianName', async (args) => {
  args.wallet.updateAlianName(args.address, args.alianName)
  return args.alianName
})

interface setCurrentAccountArgs {
  wallet: WalletController
  account: Account
}

export const setCurrentAccount = createAsyncThunk<Account, setCurrentAccountArgs>('setCurrentAccount', async (args) => {
  const { address, type, brandName } = args.account
  args.wallet.changeAccount({ address, type, brandName })
  return args.account
})

const initialState: State = {
  panel: 'home',
  conn: false,
  currentAccount: null,
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
    handleSetSending: (state, action: PayloadAction<Sending>) => {
      state.sending = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentAccount.fulfilled, (state, action) => {
        state.currentAccount = action.payload
      })
      .addCase(updateAlianName.rejected, (state, action) => {
        console.log('reject')
      })
      .addCase(updateAlianName.fulfilled, (state, action) => {
        console.log('alian')
        // const dispatch = useAppDispatch()
        // dispatch(fetchCurrentAccount())
      })
      .addCase(setCurrentAccount.fulfilled, (state, action) => {
        state.currentAccount = action.payload
      })
  }
})

export const { handleSetPanel, setConn, handleSetSending } = slice.actions

export const getPanel = (state: RootState) => state.popup.panel
export const getConn = (state: RootState) => state.popup.conn
export const getSending = (state: RootState) => state.popup.sending
export const getCurrentAccount = (state: RootState) => state.popup.currentAccount

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
