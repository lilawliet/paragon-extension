import { Account } from '@/background/service/preference'
import { useAppDispatch, useAppSelector } from '@/common/storages/hooks'
import { fetchCurrentAccount, getCurrentAccount, setCurrentAccount } from '@/common/storages/stores/popup/slice'
import { formatAddr } from '@/common/utils'
import { useWallet } from '@/ui/utils'
import { CheckOutlined, RightOutlined } from '@ant-design/icons'
import { Button, Input } from 'antd'
import BigNumber from 'bignumber.js'
import { forwardRef, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import VirtualList from 'rc-virtual-list'

import { Status } from '.'

interface MyItemProps {
  index: number
  account: Account
  currency: number
  setCurrency(num:number): void
}

const MyItem: React.ForwardRefRenderFunction<any, MyItemProps> = (
  {
    index,
    account,
    currency,
    setCurrency
  },
  ref,
) => {
  return (
    <Button
      key={index}
      size="large"
      type="default"
      className="p-5 box w-115 default mb-3_75 btn-89"
      onClick={(e) => {
        setCurrency(index)
      }}
    >
      <div className="flex items-center justify-between text-base font-semibold">
        <div className="flex flex-col flex-grow text-left">
          <span>{account.brandName} </span>
          <span className="font-normal opacity-60">({formatAddr(account.address)})</span>
        </div>
        {currency == index ? <CheckOutlined style={{ transform: 'scale(1.2)', opacity: '80%' }} /> : <></>}
      </div>
    </Button>
  );
};

interface Props {
  setStatus(status: Status): void
}

export type ScrollAlign = 'top' | 'bottom' | 'auto';

export type ScrollConfig =
  | {
      index: number;
      align?: ScrollAlign;
      offset?: number;
    }
  | {
      key: React.Key;
      align?: ScrollAlign;
      offset?: number;
    };

export type ScrollTo = (arg: number | ScrollConfig) => void;

type ListRef = {
  scrollTo: ScrollTo;
};

export default ({ setStatus }: Props) => {
  const wallet = useWallet()
  const currentAccount = useAppSelector(getCurrentAccount)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const listRef = useRef<ListRef>(null);
  
  const [currency, setCurrency] = useState(0)
  const [accountsList, setAccountsList] = useState<Account[]>([])

  const ForwardMyItem = forwardRef(MyItem);
  const balanceList = async (accounts) => {
    return await Promise.all<Account>(
      accounts.map(async (item) => {
        let balance = await wallet.getAddressCacheBalance(item?.address)
        if (!balance) {
          balance = await wallet.getAddressBalance(item?.address)
        }
        return {
          ...item,
          balance: balance?.amount || 0
        }
      })
    )
  }

  const getAllKeyrings = async () => {
    const _accounts = await wallet.getAllVisibleAccounts()
    const allAlianNames = await wallet.getAllAlianName()
    const allContactNames = await wallet.getContactsByMap()
    const templist = await _accounts
      .map((item) =>
        item.accounts.map((account) => {
          return {
            ...account,
            type: item.type,
            alianName: allContactNames[account?.address?.toLowerCase()]?.name || allAlianNames[account?.address?.toLowerCase()],
            keyring: item.keyring
          }
        })
      )
      .flat(1)
    const result = await balanceList(templist)
    if (result) {
      const withBalanceList = result.sort((a, b) => {
        return new BigNumber(b?.balance || 0).minus(new BigNumber(a?.balance || 0)).toNumber()
      })
      setAccountsList(withBalanceList)
    }
  }

  useEffect(() => {
    ;(async () => {
      if (!currentAccount) {
        const fetchCurrentAccountAction = await dispatch(fetchCurrentAccount({ wallet }))
        if (fetchCurrentAccount.fulfilled.match(fetchCurrentAccountAction)) {
          // pass
        } else if (fetchCurrentAccount.rejected.match(fetchCurrentAccountAction)) {
          navigate('/welcome')
        }
      }
    })()

    getAllKeyrings().then(() => {
      accountsList.map((_account, index) => {
        if (currentAccount && currentAccount == _account) {
          setCurrency(index)
        }
      })
    })
  }, [])

  useEffect(() => {
    dispatch(setCurrentAccount({ account: accountsList[currency], wallet }))
  }, [currency])

  const verify = () => {
    // to verify
    setStatus('add')
  }

  return (
    <div className="flex flex-col items-center mx-auto mt-5 gap-3_75 justify-evenly w-95">
      <div className="flex items-center px-2 text-2xl h-13">Switch Account</div>
      
      <VirtualList
          data={accountsList}
          data-id="list"
          height={372}
          itemHeight={20}
          itemKey="id"
          // disabled={animating}
          ref={listRef}
          style={{
            boxSizing: 'border-box',
          }}
          // onSkipRender={onAppear}
          // onItemRemove={onAppear}
        >
          {(item, index) => (
            <ForwardMyItem
              key={index}
              account={item}
              index={index}
              currency={currency}
              setCurrency={setCurrency}
            />
          )}
        </VirtualList>
      <Button
        size="large"
        type="primary"
        className="box w380"
        onClick={(e) => {
          verify()
        }}
      >
        <div className="flex items-center justify-center text-lg">Add New Account</div>
      </Button>
    </div>
  )
}
