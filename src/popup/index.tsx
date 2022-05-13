import { HashRouter, Route, Routes, Navigate } from 'react-router-dom';
import Home from '@/popup/pages/Home';
import Login from '@/popup/pages/Login';
import Welcome from './pages/Welcome';

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