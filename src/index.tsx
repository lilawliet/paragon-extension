import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN'
import en from 'antd/es/locale/en_US'
import Popup from '@/popup'

// 全局公用样式
import '@/common/styles/tailwind.less'

import i18n, { addResourceBundle } from 'src/i18n';

const antdConfig = {
  locale: en
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

i18n.changeLanguage('en');
root.render(
  <ConfigProvider {...antdConfig}>
    <Popup/>
  </ConfigProvider>
);