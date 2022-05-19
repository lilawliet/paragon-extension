import CHeader from "@/popup/components/CHeader";
import { ArrowLeftOutlined, CheckOutlined, RightOutlined } from "@ant-design/icons";
import { Button, Input, Layout } from "antd"
import { Content, Footer, Header } from "antd/lib/layout/layout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


export default () => {
    const navigate = useNavigate()
    const [currency, setCurrency] = useState(0)


    return (
        <Layout className='h-full'>
                <Header className='border-b border-white border-opacity-10'><CHeader/></Header>
                <Content style={{backgroundColor: '#1C1919'}}>
                    <div className="flex flex-col items-center mx-auto mt-5 gap-3_75 justify-evenly w-95">
                        <div className='flex items-center px-2 text-2xl h-13'>
                            Change Password
                        </div>
                        <div className='flex items-center w-full p-5 mt-1_25 h-15_5 box default'>
                            <Input.Password className='font-bold text-white p0' bordered={false} status="error" placeholder="Current Password"/>
                        </div>
                        <div className='flex items-center w-full p-5 mt-1_25 h-15_5 box default'>
                            <Input.Password className='font-bold text-white p0' bordered={false} status="error" placeholder="New Password"/>
                        </div>
                        <div className='flex items-center w-full p-5 mt-1_25 h-15_5 box default'>
                            <Input.Password className='font-bold text-white p0' bordered={false} status="error" placeholder="Confirm Password"/>
                        </div>
                        <Button size='large' type='primary' className='box w380' >
                            <div className='flex items-center justify-center text-lg'>Change Password</div>
                        </Button>
                    </div>
                </Content>
                <Footer style={{height: '5.625rem', backgroundColor: '#1C1919', textAlign: 'center', width: '100%'}}>
                    <Button size='large' type='default' className='box w440' onClick={e => {Javascript:window.history.go(-1)}}>
                        <div className='flex items-center justify-center text-lg'><ArrowLeftOutlined/>&nbsp;Back</div>
                    </Button>
                </Footer>
        </Layout>
        
    )
}