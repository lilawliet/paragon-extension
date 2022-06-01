import { Account } from '@/background/service/preference'
import { useGlobalState } from '@/ui/state/state'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

interface AccountSelectDrawerProps {
  current?: Account | null
  accountsList?: Account[]
  // handleOnChange?(account: Account): void
  // handleOnCancel(): void
  // title: string
  // isLoading?: boolean
}

const AccountSelect = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [currentAccount] = useGlobalState('currentAccount')

  return (
    <div
      className="flex items-center w-full cursor-pointer px-1_25"
      onClick={(e) => {
        navigate('/settings/account')
      }}>
      <span>
        <img src="./images/user-solid.svg" alt="" />
      </span>
      <div className="flex-grow">
        <div style={{ width: '100%', textAlign: 'center', lineHeight: '2.5rem', fontWeight: 600 }}>{currentAccount?.alianName}</div>
      </div>
      <span className="text-white">
        <img src="./images/chevron-down-solid.png" alt="" />
      </span>
    </div>
  )
}

export default AccountSelect
