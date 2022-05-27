import { Button, Divider, Input, Layout, Statistic } from 'antd'
import { useTranslation } from 'react-i18next'
import { Content, Footer, Header } from 'antd/lib/layout/layout'
import { ArrowLeftOutlined } from '@ant-design/icons'
import CHeader from '@/popup/components/CHeader'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AccountSwitch from './Switch'
import AccountAdd from './Add'
import AccountCreate from './Create'
import AccountImport from './Import'
import { useWallet } from '@/ui/utils'
import { BigNumber } from 'bignumber.js'
import { Account } from '@/background/service/preference'
import { useAppDispatch, useAppSelector } from '@/common/storages/hooks'
import { getCurrentAccount } from '@/common/storages/stores/popup/slice'

export type Status = 'switch' | 'add' | 'import' | 'create'

const SendIndex = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const wallet = useWallet()

  const [status, setStatus] = useState<Status>('switch')

  const current = useAppSelector(getCurrentAccount)
  const dispatch = useAppDispatch()

  const [accountsList, setAccountsList] = useState<Account[]>([])

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

  const getAllKeyrings = async () => {
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
    if (result) {
      const withBalanceList = result.sort((a, b) => {
        return new BigNumber(b?.balance || 0).minus(new BigNumber(a?.balance || 0)).toNumber()
      })
      setAccountsList(withBalanceList)
    }
  }

  useEffect(() => {
    getAllKeyrings()
  }, [])

  const statusBack = () => {
    if (status == 'import' || status == 'create') {
      setStatus('add')
    } else if (status == 'add') {
      setStatus('switch')
    } else {
      window.history.go(-1)
    }
  }

  useEffect(() => {}, [status])

  return (
    <Layout className="h-full">
      <Header className="border-b border-white border-opacity-10">
        <CHeader />
      </Header>
      <Content style={{ backgroundColor: '#1C1919' }}>
        {status == 'switch' ? (
          <AccountSwitch setStatus={setStatus} />
        ) : status == 'add' ? (
          <AccountAdd setStatus={setStatus} />
        ) : status == 'import' ? (
          <AccountImport setStatus={setStatus} />
        ) : status == 'create' ? (
          <AccountCreate setStatus={setStatus} />
        ) : (
          <div>error</div>
        )}
      </Content>
      <Footer
        style={{
          height: '5.625rem',
          backgroundColor: '#1C1919',
          textAlign: 'center',
          width: '100%'
        }}
      >
        <Button
          size="large"
          type="default"
          className="box w440"
          onClick={(e) => {
            statusBack()
          }}
        >
          <div className="flex items-center justify-center text-lg">
            <ArrowLeftOutlined />
            &nbsp;Back
          </div>
        </Button>
      </Footer>
    </Layout>
  )
}

export default SendIndex
