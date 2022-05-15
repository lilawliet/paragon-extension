
import { HashRouter, Routes, Route } from 'react-router-dom';
import Welcome from "./pages/Welcome";
import CreateRecovery from './pages/Regist/CreateRecovery';
import RepeatRecovery from './pages/Regist/RepeatRecovery';
import CreatePassword from './pages/Regist/CreatePassword';

const Main = () => {
    return (
      <>
        <HashRouter>
            <Routes>
            <Route path="/" element={<Welcome/>} />
            <Route path="/create-recovery" element={<CreateRecovery />} />
            <Route path="/repeat-recovery" element={<RepeatRecovery />} />
            <Route path="/create-password" element={<CreatePassword />} />
            </Routes>
        </HashRouter>
      </>
    );
  };
  
  export default Main;