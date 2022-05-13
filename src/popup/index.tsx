import { HashRouter, Route, Routes, Navigate } from 'react-router-dom';
import Home from '@/popup/pages/home';
import Login from '@/popup/pages/login';
import Welcome from './pages/welcome';

function Popup() {
    return(
        <div className='h-[500px] w-[360px]  bg-hard-black'>
            <HashRouter>
                <Routes>
                    <Route path="/home" element={<Home/>}></Route>
                    <Route path="/login" element={<Login/>}></Route>
                    <Route path="/welcome" element={<Welcome/>}></Route>
                    <Route path="*" element={<Navigate to="/welcome" />} />
                </Routes>
            </HashRouter>
        </div>
    )
}

export default Popup