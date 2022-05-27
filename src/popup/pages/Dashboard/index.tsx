import { NovoBalance } from '@/background/service/openapi'
import { Account } from '@/background/service/preference'
import { useAppDispatch, useAppSelector } from '@/common/storages/hooks'
import { fetchCurrentAccount, getCurrentAccount, getPanel } from '@/common/storages/stores/popup/slice'
import CFooter from '@/popup/components/CFooter'
import CHeader from '@/popup/components/CHeader'
import { useWallet } from '@/ui/utils'
import { Layout } from 'antd'
import { Content, Footer, Header } from 'antd/lib/layout/layout'
import BigNumber from 'bignumber.js'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import Home from './Home'
import Settings from './Settings'
import Transaction from './Transaction'

export interface AccountsProps {
  current: Account | null
  accountsList?: Account[]
  handleOnChange?(account: Account): void
  accountAssets?: {
    name: string
    symbol: string
    amount: number
    value: string
  }[]
  accountBalance?: NovoBalance
}

const Dashboard = () => {
  const { t } = useTranslation()
  const wallet = useWallet()
  const navigate = useNavigate()
  const currentAccount = useAppSelector(getCurrentAccount)

  const panel = useAppSelector(getPanel)
  const dispatch = useAppDispatch()

  // 改名
  // addressItems.current.forEach((item) => item.alianNameConfirm());

  const [accountsList, setAccountsList] = useState<Account[]>([])

  const [pendingTxCount, setPendingTxCount] = useState(0)
  const [loadingAddress, setLoadingAddress] = useState(false)
  const [startEdit, setStartEdit] = useState(false)
  const [alianName, setAlianName] = useState<string>('')
  const [displayName, setDisplayName] = useState<string>('')
  const [currentAddress, setCurrentAddress] = useState('')

  const balanceList = async (accounts) => {
    return await Promise.all<Account>(
      accounts.map(async (item) => {
        let balance = await wallet.getAddressCacheBalance(item?.address)
        if (!balance) {
          balance = await wallet.getAddressBalance(item?.address)
        }
        return {
          ...item,
          balance: balance?.amount || 0
        }
      })
    )
  }

  const [accountAssets, setAccountAssets] = useState<
    {
      name: string
      symbol: string
      amount: number
      value: string
    }[]
  >([])
  const loadAccountAssets = async () => {
    const _res = await wallet.listChainAssets(currentAddress)
    setAccountAssets(_res)
  }

  const [accountBalance, setAccountBalance] = useState<NovoBalance>({ amount: 0, pending_amount: 0, confirm_amount: 0, usd_value: 0 })
  const loadAccountBalance = async () => {
    const _res = await wallet.getAddressBalance(currentAddress)
    setAccountBalance(_res)
  }

  useEffect(() => {
    if (currentAddress) {
      loadAccountAssets()
      loadAccountBalance()
    }
  }, [currentAddress])

  const getAllKeyrings = async () => {
    setLoadingAddress(true)
    const _accounts = await wallet.getAllVisibleAccounts()
    const allAlianNames = await wallet.getAllAlianName()
    const allContactNames = await wallet.getContactsByMap()
    const templist = await _accounts
      .map((item) =>
        item.accounts.map((account) => {
          return {
            ...account,
            type: item.type,
            alianName: allContactNames[account?.address?.toLowerCase()]?.name || allAlianNames[account?.address?.toLowerCase()],
            keyring: item.keyring
          }
        })
      )
      .flat(1)
    const result = await balanceList(templist)
    setLoadingAddress(false)
    if (result) {
      const withBalanceList = result.sort((a, b) => {
        return new BigNumber(b?.balance || 0).minus(new BigNumber(a?.balance || 0)).toNumber()
      })
      setAccountsList(withBalanceList)
    }
  }

  useEffect(() => {
    ;(async () => {
      getAllKeyrings()
      if (!currentAccount) {
        const fetchCurrentAccountAction = await dispatch(fetchCurrentAccount({ wallet }))
        if (fetchCurrentAccount.fulfilled.match(fetchCurrentAccountAction)) {
          // pass
        } else if (fetchCurrentAccount.rejected.match(fetchCurrentAccountAction)) {
          navigate('/welcome')
        }
      }
      let account = await wallet.getCurrentAccount()
      setCurrentAddress(account.address)
    })()
  }, [])

  return (
    <Layout className="h-full">
      <Header className="border-b border-white border-opacity-10">
        <CHeader />
      </Header>
      <Content style={{ backgroundColor: '#1C1919', overflowY: 'auto' }}>
        {panel == 'home' ? (
          <Home current={currentAccount} accountsList={accountsList} accountAssets={accountAssets} accountBalance={accountBalance} />
        ) : panel == 'transaction' ? (
          <Transaction current={currentAccount} accountsList={accountsList} />
        ) : panel == 'settings' ? (
          <Settings current={currentAccount} />
        ) : (
          <Home current={currentAccount} accountsList={accountsList} />
        )}
      </Content>
      <Footer style={{ height: '5.625rem' }}>
        <CFooter />
      </Footer>
    </Layout>
  )
}

export default Dashboard
