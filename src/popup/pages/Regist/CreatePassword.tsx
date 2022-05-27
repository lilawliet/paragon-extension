import { Button, Input, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { useWallet, useWalletRequest } from '@/ui/utils'

type Status = '' | 'error' | 'warning' | undefined

const CreatePassword = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const wallet = useWallet()

  const [password, setPassword] = useState('')
  const [placeholder1, setPlaceholder1] = useState('Password')
  const [status1, setStatus1] = useState<Status>('')

  const [password2, setPassword2] = useState('')
  const [placeholder2, setPlaceholder2] = useState('Confirm Password')
  const [status2, setStatus2] = useState<Status>('')

  const [disabled, setDisabled] = useState(true)
  const [active, setActive] = useState('')

  message.config({
    maxCount: 1
  })

  const [run, loading] = useWalletRequest(wallet.boot, {
    onSuccess() {
      navigate('/create-recovery', {
        state: {
          create: true
        }
      })
    },
    onError(err) {
      message.error(err)
    }
  })

  const btnClick = () => {
    run(password.trim())
  }

  const verify = (pwd2: string) => {
    if (pwd2 !== password) {
      setStatus2('error')
      message.warning('Entered passwords differ')
    }
  }

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
        if (password === password2) {
          setStatus2('')
          setDisabled(false)
        }
      }
    }
  }, [password, password2])

  useEffect(() => {
    setPlaceholder1('Password')
    setPlaceholder2('Confirm Password')

    if ('password1' == active) {
      setActive('password1')
      setPlaceholder1('')
    } else if ('password2' == active) {
      setActive('password2')
      setPlaceholder2('')
    }
  }, [active])

  return (
    <div className="flex justify-center pt-45">
      <div className="flex flex-col justify-center gap-5 text-center">
        <div className="text-2xl text-white box w380">Create a password</div>
        <div className="text-base text-soft-white box w380">You will use this to unlock your wallet</div>
        <div className="mt-12">
          <Input.Password
            status={status1}
            className={active == 'password1' ? 'active' : ''}
            placeholder={placeholder1}
            onFocus={(e) => {
              setActive('password1')
            }}
            onBlur={(e) => {
              setPassword(e.target.value)
            }}
          />
        </div>
        <div>
          <Input.Password
            status={status2}
            className={active == 'password2' ? 'active' : ''}
            placeholder={placeholder2}
            onFocus={(e) => {
              setActive('password2')
            }}
            onChange={(e) => {
              setPassword2(e.target.value)
            }}
            onBlur={(e) => {
              verify(e.target.value)
            }}
          />
        </div>
        <div>
          <Button disabled={disabled} size="large" type="primary" className="box w380 content" onClick={btnClick}>
            {t('Continue')}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CreatePassword
