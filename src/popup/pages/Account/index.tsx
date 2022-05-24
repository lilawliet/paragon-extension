import { Button, Divider, Input, Layout, Statistic } from "antd"
import { useTranslation } from "react-i18next"
import { Content, Footer, Header } from "antd/lib/layout/layout"
import { ArrowLeftOutlined } from "@ant-design/icons"
import CHeader from "@/popup/components/CHeader"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import AccountSwitch from "./Switch"
import AccountAdd from "./Add"
import AccountCreate from "./Create"
import AccountImport from "./Import"

export interface Account {
  name: string
  address: string
}

export type Status = "switch" | "add" | "import" | "create"

const SendIndex = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [status, setStatus] = useState<Status>("switch")
  const [accounts, setAccounts] = useState<Account[]>([])
  const [account, setAccount] = useState<Account>({
    name: "Very Long Account Name",
    address: "sadfjkl2j343jlk"
  })

  const statusBack = () => {
    if (status == "import" || status == "create") {
      setStatus("add")
    } else if (status == "add") {
      setStatus("switch")
    } else {
      window.history.go(-1)
    }
  }

  useEffect(() => {
    console.log(status)
  }, [status])

  return (
    <Layout className="h-full">
      <Header className="border-b border-white border-opacity-10">
        <CHeader />
      </Header>
      <Content style={{ backgroundColor: "#1C1919" }}>
        {status == "switch" ? (
          <AccountSwitch account={account} setAccount={setAccount} setStatus={setStatus} />
        ) : status == "add" ? (
          <AccountAdd account={account} setAccount={setAccount} setStatus={setStatus} />
        ) : status == "import" ? (
          <AccountImport account={account} setAccount={setAccount} setStatus={setStatus} />
        ) : status == "create" ? (
          <AccountCreate account={account} setAccount={setAccount} setStatus={setStatus} />
        ) : (
          <div>error</div>
        )}
      </Content>
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
            statusBack()
          }}
        >
          <div className="flex items-center justify-center text-lg">
            <ArrowLeftOutlined />
            &nbsp;Back
          </div>
        </Button>
      </Footer>
    </Layout>
  )
}

export default SendIndex
