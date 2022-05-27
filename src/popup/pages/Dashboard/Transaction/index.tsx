import AccountSelect from '@/popup/components/Account'
import { shortAddress, useWallet } from '@/ui/utils'
import { List } from 'antd'
import moment from 'moment'
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

interface HistoryItem {
  address: string
  amount: number
  symbol: string
}

const Transaction = ({ current, accountsList, accountHistory }: AccountsProps) => {
  const { t } = useTranslation()
  const wallet = useWallet()
  const navigate = useNavigate()

  const [isListLoading, setIsListLoading] = useState(false)
  const [isAssetsLoading, setIsAssetsLoading] = useState(true)

  const historyGroups: { date: string; historyItems: HistoryItem[] }[] = []
  let lastDate = ''
  let lastGroup: { date: string; historyItems: HistoryItem[] }
  accountHistory?.forEach((v) => {
    if (lastDate != v.date) {
      lastDate = v.date
      lastGroup = { date: moment(v.time * 1000).format('MMMM DD,YYYY'), historyItems: [] }
      historyGroups.push(lastGroup)
    }
    let amount = v.assets_transferred[0].amount
    let symbol = v.assets_transferred[0].symbol
    let address
    if (amount > 0) {
      address = v.from_addrs[0]
    } else {
      address = v.to_addrs[0]
    }
    address = address || current?.address
    lastGroup.historyItems.push({
      address,
      amount,
      symbol
    })
  })
  return (
    <div className="flex flex-col items-center gap-5 mt-5 justify-evenly">
      <div className="flex items-center px-2 h-13 box soft-black hover bg-opacity-20 w340">
        <AccountSelect
          current={current}
          accountsList={accountsList}
          handleOnCancel={function (): void {
            throw new Error('Function not implemented.')
          }}
          title={''}
        />
      </div>
      <div className="grid mt-6 gap-2_5">
        <List
          dataSource={historyGroups}
          renderItem={(group, groupIndex) => (
            <div key={groupIndex}>
              <div className="pl-2 font-semibold text-soft-white">{group.date}</div>
              {group.historyItems.map((item, index) => (
                <div className="justify-between mb-4 box nobor w440 text-soft-white" key={index}>
                  <span>{shortAddress(item.address)}</span>
                  <span>
                    <span className={`font-semibold ${item.amount > 0 ? 'text-custom-green' : 'text-warn'}`}>{item.amount > 0 ? '+' : '-'}</span>
                    <span className="font-semibold text-white">{Math.abs(item.amount)}</span> {item.symbol}
                  </span>
                </div>
              ))}
            </div>
          )}></List>
      </div>
    </div>
  )
}

export default Transaction
