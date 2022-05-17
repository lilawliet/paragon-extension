import { Button, Divider, Input, Layout, Statistic } from 'antd';
import { useTranslation } from 'react-i18next';
import { Content, Footer, Header } from 'antd/lib/layout/layout';
import { ArrowLeftOutlined } from '@ant-design/icons';
import CHeader from '@/popup/components/CHeader';
import { useState } from 'react';

const SendIndex = () => {
    const { t } = useTranslation();

    const [transaction, setTransaction] = useState({
        time: 1652188199,
        address: 'sadfjkl2j343jlk',
        amount: '+1,224'
    }) 
    return(
        <Layout className='h-full'>
                <Header className='border-b border-white border-opacity-10'><CHeader/></Header>
                <Content style={{backgroundColor: '#1C1919'}}>
                    <div className="flex flex-col items-center gap-5 mt-5 justify-evenly">
                        <div className='flex items-center px-2 text-2xl h-13 w340'>
                            Send Novo
                        </div>
                        <div className='w-15 h-15'><img className='w-full' src={`./images/Novo.svg`} alt="" /></div>
                        <div className='flex items-center h-15_5 p-2_5 w380 box default'>
                                <Input className='text-white p0' bordered={false} placeholder="Recipient’s NOVO address"/>
                        </div>
                        <div className='flex justify-between box w380 text-soft-white'>
                            <span>{transaction.address}</span>
                            <span><span className='font-bold text-white'>{transaction.amount}</span> Novo</span>
                        </div>
                        <div className='flex items-center h-15_5 p-2_5 w380 box default'>
                                <Input className='text-white p0' bordered={false} placeholder="Recipient’s NOVO address"/>
                        </div>
                        <div className='flex justify-between box w380 text-soft-white'>
                            <span>{transaction.address}</span>
                            <span><span className='font-bold text-white'>{transaction.amount}</span> Novo</span>
                        </div>
                        
                        <Button size='large' type='primary' className='box w380' onClick={e => {Javascript:window.history.go(-1)}}>
                            <div className='flex items-center justify-center text-lg'>Next</div>
                        </Button>
                    </div>
                </Content>
                <Footer style={{height: '5.625rem', backgroundColor: '#1C1919', textAlign: 'center', width: '100%'}}>
                    <Button size='large' type='default' className='box w440' onClick={e => {Javascript:window.history.go(-1)}}>
                        <div className='flex items-center justify-center text-lg'><ArrowLeftOutlined/>&nbsp;Back</div>
                    </Button>
                </Footer>
                
        </Layout>
    )
}

export default SendIndex