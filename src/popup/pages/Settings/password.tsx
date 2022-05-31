import { handleInputBlur, handleInputFocus } from '@/common/utils'
import CHeader from '@/popup/components/CHeader'
import { useWallet, useWalletRequest } from '@/ui/utils'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { Button, Input, Layout, message } from 'antd'
import { Content, Footer, Header } from 'antd/lib/layout/layout'
import { FocusEvent, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

type Status = '' | 'error' | 'warning' | undefined

export default () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [passwordC, setPasswordC] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [statusC, setStatusC] = useState<Status>('')
  const [status1, setStatus1] = useState<Status>('')
  const [status2, setStatus2] = useState<Status>('')
  const [disabled, setDisabled] = useState(true)
  const wallet = useWallet()

  useEffect(() => {
    setDisabled(true)
    if (password) {
      if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,}$/.test(password)) {
        message.warning('at least six characters and must contain uppercase and lowercase letters and digits')
        setStatus1('error')
        return
      }

      setStatus1('')

      if (password2) {
        if (password !== password2) {
          message.warning('Entered passwords differ')
          setStatus2('error')
          return
        }
        setStatus2('')
      }

      if (passwordC) {
        setDisabled(false)
      }
    }
  }, [passwordC, password, password2])

  const handleOnBlur = (e, type: string) => {
    switch (type) {
      case 'password':
        setPassword(e.target.value)
        break
      case 'password2':
        setPassword2(e.target.value)
        break
      case 'passwordC':
        setPasswordC(e.target.value)
        break
    }
  }

  const [run, loading] = useWalletRequest(wallet.changePassword, {
    onSuccess() {
      message.success(t('Success'), undefined, () => {
        navigate('/dashboard')
      })
    },
    onError(err) {
      message.error(err.message)
    }
  })

  const verify = () => {
    run(passwordC, password)
  }

  return (
    <Layout className="h-full">
      <Header className="border-b border-white border-opacity-10">
        <CHeader />
      </Header>
      <Content style={{ backgroundColor: '#1C1919' }}>
        <div className="flex flex-col items-center mx-auto mt-5 gap-3_75 justify-evenly w-95">
          <div className="flex items-center px-2 text-2xl h-13">Change Password</div>
          <Input.Password
            status={statusC}
            className="font-semibold text-white mt-1_25 box focus:active"
            placeholder="Current Password"
            onBlur={(e) => {
              handleOnBlur(e, 'passwordC')
            }}
            onPressEnter={(e) => {
              handleOnBlur(e, 'passwordC')
            }}
          />
          <Input.Password
            status={status1}
            className="font-semibold text-white mt-1_25 box focus:active"
            placeholder="New Password"
            onBlur={(e) => {
              handleOnBlur(e, 'password')
            }}
            onPressEnter={(e) => {
              handleOnBlur(e, 'password')
            }}
          />
          <Input.Password
            status={status2}
            className="font-semibold text-white mt-1_25 box focus:active"
            placeholder="Confirm Password"
            onBlur={(e) => {
              handleOnBlur(e, 'password2')
            }}
            onPressEnter={(e) => {
              handleOnBlur(e, 'password2')
            }}
          />
          <Button
            disabled={disabled}
            size="large"
            type="primary"
            className="box w380"
            onClick={() => {
              verify()
            }}
          >
            <div className="flex items-center justify-center text-lg">Change Password</div>
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
          }}
        >
          <div className="flex items-center justify-center text-lg">
            <ArrowLeftOutlined />
            <span className='font-semibold leading-4'>&nbsp;Back</span>
          </div>
        </Button>
      </Footer>
    </Layout>
  )
}
