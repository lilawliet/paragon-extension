import { HashRouter, Routes, Route } from 'react-router-dom'
import Welcome from './pages/Welcome'
import CreateRecovery from './pages/Regist/CreateRecovery'
import RepeatRecovery from './pages/Regist/RepeatRecovery'
import CreatePassword from './pages/Regist/CreatePassword'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Receive from './pages/Dashboard/Home/Receive'
import SendPage from './pages/Send'
import SetLang from './pages/Settings/language'
import SetCurr from './pages/Settings/currency'
import SetPwd from './pages/Settings/password'
import ShowRecv from './pages/Settings/recovery'
import ShowKey from './pages/Settings/showkey'
import ExportKey from './pages/Settings/exportkey'
import SetAccount from './pages/Account'
import Sorthat from './pages/Sorthat'

const Main = () => {
  return (
    <>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Sorthat />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/create-recovery" element={<CreateRecovery />} />
          <Route path="/repeat-recovery" element={<RepeatRecovery />} />
          <Route path="/create-password" element={<CreatePassword />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/receive" element={<Receive />} />
          <Route path="/send/index" element={<SendPage />} />
          <Route path="/settings/language" element={<SetLang />} />
          <Route path="/settings/currency" element={<SetCurr />} />
          <Route path="/settings/password" element={<SetPwd />} />
          <Route path="/settings/recovery" element={<ShowRecv />} />
          <Route path="/settings/export-key" element={<ExportKey />} />
          <Route path="/settings/show-key" element={<ShowKey />} />
          <Route path="/settings/account" element={<SetAccount />} />
        </Routes>
      </HashRouter>
    </>
  )
}

export default Main
