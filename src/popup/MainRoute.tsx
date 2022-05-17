
import { HashRouter, Routes, Route } from 'react-router-dom';
import Welcome from "./pages/Welcome";
import CreateRecovery from './pages/Regist/CreateRecovery';
import RepeatRecovery from './pages/Regist/RepeatRecovery';
import CreatePassword from './pages/Regist/CreatePassword';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Receive from './pages/Dashboard/Home/Receive'
import SendIndex from './pages/Dashboard/Home/Send'

const Main = () => {
    return (
      <>
        <HashRouter>
            <Routes>
              <Route path="/" element={<Welcome/>} />
              <Route path="/create-recovery" element={<CreateRecovery />} />
              <Route path="/repeat-recovery" element={<RepeatRecovery />} />
              <Route path="/create-password" element={<CreatePassword />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/receive" element={<Receive />} />
              <Route path="/send/index" element={<SendIndex />} />
            </Routes>
        </HashRouter>
      </>
    );
  };
  
  export default Main;