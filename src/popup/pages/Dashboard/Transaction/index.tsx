import AccountSelect from '@/popup/components/Account'
import { useGlobalState } from '@/ui/state/state'
import { shortAddress } from '@/ui/utils'
import { ClockCircleFilled } from '@ant-design/icons'
import { Empty } from 'antd'
import moment from 'moment'
import VirtualList from 'rc-virtual-list'
import { forwardRef, useRef } from 'react'
import { useTranslation } from 'react-i18next'

interface HistoryItem {
  address: string
  amount: number
  symbol: string
}

interface GroupItem {
  date: string
  historyItems: HistoryItem[]
  index: number
}

interface MyItemProps {
  group: GroupItem
  index: number
}

const MyItem: React.ForwardRefRenderFunction<any, MyItemProps> = ({ group, index }, ref) => {
  return (
    <div key={index} className="mt-2_5">
      <div className="pl-2 font-semibold text-soft-white">{group.date}</div>
      {group.historyItems.map((item, index) => (
        <div className="mt-2_5" key={`item_${index}`}>
          <div className="justify-between box nobor w440 text-soft-white" key={index}>
            <span>{shortAddress(item.address)}</span>
            <span>
              <span className={`font-semibold ${item.amount > 0 ? 'text-custom-green' : 'text-warn'}`}>{item.amount > 0 ? '+' : '-'}</span>
              <span className="font-semibold text-white">{Number(Math.abs(item.amount)).toLocaleString('en', { minimumFractionDigits: 4 })}</span> {item.symbol}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

export type ScrollAlign = 'top' | 'bottom' | 'auto'

export type ScrollConfig =
  | {
      index: number
      align?: ScrollAlign
      offset?: number
    }
  | {
      key: React.Key
      align?: ScrollAlign
      offset?: number
    }

export type ScrollTo = (arg: number | ScrollConfig) => void

type ListRef = {
  scrollTo: ScrollTo
}

interface Transaction {
  time: number
  address: string
  amount: string
  opt: string
}

const Transaction = () => {
  const { t } = useTranslation()
  const listRef = useRef<ListRef>(null)
  const ForwardMyItem = forwardRef(MyItem)
  const html = document.getElementsByTagName('html')[0]
  let virtualListHeight = 485
  if (html && getComputedStyle(html).fontSize) {
    virtualListHeight = (virtualListHeight * parseFloat(getComputedStyle(html).fontSize)) / 16
  }

  const [currentAccount] = useGlobalState('currentAccount')
  const [accountHistory] = useGlobalState('accountHistory')

  const _historyGroups: GroupItem[] = []
  let lastDate = ''
  let lastGroup: GroupItem
  let index = 0
  accountHistory?.forEach((v) => {
    if (lastDate != v.date) {
      lastDate = v.date
      lastGroup = { date: moment(v.time * 1000).format('MMMM DD, YYYY'), historyItems: [], index: index++ }
      _historyGroups.push(lastGroup)
    }
    const amount = parseFloat(v.amount)
    const symbol = v.symbol
    const address = currentAccount?.address || ''
    lastGroup.historyItems.push({
      address,
      amount,
      symbol
    })
  })
  const historyGroups = _historyGroups
  if (historyGroups.length == 0) {
    virtualListHeight = 0
  }
  return (
    <div className="flex flex-col items-center h-full gap-5 justify-evenly">
      <div className="mt-5">
        <div className="flex items-center px-2 h-13 box soft-black hover bg-opacity-20 w340">
          <AccountSelect />
        </div>
      </div>
      <div className="grid flex-grow mt-6 gap-2_5">
        {historyGroups.length == 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-5">
            <ClockCircleFilled className="text-2xl" />
            {t('No Activity')}
          </div>
        ) : null}
        <VirtualList
          data={historyGroups}
          data-id="list"
          height={virtualListHeight}
          itemHeight={20}
          itemKey={(group) => group.date}
          // disabled={animating}
          style={{
            boxSizing: 'border-box'
          }}
          // onSkipRender={onAppear}
          // onItemRemove={onAppear}
        >
          {(item, index) => <ForwardMyItem group={item} index={index} />}
        </VirtualList>
      </div>
    </div>
  )
}

export default Transaction
