import { useWallet } from '@/ui/utils'
import { EditOutlined, RightOutlined } from '@ant-design/icons'
import { Button, Input, List } from 'antd'
import VirtualList from 'rc-virtual-list'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { AccountsProps } from '..'

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
    label: 'Language',
    value: 'English',
    desc: '',
    action: 'language',
    route: 'language',
    right: true
  },
  {
    label: 'Currency',
    value: 'US Dollar',
    desc: '',
    action: 'currency',
    route: 'currency',
    right: true
  },
  {
    label: 'Change Password',
    value: 'Change your lockscreen password',
    desc: '',
    action: 'password',
    route: 'password',
    right: true
  },
  {
    label: '',
    value: '',
    desc: 'Show Secret Recovery Phrase',
    action: 'recovery',
    route: 'recovery',
    right: false
  },
  {
    label: '',
    value: '',
    desc: 'Export Private Key',
    action: 'export-key',
    route: 'export-key',
    right: false
  }
]

export default ({ current }: AccountsProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const wallet = useWallet()

  const [name, setName] = useState('')
  const [editable, setEditable] = useState(false)

  const addressInput = useRef<any>(null)

  const handleChangeAlianName = () => {
    setEditable(!editable)
    //todo
  }

  // await wallet.updateAlianName(
  //   account[0]?.toLowerCase(),
  //   `${BRAND_ALIAN_TYPE_TEXT[KEYRING_CLASS.MNEMONIC]} ${
  //     mnemonLengh + 1
  //   }`
  // );
  useEffect(() => {
    setName(current?.alianName ? current.alianName : current?.brandName ? current.brandName : '')
  }, [])

  useEffect(() => {
    setName(current?.alianName ? current.alianName : current?.brandName ? current.brandName : '')
  }, [current?.alianName])

  useEffect(() => {
    if (editable) {
      addressInput.current!.focus({ cursor: 'start' })
    }
  }, [editable])

  const ContainerHeight = 500
  const ItemHeight = 90

  const onScroll = (e: any) => {
    if (e.target.scrollHeight - e.target.scrollTop === ContainerHeight) {
      // do something
    }
  }

  const handleOnBlur = async (e) => {
    if (current) {
      console.log(current)
      await wallet.updateAlianName(current.address, e.target.value)
      setName(e.target.value)
      setEditable(false)
    }
  }

  return (
    <div className="flex flex-col items-center h-full gap-5justify-evenly">
      <div className="mt-5">
        <div className="grid items-center grid-cols-6 p-5 mt-5 h-15_5 box default hover w380">
          {editable ? (
            <Input
              ref={addressInput}
              className="col-span-5 font-semibold p0 hover hover:cursor-pointer disabled:color-soft-white"
              bordered={false}
              status="error"
              placeholder="Recipient’s NOVO address"
              defaultValue={name}
              onBlur={(e) => handleOnBlur(e)}
              onPressEnter={(e) => handleOnBlur(e)}
            />
          ) : (
            <span
              className="col-span-5 font-semibold p0 hover hover:cursor-pointer opacity-60"
              onClick={(e) => {
                navigate('/settings/account')
              }}
            >
              {name}
            </span>
          )}
          <div
            className="flex items-center justify-center cursor-pointer opacity-60 hover:opacity-100"
            onClick={(e) => {
              handleChangeAlianName()
            }}
          >
            <EditOutlined />
          </div>
        </div>

        <div className="w-full text-center text-soft-white mt-2_5">({'addressaddressaddress'})</div>
      </div>
      <div className="h-125 ">
        <List>
          <VirtualList data={SettingList} itemKey="action" onScroll={onScroll}>
            {(item) => (
              <Button
                size="large"
                type="default"
                className={`mt-3_75 box w-115 default ${item.right ? 'btn-settings' : ''}`}
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
                  {item.right ? <RightOutlined style={{ transform: 'scale(1.2)', opacity: '80%' }} /> : <></>}
                </div>
              </Button>
            )}
          </VirtualList>
        </List>
      </div>
    </div>
  )
}
