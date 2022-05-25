import { Layout } from 'antd'
import { useTranslation } from 'react-i18next'
import { Content, Footer, Header } from 'antd/lib/layout/layout'
import CHeader from '@/popup/components/CHeader'
import CFooter from '@/popup/components/CFooter'
import Home from './Home'
import Transaction from './Transaction'
import Settings from './Settings'

import { getPanel, setAccount } from '@/common/storages/stores/popup/slice'
import { useAppDispatch, useAppSelector } from '@/common/storages/hooks'
import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Account } from '@/background/service/preference'
import { useWallet } from '@/ui/utils'
import BigNumber from 'bignumber.js'

interface State {
  keyring: string
  isMnemonics?: boolean
  isWebHID?: boolean
  path?: string
  keyringId?: number | null
  ledgerLive?: boolean
}

export interface AccountsProps {
  currentAccount: Account | null
  accountsList?: Account[]
  handleChange?(account: Account): void
}

const Dashboard = () => {
  const { t } = useTranslation()
  const wallet = useWallet()
  const navigate = useNavigate()
  const { state } = useLocation()

  const panel = useAppSelector(getPanel)

  // 改名
  // addressItems.current.forEach((item) => item.alianNameConfirm());

  const [dashboardReload, setDashboardReload] = useState(false)
  const [pendingTxCount, setPendingTxCount] = useState(0)
  const [loadingAddress, setLoadingAddress] = useState(false)
  const [currentAccount, setCurrentAccount] = useState<Account | null>(null)
  const [startEdit, setStartEdit] = useState(false)
  const [alianName, setAlianName] = useState<string>('')
  const [accountsList, setAccountsList] = useState<Account[]>([])
  const [displayName, setDisplayName] = useState<string>('')

  const alianNameConfirm = async (e) => {
    e.stopPropagation()
    if (!alianName) {
      return
    }
    setStartEdit(false)
    await wallet.updateAlianName(currentAccount?.address?.toLowerCase(), alianName)
    setDisplayName(alianName)
    const newAccountList = accountsList.map((item) => {
      if (item.address.toLowerCase() === currentAccount?.address.toLowerCase()) {
        return {
          ...item,
          alianName: alianName
        }
      }
      return item
    })
    if (newAccountList.length > 0) {
      setAccountsList(newAccountList)
    }
  }

  const balanceList = async (accounts) => {
    return await Promise.all<Account>(
      accounts.map(async (item) => {
        let balance = await wallet.getAddressCacheBalance(item?.address)
        if (!balance) {
          balance = await wallet.getAddressBalance(item?.address)
        }
        return {
          ...item,
          balance: balance?.total_usd_value || 0
        }
      })
    )
  }

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
    console.log(templist)
    if (result) {
      const withBalanceList = result.sort((a, b) => {
        return new BigNumber(b?.balance || 0).minus(new BigNumber(a?.balance || 0)).toNumber()
      })
      console.log(withBalanceList)
      setAccountsList(withBalanceList)
    }
  }

  const getPendingTxCount = async (address: string) => {
    const count = await wallet.getPendingCount(address)
    setPendingTxCount(count)
  }

  const getCurrentAccount = async () => {
    const account = await wallet.getCurrentAccount()
    if (!account) {
      navigate('/welcome')
      return
    }
    setCurrentAccount(account)
  }

  useEffect(() => {
    if (dashboardReload) {
      if (currentAccount) {
        getPendingTxCount(currentAccount.address)
      }
      setDashboardReload(false)
      getCurrentAccount()
      getAllKeyrings()
    }
  }, [dashboardReload])
  useEffect(() => {
    getAllKeyrings()
  }, [])

  const [isListLoading, setIsListLoading] = useState(false)
  const [isAssetsLoading, setIsAssetsLoading] = useState(true)
  const handleChange = async (account: Account) => {
    console.log(account)
    setIsListLoading(true)
    setIsAssetsLoading(true)
    const { address, type, brandName } = account
    await wallet.changeAccount({ address, type, brandName })
    setCurrentAccount({ address, type, brandName })
  }

  return (
    <Layout className="h-full">
      <Header className="border-b border-white border-opacity-10">
        <CHeader />
      </Header>
      <Content style={{ backgroundColor: '#1C1919', overflowY: 'auto' }}>
        {panel == 'home' ? (
          <Home currentAccount={currentAccount} accountsList={accountsList} handleChange={handleChange} />
        ) : panel == 'transaction' ? (
          <Transaction currentAccount={currentAccount} accountsList={accountsList} handleChange={handleChange} />
        ) : panel == 'settings' ? (
          <Settings currentAccount={currentAccount} >
        ) : (
          <Home currentAccount={currentAccount} accountsList={accountsList} handleChange={handleChange} />
        )}
      </Content>
      <Footer style={{ height: '5.625rem' }}>
        <CFooter />
      </Footer>
    </Layout>
  )
}

export default Dashboard
