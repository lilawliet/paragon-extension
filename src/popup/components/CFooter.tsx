import { useTranslation } from 'react-i18next';

import {
    Panel,
    getPanel,
    setPanel
} from '@/common/storages/stores/popup/slice';
import { useAppDispatch, useAppSelector } from '@/common/storages/hooks';

  
const CFooter = () => {
    const { t } = useTranslation();
    const panel = useAppSelector(getPanel);
    const dispatch = useAppDispatch();

    return(
        <div className='grid w-full h-full grid-cols-4 text-2xl border-t border-white bg-soft-black border-opacity-10'>
            <div className={`cursor-pointer flex items-center justify-center h-full text-center ${panel == Panel.home ? 'text-primary': ''}`} onClick={e=>{dispatch(setPanel(Panel.home))}}>
                <img src={`./images/wallet-solid${ panel == Panel.home ? '-active': '' }.png`} alt="" />
            </div>
            <div className={`cursor-pointer flex items-center justify-center h-full text-center ${panel == Panel.nft ? 'text-primary': ''}`} >
                <img src={`./images/list-solid${ panel == Panel.nft ? '-active': '' }.png`} alt="" />
            </div>
            <div className={`cursor-pointer flex items-center justify-center h-full text-center ${panel == Panel.transaction ? 'text-primary': ''}`} onClick={e=>{dispatch(setPanel(Panel.transaction))}}>
                <img src={`./images/clock-solid${ panel == Panel.transaction ? '-active': '' }.png`} alt="" />
            </div>
            <div className={`cursor-pointer flex items-center justify-center h-full text-center ${panel == Panel.settings ? 'text-primary': ''}`} onClick={e=>{dispatch(setPanel(Panel.settings))}}>
                <img src={`./images/gear-solid${ panel == Panel.settings ? '-active': '' }.png`} alt="" />
            </div>
        </div>
    )
}

export default CFooter;