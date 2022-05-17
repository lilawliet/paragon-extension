import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AccountSelect from '@/popup/components/Account';
import { Account } from '@/background/service/preference';
import { useState } from 'react';

interface Transaction {
    time: number
    address: string
    amount: string
}

const Transaction = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [transactions, setTransactions] = useState<Transaction[]>([{
        time: 1652188199,
        address: 'sadfjkl2j343jlk',
        amount: '+1,224'
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
            <div className="mt-6">
                {transactions.map((transaction, index) => (
                    <div className='box nobor' key={index}>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Transaction