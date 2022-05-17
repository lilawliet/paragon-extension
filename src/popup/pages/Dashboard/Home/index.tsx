import { Divider, Layout, Statistic } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AccountSelect from '@/popup/components/Account';
import { Account } from '@/background/service/preference';
import { useState } from 'react';

interface Currency {
    name: string
    amount: string
    value: string
}

const Home = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [currencies, setCurrencies] = useState<Currency[]>([{
        name: 'novo',
        amount: '15000000000000 Novo',
        value: '$5,245.01'
    }]) 

    return(
        <div className="flex flex-col items-center mt-4 justify-evenly">
            <div className='px-2 py-1 box black bg-opacity-20 middle'>
                <AccountSelect 
                    onChange={function (account: Account): void {
                        throw new Error('Function not implemented.');
                    } } 
                    onCancel={function (): void {
                        throw new Error('Function not implemented.');
                    } } 
                    title={''} 
                />
            </div>
            <div className='p-[10px] flex items-center font-bold text-[44px]'>
                <span >$</span><Statistic className='text-white' value={112893} valueStyle={{fontSize: '44px'}} />
            </div>
            <div className='grid grid-cols-2 gap-4 text-lg w-5/8'>
                <div className='box unit'>
                    <span><img src="./images/qrcode-solid.png" alt="" /></span>
                    &nbsp;Receive
                </div>
                <div className='box unit'>
                    <span><img src="./images/arrow-right-arrow-left-solid.png" alt="" /></span>
                    &nbsp;Send
                </div>
            </div>
            <div className="mt-6">
                {currencies.map((currency, index) => (
                    <div className='box nobor' key={index}>
                        <div className='w-[40px] h-[40px]'><img src={`./images/${currency.name}.svg`} alt="" /></div>
                        <div className='flex flex-col flex-grow px-2'>
                            <div className='font-semibold'>{currency.name}</div>
                            <div className='text-soft-white'>{currency.amount}</div>
                        </div>
                        <div className='font-semibold'>{currency.value}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Home