import { copyToClipboard } from '@/common/utils'
import CHeader from '@/popup/components/CHeader'
import { useWallet } from '@/ui/utils'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { Button, Input, Layout, message } from 'antd'
import { Content, Footer, Header } from 'antd/lib/layout/layout'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
export default () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [currency, setCurrency] = useState(0)

  const [password, setPassword] = useState('')
  const [disabled, setDisabled] = useState(true)

  const [mnemonic, setMnemonic] = useState('')
  const [error, setError] = useState('')
  const wallet = useWallet()
  const btnClick = async () => {
    try {
      const _res = await wallet.getMnemonics(password)
      setMnemonic(_res)
    } catch (e) {
      setError((e as any).message)
    }
  }

  useEffect(() => {
    if (password) {
      // if (true) {
      setDisabled(false)
      setError('')
      // }
    }
  }, [password])

  function copy(str: string) {
    copyToClipboard(str).then(() => {
      message.success({
        duration: 3,
        content: 'copied'
      })
    })
  }
  return (
    <Layout className="h-full">
      <Header className="border-b border-white border-opacity-10">
        <CHeader />
      </Header>

      <Content style={{ backgroundColor: '#1C1919' }}>
        <div className="flex flex-col items-center mx-auto mt-5 text-center gap-3_75 justify-evenly w-95">
          <div className="flex items-center px-2 text-2xl h-13">Secret Recovery Phrase</div>

          {mnemonic == '' ? (
            <div className="flex flex-col items-center mx-auto mt-5 text-center gap-3_75 justify-evenly w-95">
              <div className="text-warn box w380 text-left">Type your Paragon password</div>
              <div className="box w380">
                <Input.Password
                  placeholder="Password"
                  onChange={(e) => {
                    setPassword(e.target.value)
                  }}
                />
              </div>
              <div className="text-base text-warn box w380">{error}</div>
              <div>
                <Button disabled={disabled} size="large" type="primary" className="box w380 content" onClick={btnClick}>
                  {t('Show Secret Recovery Phrase')}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center mx-auto mt-5 text-center gap-3_75 justify-evenly w-95">
              <div className="text-base text-warn box w380">
                This phrase is the ONLY way to <br />
                recover your wallet. Do NOT share it with anyone!
                <br /> (click to copy)
              </div>
              <div>{/* margin */} </div>
              <div
                className="p-5 font-semibold select-text box default text-4_5 w380 leading-6_5"
                onClick={(e) => {
                  copy(mnemonic)
                }}>
                {mnemonic}
              </div>
            </div>
          )}
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
