import { useGlobalState } from '@/ui/state/state'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import './index.less'
const AccountSelect = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [currentAccount] = useGlobalState('currentAccount')

  return (
    <div
      className="account-select-container"
      onClick={(e) => {
        navigate('/settings/account')
      }}>
      <span className="icon-profile">
        <img src="./images/user-solid.svg" alt="" />
      </span>
      <div className="account">
        <div style={{ width: '100%', textAlign: 'center', lineHeight: '2.5rem', fontWeight: 600 }}>{currentAccount?.alianName}</div>
      </div>
      <span className="icon-drop">
        <img src="./images/chevron-down-solid.png" alt="" />
      </span>
    </div>
  )
}

export default AccountSelect
