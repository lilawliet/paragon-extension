import { lazy } from 'react';
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom';
import { store } from '@/common/storages/stores'
import { Provider } from 'react-redux';
const AsyncMainRoute = lazy(() => import('./MainRoute'));

function Popup() {
    return(
        <Provider store={store}>
            <div className='h-200 w-125 bg-hard-black'>
                <AsyncMainRoute/>
            </div>
        </Provider>
    )
}

export default Popup