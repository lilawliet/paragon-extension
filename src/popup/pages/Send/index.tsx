import { COIN_DUST } from '@/constant'
import CHeader from '@/popup/components/CHeader'
import { useGlobalState } from '@/ui/state/state'
import { isValidAddress, sleep, useWallet } from '@/ui/utils'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { Button, Layout, message } from 'antd'
import { Content, Footer, Header } from 'antd/lib/layout/layout'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import SendConfirm from './Confirm'
import SendCreate from './Create'
import Error from './Error'
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

  const [currentAccount] = useGlobalState('currentAccount')

  const [fromAddress, setFromAddress] = useState(currentAccount?.address || '')
  const [accountBalance] = useGlobalState('accountBalance')
  const [toAddress, setToAddress] = useState('')
  const [toAmount, setToAmount] = useState(0)
  const [fee, setFee] = useState(0)
  const wallet = useWallet()
  const ref = useRef<Transaction>({
    rawtx: '',
    txid: ''
  })

  const [status, setStatus] = useState<Status>('success')
  const [error, setError] = useState('')

  const sendTx = useCallback(async () => {
    try {
      setStatus('sending')
      const txid = await wallet.pushTx(ref.current.rawtx)
      ref.current.txid = txid
      await sleep(3)
      setStatus('success')
    } catch (e) {
      message.error((e as any).message)
      setStatus('error')
    }
  }, [ref.current.rawtx])

  useEffect(() => {
    setError('')
    if (!isValidAddress(toAddress)) {
      return
    }
    if (toAmount <= COIN_DUST || toAmount > parseFloat(accountBalance.amount)) {
      return
    }
    const run = async () => {
      if (!isValidAddress(toAddress)) {
        setError('Invalid address')
        return
      }
      if (toAmount < COIN_DUST || toAmount > parseFloat(accountBalance.amount)) {
        setError('Invalid amount')
        return
      }
      const { fee, rawtx } = await wallet.sendNovo({ to: toAddress, amount: toAmount })
      setFee(fee)
      ref.current.rawtx = rawtx
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
          <SendCreate
            transaction={ref.current}
            fee={fee}
            setToAddress={setToAddress}
            setToAmount={setToAmount}
            setStatus={setStatus}
            toAddress={toAddress}
            toAmount={toAmount}
            setError={setError}
            error={error}
          />
        ) : status == 'confirm' ? (
          <SendConfirm transaction={ref.current} fromAddress={fromAddress} toAddress={toAddress} toAmount={toAmount} fee={fee} setStatus={setStatus} sendTx={sendTx} />
        ) : status == 'sending' ? (
          <Sending />
        ) : status == 'success' ? (
          <Success transaction={ref.current} fromAddress={fromAddress} toAmount={toAmount} setStatus={setStatus} />
        ) : (
          <Error transaction={ref.current} fromAddress={fromAddress} toAmount={toAmount} setStatus={setStatus} />
        )}
      </Content>
      {status !== 'sending' ? (
        <Footer
          style={{
            height: '5.625rem',
            backgroundColor: '#1C1919',
            textAlign: 'center',
            width: '100%'
          }}>
          <Button
            size="large"
            type="default"
            className="box w440"
            onClick={(e) => {
              if (status == 'create') {
                window.history.go(-1)
              } else if (status == 'confirm') {
                setStatus('create')
              } else if (status == 'success') {
                window.history.go(-1)
              } else {
                setStatus('create')
              }
            }}>
            <div className="flex items-center justify-center text-lg">
              <img src="./images/arrow-left.svg" />
              <span className="font-semibold leading-4_5">&nbsp;{t('Back')}</span>
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
