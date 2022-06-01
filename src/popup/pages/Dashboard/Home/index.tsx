import { copyToClipboard, formatAddr } from '@/common/utils'
import { CURRENCIES, KEYRING_CLASS, TO_LOCALE_STRING_CONFIG } from '@/constant'
import AccountSelect from '@/popup/components/Account'
import { useGlobalState } from '@/ui/state/state'
import { message, Statistic } from 'antd'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

function copy(str: string) {
  copyToClipboard(str).then(() => {
    message.success({
      duration: 3,
      content: `${str} copied`
    })
  })
}

const Home = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [currentAccount] = useGlobalState('currentAccount')
  const [accountAssets] = useGlobalState('accountAssets')
  const [currency] = useGlobalState('currency')
  const [exchangeRate] = useGlobalState('exchangeRate')
  const [accountBalance] = useGlobalState('accountBalance')

  const getCurrencyValueString = (usd_value) => {
    let value = 0
    if (accountBalance) {
      if (currency == 'USD') {
        value = parseFloat(usd_value)
      } else {
        value = parseFloat(usd_value) * exchangeRate[currency]
      }
    }
    const symbol = CURRENCIES.find((v) => v.code == currency)?.symbol
    return symbol + ' ' + value.toFixed(2)
  }
  return (
    <div className="flex flex-col items-center gap-5 mt-5 justify-evenly">
      <div className="flex items-center px-2 h-13 box soft-black bg-opacity-20 w340 hover">
        <AccountSelect />
      </div>
      <div
        className="flex items-center cursor-pointer mt-2_5"
        onClick={(e) => {
          copy(currentAccount?.address ?? '')
        }}>
        <span className="text-2xl text-soft-white">{formatAddr(currentAccount?.address ?? '', 5)}</span>
        {currentAccount?.type == KEYRING_CLASS.PRIVATE_KEY ? <span className="text-xs rounded bg-primary-active p-2_5 ml-2_5">IMPORTED</span> : <></>}
      </div>
      <div className="flex items-center p-10 font-semibold text-11">
        <Statistic className="text-white" value={getCurrencyValueString(accountBalance?.usd_value)} valueStyle={{ fontSize: '2.75rem' }} />
      </div>
      <div className="grid grid-cols-2 gap-4 leading-6_5 w-5/8">
        <div
          className="cursor-pointer box unit bg-soft-black hover:border-white hover:border-opacity-40 hover:bg-primary-active"
          onClick={(e) => {
            navigate(`/receive?address=${'quires'}`)
          }}>
          <span className='h-4_8 mr-0_5' >
            <img src="./images/qrcode-solid.svg" alt="" />
          </span>
          &nbsp;{t('Receive')}
        </div>
        <div
          className="cursor-pointer box unit bg-soft-black hover:border-white hover:border-opacity-40 hover:bg-primary-active"
          onClick={(e) => {
            navigate('/send/index')
          }}>
          <span className='h-4_8 mr-0_5' >
            <img src="./images/arrow-right-arrow-left-solid.svg" alt="" />
          </span>
          &nbsp;{t('Send')}
        </div>
      </div>
      <div className="mt-2">
        {accountAssets?.map((asset, index) => (
          <div className="box nobor w440" key={index}>
            <div className="w-10 h-10">
              <img src={`./images/${asset.name}.svg`} alt="" />
            </div>
            <div className="flex flex-col flex-grow px-2">
              <div className="font-semibold">{asset.name}</div>
              <div className="text-base text-soft-white">
                {Number(asset.amount)?.toLocaleString('en', {minimumFractionDigits:4})} {asset.symbol}
              </div>
            </div>
            <div className="font-semibold">{getCurrencyValueString(asset.value)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home
