import { LANGS } from '@/constant'
import i18n, { addResourceBundle } from '@/i18n'
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
  const wallet = useWallet()
  const navigate = useNavigate()
  const [locale, setLocale] = useGlobalState('locale')

  const handleSwitchLang = async (value: string) => {
    await wallet.setLocale(value)
    setLocale(value)
    await addResourceBundle(value)
    i18n.changeLanguage(value)
    navigate('/dashboard')
    window.location.reload()
  }

  return (
    <Layout className="h-full">
      <Header className="border-b border-white border-opacity-10">
        <CHeader />
      </Header>
      <Content style={{ backgroundColor: '#1C1919' }}>
        <div className="flex flex-col items-center mx-auto mt-5 gap-3_75 justify-evenly w-95">
          <div className="flex items-center px-2 text-2xl h-13">{t('Language')}</div>
          {LANGS.map((item, index) => {
            return (
              <Button
                key={index}
                size="large"
                type="default"
                className="box w-115 default"
                onClick={(e) => {
                  handleSwitchLang(item.value)
                }}>
                <div className="flex items-center justify-between text-base font-semibold">
                  <div className="flex-grow text-left">{t(item.label)}</div>
                  {item.value == locale ? <CheckOutlined style={{ transform: 'scale(1.5)', opacity: '80%' }} /> : <></>}
                </div>
              </Button>
            )
          })}
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
            <span className="font-semibold leading-4">&nbsp;{t('Back')}</span>
          </div>
        </Button>
      </Footer>
    </Layout>
  )
}
