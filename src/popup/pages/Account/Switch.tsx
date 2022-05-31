import { Account } from '@/background/service/preference'
import { useAppDispatch } from '@/common/storages/hooks'
import { formatAddr } from '@/common/utils'
import { KEYRING_CLASS } from '@/constant'
import { useGlobalState } from '@/ui/state/state'
import { useWallet } from '@/ui/utils'
import { CheckOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import VirtualList from 'rc-virtual-list'
import { forwardRef, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Status } from '.'

interface MyItemProps {
  index: number
  account: Account
  accountIndex: number
  onClick(num: number): void
}

const MyItem: React.ForwardRefRenderFunction<any, MyItemProps> = ({ index, account, accountIndex: currency, onClick }: MyItemProps, ref) => {
  return (
    <Button
      key={index}
      size="large"
      type="default"
      className="p-5 box w-115 default mb-3_75 btn-88"
      onClick={(e) => {
        onClick(index)
      }}>
      <div className="flex items-center justify-between text-base font-semibold">
        <div className="flex flex-col flex-grow text-left">
          <span>{account.alianName} </span>
          <span className="font-normal opacity-60">({formatAddr(account.address, 8)})</span>
        </div>
        {account?.type == KEYRING_CLASS.PRIVATE_KEY ? <span className="text-xs rounded bg-primary-active p-2_5">IMPORTED</span> : <></>}
        {currency == index ? <CheckOutlined className="w-4 ml-2_5" style={{ transform: 'scale(1.2)', opacity: '80%' }} /> : <span className="w-4 ml-2_5"></span>}
      </div>
    </Button>
  )
}

interface Props {
  setStatus(status: Status): void
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

export default ({ setStatus }: Props) => {
  const { t } = useTranslation()
  const wallet = useWallet()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const listRef = useRef<ListRef>(null)

  const [currentAccount, setCurrentAccount] = useGlobalState('currentAccount')
  const [accountsList] = useGlobalState('accountsList')
  const [accountIndex, setAccountIndex] = useState(accountsList.findIndex((v) => v.address == currentAccount?.address))

  const ForwardMyItem = forwardRef(MyItem)

  useEffect(() => {
    setAccountIndex(accountsList.findIndex((v) => v.address == currentAccount?.address))
  }, [currentAccount, accountsList])

  const verify = () => {
    // to verify
    setStatus('add')
  }

  return (
    <div className="flex flex-col items-center mx-auto mt-5 gap-3_75 justify-evenly w-95">
      <div className="flex items-center px-2 text-2xl h-13">{t('Switch Account')}</div>

      <VirtualList
        data={accountsList}
        data-id="list"
        height={330}
        itemHeight={20}
        itemKey={(item) => item.address}
        // disabled={animating}
        ref={listRef}
        style={{
          boxSizing: 'border-box'
        }}
        // onSkipRender={onAppear}
        // onItemRemove={onAppear}
      >
        {(item, index) => (
          <ForwardMyItem
            key={index}
            account={item}
            index={index}
            accountIndex={accountIndex}
            onClick={async (index) => {
              if (index != accountIndex) {
                await wallet.changeAccount(accountsList[index])
                setCurrentAccount(accountsList[index])
              }
              navigate('/dashboard')
            }}
          />
        )}
      </VirtualList>
      <Button
        size="large"
        type="primary"
        className="box w380"
        onClick={(e) => {
          verify()
        }}>
        <div className="flex items-center justify-center text-lg">{t('Add New Account')}</div>
      </Button>
    </div>
  )
}
