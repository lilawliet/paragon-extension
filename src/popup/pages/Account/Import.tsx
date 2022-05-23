import { Button, Input } from "antd"
import { useNavigate } from "react-router-dom";

import { Account, Status } from './index'

interface Props {
    account: Account;
    setAccount(account: Account): void; 
    setStatus(status: Status): void;
}

export default ({
    account,
    setAccount,
    setStatus
}: Props) => {
    const navigate = useNavigate()

    const verify = () => {
        // to verify 
        navigate('/create-recovery')
    }

    return (
        <div className="flex flex-col items-center mx-auto mt-5 gap-3_75 justify-evenly w-95">
            <div className='flex items-center px-2 text-2xl h-13'>
                Import Private Key
            </div>
            <div className='text-base text-soft-white'>Imported accounts will not be associated with your originally created Paragon account Secret Recovery Phrase.</div>
            <div className='flex items-center w-full p-5 mt-1_25 h-15_5 box default'>
                <Input className='font-semibold text-white p0' bordered={false} status="error" placeholder="Private Key"/>
            </div>
            <Button size='large' type='primary' className='box w380' onClick={e => {verify()}}>
                <div className='flex items-center justify-center text-lg'>Import Private Key</div>
            </Button>
        </div>
    )
}