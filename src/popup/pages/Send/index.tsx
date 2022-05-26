import { NovoBalance } from '@/background/service/openapi'
import CHeader from '@/popup/components/CHeader'
import { sleep, useWallet } from '@/ui/utils'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { Button, Layout } from 'antd'
import { Content, Footer, Header } from 'antd/lib/layout/layout'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import SendConfirm from './Confirm'
import SendCreate from './Create'
import Sending from './Sending'
import Success from './Success'

export interface Transaction {
  rawtx: string
  txid: string
}

export type Status = 'create' | 'confirm' | 'sending' | 'success' | 'error'

const SendIndex = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [balance, setBalance] = useState<NovoBalance>({
    confirm_amount: 0,
    pending_amount: 0,
    amount: 0,
    usd_value: 0
  })
  const [fromAddress, setFromAddress] = useState('')
  const [toAddress, setToAddress] = useState('')
  const [toAmount, setToAmount] = useState(0)
  const [fee, setFee] = useState(0)
  const wallet = useWallet()
  const ref = useRef<Transaction>({
    rawtx: '',
    txid: ''
  })

  const [status, setStatus] = useState<Status>('create')

  useEffect(() => {
    //todo
  }, [status])

  useEffect(() => {
    const init = async () => {
      const currentAccount = await wallet.getCurrentAccount()
      setFromAddress(currentAccount.address)
      const balance = await wallet.getAddressBalance(currentAccount.address)
      setBalance(balance)
    }
    init()
  }, [])

  const sendTx = useCallback(async () => {
    try {
      setStatus('sending')
      // const txid = await wallet.pushTx(ref.current.rawtx)
      // ref.current.txid = txid
      console.log('start')
      await sleep(3)
      setStatus('success')
      console.log('sss')
    } catch (e) {
      console.error(e)
      setStatus('error')
    }
  }, [ref.current.rawtx])

  useEffect(() => {
    if (!toAddress) {
      return
    }
    if (toAmount <= 0 || toAmount > balance.amount) {
      return
    }
    const run = async () => {
      const { fee, rawtx } = await wallet.sendNovo({ to: toAddress, amount: toAmount })
      setFee(fee)
      ref.current.rawtx = rawtx
      console.log(toAddress, toAmount, fee)
    }
    run()
  }, [toAddress + toAmount])

  return (
    <Layout className="h-full">
      <Header className="border-b border-white border-opacity-10">
        <CHeader />
      </Header>
      <Content style={{ backgroundColor: '#1C1919' }}>
        {status == 'create' ? (
          <SendCreate transaction={ref.current} balance={balance} fee={fee} setToAddress={setToAddress} setToAmount={setToAmount} setStatus={setStatus} />
        ) : status == 'confirm' ? (
          <SendConfirm transaction={ref.current} fromAddress={fromAddress} toAddress={toAddress} toAmount={toAmount} fee={fee} setStatus={setStatus} sendTx={sendTx} />
        ) : status == 'sending' ? (
          <Sending />
        ) : status == 'success' ? (
          <Success transaction={ref.current} fromAddress={fromAddress} toAmount={toAmount} setStatus={setStatus} />
        ) : (
          <div>error</div>
        )}
      </Content>
      {status !== 'sending' ? (
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
              window.history.go(-1)
            }}
          >
            <div className="flex items-center justify-center text-lg">
              <ArrowLeftOutlined />
              &nbsp;Back
            </div>
          </Button>
        </Footer>
      ) : (
        <></>
      )}
    </Layout>
  )
}

export default SendIndex
