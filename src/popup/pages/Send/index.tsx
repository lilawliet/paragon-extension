import { Button, Divider, Input, Layout, Statistic } from "antd"
import { useTranslation } from "react-i18next"
import { Content, Footer, Header } from "antd/lib/layout/layout"
import { ArrowLeftOutlined } from "@ant-design/icons"
import CHeader from "@/popup/components/CHeader"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import SendCreate from "./Create"
import SendConfirm from "./Confirm"
import Sending from "./Sending"
import Success from "./Success"

export interface Transaction {
    time: number
    address: string
    amount: string
}

export type Status = "create" | "confirm" | "sending" | "success" | "error"

const SendIndex = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [status, setStatus] = useState<Status>("create")
  const [transaction, setTransaction] = useState<Transaction>({
    time: 1652188199,
    address: "sadfjkl2j343jlk",
    amount: "+1,224"
  })

  useEffect(() => {
    console.log(status)
  }, [status])

  return (
    <Layout className="h-full">
      <Header className="border-b border-white border-opacity-10">
        <CHeader />
      </Header>
      <Content style={{ backgroundColor: "#1C1919" }}>
        {status == "create" ? (
          <SendCreate transaction={transaction} setTransaction={setTransaction} setStatus={setStatus} />
        ) : status == "confirm" ? (
          <SendConfirm transaction={transaction} setTransaction={setTransaction} setStatus={setStatus} />
        ) : status == "sending" ? (
          <Sending transaction={transaction} setTransaction={setTransaction} setStatus={setStatus} />
        ) : status == "success" ? (
          <Success transaction={transaction} setTransaction={setTransaction} setStatus={setStatus} />
        ) : (
          <div>error</div>
        )}
      </Content>
      {status !== "sending" ? (
        <Footer
          style={{
            height: "5.625rem",
            backgroundColor: "#1C1919",
            textAlign: "center",
            width: "100%"
          }}
        >
          <Button
            size="large"
            type="default"
            className="box w440"
            onClick={(e) => {
              window.history.go(-1)
            }}
          >
            <div className="flex items-center justify-center text-lg">
              <ArrowLeftOutlined />
                            &nbsp;Back
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
