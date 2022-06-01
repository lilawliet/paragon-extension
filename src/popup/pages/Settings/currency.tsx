import { CURRENCIES } from '@/constant'
import CHeader from '@/popup/components/CHeader'
import { useGlobalState } from '@/ui/state/state'
import { useWallet } from '@/ui/utils'
import { ArrowLeftOutlined, CheckOutlined } from '@ant-design/icons'
import { Button, Layout } from 'antd'
import { Content, Footer, Header } from 'antd/lib/layout/layout'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

export default () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const wallet = useWallet()

  const [currency, setCurrency] = useGlobalState('currency')

  const onBtnSetCurrency = async (code: string) => {
    await wallet.setCurrency(code)
    setCurrency(code)
    window.history.go(-1)
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
              key={v.code}
              size="large"
              type="default"
              className="box w-115 default"
              onClick={(e) => {
                onBtnSetCurrency(v.code)
              }}>
              <div className="flex items-center justify-between text-base font-semibold">
                <div className="flex-grow text-left">{`${t(v.name)} (${v.code})`}</div>
                {currency == v.code ? <CheckOutlined style={{ transform: 'scale(1.5)', opacity: '80%' }} /> : <></>}
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
          }}>
          <div className="flex items-center justify-center text-lg">
            <img src="./images/arrow-left.svg" />
            <span className="font-semibold leading-4_5">&nbsp;{t('Back')}</span>
          </div>
        </Button>
      </Footer>
    </Layout>
  )
}
