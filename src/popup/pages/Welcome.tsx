import { Button } from "antd"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

const Welcome = () => {
  const { t } = useTranslation()
  return (
    <div
      className="flex justify-center pt-60"
      style={
        {
          // backgroundImage:
          //   'linear-gradient(0deg, #1c1919 0%, #000000 50%, #1c1919 90.78%)',
        }
      }
    >
      <div className="flex-col">
        <div className="flex justify-center mb-8 gap-x-4">
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
