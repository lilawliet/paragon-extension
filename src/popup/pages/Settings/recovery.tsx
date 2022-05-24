import CHeader from "@/popup/components/CHeader"
import { ArrowLeftOutlined, CheckOutlined, RightOutlined } from "@ant-design/icons"
import { Button, Input, Layout } from "antd"
import { Content, Footer, Header } from "antd/lib/layout/layout"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default () => {
  const navigate = useNavigate()
  const [currency, setCurrency] = useState(0)

  return (
    <Layout className="h-full">
      <Header className="border-b border-white border-opacity-10">
        <CHeader />
      </Header>
      <Content style={{ backgroundColor: "#1C1919" }}>
        <div className="flex flex-col items-center mx-auto mt-5 text-center gap-3_75 justify-evenly w-95">
          <div className="flex items-center px-2 text-2xl h-13">Secret Recovery Phrase</div>
          <div className="text-base text-warn box w380">
            This phrase is the Only way to <br />
            recover your wallet. Do NOT share it with anyone!
          </div>
          <div>{/* margin */} </div>
          <div className="p-5 font-semibold select-text box default text-4_5 w380 leading-6_5">
            glare knee able beach success comic giant aerobic myself false debris attack
          </div>
        </div>
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
            window.history.go(-1)
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
