import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN'
import Popup from '@/popup'

// 全局公用样式
import '@/common/styles/tailwind.css'

import i18n, { addResourceBundle } from 'src/i18n';

const antdConfig = {
  locale: zhCN
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

i18n.changeLanguage('zh_CN');
root.render(
  <ConfigProvider {...antdConfig}>
    <Popup/>
  </ConfigProvider>
);