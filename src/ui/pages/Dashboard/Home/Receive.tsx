import { AddressBar } from '@/ui/components/AddressBar';
import CHeader from '@/ui/components/CHeader';
import { FooterBackButton } from '@/ui/components/FooterBackButton';
import { useGlobalState } from '@/ui/state/state';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Layout } from 'antd';
import { Content, Header } from 'antd/lib/layout/layout';
import QRCode from 'qrcode.react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './Receive.less';
const Receive = () => {
  const { t } = useTranslation();
  const [size, setSize] = useState(210);

  const [currentAccount] = useGlobalState('currentAccount');

  useEffect(() => {
    const html = document.getElementsByTagName('html')[0];
    if (html && getComputedStyle(html).fontSize) {
      setSize((210 * parseFloat(getComputedStyle(html).fontSize)) / 16);
    }
  }, []);

  return (
    <Layout className="h-full">
      <Header className="border-b border-white border-opacity-10">
        <CHeader />
      </Header>
      <Content style={{ backgroundColor: '#1C1919' }}>
        <div className="flex flex-col items-center gap-10 mx-auto mt-5 justify-evenly w-110">
          <div className="flex items-center px-2 text-2xl h-13 w340">{t('Deposit')} Novo</div>
          <div className="flex items-center justify-center bg-white rounded-2xl h-60 w-60">
            <QRCode value={currentAccount?.address || ''} renderAs="svg" size={size}></QRCode>
          </div>
          <div className="receive-content">
            <div className="frame1">
              <div className="profile">
                <FontAwesomeIcon className="icon" icon={faUser} />
              </div>
              <span>{currentAccount?.alianName}</span>
            </div>
            <AddressBar />
          </div>
          <div className="receive-tip">
            <span>{t('This address can only receive Novo')}</span>
          </div>
        </div>
      </Content>
      <FooterBackButton />
    </Layout>
  );
};

export default Receive;
