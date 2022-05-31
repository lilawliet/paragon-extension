import { Account } from '@/background/service/preference'
import { useAppSelector } from '@/common/storages/hooks'
import { getPanel } from '@/common/storages/stores/popup/slice'
import eventBus from '@/eventBus'
import CFooter from '@/popup/components/CFooter'
import CHeader from '@/popup/components/CHeader'
import { useGlobalState } from '@/ui/state/state'
import { useWallet } from '@/ui/utils'
import { Layout } from 'antd'
import { Content, Footer, Header } from 'antd/lib/layout/layout'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import Home from './Home'
import Settings from './Settings'
import Transaction from './Transaction'

const Dashboard = () => {
  const { t } = useTranslation()
  const wallet = useWallet()
  const navigate = useNavigate()
  const panel = useAppSelector(getPanel)

  const [accountsList, setAccountsList] = useGlobalState('accountsList')
  const [currentAccount, setCurrentAccount] = useGlobalState('currentAccount')
  const [accountBalance, setAccountBalance] = useGlobalState('accountBalance')
  const [accountAssets, setAccountAssets] = useGlobalState('accountAssets')
  const [accountHistory, setAccountHistory] = useGlobalState('accountHistory')
  const [currency, setCurrency] = useGlobalState('currency')
  const [exchangeRate, setExchangeRate] = useGlobalState('exchangeRate')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    console.log('reaload', currentAccount)
    const onCurrentChange = async () => {
      if (currentAccount) {
        setAccountHistory([])

        setLoading(true)
        const _accountAssets = await wallet.listChainAssets(currentAccount.address)
        setAccountAssets(_accountAssets)

        const _accountBalance = await wallet.getAddressBalance(currentAccount.address)
        setAccountBalance(_accountBalance)

        const _accountHistory = await wallet.getTransactionHistory(currentAccount.address)
        setAccountHistory(_accountHistory)

        const _currency = await wallet.getCurrency()
        setCurrency(_currency)

        const _exchangeRate = await wallet.getExchangeRate()
        setExchangeRate(_exchangeRate)
        setLoading(false)
      }
    }
    onCurrentChange()
  }, [currentAccount])

  useEffect(() => {
    const init = async () => {
      const _accounts = await wallet.getAccounts()
      setAccountsList(_accounts)
      if (_accounts.length == 0) {
        navigate('/welcome')
        return
      }

      const _currentAccount = await wallet.getCurrentAccount()
      if (_currentAccount.address != currentAccount?.address) {
        setCurrentAccount(_currentAccount)
      }
    }
    init()
    const accountChangeHandler = (account: Account) => {
      if (account && account.address) {
        if (account.address != currentAccount?.address) {
          setCurrentAccount(account)
        }
      }
    }
    eventBus.addEventListener('accountsChanged', accountChangeHandler)
    return () => {
      eventBus.removeEventListener('accountsChanged', accountChangeHandler)
    }
  }, [])

  return (
    <Layout className="h-full">
      <Header className="border-b border-white border-opacity-10">
        <CHeader />
      </Header>
      <Content style={{ backgroundColor: '#1C1919', overflowY: 'auto' }}>
        {panel == 'home' ? <Home /> : panel == 'transaction' ? <Transaction /> : panel == 'settings' ? <Settings /> : <Home />}
      </Content>
      <Footer style={{ height: '5.625rem' }}>
        <CFooter />
      </Footer>
    </Layout>
  )
}

export default Dashboard
