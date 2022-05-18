import { Button, Input } from "antd"

import { Transaction, Status } from './index'

interface Props {
    transaction: Transaction;
    setTransaction(transaction: Transaction): void; 
    setStatus(status: Status): void;
}

export default ({
    transaction,
    setTransaction,
    setStatus
}: Props) => {
    const verify = () => {
        // to verify 
        setStatus('confirm')
    }

    return (
        <div className="flex flex-col items-center mx-auto mt-5 gap-3_75 justify-evenly w-95">
            <div className='flex items-center px-2 text-2xl h-13 w340'>
                Send Novo
            </div>
            <div className='w-15 h-15'><img className='w-full' src={`./images/Novo.svg`} alt="" /></div>
            <div className='flex items-center w-full mt-5 h-15_5 p-2_5 box default'>
                <Input className='font-bold text-white p0' bordered={false} status="error" placeholder="Recipient’s NOVO address"/>
            </div>
            <div className='flex justify-between w-full mt-5 box text-soft-white'>
                <span>Available</span>
                <span><span className='font-bold text-white'>{transaction.amount}</span> Novo</span>
            </div>
            <div className='flex items-center w-full h-15_5 p-2_5 box default'>
                    <Input className='font-bold text-white p0' bordered={false} placeholder="Amount"/>
            </div>
            <div className='flex justify-between w-full mt-5 text-soft-white'>
                <span>Fee</span>
                <span><span className='font-bold text-white'>{transaction.amount}</span> Novo</span>
            </div>
            
            <Button size='large' type='primary' className='box w380' onClick={e => {verify()}}>
                <div className='flex items-center justify-center text-lg'>Next</div>
            </Button>
        </div>
    )
}