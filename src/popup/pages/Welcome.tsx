import React from 'react';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Welcome = () => {
  const { t } = useTranslation();
  return (
    <div
      className="pt-[120px] flex justify-center"
      style={{
        // backgroundImage:
        //   'linear-gradient(0deg, #1c1919 0%, #000000 50%, #1c1919 90.78%)',
      }}
    >
        <div className='flex-col'>
            <div className='flex justify-center'>
                <img 
                    className="select-none bg-no-repeat bg-cover w-[50px] h-[50px]"
                    src='./images/Diamond-primary.svg' />
                <img src="./images/Paragon.svg" alt="" />
            </div>
            <div className='w-[280px] grid gap-4 my-4'>
                <Link to="/password" replace>
                    <Button
                    size="large"
                    type="primary"
                    className="block mx-auto border-none bg-primary w-full"
                    >
                    {t('Create new wallet')}
                    </Button>
                </Link>
                <Link to="/login" replace>
                    <Button
                    size="large"
                    type='default'
                    className="block mx-auto text-white bg-soft-black border-white border-opacity-20 w-full"
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
