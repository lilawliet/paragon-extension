import CHeader from '@/popup/components/CHeader'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { Button, Layout } from 'antd'
import { Content, Footer, Header } from 'antd/lib/layout/layout'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import AccountAdd from './Add'
import AccountCreate from './Create'
import AccountImport from './Import'
import AccountSwitch from './Switch'

export type Status = 'switch' | 'add' | 'import' | 'create'

const SendIndex = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [status, setStatus] = useState<Status>('switch')

  const statusBack = () => {
    if (status == 'import' || status == 'create') {
      setStatus('add')
    } else if (status == 'add') {
      setStatus('switch')
    } else {
      window.history.go(-1)
    }
  }

  return (
    <Layout className="h-full">
      <Header className="border-b border-white border-opacity-10">
        <CHeader />
      </Header>
      <Content style={{ backgroundColor: '#1C1919' }}>
        {status == 'switch' ? (
          <AccountSwitch setStatus={setStatus} />
        ) : status == 'add' ? (
          <AccountAdd setStatus={setStatus} />
        ) : status == 'import' ? (
          <AccountImport setStatus={setStatus} />
        ) : status == 'create' ? (
          <AccountCreate setStatus={setStatus} />
        ) : (
          <div>error</div>
        )}
      </Content>
      <Footer
        style={{
          height: '5.625rem',
          backgroundColor: '#1C1919',
          textAlign: 'center',
          width: '100%'
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
            <img src="./images/arrow-left.svg" />
            <span className="font-semibold leading-4_5">&nbsp;{t('Back')}</span>
          </div>
        </Button>
      </Footer>
    </Layout>
  )
}

export default SendIndex
