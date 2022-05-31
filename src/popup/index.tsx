import { lazy } from 'react'
import { store } from '@/common/storages/stores'
import { Provider } from 'react-redux'
import message from 'antd/lib/message'
// import 'default-passive-events'

const AsyncMainRoute = lazy(() => import('./MainRoute'))

message.config({
  maxCount: 1
})

function Popup() {
  return (
    <Provider store={store}>
      <div className="h-200 w-125 bg-hard-black">
        <AsyncMainRoute />
      </div>
    </Provider>
  )
}

export default Popup
