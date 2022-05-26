import { Account } from '@/background/service/preference'
import { useAppDispatch } from '@/common/storages/hooks'
import { Select } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface AccountSelectDrawerProps {
<<<<<<< HEAD
  current: Account | null
  accountsList?: Account[]
  handleOnChange?(account: Account): void
  handleOnCancel(): void
=======
  current?: Account | null
  accounts?: Account[]
  onChange?(account: Account): void
  onCancel(): void
>>>>>>> 235b86cdb7277715a92d62118e938a841c386c56
  title: string
  isLoading?: boolean
}

<<<<<<< HEAD
const AccountSelect = ({ 
  current,
  accountsList,
  handleOnChange, 
  handleOnCancel, 
  title, 
  isLoading = false 
}: AccountSelectDrawerProps) => {
=======
const AccountSelect = ({ current, accounts, onChange, title, onCancel, isLoading = false }: AccountSelectDrawerProps) => {
>>>>>>> 235b86cdb7277715a92d62118e938a841c386c56
  const [checkedAccount, setCheckedAccount] = useState<Account | null>(null)
  const { t } = useTranslation()
  const { Option } = Select
  const dispatch = useAppDispatch()

  const init = async () => {
    //todo
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
          onChange={handleOnChange}
          defaultValue={current}
          key={'address'}
          style={{ width: '100%', textAlign: 'center', lineHeight: '2.5rem' }}
          bordered={false}
          suffixIcon={
            <span className="text-white">
              <img src="./images/chevron-down-solid.png" alt="" />
            </span>
          }>
<<<<<<< HEAD
          {accountsList?.map((account, index) => (
=======
          {accounts?.map((account, index) => (
>>>>>>> 235b86cdb7277715a92d62118e938a841c386c56
            <Option value={account.address} key={index}>
              {account.alianName ? account.alianName : account.brandName}{' '}
            </Option>
          ))}
        </Select>
      </div>
    </div>
  )
}

export default AccountSelect
