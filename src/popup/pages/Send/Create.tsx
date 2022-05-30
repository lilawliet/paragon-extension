import { NovoBalance } from '@/background/service/openapi'
import { isValidAddress } from '@/ui/utils'
import { Button, Input } from 'antd'
import { useState } from 'react'
import { Status, Transaction } from './index'

type InputState = '' | 'error' | 'warning' | undefined

interface Props {
  transaction: Transaction

  balance: NovoBalance
  fee: number

  toAddress: string
  toAmount: number
  error: string
  setError(val: string): void
  setToAddress(val: string): void
  setToAmount(val: number): void
  setStatus(status: Status): void
}

export default ({ transaction, balance, fee, toAddress, toAmount, error, setError, setToAddress, setToAmount, setStatus }: Props) => {
  const [statueAdd, setStatueAdd] = useState<InputState>('')
  const [statueAmt, setStatueAmt] = useState<InputState>('')

  const verify = () => {
    setStatueAdd('')
    setStatueAmt('')
    if (!isValidAddress(toAddress)) {
      setStatueAdd('error')
      setError('Invalid address')
      return
    }
    if (toAmount <= 0 || toAmount > parseFloat(balance.amount)) {
      setStatueAmt('error')
      setError('Invalid amount')
      return
    }
    // to verify
    setStatus('confirm')
  }

  return (
    <div className="flex flex-col items-center mx-auto mt-5 gap-3_75 justify-evenly w-95">
      <div className="flex items-center px-2 text-2xl h-13">Send Novo</div>
      <div className="w-15 h-15">
        <img className="w-full" src={'./images/Novo.svg'} alt="" />
      </div>
      <Input
        className="mt-5 font-semibold text-white h-15_5 box default hover"
        placeholder="Recipient’s NOVO address"
        status={statueAdd}
        onChange={async (e) => {
          setToAddress(e.target.value)
        }}
      />
      <div className="flex justify-between w-full mt-5 box text-soft-white">
        <span>Available</span>
        <span>
          <span className="font-semibold text-white">{balance.amount}</span> Novo
        </span>
      </div>
      <Input
        className="font-semibold text-white h-15_5 box default hover"
        placeholder="Amount"
        status={statueAmt}
        onChange={async (e) => {
          const val = parseFloat(e.target.value)
          setToAmount(val)
        }}
      />
      <div className="flex justify-between w-full mt-5 text-soft-white">
        <span>Fee</span>
        <span>
          <span className="font-semibold text-white">{fee}</span> Novo
        </span>
      </div>
      <span className="text-base text-error">{error}</span>
      <Button
        size="large"
        type="primary"
        className="box w380"
        onClick={(e) => {
          verify()
        }}>
        <div className="flex items-center justify-center text-lg">Next</div>
      </Button>
    </div>
  )
}
