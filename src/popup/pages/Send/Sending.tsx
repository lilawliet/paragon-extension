import { ArrowRightOutlined, LoadingOutlined } from "@ant-design/icons"
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
    <div className="flex flex-col items-center mx-auto text-6xl mt-60 gap-3_75 w-95 text-primary">
      <LoadingOutlined />
      <span className="text-2xl text-white">Sending</span>
    </div>
  )
}
