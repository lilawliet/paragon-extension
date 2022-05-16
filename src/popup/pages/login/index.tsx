import { Button, Input, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import React, { ChangeEventHandler, useEffect, useRef, useState } from 'react';

const Login = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [password, setPassword] = useState("")
    const [disabled, setDisabled] = useState(true)

    const btnClick = () => {
        // to create wallet 

        // jump to dashboard
        navigate('/dashboard')
    }

    const verify = (e: React.FocusEvent<HTMLInputElement, Element>) => {
        // to verify 
        setPassword(e.target.value)
    }

    useEffect(() => {
        if (password) {
            if (true) { // to verify
                setDisabled(false)
            }
        }
    }, [password])


    return(
        <div
          className="flex justify-center pt-36"
        >
            <div className='flex flex-col justify-center gap-4 mx-8 text-center'>
                <div className='flex justify-center gap-2'>
                    <img 
                        className="h-12 select-none"
                        src='./images/Diamond.svg' />
                    <img src="./images/Paragon.svg" className='select-none' alt="" />
                </div>
                <div className='text-2xl text-white box large'>
                    Enter your password
                </div>
                <div>
                    <Input.Password placeholder="Password" onBlur={verify} />
                </div>
                <div>
                    <Button
                    disabled={disabled}
                    size="large"
                    type='primary'
                    className="box large content"
                    onClick={btnClick}
                    >
                    {t('Unlock')}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Login