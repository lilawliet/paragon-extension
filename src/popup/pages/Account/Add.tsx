import { RightOutlined } from '@ant-design/icons'
import { Button, Input } from 'antd'
import { useNavigate } from 'react-router-dom'

import { Status } from '.'

interface Props {
  setStatus(status: Status): void
}

export default ({ setStatus }: Props) => {
  const navigate = useNavigate()

  const verify = () => {
    // to verify
    navigate('/create-recovery')
  }

  return (
    <div className="flex flex-col items-center mx-auto mt-5 gap-3_75 justify-evenly w-95">
      <div className="flex items-center px-2 text-2xl h-13">Add a new account</div>
      <Button
        size="large"
        type="default"
        className="mt-1_25 box w-115 default btn-settings"
        onClick={(e) => {
          setStatus('create')
        }}
      >
        <div className="flex items-center justify-between font-semibold text-4_5">
          <div className="flex flex-col text-left gap-2_5">
            <span>Create a new account</span>
            <span className="font-normal opacity-60">Generate a new address</span>
          </div>
          <div className="flex-grow"> </div>
          {/* <RightOutlined style={{transform: 'scale(1.2)', opacity: '80%'}}/> */}
        </div>
      </Button>

      <Button
        size="large"
        type="default"
        className="box w-115 default btn-settings"
        onClick={(e) => {
          setStatus('import')
        }}
      >
        <div className="flex items-center justify-between font-semibold text-4_5">
          <div className="flex flex-col text-left gap-2_5">
            <span>Import Private Key</span>
            <span className="font-normal opacity-60">Import an existing account</span>
          </div>
          <div className="flex-grow"> </div>
          {/* <RightOutlined style={{transform: 'scale(1.2)', opacity: '80%'}}/> */}
        </div>
      </Button>
    </div>
  )
}
