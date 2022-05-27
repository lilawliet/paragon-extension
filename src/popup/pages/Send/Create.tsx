import { NovoBalance } from '@/background/service/openapi'
import { isValidAddress, satoshisToNovo } from '@/ui/utils'
import { Button, Input } from 'antd'
import { Status, Transaction } from './index'

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
  const verify = () => {
    if (!isValidAddress(toAddress)) {
      setError('Invalid address')
      return
    }
    if (toAmount <= 0 || toAmount > balance.amount / 10000) {
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
      <div className="flex items-center w-full p-5 mt-5 h-15_5 box default">
        <Input
          className="font-semibold text-white p0"
          bordered={false}
          status="error"
          placeholder="Recipient’s NOVO address"
          onChange={async (e) => {
            setToAddress(e.target.value)
          }}
        />
      </div>
      <div className="flex justify-between w-full mt-5 box text-soft-white">
        <span>Available</span>
        <span>
          <span className="font-semibold text-white">{satoshisToNovo(balance.amount)}</span> Novo
        </span>
      </div>
      <div className="flex items-center w-full p-5 h-15_5 box default">
        <Input
          className="font-semibold text-white p0"
          bordered={false}
          placeholder="Amount"
          onChange={async (e) => {
            const val = parseFloat(e.target.value)
            setToAmount(val)
          }}
        />
      </div>
      <div className="flex justify-between w-full mt-5 text-soft-white">
        <span>Fee</span>
        <span>
          <span className="font-semibold text-white">{fee}</span> Novo
        </span>
      </div>
      <span className="font-semibold text-white text-warn">{error}</span>
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
