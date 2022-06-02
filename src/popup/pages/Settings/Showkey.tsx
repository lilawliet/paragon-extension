import { copyToClipboard } from '@/common/utils'
import CHeader from '@/popup/components/CHeader'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { Button, Layout, message } from 'antd'
import { Content, Footer, Header } from 'antd/lib/layout/layout'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

export default () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  function copy(str: string) {
    copyToClipboard(str).then(() => {
      message.success({
        duration: 3,
        content: t('copied')
      })
    })
  }

  return (
    <Layout className="h-full">
      <Header className="border-b border-white border-opacity-10">
        <CHeader />
      </Header>
      <Content style={{ backgroundColor: '#1C1919' }}>
        <div className="flex flex-col items-center mx-auto mt-5 gap-3_75 justify-evenly w-95">
          <div className="flex items-center px-2 text-2xl h-13">Export Private Key</div>
          <div className="text-base text-center text-soft-white">
            If you ever change browsers or move computers, you will need this Private Key to access this account. Save it somewhere safe and secret.
          </div>
          <div
            className="grid w-full grid-cols-6 p-5 box default mt-1_25"
            onClick={(e) => {
              copy('address')
            }}
          >
            <div className="h-5_5">
              <img src="./images/copy-solid.png" alt="" />
            </div>
            <span className="text-soft-white">{'address'}</span>
          </div>
          <div className="text-soft-white">Derivation Path::m/44'/0'/0'/0/0</div>
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
            <span className="font-semibold leading-4">&nbsp;Back</span>
          </div>
        </Button>
      </Footer>
    </Layout>
  )
}
