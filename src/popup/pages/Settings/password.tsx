import CHeader from '@/popup/components/CHeader'
import { useWallet } from '@/ui/utils'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { Button, Input, Layout, message } from 'antd'
import { Content, Footer, Header } from 'antd/lib/layout/layout'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default () => {
  const navigate = useNavigate()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const wallet = useWallet()

  const changePassword = async () => {
    message.error('not implemented')
    return
    if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,}$/.test(newPassword)) {
      message.warning('at least six characters and must contain uppercase and lowercase letters and digits')
      return
    }
    if (newPassword != confirmPassword) {
      message.warning('Entered passwords differ')
      return
    }
    try {
      let _res = await wallet.changePassword(currentPassword, newPassword)
      message.success('success')
    } catch (e) {
      message.warning((e as any).message)
      return
    }
  }
  return (
    <Layout className="h-full">
      <Header className="border-b border-white border-opacity-10">
        <CHeader />
      </Header>
      <Content style={{ backgroundColor: '#1C1919' }}>
        <div className="flex flex-col items-center mx-auto mt-5 gap-3_75 justify-evenly w-95">
          <div className="flex items-center px-2 text-2xl h-13">Change Password</div>
          <div className="flex items-center w-full p-5 mt-1_25 h-15_5 box default">
            <Input.Password
              className="font-semibold text-white p0"
              bordered={false}
              status="error"
              placeholder="Current Password"
              onChange={(e) => {
                setCurrentPassword(e.target.value)
              }}
            />
          </div>
          <div className="flex items-center w-full p-5 mt-1_25 h-15_5 box default">
            <Input.Password
              className="font-semibold text-white p0"
              bordered={false}
              status="error"
              placeholder="New Password"
              onChange={(e) => {
                setNewPassword(e.target.value)
              }}
            />
          </div>
          <div className="flex items-center w-full p-5 mt-1_25 h-15_5 box default">
            <Input.Password
              className="font-semibold text-white p0"
              bordered={false}
              status="error"
              placeholder="Confirm Password"
              onChange={(e) => {
                setConfirmPassword(e.target.value)
              }}
            />
          </div>
          <Button
            size="large"
            type="primary"
            className="box w380"
            onClick={() => {
              changePassword()
            }}>
            <div className="flex items-center justify-center text-lg">Change Password</div>
          </Button>
        </div>
      </Content>
      <Footer style={{ height: '5.625rem', backgroundColor: '#1C1919', textAlign: 'center', width: '100%' }}>
        <Button
          size="large"
          type="default"
          className="box w440"
          onClick={(e) => {
            window.history.go(-1)
          }}>
          <div className="flex items-center justify-center text-lg">
            <ArrowLeftOutlined />
            &nbsp;Back
          </div>
        </Button>
      </Footer>
    </Layout>
  )
}
