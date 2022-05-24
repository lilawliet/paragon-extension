import { Button, Checkbox, message } from "antd"
import { Link, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useState } from "react"
import { CheckboxChangeEvent } from "antd/lib/checkbox"
import { useWallet, useWalletRequest } from "@/ui/utils"
import { KEYRING_TYPE } from "@/constant"

const CreateRecovery = () => {
  const { t } = useTranslation()
  const wallet = useWallet();
  const navigate = useNavigate()

  const [run, loading] = useWalletRequest(wallet.generateKeyringWithMnemonic, {
    onSuccess(stashKeyringId) {
      navigate('/dashboard', {
        state: {
          keyring: KEYRING_TYPE.HdKeyring,
          keyringId: stashKeyringId,
          isMnemonics: true,
        }
      })
    },
    onError(err) {
      message.error(err)
    },
  });
  
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
        <div className="p-5 font-semibold select-text box default text-4_5 w380 leading-6_5">
                    glare knee able beach success comic giant aerobic myself false debris attack
        </div>
        <div>
          <div className="flex items-center justify-center align-middle">
            <Checkbox onChange={onChange} checked={checked} className="font-semibold">
              <span className="font-semibold text-white">I saved My Secret Recovery Phrase</span>
            </Checkbox>
          </div>
        </div>
        <div>
          <Link to="/repeat-recovery" replace>
            <Button disabled={!checked} size="large" type="primary" className="box w380 content">
              {t("Continue")}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default CreateRecovery
