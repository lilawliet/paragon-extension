import { Statistic } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import AccountSelect from '@/popup/components/Account'
import { Account } from '@/background/service/preference'
import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/common/storages/hooks'
import { getAccount } from '@/common/storages/stores/popup/slice'
import { useWallet } from '@/ui/utils'
import BigNumber from 'bignumber.js';

interface Currency {
  name: string
  amount: string
  value: string
}

const Home = () => {
  const { t } = useTranslation()
  const wallet = useWallet()
  const navigate = useNavigate()
  const account = useAppSelector(getAccount)
  const dispatch = useAppDispatch()

  const [dashboardReload, setDashboardReload] = useState(false);
  const [pendingTxCount, setPendingTxCount] = useState(0);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [currentAccount, setCurrentAccount] = useState<Account | null>(null);
  const [startEdit, setStartEdit] = useState(false);
  const [alianName, setAlianName] = useState<string>('');
  const [accountsList, setAccountsList] = useState<Account[]>([]);
  const [displayName, setDisplayName] = useState<string>('');
  
  const alianNameConfirm = async (e) => {
    e.stopPropagation();
    if (!alianName) {
      return;
    }
    setStartEdit(false);
    await wallet.updateAlianName(
      currentAccount?.address?.toLowerCase(),
      alianName
    );
    setDisplayName(alianName);
    const newAccountList = accountsList.map((item) => {
      if (
        item.address.toLowerCase() === currentAccount?.address.toLowerCase()
      ) {
        return {
          ...item,
          alianName: alianName,
        };
      }
      return item;
    });
    if (newAccountList.length > 0) {
      setAccountsList(newAccountList);
    }
  };

  const balanceList = async (accounts) => {
    return await Promise.all<Account>(
      accounts.map(async (item) => {
        let balance = await wallet.getAddressCacheBalance(item?.address);
        if (!balance) {
          balance = await wallet.getAddressBalance(item?.address);
        }
        return {
          ...item,
          balance: balance?.total_usd_value || 0,
        };
      })
    );
  };

  const getAllKeyrings = async () => {
    setLoadingAddress(true);
    const _accounts = await wallet.getAllVisibleAccounts();
    const allAlianNames = await wallet.getAllAlianName();
    const allContactNames = await wallet.getContactsByMap();
    const templist = await _accounts
      .map((item) =>
        item.accounts.map((account) => {
          return {
            ...account,
            type: item.type,
            alianName:
              allContactNames[account?.address?.toLowerCase()]?.name ||
              allAlianNames[account?.address?.toLowerCase()],
            keyring: item.keyring,
          };
        })
      )
      .flat(1);
    console.log('template', templist)
    const result = await balanceList(templist);
    setLoadingAddress(false);
    if (result) {
      const withBalanceList = result.sort((a, b) => {
        return new BigNumber(b?.balance || 0)
          .minus(new BigNumber(a?.balance || 0))
          .toNumber();
      });
      console.log(withBalanceList)
      setAccountsList(withBalanceList);
    }
  };

  const getPendingTxCount = async (address: string) => {
    const count = await wallet.getPendingCount(address);
    setPendingTxCount(count);
  };
  
  const getCurrentAccount = async () => {
    const account = await wallet.getCurrentAccount();
    if (!account) {
      navigate('/welcome');
      return;
    }
    setCurrentAccount(account);
  };

  useEffect(() => {
    if (dashboardReload) {
      if (currentAccount) {
        getPendingTxCount(currentAccount.address);
      }
      setDashboardReload(false);
      getCurrentAccount();
      getAllKeyrings();
    }
  }, [dashboardReload]);
  useEffect(() => {
    getAllKeyrings();
  }, []);

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
          accounts={accountsList}
          onChange={function (account: Account): void {
            throw new Error('Function not implemented.')
          }}
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
          }}
        >
          <span>
            <img src="./images/qrcode-solid.png" alt="" />
          </span>
          &nbsp;Receive
        </div>
        <div
          className="cursor-pointer box unit"
          onClick={(e) => {
            navigate('/send/index')
          }}
        >
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
