import AccountSelect from '@/popup/components/Account'
import { useWallet } from '@/ui/utils'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { AccountsProps } from '..'

interface Transaction {
  time: number
  address: string
  amount: string
  opt: string
}

const Transaction = ({ currentAccount, accountsList, handleChange }: AccountsProps) => {
  const { t } = useTranslation()
  const wallet = useWallet()
  const navigate = useNavigate()

  const [isListLoading, setIsListLoading] = useState(false)
  const [isAssetsLoading, setIsAssetsLoading] = useState(true)

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      time: 1652188199,
      address: 'sadfjkl...2j343jlk',
      amount: '1,224',
      opt: '+'
    },
    {
      time: 1652188199,
      address: 'sadfjkl...2j343jlk',
      amount: '1,224',
      opt: '-'
    }
  ])

  return (
    <div className="flex flex-col items-center gap-5 mt-5 justify-evenly">
      <div className="flex items-center px-2 h-13 box black bg-opacity-20 w340">
        <AccountSelect
          current={currentAccount}
          accounts={accountsList}
          onChange={handleChange}
          onCancel={function (): void {
            throw new Error('Function not implemented.')
          }}
          title={''}
        />
      </div>
      <div className="grid mt-6 gap-2_5">
        <div className="pl-2 font-semibold text-soft-white">May 5,2022</div>
        {transactions.map((transaction, index) => (
          <div className="justify-between mb-4 box nobor w440 text-soft-white" key={index}>
            <span>{transaction.address}</span>
            <span>
              <span className={`font-semibold ${transaction.opt == '+' ? 'text-custom-green' : 'text-warn'}`}>{transaction.opt}</span>
              <span className="font-semibold text-white">{transaction.amount}</span> Novo
            </span>
          </div>
        ))}
        <div className="pl-2 font-semibold text-soft-white">May 4,2022</div>
        {transactions.map((transaction, index) => (
          <div className="justify-between mb-4 box nobor w440 text-soft-white" key={index}>
            <span>{transaction.address}</span>
            <span>
              <span className={`font-semibold ${transaction.opt == '+' ? 'text-custom-green' : 'text-warn'}`}>{transaction.opt}</span>
              <span className="font-semibold text-white">{transaction.amount}</span> Novo
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Transaction
