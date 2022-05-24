import { ArrowRightOutlined, EyeOutlined, LoadingOutlined } from "@ant-design/icons"
import { Button, Input } from "antd"
import { result } from "lodash"
import { useEffect, useState } from "react"

import { Transaction, Status } from "./index"

interface Props {
    transaction: Transaction
    setTransaction(transaction: Transaction): void
    setStatus(status: Status): void
}

export default ({ transaction, setTransaction, setStatus }: Props) => {
  const verify = () => {
    // to verify
    setStatus("success")

    // setStatus('success')
  }

  const [result, setResult] = useState("sending")

  const sending = () => {
    return new Promise((resolve, reject) => {
      // sending
      setTimeout(() => {
        console.log("sending2")
        setResult("success")
      }, 3000)
    })
  }

  useEffect(() => {
    sending()
  }, [])

  useEffect(() => {
    if (result == "sending") {
      console.log("sending1")
    }
    // sending
    else if (result == "success") {
      console.log("success")
      setStatus("success")
    } else {
      setStatus("error")
    }
  }, [result])

  return (
    <div className="flex flex-col items-center mx-auto mt-36 gap-2_5 w-110">
      <img src="./images/Success.png" alt="" />
      <span className="mt-6 text-2xl">Payment Sent</span>
      <span className="text-soft-white">Your transaction has been succesfully sent</span>
      <div className="justify-between w-full box nobor text-soft-white mt-2_5">
        <span>{transaction.address}</span>
        <span>
          <span className="font-semibold text-white">{transaction.amount}</span> Novo
        </span>
      </div>
      <div className="flex items-center text-soft-white">
        <EyeOutlined />
                &nbsp;View on Block Explorer
      </div>
    </div>
  )
}
