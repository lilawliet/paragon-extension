import { Button, Divider, Layout, Statistic } from 'antd';
import { useTranslation } from 'react-i18next';
import { Content, Footer, Header } from 'antd/lib/layout/layout';
import { ArrowLeftOutlined } from '@ant-design/icons';
import CHeader from '@/popup/components/CHeader';

const Receive = () => {
    const { t } = useTranslation();

    return(
        <Layout className='h-full'>
                <Header className='border-b border-white border-opacity-10'><CHeader/></Header>
                <Content style={{backgroundColor: '#1C1919'}}>
                    <div className="flex flex-col items-center gap-5 mt-5 justify-evenly">
                        <div className='flex items-center px-2 text-2xl h-13 w340'>
                            Deposit Novo
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