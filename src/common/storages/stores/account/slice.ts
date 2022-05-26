import { Account } from '@/background/service/preference'
import { useWallet } from '@/ui/utils'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunk, RootState } from '../index'

// typically used to make async requests.
export const makeAsync = createAsyncThunk('counter/fetchCount', async (amount: number) => {
  // const response = await fetchCount(amount)
  // return response.data
})

const initialState: Account = {
  type: '',
  address: '',
  brandName: '',
  alianName: '',
  displayBrandName: '',
  index: 0,
  balance: 0
}

export const slice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    handleSetAlianName: (state, action: PayloadAction<string>) => {
      state.alianName = action.payload
    }
  }
})

export const { handleSetAlianName } = slice.actions

export const getAlianName = (state: RootState) => state.account.alianName

export const setAlianName = (address: string, name: string): AppThunk => {
  return (dispatch, getState) => {
    const wallet = useWallet()
    wallet.updateAlianName(address, name)
    dispatch(handleSetAlianName(name))
  }
}

export default slice.reducer
