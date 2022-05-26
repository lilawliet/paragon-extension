import { Account } from '@/background/service/preference'
import { useAppDispatch, useAppSelector } from '@/common/storages/hooks'
import { getAccount, getPanel, setAccount } from '@/common/storages/stores/popup/slice'
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
}

const Dashboard = () => {
  const { t } = useTranslation()
  const wallet = useWallet()
  const navigate = useNavigate()

  const panel = useAppSelector(getPanel)
  const current = useAppSelector(getAccount)
  const dispatch = useAppDispatch()

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
    if (result) {
      const withBalanceList = result.sort((a, b) => {
        return new BigNumber(b?.balance || 0).minus(new BigNumber(a?.balance || 0)).toNumber()
      })
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

    dispatch(setAccount(account))
  }

  useEffect(() => {
    if (dashboardReload) {
      if (current) {
        getPendingTxCount(current.address)
      }
      setDashboardReload(false)
      getCurrentAccount()
      getAllKeyrings()
    }
  }, [dashboardReload])

  // useEffect(() => {
  //   if (currentAccount) {
  //     // if (currentAccount.type === KEYRING_TYPE.GnosisKeyring) {
  //       // setSafeInfo(null);
  //       // getGnosisPendingCount();
  //     // } else {
  //       // getPendingTxCount(currentAccount.address);
  //     // }
  //     // getAlianName(currentAccount?.address.toLowerCase());
  //     setCurrentAccount(currentAccount);
  //   }
  // }, [currentAccount]);

  useEffect(() => {
    getAllKeyrings()
    if (!current) {
      getCurrentAccount();
    }
  }, [])

  const [isListLoading, setIsListLoading] = useState(false)
  const [isAssetsLoading, setIsAssetsLoading] = useState(true)
  const handleOnChange = async (account: Account) => {
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
          <Home current={currentAccount} accountsList={accountsList}/>
        ) : panel == 'transaction' ? (
          <Transaction current={currentAccount} accountsList={accountsList}/>
        ) : panel == 'settings' ? (
          <Settings current={currentAccount} />
        ) : (
          <Home current={currentAccount} accountsList={accountsList}/>
        )}
      </Content>
      <Footer style={{ height: '5.625rem' }}>
        <CFooter />
      </Footer>
    </Layout>
  )
}

export default Dashboard
