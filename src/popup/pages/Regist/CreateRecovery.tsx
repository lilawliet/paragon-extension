import { Button, Checkbox, message } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { CheckboxChangeEvent } from 'antd/lib/checkbox'
import { useWallet, useWalletRequest } from '@/ui/utils'

const CreateRecovery = () => {
  const { t } = useTranslation()
  const wallet = useWallet()
  const navigate = useNavigate()
  const { state } = useLocation()

  const [mnemonics, setMnemonics] = useState('')

  const init = async (state: any) => {
    const _mnemonics = (await wallet.getPreMnemonics()) || (await wallet.generatePreMnemonic())
    setMnemonics(_mnemonics)

    // if (state?.create) {
    //   const _mnemonics = (await wallet.generatePreMnemonic())
    //   setMnemonics(_mnemonics)
    //   // run(_mnemonics.trim())
    //   console.log('create')
    // } else {
    //   const _mnemonics = (await wallet.getPreMnemonics())
    //   setMnemonics(_mnemonics)
    //   console.log('getPreMnemonics')
    // }
  }

  useEffect(() => {
    init(state)
  }, [])

  const btnClick = async () => {
    const accounts = await wallet.createKeyringWithMnemonics(mnemonics)
    console.log(accounts)
    navigate('/dashboard', {
      state: {
        accounts,
        title: t('Successfully created'),
        editing: true,
        importedAccount: true,
      }
    })
  }

  const [checked, setChecked] = useState(false)

  const onChange = (e: CheckboxChangeEvent) => {
    setChecked(e.target.checked)
  }

  return (
    <div className="flex justify-center pt-33_75">
      <div className="flex flex-col justify-center gap-5 text-center">
        <div className="text-2xl text-white box w380">Secret Recovery Phrase</div>
        <div className="text-base text-warn box w380">
          This phrase is the ONLY way to <br />
          recover your wallet. Do NOT share it with anyone!
        </div>
        <div className="h-10">{/* margin */} </div>
        <div className="p-5 font-semibold select-text box default text-4_5 w380 leading-6_5">{mnemonics}</div>
        <div>
          <div className="flex items-center justify-center align-middle">
            <Checkbox onChange={onChange} checked={checked} className="font-semibold">
              <span className="font-semibold text-white">I saved My Secret Recovery Phrase</span>
            </Checkbox>
          </div>
        </div>
        <div>
          <Button disabled={!checked} size="large" type="primary" className="box w380 content" onClick={btnClick}>
            {t('Continue')}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CreateRecovery
