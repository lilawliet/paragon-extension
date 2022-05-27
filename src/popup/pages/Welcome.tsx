import { useWallet } from '@/ui/utils'
import { Button } from 'antd'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

const Welcome = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const wallet = useWallet()
  // const navigate = useNavigate()
  // const [currentAccount, setCurrentAccount] = useState<Account | null>(null);

  // const getCurrentAccount = async () => {
  //   const account = await wallet.getCurrentAccount();
  //   if (account) {
  //     navigate('/login');
  //     return;
  //   }
  //   setCurrentAccount(account);
  // };

  // useEffect(() => {
  //   if (!currentAccount) {
  //     getCurrentAccount();
  //   }
  // }, []);

  return (
    <div
      className="flex items-center justify-center h-full"
      style={
        {
          // backgroundImage:
          //   'linear-gradient(0deg, #1c1919 0%, #000000 50%, #1c1919 90.78%)',
        }
      }>
      <div className="flex flex-col items-center">
        <div className="flex justify-center mb-15 gap-x-4 w-70">
          <img className="select-none w-15 h-12_5" src="./images/Diamond.svg" />
          <img src="./images/Paragon.svg" className="select-none" alt="" />
        </div>
        <div className="grid gap-5">
          <Button
            size="large"
            type="primary"
            className="border-none bg-primary box w380 content h-15_5"
            onClick={async () => {
              const isBooted = await wallet.isBooted()
              if (isBooted) {
                navigate('/create-recovery', {
                  state: {
                    create: true
                  }
                })
              } else {
                localStorage.setItem('welcome-to', '/create-recovery')
                navigate('/create-password', {
                  state: {
                    create: true
                  }
                })
              }
            }}>
            {t('Create new wallet')}
          </Button>
          <Button
            size="large"
            type="default"
            className="box w380 default content"
            onClick={async () => {
              const isBooted = await wallet.isBooted()
              if (isBooted) {
                navigate('/repeat-recovery', {
                  state: {
                    create: true
                  }
                })
              } else {
                localStorage.setItem('welcome-to', '/repeat-recovery')
                navigate('/create-password', {
                  state: {
                    create: true
                  }
                })
              }
            }}>
            {t('I already have a wallet')}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Welcome
