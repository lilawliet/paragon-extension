import { Account } from '@/background/service/preference'
import { useAppDispatch, useAppSelector } from '@/common/storages/hooks'
import { fetchCurrentAccount, getCurrentAccount, setCurrentAccount } from '@/common/storages/stores/popup/slice'
import { formatAddr } from '@/common/utils'
import { useWallet } from '@/ui/utils'
import { CheckOutlined, RightOutlined } from '@ant-design/icons'
import { Button, Input } from 'antd'
import BigNumber from 'bignumber.js'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Status } from '.'

interface Props {
  setStatus(status: Status): void
}

export default ({ setStatus }: Props) => {
  const wallet = useWallet()
  const currentAccount = useAppSelector(getCurrentAccount)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [currency, setCurrency] = useState(0)
  const [accountsList, setAccountsList] = useState<Account[]>([])


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
      {accountsList &&
        accountsList.map((_account, _index) => {
          return (
            <Button
              key={_index}
              size="large"
              type="default"
              className="box w-115 default"
              onClick={(e) => {
                setCurrency(_index)
              }}
            >
              <div className="flex items-center justify-between text-base font-semibold">
                <div className="flex-grow text-left">
                  {_account.brandName} <span className="font-normal opacity-60">({formatAddr(_account.address)})</span>
                </div>
                {currency == _index ? <CheckOutlined style={{ transform: 'scale(1.5)', opacity: '80%' }} /> : <></>}
              </div>
            </Button>
          )
        })}
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
