import { Account } from '@/background/service/preference'
import { useAppDispatch } from '@/common/storages/hooks'
import { Select } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface AccountSelectDrawerProps {
  current: Account | null
  accountsList?: Account[]
  handleOnChange?(account: Account): void
  handleOnCancel(): void
  title: string
  isLoading?: boolean
}

const AccountSelect = ({ 
  current,
  accountsList,
  handleOnChange, 
  handleOnCancel, 
  title, 
  isLoading = false 
}: AccountSelectDrawerProps) => {
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
          {accountsList?.map((account, index) => (
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
