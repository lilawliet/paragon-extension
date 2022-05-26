import { Account } from '@/background/service/preference'
import { useAppDispatch, useAppSelector } from '@/common/storages/hooks'
import { getAccount, setAccount } from '@/common/storages/stores/popup/slice'
import { useWallet } from '@/ui/utils'
import { Select } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface AccountSelectDrawerProps {
  accountsList?: Account[]
  handleOnChange?(account: Account): void
  handleOnCancel(): void
  title: string
  isLoading?: boolean
}

const AccountSelect = ({ 
  accountsList,
  handleOnCancel, 
  title, 
  isLoading = false 
}: AccountSelectDrawerProps) => {
  const [checkedAccount, setCheckedAccount] = useState<Account | null>(null)
  const { t } = useTranslation()
  const wallet = useWallet()
  const { Option } = Select
  const current = useAppSelector(getAccount)
  const [value, setValue] = useState<Account| null>(null)
  const dispatch = useAppDispatch()

  const init = async () => {
    //todo
  }
  
  const handleOnChange = async (account: Account) => {
    console.log(account)
    // setValue(account)
    // const { address, type, brandName } = account
    // await wallet.changeAccount({ address, type, brandName })
    // setCurrentAccount({ address, type, brandName })

    // dispatch(setAccount(account))
  }

  useEffect(() => {
    console.log(current)
  }, [current])

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
          // value={value}
          key={'brandName'}
          optionLabelProp="brandName"
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
