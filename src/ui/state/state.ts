import { AccountAsset } from '@/background/controller/wallet'
import { ExchangeRate, NovoBalance, TxHistoryItem } from '@/background/service/openapi'
import { Account } from '@/background/service/preference'
import { COIN_NAME, COIN_SYMBOL } from '@/constant'
import { createGlobalState, createStore } from 'react-hooks-global-state'
import { WalletController } from '../utils/WalletContext'

export type GlobalModelState = {
  newAccountMode: 'create' | 'import'
  accountsList: Account[]
  currentAccount?: Account
  accountBalance: NovoBalance
  accountAssets: AccountAsset[]
  accountHistory: TxHistoryItem[]
  currency: string
  exchangeRate: ExchangeRate
  locale: string
}

// app state
const initialState: GlobalModelState = {
  newAccountMode: 'create',
  accountsList: [],
  currentAccount: undefined,
  accountBalance: {
    confirm_amount: '0',
    pending_amount: '0',
    amount: '',
    usd_value: '0'
  },
  accountAssets: [],
  accountHistory: [],
  currency: 'USD',
  exchangeRate: {
    EUR: 1,
    JPY: 1,
    GBP: 1,
    CHF: 1,
    CAD: 1
  },
  locale: 'English'
}

export const { useGlobalState, getGlobalState, setGlobalState } = createGlobalState(initialState)

// const reducer = (state, action) => {
//   switch( action.type) {
//     case 'initAccounts': return async () => {
//       state.accountsList =  await action.wallet.getAccounts()
//       if (state.accountsList.length == 0) {
//         return 
//       }
//       state.currentAccount = await action.wallet.getCurrentAccount()
//       return state
//     }
//     case 'changeCurrent': return async () => {
//       if (state.currentAccount) {
//         state.accountHistory = []
//         state.currency = await action.wallet.getCurrency()
//         state.exchangeRate = await action.wallet.getExchangeRate()
//         state.locale = await action.wallet.getLocale()
//         state.accountBalance = await action.wallet.getAddressCacheBalance(state.currentAccount.address)
//         state.accountAssets = [{ name: COIN_NAME, symbol: COIN_SYMBOL, amount: state.accountBalance.amount, value: state.accountBalance.usd_value }]
//         action.wallet.getAddressBalance(state.currentAccount.address).then((_accountBalance) => {
//           state.ccountBalance = _accountBalance
//           state.accountAssets = [{ name: COIN_NAME, symbol: COIN_SYMBOL, amount: _accountBalance.amount, value: _accountBalance.usd_value }]
//         })
    
//         state.accountHistory = await action.wallet.getAddressCacheHistory(state.currentAccount.address)
//         action.wallet.getAddressHistory(state.currentAccount.address).then((_accountHistory) => {
//           state.accountHistory = _accountHistory
//         })
//       }
//       return state
//   }
//     default: return state
//   }
// }


// export const { dispatch: globalDispath, useStoreState: useGlobalStoreState } = createStore(reducer, initialState)