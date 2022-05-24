import { CheckOutlined, RightOutlined } from "@ant-design/icons"
import { Button, Input } from "antd"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { Account, Status } from "./index"

interface Props {
  account: Account
  setAccount(account: Account): void
  setStatus(status: Status): void
}

export default ({ account, setAccount, setStatus }: Props) => {
  const navigate = useNavigate()
  const [currency, setCurrency] = useState(0)

  const verify = () => {
    // to verify
    setStatus("add")
  }

  return (
    <div className="flex flex-col items-center mx-auto mt-5 gap-3_75 justify-evenly w-95">
      <div className="flex items-center px-2 text-2xl h-13">Switch Account</div>
      <Button
        size="large"
        type="default"
        className="box w-115 default"
        onClick={(e) => {
          setCurrency(0)
        }}
      >
        <div className="flex items-center justify-between text-base font-bold">
          <div className="flex-grow text-left">
            {account.name} <span className="font-normal opacity-60">({account.address})</span>
          </div>
          {currency == 0 ? <CheckOutlined style={{ transform: "scale(1.5)", opacity: "80%" }} /> : <></>}
        </div>
      </Button>
      <Button
        size="large"
        type="default"
        className="box w-115 default"
        onClick={(e) => {
          setCurrency(1)
        }}
      >
        <div className="flex items-center justify-between text-base font-bold">
          <div className="flex-grow text-left">
            Account 2 <span className="font-normal opacity-60">(1DpeW...48ztM)</span>
          </div>
          {currency == 1 ? <CheckOutlined style={{ transform: "scale(1.5)", opacity: "80%" }} /> : <></>}
        </div>
      </Button>

      <Button
        size="large"
        type="primary"
        className="box w380"
        onClick={(e) => {
          verify()
        }}
      >
        <div className="flex items-center justify-center text-lg">Add New Account</div>
      </Button>
    </div>
  )
}
