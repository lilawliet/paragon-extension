import { Button, Divider, Layout, message, Statistic } from 'antd';
import { useTranslation } from 'react-i18next';
import { Content, Footer, Header } from 'antd/lib/layout/layout';
import { ArrowLeftOutlined, CopyOutlined } from '@ant-design/icons';
import CHeader from '@/popup/components/CHeader';
import QRCode from 'qrcode.react';
import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { copyToClipboard } from '@/common/utils';

const Receive = () => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();

    const address = searchParams?.get('address')?? '';

    function copy(str: string) {
        copyToClipboard(str).then(() => {
          message.success({
              duration: 100,
              content: `${str} copied`
          });
        });
    }

    return(
        <Layout className='h-full'>
                <Header className='border-b border-white border-opacity-10'><CHeader/></Header>
                <Content style={{backgroundColor: '#1C1919'}}>
                    <div className="flex flex-col items-center gap-10 mx-auto mt-5 justify-evenly w-110">
                        <div className='flex items-center px-2 text-2xl h-13 w340'>
                            Deposit Novo
                        </div>
                        <div className='flex items-center justify-center bg-white rounded-2xl h-60 w-60'>
                            <QRCode value={address} renderAs="svg" size={210} ></QRCode>
                        </div>
                        <div className='flex flex-col w-full gap-5'>
                            <div className='grid w-full grid-cols-6 px-10 box default py-2_5' onClick={e => {copy('address')}}>
                                <div className='flex items-center'>
                                    <img src="./images/copy-solid.png" alt="" />
                                </div>
                                <div className='flex flex-col flex-grow col-span-5 items-begin'>
                                    <span className='font-bold'>account name</span>
                                    <span className='text-soft-white'>{address}</span>
                                </div>
                            </div>
                            <div className='text-base text-center text-soft-white'>This address can only receive Novo</div>
                        </div>
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

export default Receive