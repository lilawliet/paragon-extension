import '@/common/styles/antd.less'
// 全局公用样式
import '@/common/styles/tailwind.less'
import '@/common/styles/rc-virtual-list.less'
import eventBus from '@/eventBus'
import Popup from '@/popup'
import { Message } from '@/utils'
import * as Sentry from '@sentry/react'
import { Integrations } from '@sentry/tracing'
import en from 'antd/es/locale/en_US'
import { EVENTS } from 'consts'
import React from 'react'
import ReactDOM from 'react-dom/client'
import i18n, { addResourceBundle } from 'src/i18n'
import { getUITypeName, WalletProvider } from './utils'
const antdConfig = {
  locale: en
}

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: 'https://e871ee64a51b4e8c91ea5fa50b67be6b@o460488.ingest.sentry.io/5831390',
    integrations: [new Integrations.BrowserTracing()],
    release: process.env.release,

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0
  })
}

// For fix chrome extension render problem in external screen
if (
  // From testing the following conditions seem to indicate that the popup was opened on a secondary monitor
  window.screenLeft < 0 ||
  window.screenTop < 0 ||
  window.screenLeft > window.screen.width ||
  window.screenTop > window.screen.height
) {
  chrome.runtime.getPlatformInfo(function (info) {
    if (info.os === 'mac') {
      const fontFaceSheet = new CSSStyleSheet()
      fontFaceSheet.insertRule(`
        @keyframes redraw {
          0% {
            opacity: 1;
          }
          100% {
            opacity: .99;
          }
        }
      `)
      fontFaceSheet.insertRule(`
        html {
          animation: redraw 1s linear infinite;
        }
      `)
      ;(document as any).adoptedStyleSheets = [...(document as any).adoptedStyleSheets, fontFaceSheet]
    }
  })
}

function initAppMeta() {
  const head = document.querySelector('head')
  const icon = document.createElement('link')
  icon.href = 'https://rabby.io/assets/images/logo-128.png'
  icon.rel = 'icon'
  head?.appendChild(icon)
  const name = document.createElement('meta')
  name.name = 'name'
  name.content = 'Rabby'
  head?.appendChild(name)
  const description = document.createElement('meta')
  description.name = 'description'
  description.content = i18n.t('appDescription')
  head?.appendChild(description)
}

initAppMeta()

const { PortMessage } = Message

const portMessageChannel = new PortMessage()

portMessageChannel.connect('popup')

const wallet: Record<string, any> = new Proxy(
  {},
  {
    get(obj, key) {
      switch (key) {
        case 'openapi':
          return new Proxy(
            {},
            {
              get(obj, key) {
                return function (...params: any) {
                  return portMessageChannel.request({
                    type: 'openapi',
                    method: key,
                    params
                  })
                }
              }
            }
          )
          break
        default:
          return function (...params: any) {
            return portMessageChannel.request({
              type: 'controller',
              method: key,
              params
            })
          }
      }
    }
  }
)

portMessageChannel.listen((data) => {
  if (data.type === 'broadcast') {
    eventBus.emit(data.method, data.params)
  }
})

eventBus.addEventListener(EVENTS.broadcastToBackground, (data) => {
  portMessageChannel.request({
    type: 'broadcast',
    method: data.method,
    params: data.data
  })
})
wallet.getLocale().then((locale) => {
  addResourceBundle(locale).then(() => {
    i18n.changeLanguage(locale)
    // ReactDOM.render(<Views wallet={wallet} />, document.getElementById('root'));
    const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

    root.render(
      <WalletProvider {...antdConfig} wallet={wallet as any}>
        <Popup />
      </WalletProvider>
    )
  })
})
