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
    }, {
        time: 1652188199,
        address: 'sadfjkl2j343jlk',
        amount: '+1,224'
    }]) 

    return(
        <div className="flex flex-col items-center gap-5 mt-5 justify-evenly">
            <div className='flex items-center px-2 h-13 box black bg-opacity-20 w340'>
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
            <div className="grid gap-5 mt-6">
                {transactions.map((transaction, index) => (
                    <div className='justify-between box nobor w440 text-soft-white' key={index}>
                        <span>{transaction.address}</span>
                        <span><span className='font-bold text-white'>{transaction.amount}</span> Novo</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Transaction