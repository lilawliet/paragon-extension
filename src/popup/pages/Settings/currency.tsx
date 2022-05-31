import { CURRENCIES } from '@/constant'
import CHeader from '@/popup/components/CHeader'
import { useWallet } from '@/ui/utils'
import { ArrowLeftOutlined, CheckOutlined } from '@ant-design/icons'
import { Button, Layout } from 'antd'
import { Content, Footer, Header } from 'antd/lib/layout/layout'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

export default () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const wallet = useWallet()

  const [currency, setCurrency] = useState('USD')
  useEffect(() => {
    ;(async () => {
      const currency = await wallet.getCurrency()
      setCurrency(currency)
    })()
  }, [])

  const onBtnSetCurrency = async (symbol: string) => {
    await wallet.setCurrency(symbol)
    setCurrency(symbol)
  }

  return (
    <Layout className="h-full">
      <Header className="border-b border-white border-opacity-10">
        <CHeader />
      </Header>
      <Content style={{ backgroundColor: '#1C1919' }}>
        <div className="flex flex-col items-center mx-auto mt-5 gap-3_75 justify-evenly w-95">
          <div className="flex items-center px-2 text-2xl h-13">{t('Currency')}</div>

          {CURRENCIES.map((v) => (
            <Button
              key={v.symbol}
              size="large"
              type="default"
              className="box w-115 default"
              onClick={(e) => {
                onBtnSetCurrency(v.symbol)
              }}
            >
              <div className="flex items-center justify-between text-base font-semibold">
                <div className="flex-grow text-left">{`${v.name} (${v.symbol})`}</div>
                {currency == v.symbol ? <CheckOutlined style={{ transform: 'scale(1.5)', opacity: '80%' }} /> : <></>}
              </div>
            </Button>
          ))}
        </div>
      </Content>
      <Footer style={{ height: '5.625rem', backgroundColor: '#1C1919', textAlign: 'center', width: '100%' }}>
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
            <span className="font-semibold leading-4">&nbsp;{t('Back')}</span>
          </div>
        </Button>
      </Footer>
    </Layout>
  )
}
