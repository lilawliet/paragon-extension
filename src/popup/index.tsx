import { lazy } from 'react';
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom';
const AsyncMainRoute = lazy(() => import('./MainRoute'));

function Popup() {
    return(
        <div className='h-200 w-125 bg-hard-black'>
            <AsyncMainRoute/>
        </div>
    )
}

export default Popup