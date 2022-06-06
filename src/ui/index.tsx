import browser from '@/background/webapi/browser'
import '@/common/styles/antd.less'
import '@/common/styles/rc-virtual-list.less'
// 全局公用样式
import '@/common/styles/tailwind.less'
import eventBus from '@/eventBus'
import Popup from '@/popup'
import { Message } from '@/utils'
import en from 'antd/es/locale/en_US'
import { EVENTS } from 'consts'
import ReactDOM from 'react-dom/client'
import i18n, { addResourceBundle } from 'src/i18n'
import { WalletProvider } from './utils'
const antdConfig = {
  locale: en
}

// if (process.env.NODE_ENV === 'production') {
//   Sentry.init({
//     dsn: 'https://610efdad84c14c2c8e76192ac365eb7b@o1271596.ingest.sentry.io/6464056',
//     integrations: [new Integrations.BrowserTracing()],
//     release: process.env.release,

//     // Set tracesSampleRate to 1.0 to capture 100%
//     // of transactions for performance monitoring.
//     // We recommend adjusting this value in production
//     tracesSampleRate: 1.0
//   })
// }

// For fix chrome extension render problem in external screen
if (
  // From testing the following conditions seem to indicate that the popup was opened on a secondary monitor
  window.screenLeft < 0 ||
  window.screenTop < 0 ||
  window.screenLeft > window.screen.width ||
  window.screenTop > window.screen.height
) {
  browser.runtime.getPlatformInfo(function (info) {
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
