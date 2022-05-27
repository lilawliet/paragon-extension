import { Account } from '@/background/service/preference'
import { useAppDispatch, useAppSelector } from '@/common/storages/hooks'
import { getCurrentAccount, setCurrentAccount } from '@/common/storages/stores/popup/slice'
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

const AccountSelect = ({ accountsList, handleOnCancel, title, isLoading = false }: AccountSelectDrawerProps) => {
  const { t } = useTranslation()
  const wallet = useWallet()
  const { Option } = Select
  const currentAccount = useAppSelector(getCurrentAccount)
  const [selected, setSelected] = useState(0)
  const dispatch = useAppDispatch()

  const handleOnChange = (index: number) => {
    if (accountsList && accountsList[index]) {
      setSelected(index)
      dispatch(setCurrentAccount({ account: accountsList[index], wallet }))
    }
  }

  const updateSelected = () => {
    accountsList?.map((account, index) => {
      if (account == currentAccount) {
        setSelected(index)
      }
    })
  }

  useEffect(() => {
    updateSelected()
  }, [])

  return (
    <div className="flex items-center w-full">
      <span>
        <img src="./images/user-solid.svg" alt="" />
      </span>
      <div className="flex-grow">
        <Select
          onChange={handleOnChange}
          value={selected}
          style={{ width: '100%', textAlign: 'center', lineHeight: '2.5rem' }}
          bordered={false}
          suffixIcon={
            <span className="text-white">
              <img src="./images/chevron-down-solid.png" alt="" />
            </span>
          }
        >
          {accountsList?.map((account, index) => (
            <Option value={index} key={index}>
              {account.alianName ? account.alianName : account.brandName}{' '}
            </Option>
          ))}
        </Select>
      </div>
    </div>
  )
}

export default AccountSelect
