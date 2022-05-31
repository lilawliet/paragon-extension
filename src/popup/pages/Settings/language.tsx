import i18n, { addResourceBundle } from '@/i18n'
import CHeader from '@/popup/components/CHeader'
import { useWallet } from '@/ui/utils'
import { ArrowLeftOutlined, CheckOutlined, RightOutlined } from '@ant-design/icons'
import { Button, Input, Layout } from 'antd'
import { Content, Footer, Header } from 'antd/lib/layout/layout'
import { t } from 'i18next'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

interface Setting {
  label: string
  value: string
}

const SettingList: Setting[] = [
  {
    label: t('English'),
    value: 'en'
  },
  {
    label: t('Chinese'),
    value: 'zh_CN'
  },
  {
    label: t('Japanese'),
    value: 'ja'
  },
  {
    label: t('Spanish'),
    value: 'es'
  }
]

export default () => {
  const { t } = useTranslation()
  const wallet = useWallet()
  const [lang, setLang] = useState('en')

  const handleSwitchLang = async (value: string) => {
    await wallet.setLocale(value)
    await addResourceBundle(value)
    i18n.changeLanguage(value)
    window.location.reload()
  }

  const init = async () => {
    const locale = await wallet.getLocale()
    setLang(locale)
  }

  // useEffect(() => {
  //   if(reload) {
  //     window.location.reload()
  //   }
  // }, [reload])

  useEffect(() => {
    init()
  }, [])

  return (
    <Layout className="h-full">
      <Header className="border-b border-white border-opacity-10">
        <CHeader />
      </Header>
      <Content style={{ backgroundColor: '#1C1919' }}>
        <div className="flex flex-col items-center mx-auto mt-5 gap-3_75 justify-evenly w-95">
          <div className="flex items-center px-2 text-2xl h-13">{t('Language')}</div>
          {SettingList.map((item, index) => {
            return (
              <Button
                key={index}
                size="large"
                type="default"
                className="box w-115 default"
                onClick={(e) => {
                  handleSwitchLang(item.value)
                }}
              >
                <div className="flex items-center justify-between text-base font-semibold">
                  <div className="flex-grow text-left">{item.label}</div>
                  {item.value == lang ? <CheckOutlined style={{ transform: 'scale(1.5)', opacity: '80%' }} /> : <></>}
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
