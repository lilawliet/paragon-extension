import { useNavigate } from "react-router-dom";
import { Button } from "antd";

function Home() {
    const navigate =useNavigate()

    return(
        <div>
            <h1>Home Page</h1>
            <div>
                <Button type="primary" onClick={() => { navigate('/login')}}>返回</Button>
            </div>
        </div>
    )
}

export default Home