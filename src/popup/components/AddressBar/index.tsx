import { copyToClipboard } from '@/common/utils'
import { KEYRING_CLASS } from '@/constant'
import { useGlobalState } from '@/ui/state/state'
import { shortAddress } from '@/ui/utils'
import { faCheck, faCopy } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { MouseEventHandler, useState } from 'react'
import { useTranslation } from 'react-i18next'
import './index.less'
export const AddressBar: React.FC<{ onClick?: MouseEventHandler<HTMLElement> }> = ({ onClick }) => {
  const { t } = useTranslation()
  const [currentAccount] = useGlobalState('currentAccount')
  const [isCopied, setIsCopied] = useState(false)
  return (
    <div className="address-bar">
      {isCopied ? (
        <div className="container-copied">
          <div className="container2">
            <FontAwesomeIcon className="check-icon" icon={faCheck} />
            <span>{t('copied')}</span>
          </div>
        </div>
      ) : (
        <div
          className="container"
          onClick={(e) => {
            copyToClipboard(currentAccount?.address ?? '').then(() => {
              setIsCopied(true)
              setTimeout(() => {
                setIsCopied(false)
              }, 10000)
            })
          }}>
          <div className="container2">
            <div className="frame">
              <FontAwesomeIcon className="copy-icon" icon={faCopy} />
              <span className="address">
                <span>{shortAddress(currentAccount?.address)}</span>
              </span>
            </div>
          </div>
        </div>
      )}

      {currentAccount?.type == KEYRING_CLASS.PRIVATE_KEY ? (
        <div className="imported">
          <div className="container3">
            <span>IMPORTED</span>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}
