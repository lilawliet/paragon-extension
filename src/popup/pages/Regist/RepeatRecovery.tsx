import { useWallet } from '@/ui/utils'
import { Button, Input, message } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import styles from './index.module.less'

const RepeatRecovery = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  // const tmp = 'venue tattoo cloth cash learn diary add hurry success actress case lobster'
  // const [keys, setKeys] = useState<Array<string>>(tmp.split(' '))
  const [keys, setKeys] = useState<Array<string>>(new Array(12).fill(''))
  const [active, setActive] = useState(999)
  const [hover, setHover] = useState(999)
  const [disabled, setDisabled] = useState(true)

  const wallet = useWallet()
  const verify = async () => {
    const mnemonics = keys.join(' ')
    try {
      const accounts = await wallet.createKeyringWithMnemonics(mnemonics)
      navigate('/dashboard', {
        state: {
          accounts,
          title: t('Successfully created'),
          editing: true,
          importedAccount: true
        }
      })
    } catch (e) {
      console.log(mnemonics, e)
      message.error('mnemonic phrase is invalid')
    }
  }

  const handleEventPaste = (event, index: number) => {
    const copyText = event.clipboardData?.getData('text/plain')
    const textArr = copyText.trim().split(' ')
    let newKeys = [...keys]
    if (textArr) {
      for (let i = 0; i < keys.length - index; i++) {
        if (textArr.length == i) {
          break
        }
        newKeys[index + i] = textArr[i]
      }
      setKeys(newKeys)
    }

    event.preventDefault()
  }

  const onChange = (e: any, index: any) => {
    const newKeys = [...keys]
    newKeys.splice(index, 1, e.target.value)
    setKeys(newKeys)
  }

  useEffect(() => {
    // to verify key
    setDisabled(
      keys.filter((key) => {
        return key == ''
      }).length > 0
    )
  }, [keys])

  useEffect(() => {
    //todo
  }, [hover])

  return (
    <div className="flex justify-center pt-15 box w380">
      <div className="flex flex-col justify-center gap-5 text-center">
        <div className="text-2xl text-white">Secret Recovery Phrase</div>
        <div className="text-base text-soft-white">Import an existing wallet with your 12-word secret recovery phrase</div>
        <div className="grid grid-cols-2 gap-5 text-soft-white">
          {keys.map((_, index) => {
            return (
              <div
                key={index}
                className={`flex items-center w-full p-5 font-bold text-left border border-white rounded-lg bg-soft-black border-opacity-20 
                                    ${hover == index ? ' border-white border-opacity-40 text-white' : ''} 
                                    ${active == index ? ' border-white border-opacity-40 bg-primary-active text-white' : ''}`}>
                {index + 1}.&nbsp;
                <Input
                  className={`font-bold p0 ${active == index || hover == index ? styles.antInputActive : styles.antInput}`}
                  bordered={false}
                  value={_}
                  onPaste={(e) => {
                    handleEventPaste(e, index)
                  }}
                  onChange={(e) => {
                    onChange(e, index)
                  }}
                  onMouseOverCapture={(e) => {
                    setHover(index)
                  }}
                  onMouseLeave={(e) => {
                    setHover(999)
                  }}
                  onFocus={(e) => {
                    setActive(index)
                  }}
                  onBlur={(e) => {
                    setActive(999)
                  }}
                />
              </div>
            )
          })}
        </div>
        <div>
          <Button disabled={disabled} size="large" type="primary" className="box w380 content" onClick={verify}>
            {t('Import wallet')}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default RepeatRecovery
