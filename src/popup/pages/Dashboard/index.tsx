import { Layout } from "antd"
import { useTranslation } from "react-i18next"
import { Content, Footer, Header } from "antd/lib/layout/layout"
import CHeader from "@/popup/components/CHeader"
import CFooter from "@/popup/components/CFooter"
import Home from "./Home"
import Transaction from "./Transaction"
import Settings from "./Settings"

import { getPanel } from "@/common/storages/stores/popup/slice"
import { useAppDispatch, useAppSelector } from "@/common/storages/hooks"
import { useLocation } from "react-router-dom"
import { getUiType } from "@/ui/utils"

interface State {
  keyring: string;
  isMnemonics?: boolean;
  isWebHID?: boolean;
  path?: string;
  keyringId?: number | null;
  ledgerLive?: boolean;
}

const Dashboard = () => {
  const { t } = useTranslation()
  const panel = useAppSelector(getPanel)
  const { state } = useLocation()

  return (
    <Layout className="h-full">
      <Header className="border-b border-white border-opacity-10">
        <CHeader />
      </Header>
      <Content style={{ backgroundColor: "#1C1919", overflowY: "auto" }}>
        {panel == "home" ? <Home /> : panel == "transaction" ? <Transaction /> : panel == "settings" ? <Settings /> : <Home />}
      </Content>
      <Footer style={{ height: "5.625rem" }}>
        <CFooter />
      </Footer>
    </Layout>
  )
}

export default Dashboard
