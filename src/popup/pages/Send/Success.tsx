import { EyeOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { Status, Transaction } from './index'

interface Props {
  transaction: Transaction
  fromAddress: string
  toAmount: number
  setStatus(status: Status): void
}

export default ({ transaction, fromAddress, toAmount, setStatus }: Props) => {
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

  return (
    <div className="flex flex-col items-center mx-auto mt-36 gap-2_5 w-110">
      <img src="./images/Success.svg" alt="" />
      <span className="mt-6 text-2xl">Payment Sent</span>
      <span className="text-soft-white">Your transaction has been succesfully sent</span>
      <div className="justify-between w-full box nobor text-soft-white mt-2_5">
        <span>{fromAddress}</span>
        <span>
          <span className="font-semibold text-white">{toAmount}</span> Novo
        </span>
      </div>
      <div className="flex items-center text-soft-white">
        <EyeOutlined />
        &nbsp;View on Block Explorer
      </div>
    </div>
  )
}
