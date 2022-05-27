import { Account } from '@/background/service/preference'
import { copyToClipboard } from '@/common/utils'
import CHeader from '@/popup/components/CHeader'
import { shortAddress, useWallet } from '@/ui/utils'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { Button, Layout, message } from 'antd'
import { Content, Footer, Header } from 'antd/lib/layout/layout'
import QRCode from 'qrcode.react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'

const Receive = () => {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()

  const wallet = useWallet()
  const [size, setSize] = useState(210)

  const [currentAccount, setCurrentAccount] = useState<Account | null>(null)

  useEffect(() => {
    const html = document.getElementsByTagName('html')[0]
    if (html && getComputedStyle(html).fontSize) {
      setSize((210 * parseFloat(getComputedStyle(html).fontSize)) / 16)
    }
    ;(async () => {
      const account = await wallet.getCurrentAccount()
      setCurrentAccount(account)
    })()
  }, [])

  function copy(str: string) {
    copyToClipboard(str).then(() => {
      message.success({
        duration: 3,
        content: `${str} copied`
      })
    })
  }

  return (
    <Layout className="h-full">
      <Header className="border-b border-white border-opacity-10">
        <CHeader />
      </Header>
      <Content style={{ backgroundColor: '#1C1919' }}>
        <div className="flex flex-col items-center gap-10 mx-auto mt-5 justify-evenly w-110">
          <div className="flex items-center px-2 text-2xl h-13 w340">Deposit Novo</div>
          <div className="flex items-center justify-center bg-white rounded-2xl h-60 w-60">
            <QRCode value={currentAccount?.address || ''} renderAs="svg" size={size}></QRCode>
          </div>
          <div className="flex flex-col w-full gap-5">
            <div
              className="grid w-full grid-cols-6 px-10 box default py-2_5"
              onClick={(e) => {
                copy(currentAccount?.address || '')
              }}>
              <div className="flex items-center">
                <img src="./images/copy-solid.png" alt="" />
              </div>
              <div className="flex flex-col flex-grow col-span-5 items-begin">
                <span className="font-semibold">{currentAccount?.alianName}</span>
                <span className="text-soft-white">{shortAddress(currentAccount?.address || '')}</span>
              </div>
            </div>
            <div className="text-base text-center text-soft-white">This address can only receive Novo</div>
          </div>
        </div>
      </Content>
      <Footer style={{ height: '5.625rem', backgroundColor: '#1C1919', textAlign: 'center', width: '100%' }}>
        <Button
          size="large"
          type="default"
          className="box w440"
          onClick={(e) => {
            window.history.go(-1)
          }}>
          <div className="flex items-center justify-center text-lg">
            <ArrowLeftOutlined />
            &nbsp;Back
          </div>
        </Button>
      </Footer>
    </Layout>
  )
}

export default Receive
