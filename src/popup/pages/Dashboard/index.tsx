import { Account } from '@/background/service/preference'
import { useAppSelector } from '@/common/storages/hooks'
import { getPanel } from '@/common/storages/stores/popup/slice'
import { COIN_NAME, COIN_SYMBOL } from '@/constant'
import eventBus from '@/eventBus'
import CFooter from '@/popup/components/CFooter'
import CHeader from '@/popup/components/CHeader'
import { useGlobalState } from '@/ui/state/state'
import { useWallet } from '@/ui/utils'
import { Layout, Space, Spin } from 'antd'
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
  const [locale, setLocale] = useGlobalState('locale')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const onCurrentChange = async () => {
      if (currentAccount) {
        setAccountHistory([])

        setLoading(true)

        const _currency = await wallet.getCurrency()
        setCurrency(_currency)

        const _exchangeRate = await wallet.getExchangeRate()
        setExchangeRate(_exchangeRate)

        const _locale = await wallet.getLocale()
        setLocale(_locale)

        const _accountBalance = await wallet.getAddressCacheBalance(currentAccount.address)
        setAccountBalance(_accountBalance)
        const _assets = [{ name: COIN_NAME, symbol: COIN_SYMBOL, amount: _accountBalance.amount, value: _accountBalance.usd_value }]
        setAccountAssets(_assets)
        wallet.getAddressBalance(currentAccount.address).then((_accountBalance) => {
          setAccountBalance(_accountBalance)
          const _assets = [{ name: COIN_NAME, symbol: COIN_SYMBOL, amount: _accountBalance.amount, value: _accountBalance.usd_value }]
          setAccountAssets(_assets)
        })

        const _accountHistory = await wallet.getAddressCacheHistory(currentAccount.address)
        setAccountHistory(_accountHistory)
        wallet.getAddressHistory(currentAccount.address).then((_accountHistory) => {
          setAccountHistory(_accountHistory)
        })

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
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', height: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
              <Space size="middle">
                <Spin size="large" />
              </Space>
            </div>
          </div>
        ) : panel == 'home' ? (
          <Home />
        ) : panel == 'transaction' ? (
          <Transaction />
        ) : panel == 'settings' ? (
          <Settings />
        ) : (
          <Home />
        )}
      </Content>
      <Footer style={{ height: '5.625rem' }}>
        <CFooter />
      </Footer>
    </Layout>
  )
}

export default Dashboard
