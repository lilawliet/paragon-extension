import { Button, Checkbox } from 'antd';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';

const CreateRecovery = () => {
    const { t } = useTranslation();

    const [checked, setChecked] = useState(false)

    const onChange = (e: CheckboxChangeEvent) => {
        setChecked(e.target.checked)
    }

    return(
        <div
          className="flex justify-center pt-33_75"
        >
            <div className='flex flex-col justify-center gap-5 text-center'>
                <div className='text-2xl text-white box large'>
                    Secret Recovery Phrase
                </div>
                <div className='text-base text-warn box large'>
                    This phrase is the Only way to <br/>recover your wallet. Do NOT share it with anyone!
                </div>
                <div className='h-10'>{/* margin */} </div>
                <div className='p-5 font-semibold select-text box default text-4_5 large leading-6_5'>
                    Let me write twelve mnemonics here Let me write twelve mnemonics here
                </div>
                <div>
                <Checkbox onChange={onChange} checked={checked} >
                    <span className="text-white">I saved My Secret Recovery Phrase</span>
                </Checkbox>
                </div>
                <div>
                    <Link to="/repeat-recovery" replace>
                        <Button
                        disabled={!checked}
                        size="large"
                        type='primary'
                        className="box large content"
                        >
                        {t('Continue')}
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default CreateRecovery