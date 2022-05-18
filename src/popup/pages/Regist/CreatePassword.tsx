import { Button, Input, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import React, { ChangeEventHandler, useEffect, useState } from 'react';

const CreatePassword = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")
    const [disabled, setDisabled] = useState(true)

    const btnClick = () => {
        // to create wallet 

        // jump to dashboard
        navigate('/dashboard')
    }

    const justify = (e: React.ChangeEvent<HTMLInputElement> , type: string) => {
        if (e.target.value && /^.*(?=.{6,16})(?=.*\d)(?=.*[A-Z]{1,})(?=.*[a-z]{1,})(?=.*[!@#$%^&*?\(\)]).*$/.test(e.target.value)){
            message.warning('The value must be 6 to 16 letters, contains at least uppercase and lowercase, digits, and special characters');
            return;
        }
        switch (type) {
            case 'password':
                setPassword(e.target.value);
                break;
            case 'password2':
                setPassword2(e.target.value);
                break;
            default: 
                break;
        }
    }

    useEffect(() => {
        if (password && password2 && password == password2) {
            setDisabled(false)
        }else {
            setDisabled(true)
        }
    }, [password, password2])

    return(
        <div
          className="flex justify-center pt-45"
        >
            <div className='flex flex-col justify-center gap-5 text-center'>
                <div className='text-2xl text-white box w380'>
                    Create a password
                </div>
                <div className='text-sm text-soft-white box w380'>You will use this to unlock your wallet</div>
                <div className='mt-12'>
                    <Input.Password placeholder="Password" onChange={ event => {
                                    justify(event, 'password')
                    }} />
                </div>
                <div>
                    <Input.Password placeholder="Confirm Password" onChange={ event => {
                                    justify(event, 'password2')
                    }} />
                </div>
                <div>
                    <Button
                    disabled={disabled}
                    size="large"
                    type='primary'
                    className="box w380 content"
                    onClick={btnClick}
                    >
                    {t('Continue')}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default CreatePassword