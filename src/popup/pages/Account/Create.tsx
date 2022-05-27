import { useWallet } from '@/ui/utils'
import { Button, Input, message } from 'antd'
import { useNavigate } from 'react-router-dom'

import { KEYRING_CLASS } from '@/constant'
import { useTranslation } from 'react-i18next'
import { updateAlianName } from '@/common/storages/stores/popup/slice'
import { useAppDispatch } from '@/common/storages/hooks'
import { useEffect, useState } from 'react'
import { Status } from '.'

interface Props {
  setStatus(status: Status): void
}

export default ({ setStatus }: Props) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const wallet = useWallet()
  const dispatch = useAppDispatch()

  const [disabled, setDisabled] = useState(true)
  const [alianName, setAlianName] = useState('')
  const verify = async () => {
    // to verify
    if ('' == alianName) {
      return
    }

    if (wallet.checkHasMnemonic()) {
      const account = await wallet.deriveNewAccountFromMnemonic()
      const allAccounts = await wallet.getTypedAccounts(KEYRING_CLASS.MNEMONIC)
      let mnemonLengh = 0
      if (allAccounts.length > 0) {
        mnemonLengh = allAccounts[0]?.accounts?.length
      }
      if (account && account.length > 0) {
        dispatch(
          updateAlianName({
            wallet,
            address: account[0]?.toLowerCase(),
            alianName: alianName
          })
        )
        message.success({
          content: t('Successfully created')
        })
      }

      navigate('/dashboard')
    }
  }

  useEffect(() => {
    setDisabled(true)

    if (alianName) {
      setDisabled(false)
    }
  }, [alianName])

  return (
    <div className="flex flex-col items-center mx-auto mt-5 gap-3_75 justify-evenly w-95">
      <div className="flex items-center px-2 text-2xl h-13">Create a new account</div>
      <div className="flex items-center w-full p-5 mt-1_25 h-15_5 box default">
        <Input
          className="font-semibold text-white p0"
          bordered={false}
          status="error"
          placeholder="Account name"
          onChange={(e) => {
            setAlianName(e.target.value)
          }}
        />
      </div>
      <Button
        size="large"
        type="primary"
        disabled={disabled}
        className="box w380"
        onClick={(e) => {
          verify()
        }}
      >
        <div className="flex items-center justify-center text-lg">Create Account</div>
      </Button>
    </div>
  )
}
function setDisabled(arg0: boolean) {
  throw new Error('Function not implemented.')
}
