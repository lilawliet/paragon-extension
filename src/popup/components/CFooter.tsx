import { useTranslation } from 'react-i18next'

import { getPanel, setPanel } from '@/common/storages/stores/popup/slice'
import { useAppDispatch, useAppSelector } from '@/common/storages/hooks'

const CFooter = () => {
  const { t } = useTranslation()
  const panel = useAppSelector(getPanel)
  const dispatch = useAppDispatch()

  return (
    <div className="grid w-full h-full grid-cols-3 text-2xl border-t border-white bg-soft-black border-opacity-10">
      <div
        className={`cursor-pointer flex items-center justify-center h-full text-center ${panel == 'home' ? 'text-primary' : ''}`}
        onClick={(e) => {
          dispatch(setPanel('home'))
        }}
      >
        <img src={`./images/wallet-solid${panel == 'home' ? '-active' : ''}.svg`} alt="" className="h-6" />
      </div>
      {/* <div className={`cursor-pointer flex items-center justify-center h-full text-center ${panel == 'nft' ? 'text-primary' : ''}`}>
        <img src={`./images/list-solid${panel == 'nft' ? '-active' : ''}.svg`} alt="" />
      </div> */}
      <div
        className={`cursor-pointer flex items-center justify-center h-full text-center ${panel == 'transaction' ? 'text-primary' : ''}`}
        onClick={(e) => {
          dispatch(setPanel('transaction'))
        }}
      >
        <img src={`./images/clock-solid${panel == 'transaction' ? '-active' : ''}.svg`} alt="" className="h-6" />
      </div>
      <div
        className={`cursor-pointer flex items-center justify-center h-full text-center ${panel == 'settings' ? 'text-primary' : ''}`}
        onClick={(e) => {
          dispatch(setPanel('settings'))
        }}
      >
        <img src={`./images/gear-solid${panel == 'settings' ? '-active' : ''}.svg`} alt="" className="h-6" />
      </div>
    </div>
  )
}

export default CFooter
