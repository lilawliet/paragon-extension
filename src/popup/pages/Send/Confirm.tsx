import { shortAddress } from '@/ui/utils'
import { ArrowRightOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { Status, Transaction } from './index'

interface Props {
  transaction: Transaction
  fromAddress: string
  toAddress: string
  toAmount: number
  fee: number

  sendTx(): void
  setStatus(status: Status): void
}

export default ({ transaction, fromAddress, toAddress, toAmount, fee, sendTx, setStatus }: Props) => {
  return (
    <div className="flex flex-col items-center mx-auto mt-5 gap-3_75 justify-evenly w-95">
      <div className="flex items-center px-2 text-2xl h-13">Confirm payment</div>
      <div className="w-full text-left text-soft-white">Recipient</div>
      <div className="justify-between w-full box nobor text-soft-white">
        <span>{shortAddress(fromAddress)}</span>
        <span className="text-white">
          <ArrowRightOutlined />
        </span>
        <span>{shortAddress(toAddress)}</span>
      </div>
      <div className="w-full text-left text-soft-white">Amount</div>
      <div className="justify-end w-full box nobor text-soft-white">
        <span>
          <span className="font-semibold text-white">{toAmount}</span> Novo
        </span>
      </div>
      <div className="w-full text-left text-soft-white">Fee</div>
      <div className="justify-end w-full box nobor text-soft-white">
        <span>
          <span className="font-semibold text-white">{fee}</span> Novo
        </span>
      </div>

      <Button
        size="large"
        type="primary"
        className="box w380"
        onClick={(e) => {
          sendTx()
        }}
      >
        <div className="flex items-center justify-center text-lg">Next</div>
      </Button>
    </div>
  )
}
