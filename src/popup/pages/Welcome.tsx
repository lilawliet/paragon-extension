import { Button } from "antd"
import { Link, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useWallet } from "@/ui/utils"
import { useEffect, useState } from "react"
import { Account } from 'background/service/preference';

const Welcome = () => {
  const { t } = useTranslation()
  const wallet = useWallet()
  const navigate = useNavigate()
  const [currentAccount, setCurrentAccount] = useState<Account | null>(null);

  const getCurrentAccount = async () => {
    const account = await wallet.getCurrentAccount();
    if (account) {
      navigate('/login');
      return;
    }
    setCurrentAccount(account);
  };

  useEffect(() => {
    if (!currentAccount) {
      getCurrentAccount();
    }
  }, []);

  return (
    <div
      className="flex items-center justify-center h-full"
      style={
        {
          // backgroundImage:
          //   'linear-gradient(0deg, #1c1919 0%, #000000 50%, #1c1919 90.78%)',
        }
      }
    >
      <div className="flex flex-col items-center">
        <div className="flex justify-center mb-15 gap-x-4 w-70">
          <img className="select-none w-15 h-12_5" src="./images/Diamond.svg" />
          <img src="./images/Paragon.svg" className="select-none" alt="" />
        </div>
        <div className="grid gap-5">
          <Link to="/create-password" replace>
            <Button size="large" type="primary" className="border-none bg-primary box w380 content h-15_5">
              {t("Create new wallet")}
            </Button>
          </Link>
          <Link to="/login" replace>
            <Button size="large" type="default" className="box w380 default content">
              {t("I already have a wallet")}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Welcome
