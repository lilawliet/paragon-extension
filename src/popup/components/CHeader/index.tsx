import { Badge, Layout } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Suspense, useEffect, useState } from 'react';
import './index.less'

const CHeader = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(true);

    const connect = () => {
        return new Promise((resolve, reject) => {
            setLoading(true)
            setTimeout(() => {
                setStatus(true)
                setLoading(false)
            }, 3000);
        });
    }

    const disconnect = () => {
        return new Promise((resolve, reject) => {
            setLoading(true)
            setTimeout(() => {
                setStatus(false)
                setLoading(false)
            }, 3000);
        });
    }

    // useEffect(() => {
    //     connect()
    // }, [])


    const StatusEl = () => {
        // let result: any = useResource.read();
        if (status) {
            return (
            <div className='connected'
                onClick={e=> {disconnect()}}>
                <div className='mr-2 bg-custom-green rounded-xl w-2_5 h-2_5'></div>
                Connected
            </div>
            )
        }
        return(
            <div className='flex items-center justify-center text-sm p-2_5 h-8_5 box default leading-5_5'
                onClick={e=> {connect()}}>
                <div className='bg-primary rounded-xl w-[10px] h-[10px]'></div>
            </div>
        )
    }
    
    return(
        <div className='flex items-center justify-between h-full'>
            <div className='flex items-center justify-center'>
                <img 
                    className="h-8 select-none w-9"
                    src='./images/Diamond.svg' />
                <img src="./images/Paragon.svg" className='h-5 ml-3 select-none' alt="" />
            </div>
            <div className='flex-grow-1'></div>
            {loading ? (
            <div className='connected'>
                <div className='mr-2 bg-custom-green rounded-xl w-2_5 h-2_5'></div>
                { status ? 'Disconnecting': 'Connecting'}
            </div>) :  (<StatusEl/>)}
        </div>
    )
}

export default CHeader;