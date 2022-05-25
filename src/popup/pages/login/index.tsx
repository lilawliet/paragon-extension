import { Button, Input, message } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import React, { ChangeEventHandler, useEffect, useRef, useState } from 'react'
import { useApproval, useWallet, useWalletRequest } from '@/ui/utils'

const Login = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const wallet = useWallet()
  const [, resolveApproval] = useApproval()

  const [password, setPassword] = useState('')
  const [disabled, setDisabled] = useState(true)

  const [run] = useWalletRequest(wallet.unlock, {
    onSuccess() {
      resolveApproval()
    },
    onError(err) {
      message.error('PASSWORD ERROR')
    }
  })

  const btnClick = () => {
    // to create wallet
    run(password)
    // jump to dashboard
    // navigate("/dashboard")
  }

  const verify = (e: React.ChangeEvent<HTMLInputElement>) => {
    // to verify
    setPassword(e.target.value)
  }

  useEffect(() => {
    if (password) {
      if (true) {
        setDisabled(false)
      }
    }
  }, [password])

  return (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col items-center">
        <div className="flex justify-center mb-15 gap-x-4 w-70">
          <img className="select-none w-15 h-12_5" src="./images/Diamond.svg" />
          <img src="./images/Paragon.svg" className="select-none" alt="" />
        </div>
        <div className="grid gap-5">
          <div className="text-2xl text-center text-white">Enter your password</div>
          <div>
            <Input.Password placeholder="Password" onChange={verify} />
          </div>
          <div>
            <Button disabled={disabled} size="large" type="primary" className="box w380 content" onClick={btnClick}>
              {t('Unlock')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
