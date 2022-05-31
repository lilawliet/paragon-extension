import { HashRouter, Route, Routes } from 'react-router-dom'
import SetAccount from './pages/Account'
import Dashboard from './pages/Dashboard'
import Receive from './pages/Dashboard/Home/Receive'
import Login from './pages/Login'
import CreatePassword from './pages/Regist/CreatePassword'
import CreateRecovery from './pages/Regist/CreateRecovery'
import RepeatRecovery from './pages/Regist/RepeatRecovery'
import SendPage from './pages/Send'
import SetCurr from './pages/Settings/Currency'
import ExportKey from './pages/Settings/Exportkey'
import SetLang from './pages/Settings/Language'
import SetPwd from './pages/Settings/Password'
import ShowRecv from './pages/Settings/Recovery'
import RemoveAccount from './pages/Settings/Remove'
import ShowKey from './pages/Settings/Showkey'
import Sorthat from './pages/Sorthat'
import Welcome from './pages/Welcome'

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
          <Route path="/settings/remove-account" element={<RemoveAccount />} />
        </Routes>
      </HashRouter>
    </>
  )
}

export default Main
