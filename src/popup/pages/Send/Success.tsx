import { copyToClipboard, formatAddr } from '@/common/utils'
import { EyeOutlined } from '@ant-design/icons'
import { message } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Status, Transaction } from './index'

interface Props {
  transaction: Transaction
  fromAddress: string
  toAmount: number
  setStatus(status: Status): void
}

export default ({ transaction, fromAddress, toAmount, setStatus }: Props) => {
  const { t } = useTranslation()
  const [result, setResult] = useState('sending')

  const sending = () => {
    return new Promise((resolve, reject) => {
      // sending
      setTimeout(() => {
        setResult('success')
      }, 3000)
    })
  }

  useEffect(() => {
    sending()
  }, [])

  useEffect(() => {
    if (result == 'sending') {
      // do something
    }
    // sending
    else if (result == 'success') {
      setStatus('success')
    } else {
      setStatus('error')
    }
  }, [result])

  function copy(str: string) {
    copyToClipboard(str).then(() => {
      message.success({
        duration: 3,
        content: `${str} ${t('copied')}`
      })
    })
  }

  return (
    <div className="flex flex-col items-center mx-auto mt-36 gap-2_5 w-110">
      <img src="./images/Success.svg" alt="" />
      <span className="mt-6 text-2xl">{t('Payment Sent')}</span>
      <span className="text-soft-white">{t('Your transaction has been succesfully sent')}</span>
      <div className="justify-between w-full box nobor text-soft-white mt-2_5">
        <span onClick={(e) => copy(fromAddress)}>{formatAddr(fromAddress, 8)}</span>
        <div className="flex">
          <span className="font-semibold text-white">{toAmount}</span> Novo
        </div>
      </div>
      <div className="flex items-center text-soft-white">
        <EyeOutlined />
        <a href={`https://novoexplorer.com/tx/${transaction.txid}`}>&nbsp;{t('View on Block Explorer')}</a>
      </div>
    </div>
  )
}
