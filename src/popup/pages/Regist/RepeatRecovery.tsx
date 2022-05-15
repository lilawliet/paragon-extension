import { Button, Checkbox, Input } from 'antd';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChangeEventHandler, useEffect, useState } from 'react';

const RepeatRecovery = () => {
    const { t } = useTranslation();

    const [keys, setKeys] = useState<Array<string>>(new Array(12).fill(""))
    const [goon, setGoon] = useState(true)
 
    const onChange = (e: any, index: any) => {
        let newKeys = [...keys]
        newKeys.splice(index, 1 , e.target.value)
        setKeys(newKeys)
    }

    useEffect(() => {
        // to verify key
        setGoon(keys.filter( key => {return key == ""}).length > 0 )
    }, [keys])


    return(
        <div
          className="flex justify-center pt-12"
        >
            <div className='flex flex-col justify-center gap-4 mx-8 text-center'>
                <div className='text-2xl text-white box large'>
                    Secret Recovery Phrase
                </div>
                <div className='text-sm text-soft-white box large'>Import an existing wallet with your 12-word secret recovery phrase
                </div>
                <div className="grid grid-cols-2 gap-2">
                    {
                        keys.map((_, index) => {
                            return(
                                <div key={index} className='flex items-center w-full p-2 text-left box default text-soft-white'>{index + 1}.
                                <Input className='text-white' bordered={false} value={_} onChange={ event => {
                                    onChange(event, index)
                                }}/></div>
                            )
                        })
                    }
                </div>
                <div>
                    <Link to="/repeat-recovery" replace>
                        <Button
                        disabled={goon}
                        size="large"
                        type='primary'
                        className="box large content"
                        >
                        {t('Import wallet')}
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default RepeatRecovery