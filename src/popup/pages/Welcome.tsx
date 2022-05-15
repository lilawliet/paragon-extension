import { Button } from 'antd';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Welcome = () => {
  const { t } = useTranslation();
  return (
    <div
      className="flex justify-center pt-36"
      style={{
        // backgroundImage:
        //   'linear-gradient(0deg, #1c1919 0%, #000000 50%, #1c1919 90.78%)',
      }}
    >
        <div className='flex-col'>
            <div className='flex justify-center gap-2 mb-8'>
                <img 
                    className="h-12 select-none"
                    src='./images/Diamond.svg' />
                <img src="./images/Paragon.svg" className='select-none' alt="" />
            </div>
            <div className='grid gap-4'>
                <Link to="/create-recovery" replace>
                    <Button
                    size="large"
                    type="primary"
                    className="border-none bg-primary box large content"
                    >
                    {t('Create new wallet')}
                    </Button>
                </Link>
                <Link to="/r" replace>
                    <Button
                    size="large"
                    type='default'
                    className="box large default content"
                    >
                    {t('I already have a wallet')}
                    </Button>
                </Link>
            </div>
        </div>
    </div>
  );
};

export default Welcome;
