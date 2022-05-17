import { Divider, Layout, Statistic } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Content, Footer, Header } from 'antd/lib/layout/layout';
import CHeader from '@/popup/components/CHeader';
import CFooter from '@/popup/components/CFooter';
import { useCallback, useEffect, useState } from 'react';
import Home from './Home'
import Transaction from './Transaction'
import List from './List'
import Settings from './Settings'
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { t } = useTranslation();
    const [active, setActive] = useState('home')

    useEffect(() => {
    }, [active])

    return(
        <Layout className='h-full'>
                <Header className='border-b border-white border-opacity-10'><CHeader/></Header>
                <Content style={{backgroundColor: '#1C1919'}}>
                    {
                        active == 'home' ? <Home/> : active == 'transaction' ? <Transaction/> : active == 'settings' ? <Settings/> : <Home/>
                    }
                </Content>
                <Footer style={{height: '5.625rem'}}><CFooter active={active} setActive={setActive}/></Footer>
        </Layout>
    )
}

export default Dashboard