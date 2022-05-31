import { useAppDispatch } from '@/common/storages/hooks'
import { changeAccount, updateAlianName } from '@/common/storages/stores/popup/slice'
import { CURRENCIES, KEYRING_CLASS } from '@/constant'
import { useWallet } from '@/ui/utils'
import { EditOutlined, RightOutlined } from '@ant-design/icons'
import { Button, Input, List } from 'antd'
import { t } from 'i18next'
import VirtualList from 'rc-virtual-list'
import { forwardRef, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NavigateFunction, useNavigate } from 'react-router-dom'
import { AccountsProps } from '..'

interface Setting {
  label?: string
  value?: string
  desc?: string
  danger?: boolean
  action: string
  route: string
  right: boolean
  keyringType?: string
}

const SettingList: Setting[] = [
  {
    label: t('Language'),
    value: t('English'),
    desc: '',
    action: 'language',
    route: 'language',
    right: true
  },
  {
    label: t('Currency'),
    value: 'US Dollar',
    desc: '',
    action: 'currency',
    route: 'currency',
    right: true
  },
  {
    label: t('Change Password'),
    value: t('Change your lockscreen password'),
    desc: '',
    action: 'password',
    route: 'password',
    right: true
  },
  {
    label: '',
    value: '',
    danger: true,
    desc: t('Remove Account'),
    action: 'remove-account',
    route: 'remove-account',
    right: false
  },
  {
    label: '',
    value: '',
    desc: t('Show Secret Recovery Phrase'),
    action: 'recovery',
    route: 'recovery',
    right: false
  },
  {
    label: '',
    value: '',
    desc: t('Export Private Key'),
    action: 'export-key',
    route: 'export-key',
    right: false
  },
  {
    label: '',
    value: '',
    desc: t('Remove Account'),
    action: 'remove-account',
    route: 'remove-account',
    right: false,
    keyringType: KEYRING_CLASS.PRIVATE_KEY
  }
]


interface MyItemProps {
  key: number
  item: Setting
  navigate: NavigateFunction
  currency: string
}

const MyItem: React.ForwardRefRenderFunction<any, MyItemProps> = ({item, key, navigate, currency}, ref) => {
  return (
    <Button
      key={key}
      danger={item.danger}
      type={item.danger ? 'text' : 'default'}
      size="large"
      className={`mb-3_75 box w-115 ${item.danger ? item.danger : 'default'} ${item.right ? 'btn-settings' : ''}`}
      onClick={(e) => {
        navigate(`/settings/${item.route}`)
      }}
    >
      <div className="flex items-center justify-between font-semibold text-4_5">
        <div className="flex flex-col text-left gap-2_5">
          <span>{item.label}</span>
          <span className="font-normal opacity-60">{item.action == 'currency' ? CURRENCIES.find((v) => v.symbol == currency)?.name : item.value}</span>
        </div>
        <div className="flex-grow">{item.desc}</div>
        {item.right ? <RightOutlined style={{ transform: 'scale(1.2)', opacity: '80%' }} /> : <></>}
      </div>
    </Button>
  )
}

export type ScrollAlign = 'top' | 'bottom' | 'auto'

export type ScrollConfig =
  | {
      index: number
      align?: ScrollAlign
      offset?: number
    }
  | {
      key: React.Key
      align?: ScrollAlign
      offset?: number
    }

export type ScrollTo = (arg: number | ScrollConfig) => void

type ListRef = {
  scrollTo: ScrollTo
}

export default ({ current }: AccountsProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const wallet = useWallet()
  const listRef = useRef<ListRef>(null)
  const ForwardMyItem = forwardRef(MyItem)
  const [editable, setEditable] = useState(false)
  const html = document.getElementsByTagName('html')[0]
  let virtualListHeight = 485
  if (html && getComputedStyle(html).fontSize) {
    virtualListHeight = virtualListHeight * parseFloat(getComputedStyle(html).fontSize) / 16
  }

  const dispatch = useAppDispatch()
  const addressInput = useRef<any>(null)

  const handleChangeAlianName = () => {
    setEditable(true)
  }

  const alianName = useMemo(() => current?.alianName, [current])
  const [name, setName] = useState('')

  useEffect(() => {
    setName(alianName || '')
  }, [current])

  useEffect(() => {
    if (editable) {
      addressInput.current!.focus({ cursor: 'start' })
    }
  }, [editable])

  const [currency, setCurrency] = useState('USD')
  useEffect(() => {
    ;(async () => {
      const currency = await wallet.getCurrency()
      setCurrency(currency)
    })()
  }, [])

  const handleOnBlur = async (e) => {
    if (current) {
      dispatch(
        updateAlianName({
          wallet,
          address: current.address,
          alianName: e.target.value
        })
      ).then(() => {
        dispatch(changeAccount({ account: { ...current, alianName: e.target.value }, wallet }))
      })
      setName(e.target.value)
      setEditable(false)
    }
  }

  const toRenderSettings = SettingList.filter((v) => {
    if (v.keyringType) {
      if (current?.type == v.keyringType) {
        return true
      }
    } else {
      return true
    }
  })

  return (
    <div className="flex flex-col items-center h-full gap-5justify-evenly">
      <div className="mt-5">
        <div
          className={`grid items-center grid-cols-6 p-5 mt-5 h-15_5 box text-white border border-white rounded-lg  hover w380 ${
            editable ? 'bg-primary-active border-opacity-60' : 'bg-soft-black border-opacity-20'
          }`}
          onClick={(e) => {
            handleChangeAlianName()
          }}>
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
            <span className="col-span-5 font-semibold p0 hover hover:cursor-pointer opacity-60">{name}</span>
          )}
          <div className={`flex items-center justify-center cursor-pointer hover:opacity-100 ${editable ? 'opacity-100' : 'opacity-60'}`}>
            <EditOutlined />
          </div>
        </div>

        <div className="w-full text-center text-soft-white mt-2_5">( {current?.address} )</div>
      </div>
      <div className="h-121_25 mt-3_75">
        <VirtualList
          data={SettingList}
          data-id="list"
          height={virtualListHeight}
          itemHeight={20}
          itemKey={(item) => item.action}
          style={{
            boxSizing: 'border-box'
          }}
        >
          {(item, index) => <MyItem key={index} navigate={navigate} item={item} currency={currency} />}
        </VirtualList>
      </div>
    </div>
  )
}
