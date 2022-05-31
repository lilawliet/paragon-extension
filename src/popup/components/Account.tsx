import { Account } from '@/background/service/preference'
import { useAppDispatch } from '@/common/storages/hooks'
import { useWallet } from '@/ui/utils'
import { Select } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

interface AccountSelectDrawerProps {
  current?: Account | null
  accountsList?: Account[]
  handleOnChange?(account: Account): void
  handleOnCancel(): void
  title: string
  isLoading?: boolean
}

const AccountSelect = ({ current, accountsList, handleOnCancel, title, isLoading = false }: AccountSelectDrawerProps) => {
  const { t } = useTranslation()
  const wallet = useWallet()
  const navigate = useNavigate()
  const { Option } = Select
  const [selected, setSelected] = useState(accountsList?.findIndex((v) => v.address == current?.address))
  const dispatch = useAppDispatch()

  const handleOnClick = (e) => {
    e.stopPropagation()
    navigate('/settings/account')
  }

  const handleOnChange = (index: number) => {
    if (accountsList && accountsList[index]) {
      setSelected(index)
      wallet.changeAccount(accountsList[index])
    }
  }

  const updateSelected = () => {
    accountsList?.map((account, index) => {
      if (account.address == current?.address) {
        setSelected(index)
      }
    })
  }

  useEffect(() => {
    updateSelected()
  }, [current])

  return (
    <div
      className="flex items-center w-full"
      onClick={(e) => {
        handleOnClick(e)
      }}
    >
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
              {account.alianName}{' '}
            </Option>
          ))}
        </Select>
      </div>
    </div>
  )
}

export default AccountSelect
