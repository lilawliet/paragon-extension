import { useWallet } from '@/ui/utils'
import { Button, Input } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Status } from '.'

interface Props {
  setStatus(status: Status): void
}

export default ({ setStatus }: Props) => {
  const navigate = useNavigate()
  const wallet = useWallet()
  const [privateKey, setPrivateKey] = useState('')
  const [inputError, setInputError] = useState('')
  const [disabled, setDisabled] = useState(true)
  const verify = async () => {
    try {
      const _res = await wallet.importPrivateKey(privateKey)
      await wallet.changeAccount(_res[0])
      navigate('/dashboard')
    } catch (e) {
      setInputError((e as any).message)
    }
  }

  useEffect(() => {
    if (privateKey) {
      setDisabled(false)
      return
    }
    setDisabled(true)
  }, [privateKey])

  return (
    <div className="flex flex-col items-center mx-auto mt-5 gap-3_75 justify-evenly w-95">
      <div className="flex flex-col items-center px-2 text-2xl">
        Import Private Key
        <div className="text-base text-soft-white mt-2_5">Imported accounts will not be associated with your originally created Paragon account Secret Recovery Phrase.</div>
      </div>
      <Input
        className="p-5 font-semibold text-white mt-1_25 h-15_5 box default"
        placeholder="Private Key"
        onChange={(e) => {
          setPrivateKey(e.target.value)
        }}
      />
      {inputError ? <div className="text-base text-error">{inputError}</div> : <></>}
      <Button
        disabled={disabled}
        size="large"
        type="primary"
        className="box w380"
        onClick={(e) => {
          verify()
        }}
      >
        <div className="flex items-center justify-center text-lg">Import Private Key</div>
      </Button>
    </div>
  )
}
