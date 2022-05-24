import { ArrowRightOutlined } from "@ant-design/icons"
import { Button, Input } from "antd"

import { Transaction, Status } from "./index"

interface Props {
  transaction: Transaction
  setTransaction(transaction: Transaction): void
  setStatus(status: Status): void
}

export default ({ transaction, setTransaction, setStatus }: Props) => {
  const verify = () => {
    // to verify
    setStatus("sending")

    // setStatus('success')
  }

  return (
    <div className="flex flex-col items-center mx-auto mt-5 gap-3_75 justify-evenly w-95">
      <div className="flex items-center px-2 text-2xl h-13">Confirm payment</div>
      <div className="w-full text-left text-soft-white">Recipient</div>
      <div className="justify-between w-full box nobor text-soft-white">
        <span>{transaction.address}</span>
        <span className="text-white">
          <ArrowRightOutlined />
        </span>
        <span>{transaction.address}</span>
      </div>
      <div className="w-full text-left text-soft-white">Recipient</div>
      <div className="justify-end w-full box nobor text-soft-white">
        <span>
          <span className="font-bold text-white">{transaction.amount}</span> Novo
        </span>
      </div>
      <div className="w-full text-left text-soft-white">Recipient</div>
      <div className="justify-end w-full box nobor text-soft-white">
        <span>
          <span className="font-bold text-white">5000</span> Novo
        </span>
      </div>

      <Button
        size="large"
        type="primary"
        className="box w380"
        onClick={(e) => {
          verify()
        }}
      >
        <div className="flex items-center justify-center text-lg">Next</div>
      </Button>
    </div>
  )
}
