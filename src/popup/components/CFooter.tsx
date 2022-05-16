import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    SketchOutlined,
    UnorderedListOutlined,
    ClockCircleOutlined,
    SettingOutlined
  } from '@ant-design/icons';

interface Props {
    ative?: string
}
  
const CFooter = ({
    ative
}: Props) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const goto = (path: string) => {
        navigate(path)
    }

    return(
        <div className='grid w-full h-full grid-cols-4 text-2xl border-t border-white bg-soft-black border-opacity-10'>
            <div className={`cursor-pointer flex items-center justify-center h-full text-center ${ative == '1' ? 'text-primary': ''}`} onClick={e=>{goto('/dashboard')}}><SketchOutlined /></div>
            <div className={`cursor-pointer flex items-center justify-center h-full text-center ${ative == '2' ? 'text-primary': ''}`} onClick={e=>{goto('/create-recovery')}}><UnorderedListOutlined /></div>
            <div className={`cursor-pointer flex items-center justify-center h-full text-center ${ative == '3' ? 'text-primary': ''}`} onClick={e=>{goto('/transaction')}}><ClockCircleOutlined /></div>
            <div className={`cursor-pointer flex items-center justify-center h-full text-center ${ative == '4' ? 'text-primary': ''}`} onClick={e=>{goto('/create-recovery')}}><SettingOutlined /></div>
        </div>
    )
}

export default CFooter;