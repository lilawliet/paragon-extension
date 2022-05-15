import { lazy } from 'react';
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom';
const AsyncMainRoute = lazy(() => import('./MainRoute'));

function Popup() {
    return(
        <div className='h-[600px] w-[375px]  bg-hard-black'>
            <AsyncMainRoute/>
        </div>
    )
}

export default Popup