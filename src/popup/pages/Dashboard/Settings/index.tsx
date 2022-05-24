import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import AccountSelect from "@/popup/components/Account"
import { Account } from "@/background/service/preference"
import { forwardRef, UIEventHandler, useEffect, useRef, useState } from "react"
import { Avatar, Button, Input, List } from "antd"
import VirtualList from "rc-virtual-list"
import { EditOutlined, RightOutlined } from "@ant-design/icons"
import { verify } from "crypto"

interface Transaction {
    time: number
    address: string
    amount: string
}

interface Setting {
    label?: string
    value?: string
    desc?: string
    action: string
    route: string
    right: boolean
}

const SettingList: Setting[] = [
  {
    label: "Language",
    value: "English",
    desc: "",
    action: "language",
    route: "language",
    right: true
  },
  {
    label: "Currency",
    value: "US Dollar",
    desc: "",
    action: "currency",
    route: "currency",
    right: true
  },
  {
    label: "Change Password",
    value: "Change your lockscreen password",
    desc: "",
    action: "password",
    route: "password",
    right: true
  },
  {
    label: "",
    value: "",
    desc: "Show Secret Recovery Phrase",
    action: "recovery",
    route: "recovery",
    right: false
  },
  {
    label: "",
    value: "",
    desc: "Export Private Key",
    action: "export-key",
    route: "export-key",
    right: false
  }
]

const MyItem: React.ForwardRefRenderFunction<HTMLElement, Setting> = (item: Setting) => {
  return (
    <Button size="large" type="default" className="box w-115 default btn-settings">
      <div className="flex items-center justify-between font-semibold text-4_5">
        <div className="flex flex-col text-left gap-2_5">
          <span>{item.label}</span>
          <span className="font-normal opacity-60">{item.value}</span>
        </div>
        <div className="flex-grow">{item.desc}</div>
        {item.right ? <RightOutlined style={{ transform: "scale(1.2)", opacity: "80%" }} /> : <></>}
      </div>
    </Button>
  )
}

const ForwardMyItem = forwardRef(MyItem)

export default () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [editable, setEditable] = useState(false)
  const [account, setAccount] = useState("Very Long Account Name")

  const addressInput = useRef<any>(null)
  const edit = () => {
    setEditable(true)
  }

  useEffect(() => {
    if (editable) {
            addressInput.current!.focus({ cursor: "start" })
    }
  }, [editable])

  useEffect(() => {
    setEditable(false)
  }, [account])

  const verify = (e: React.ChangeEvent<HTMLInputElement>) => {
    // to verify

    // to update
    console.log(e.target.value)

    setAccount(e.target.value)
  }

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      time: 1652188199,
      address: "sadfjkl2j343jlk",
      amount: "+1,224"
    },
    {
      time: 1652188199,
      address: "sadfjkl2j343jlk",
      amount: "+1,224"
    }
  ])

  const ContainerHeight = 500
  const ItemHeight = 90

  const onScroll = (e: any) => {
    if (e.target.scrollHeight - e.target.scrollTop === ContainerHeight) {
    }
  }

  return (
    <div className="flex flex-col items-center h-full gap-5justify-evenly">
      <div className="mt-5 ">
        <Button
          size="large"
          type="default"
          className="grid grid-cols-6 p-5 h-15_5 box default w380"
          onClick={(e) => {
            navigate("/settings/account")
          }}
        >
          <div className="flex items-center justify-between font-semibold text-4_5 opacity-60">
            <div className="col-span-5 font-semibold p0">{account}</div>
            <div className="flex items-center justify-center cursor-pointer">
              <EditOutlined />
            </div>
          </div>
        </Button>
        {/* <div className='grid grid-cols-6 p-5 h-15_5 box default w380'>
                    <Input
                        className='col-span-5 font-semibold text-white p0'
                        bordered={false}
                        disabled={!editable}
                        placeholder="Very Long Account Name"
                        ref={addressInput}
                        defaultValue={account}
                        onBlur={e=> {verify(e)}}
                        />
                    <div className={`cursor-pointer flex items-center justify-center ${editable? 'text-primary': ''}`} onClick={edit}><EditOutlined /></div>
                </div> */}
        <div className="w-full text-center text-soft-white mt-2_5">({"addressaddressaddress"})</div>
      </div>
      <div className="h-125 ">
        <List>
          <VirtualList data={SettingList} itemKey="action" onScroll={onScroll}>
            {(item) => (
              <Button
                size="large"
                type="default"
                className={`mt-3_75 box w-115 default ${item.right ? "btn-settings" : ""}`}
                onClick={(e) => {
                  navigate(`/settings/${item.route}`)
                }}
              >
                <div className="flex items-center justify-between font-semibold text-4_5">
                  <div className="flex flex-col text-left gap-2_5">
                    <span>{item.label}</span>
                    <span className="font-normal opacity-60">{item.value}</span>
                  </div>
                  <div className="flex-grow">{item.desc}</div>
                  {/* <div><img src={`./images/chevron-right-solid.png`} alt="" /></div> */}
                  {item.right ? <RightOutlined style={{ transform: "scale(1.2)", opacity: "80%" }} /> : <></>}
                </div>
              </Button>
            )}
          </VirtualList>
        </List>
      </div>
    </div>
  )
}
