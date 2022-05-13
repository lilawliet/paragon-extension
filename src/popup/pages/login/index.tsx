import { useNavigate } from "react-router-dom";
import { Button, Input } from "antd";
import imgLogo from './logo.png'

function Login() {
    const navigate = useNavigate()

    const login = () => {
        navigate('/home')
    }

    return(
        <div>
            <img src={imgLogo} alt=""/>
            <Button type="primary" block={true} onClick={login}>登录</Button>
        </div>
    )
}

export default Login