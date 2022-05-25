import AccountSelect from '@/popup/components/Account'
import { Statistic } from 'antd'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { AccountsProps } from '..'

interface Currency {
  name: string
  amount: string
  value: string
}

const Home = ({ currentAccount, accountsList, handleChange }: AccountsProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [currencies, setCurrencies] = useState<Currency[]>([
    {
      name: 'Novo',
      amount: '15000000000000 Novo',
      value: '$5,245.01'
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
      <div className="flex items-center p-10 font-semibold text-11">
        <span>$</span>
        <Statistic className="text-white" value={112893} valueStyle={{ fontSize: '2.75rem' }} />
      </div>
      <div className="grid grid-cols-2 gap-4 leading-6_5 w-5/8">
        <div
          className="cursor-pointer box unit hover:border-primary hover:text-primary"
          onClick={(e) => {
            navigate(`/receive?address=${'quires'}`)
          }}>
          <span>
            <img src="./images/qrcode-solid.png" alt="" />
          </span>
          &nbsp;Receive
        </div>
        <div
          className="cursor-pointer box unit"
          onClick={(e) => {
            navigate('/send/index')
          }}>
          <span>
            <img src="./images/arrow-right-arrow-left-solid.png" alt="" />
          </span>
          &nbsp;Send
        </div>
      </div>
      <div className="mt-2">
        {currencies.map((currency, index) => (
          <div className="box nobor w440" key={index}>
            <div className="w-10 h-10">
              <img src={`./images/${currency.name}.svg`} alt="" />
            </div>
            <div className="flex flex-col flex-grow px-2">
              <div className="font-semibold">{currency.name}</div>
              <div className="text-base text-soft-white">{currency.amount}</div>
            </div>
            <div className="font-semibold">{currency.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home
