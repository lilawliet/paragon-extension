import { Badge, Layout } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Content, Footer } from 'antd/lib/layout/layout';
import { Suspense, useEffect, useState } from 'react';

const CHeader = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(true);

    function connect() {
        return new Promise((resolve, reject) => {
            setLoading(true)
            setTimeout(() => {
                //resolve({ success: true, data: { id: 1, name: '姓名' + id } });
                // reject({ success: false, error: '数据加载失败' });
                setStatus(!status)
            }, 3000);
        });
    }

    useEffect(() => {
        setLoading(false)
    }, [status])

    function createResource(promise: Promise<any>) {
        return {
            read() {
                // return status;
                return status;
            }
        }
    }

    function StatusEl() {
        // let result: any = useResource.read();
        if (status) {
            return (
            <div className='flex items-center justify-center border border-custom-green bg-custom-green-rgba text-custom-green p-[10px] h-8 text-sm  rounded-lg border-opacity-20'
                onClick={connect}>
                <div className='bg-custom-green rounded-xl w-[10px] h-[10px] mr-2'></div>
                Connected
            </div>
            )
        }
        return(
            <div className='flex items-center justify-center p-[10px] h-8 text-sm box default'
                onClick={connect}>
                <div className='bg-primary rounded-xl w-[10px] h-[10px]'></div>
            </div>
        )
    }
    
    return(
        <div className='flex items-center justify-between h-full'>
            <div className='flex items-center justify-center'>
                <img 
                    className="h-8 select-none"
                    src='./images/Diamond.svg' />
                <img src="./images/Paragon.svg" className='select-none' alt="" />
            </div>
            <div className='flex-grow-1'></div>
            <StatusEl/>
        </div>
    )
}

export default CHeader;