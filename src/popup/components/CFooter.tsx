import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    SketchOutlined,
    UnorderedListOutlined,
    ClockCircleOutlined,
    SettingOutlined
  } from '@ant-design/icons';

interface Props {
    active: string;
    setActive(active: string): void; 
}
  
const CFooter = ({
    active,
    setActive 
}: Props) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const goto = (path: string) => {
        navigate(path)
    }

    return(
        <div className='grid w-full h-full grid-cols-4 text-2xl border-t border-white bg-soft-black border-opacity-10'>
            <div className={`cursor-pointer flex items-center justify-center h-full text-center ${active == 'home' ? 'text-primary': ''}`} onClick={e=>{setActive('home')}}>
                <img src={`./images/wallet-solid${ active == 'home' ? '-active': '' }.png`} alt="" />
            </div>
            <div className={`cursor-pointer flex items-center justify-center h-full text-center ${active == 'nft' ? 'text-primary': ''}`} > {/* onClick={e=>{setActive('nft')}} */}
                <img src={`./images/list-solid${ active == 'nft' ? '-active': '' }.png`} alt="" />
            </div>
            <div className={`cursor-pointer flex items-center justify-center h-full text-center ${active == 'transaction' ? 'text-primary': ''}`} onClick={e=>{setActive('transaction')}}>
                <img src={`./images/clock-solid${ active == 'transaction' ? '-active': '' }.png`} alt="" />
            </div>
            <div className={`cursor-pointer flex items-center justify-center h-full text-center ${active == 'settings' ? 'text-primary': ''}`} onClick={e=>{setActive('settings')}}>
                <img src={`./images/gear-solid${ active == 'settings' ? '-active': '' }.png`} alt="" />
            </div>
        </div>
    )
}

export default CFooter;