import { Account } from "@/background/service/preference"
import { DownOutlined } from "@ant-design/icons"
import { Select } from "antd"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

interface AccountSelectDrawerProps {
    onChange(account: Account): void
    onCancel(): void
    title: string
    isLoading?: boolean
}

const AccountSelect = ({ onChange, title, onCancel, isLoading = false }: AccountSelectDrawerProps) => {
  const [checkedAccount, setCheckedAccount] = useState<Account | null>(null)
  const [accounts, setAccounts] = useState<Account[]>([
    {
      type: "",
      address: "",
      brandName: "jack"
    },
    {
      type: "",
      address: "",
      brandName: "luck"
    }
  ])
  const { t } = useTranslation()
  const { Option } = Select

  const init = async () => {
    //   const visibleAccounts: Account[] = await wallet.getAllVisibleAccountsArray();
    //   setAccounts(
    //     visibleAccounts.filter((item) => item.type !== KEYRING_TYPE.GnosisKeyring)
    //   );
  }

  const handleSelectAccount = (account: Account) => {
    setCheckedAccount(account)
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
          defaultValue={"jack"}
          style={{ width: "100%", textAlign: "center", lineHeight: "2.5rem" }}
          bordered={false}
          suffixIcon={
            <span className="text-white">
              <img src="./images/chevron-down-solid.png" alt="" />
            </span>
          }
        >
          {accounts.map((account, index) => (
            <Option value={account.brandName} key={index}>
              {account.brandName}{" "}
            </Option>
          ))}
        </Select>
      </div>
    </div>
  )
}

export default AccountSelect
