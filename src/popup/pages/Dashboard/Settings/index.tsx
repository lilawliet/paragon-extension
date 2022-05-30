import { useAppDispatch } from '@/common/storages/hooks'
import { changeAccount, updateAlianName } from '@/common/storages/stores/popup/slice'
import { CURRENCIES } from '@/constant'
import { useWallet } from '@/ui/utils'
import { EditOutlined, RightOutlined } from '@ant-design/icons'
import { Button, Input, List } from 'antd'
import { t } from 'i18next'
import VirtualList from 'rc-virtual-list'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { AccountsProps } from '..'

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
  }
]

export default ({ current }: AccountsProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const wallet = useWallet()
  const [editable, setEditable] = useState(false)

  const dispatch = useAppDispatch()
  const addressInput = useRef<any>(null)

  const handleChangeAlianName = () => {
    setEditable(true)
  }

  const alianName = useMemo(() => (current?.alianName ? current.alianName : current?.brandName ? current.brandName : ''), [current])
  const [name, setName] = useState('')

  useEffect(() => {
    setName(alianName)
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

  const ContainerHeight = 500
  const ItemHeight = 90

  const onScroll = (e: any) => {
    if (e.target.scrollHeight - e.target.scrollTop === ContainerHeight) {
      // do something
    }
  }

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

  return (
    <div className="flex flex-col items-center h-full gap-5justify-evenly">
      <div className="mt-5">
        <div
          className={`grid items-center grid-cols-6 p-5 mt-5 h-15_5 box text-white border border-white rounded-lg  hover w380 ${
            editable ? 'bg-primary-active border-opacity-60' : 'bg-soft-black border-opacity-20'
          }`}
          onClick={(e) => {
            handleChangeAlianName()
          }}
        >
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
                    <span className="font-normal opacity-60">{item.action == 'currency' ? CURRENCIES.find((v) => v.symbol == currency)?.name : item.value}</span>
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
