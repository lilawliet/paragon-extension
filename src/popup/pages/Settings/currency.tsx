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
        <div className="flex flex-col items-center mx-auto mt-5 gap-3_75 justify-evenly w-95">
          <div className="flex items-center px-2 text-2xl h-13">Currency</div>
          <Button
            size="large"
            type="default"
            className="box w-115 default"
            onClick={(e) => {
              setCurrency(0)
            }}
          >
            <div className="flex items-center justify-between text-base font-semibold">
              <div className="flex-grow text-left">US Dollar (USD)</div>
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
            <div className="flex items-center justify-between text-base font-semibold">
              <div className="flex-grow text-left">Euro (EUR)</div>
              {currency == 1 ? <CheckOutlined style={{ transform: "scale(1.5)", opacity: "80%" }} /> : <></>}
            </div>
          </Button>
          <Button
            size="large"
            type="default"
            className="box w-115 default"
            onClick={(e) => {
              setCurrency(2)
            }}
          >
            <div className="flex items-center justify-between text-base font-semibold">
              <div className="flex-grow text-left">Japanese Yen (JPY)</div>
              {currency == 2 ? <CheckOutlined style={{ transform: "scale(1.5)", opacity: "80%" }} /> : <></>}
            </div>
          </Button>
          <Button
            size="large"
            type="default"
            className="box w-115 default"
            onClick={(e) => {
              setCurrency(3)
            }}
          >
            <div className="flex items-center justify-between text-base font-semibold">
              <div className="flex-grow text-left">British Pound (GBP)</div>
              {currency == 3 ? <CheckOutlined style={{ transform: "scale(1.5)", opacity: "80%" }} /> : <></>}
            </div>
          </Button>
          <Button
            size="large"
            type="default"
            className="box w-115 default"
            onClick={(e) => {
              setCurrency(4)
            }}
          >
            <div className="flex items-center justify-between text-base font-semibold">
              <div className="flex-grow text-left">Swiss Franc (CHF)</div>
              {currency == 4 ? <CheckOutlined style={{ transform: "scale(1.5)", opacity: "80%" }} /> : <></>}
            </div>
          </Button>
          <Button
            size="large"
            type="default"
            className="box w-115 default"
            onClick={(e) => {
              setCurrency(5)
            }}
          >
            <div className="flex items-center justify-between text-base font-semibold">
              <div className="flex-grow text-left">Canadian Dollar (CAD)</div>
              {currency == 5 ? <CheckOutlined style={{ transform: "scale(1.5)", opacity: "80%" }} /> : <></>}
            </div>
          </Button>
        </div>
      </Content>
      <Footer style={{ height: "5.625rem", backgroundColor: "#1C1919", textAlign: "center", width: "100%" }}>
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
