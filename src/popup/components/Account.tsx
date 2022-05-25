import { Account } from '@/background/service/preference'
import { useAppDispatch, useAppSelector } from '@/common/storages/hooks'
import { getAccount } from '@/common/storages/stores/popup/slice'
import { Select } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface AccountSelectDrawerProps {
  accounts: Account[]
  onChange(account: Account): void
  onCancel(): void
  title: string
  isLoading?: boolean
}

const AccountSelect = ({ 
  accounts,
  onChange, 
  title, 
  onCancel, 
  isLoading = false 
}: AccountSelectDrawerProps) => {
  const [checkedAccount, setCheckedAccount] = useState<Account | null>(null)
  const { t } = useTranslation()
  const { Option } = Select

  
  const account = useAppSelector(getAccount)
  const dispatch = useAppDispatch()

  const init = async () => {
    //   const visibleAccounts: Account[] = await wallet.getAllVisibleAccountsArray();
    //   setAccounts(
    //     visibleAccounts.filter((item) => item.type !== KEYRING_TYPE.GnosisKeyring)
    //   );
  }

  useEffect(() => {
    init()
  }, [])

  return (
    <div className="flex items-center w-full">
      <span>
        <img src="./images/user-solid.svg" alt="" />
      </span>
      <div className="flex-grow">
        <Select
          onChange={onChange}
          defaultValue={account}
          style={{ width: '100%', textAlign: 'center', lineHeight: '2.5rem' }}
          bordered={false}
          suffixIcon={
            <span className="text-white">
              <img src="./images/chevron-down-solid.png" alt="" />
            </span>
          }>
          {accounts.map((account, index) => (
            <Option value={account.brandName} key={index}>
              {account.brandName}{' '}
            </Option>
          ))}
        </Select>
      </div>
    </div>
  )
}

export default AccountSelect
