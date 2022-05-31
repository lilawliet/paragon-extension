import { Account } from '@/background/service/preference'
import { formatAddr } from '@/common/utils'
import { KEYRING_CLASS } from '@/constant'
import CHeader from '@/popup/components/CHeader'
import { useWallet } from '@/ui/utils'
import { ArrowLeftOutlined, ExclamationCircleOutlined, EyeOutlined } from '@ant-design/icons'
import { Modal } from 'antd'
import Button from 'antd/lib/button'
import Layout from 'antd/lib/layout'
import { Content, Footer, Header } from 'antd/lib/layout/layout'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export default () => {
  const { t } = useTranslation()
  const wallet = useWallet()
  const [currentAccount, setCurrentAccont] = useState<Account | null>(null)
  const { confirm } = Modal
  
  useEffect(()=> {
    (async () =>{
      setCurrentAccont(await wallet.getCurrentAccount())
    })()
  }, [])

  const showConfirm = () => {
    confirm({
      className: 'modal',
      icon: <ExclamationCircleOutlined />,
      content: <span>This is an imported account. You will not be able to recover this account with your Secret Recovery Phrase. This action is not reversible.</span>,
      onOk() {
      },
      onCancel() {
        // pass
      }
  })}

  return (
    <Layout className="h-full">
      <Header className="border-b border-white border-opacity-10">
        <CHeader />
      </Header>
      <Content style={{ backgroundColor: '#1C1919' }}>
        <div className="flex flex-col items-center mx-auto mt-36 gap-2_5 w-110">
          <img src="./images/Delete.svg" alt="" />
          <span className="mt-6 text-2xl">Remove Account</span>
          <span className="text-2xl text-soft-white">{formatAddr(currentAccount?.address??'', 8)} { currentAccount?.type == KEYRING_CLASS.PRIVATE_KEY ? <span>Imported</span>  : <></>}</span>
          <span className="text-base text-center text-error">
            This is an imported account. You will not be able to recover this account with your Secret Recovery Phrase. This action is not reversible.
          </span>
          <Button
            danger
            type='text'
            size="large"
            className="box w440 mt-3_75"
            onClick={showConfirm}
          >
            <div className="font-semibold text-center text-4_5">
              {t('Remove Account')}
            </div>
          </Button>
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
            <span className='font-semibold leading-4'>&nbsp;Back</span>
          </div>
        </Button>
      </Footer>
    </Layout>
  )
}
