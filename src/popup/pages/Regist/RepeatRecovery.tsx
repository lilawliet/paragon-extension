import { Button, Checkbox, Input } from "antd"
import { Link, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { ChangeEventHandler, useEffect, useState } from "react"

const RepeatRecovery = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [keys, setKeys] = useState<Array<string>>(new Array(12).fill(""))
  const [disabled, setDisabled] = useState(true)

  const verify = () => {
    // to verify

    console.log("verify")
    // path move
    navigate("/create-password")
  }

  const onChange = (e: any, index: any) => {
    const newKeys = [...keys]
    newKeys.splice(index, 1, e.target.value)
    setKeys(newKeys)
  }

  useEffect(() => {
    // to verify key
    setDisabled(
      keys.filter((key) => {
        return key == ""
      }).length > 0
    )
  }, [keys])

  return (
    <div className="flex justify-center pt-15 box w380">
      <div className="flex flex-col justify-center gap-5 text-center">
        <div className="text-2xl text-white">Secret Recovery Phrase</div>
        <div className="text-sm text-soft-white">
          Import an existing wallet with your 12-word secret recovery phrase
        </div>
        <div className="grid grid-cols-2 gap-5">
          {keys.map((_, index) => {
            return (
              <div
                key={index}
                className="flex items-center w-full p-5 text-left border border-white rounded-lg bg-soft-black border-opacity-20 text-soft-white"
              >
                {index + 1}.
                <Input
                  className="text-white p0"
                  bordered={false}
                  value={_}
                  onChange={(event) => {
                    onChange(event, index)
                  }}
                />
              </div>
            )
          })}
        </div>
        <div>
          <Button disabled={disabled} size="large" type="primary" className="box w380 content" onClick={verify}>
            {t("Import wallet")}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default RepeatRecovery
