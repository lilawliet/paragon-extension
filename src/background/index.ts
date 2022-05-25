import eventBus from '@/eventBus'
import * as Sentry from '@sentry/browser'
import { Integrations } from '@sentry/tracing'
import { WalletController } from 'background/controller/wallet'
import { EVENTS } from 'consts'
import { ethErrors } from 'eth-rpc-errors'
import 'reflect-metadata'
import { Message } from 'utils'
import { browser } from 'webextension-polyfill-ts'
import { walletController } from './controller'
import { contactBookService, keyringService, openapiService, pageStateCacheService, permissionService, preferenceService } from './service'
import i18n from './service/i18n'
import rpcCache from './utils/rpcCache'
import { storage } from './webapi'

const { PortMessage } = Message

let appStoreLoaded = false

Sentry.init({
  dsn: 'https://e871ee64a51b4e8c91ea5fa50b67be6b@o460488.ingest.sentry.io/5831390',
  integrations: [new Integrations.BrowserTracing()],
  release: process.env.release,
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0
})

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

async function restoreAppState() {
  const keyringState = await storage.get('keyringState')
  keyringService.loadStore(keyringState)
  keyringService.store.subscribe((value) => storage.set('keyringState', value))
  await openapiService.init()

  await permissionService.init()
  await preferenceService.init()
  await pageStateCacheService.init()
  await contactBookService.init()
  rpcCache.start()

  appStoreLoaded = true
  initAppMeta()
}

restoreAppState()

// for page provider
browser.runtime.onConnect.addListener((port) => {
  if (port.name === 'popup' || port.name === 'notification' || port.name === 'tab') {
    const pm = new PortMessage(port)
    pm.listen((data) => {
      if (data?.type) {
        switch (data.type) {
          case 'broadcast':
            eventBus.emit(data.method, data.params)
            break
          case 'openapi':
            if (walletController.openapi[data.method]) {
              return walletController.openapi[data.method].apply(null, data.params)
            }
            break
          case 'controller':
          default:
            if (data.method) {
              return walletController[data.method].apply(null, data.params)
            }
        }
      }
    })

    const boardcastCallback = (data: any) => {
      pm.request({
        type: 'broadcast',
        method: data.method,
        params: data.params
      })
    }

    if (port.name === 'popup') {
      preferenceService.setPopupOpen(true)

      port.onDisconnect.addListener(() => {
        preferenceService.setPopupOpen(false)
      })
    }

    eventBus.addEventListener(EVENTS.broadcastToUI, boardcastCallback)
    port.onDisconnect.addListener(() => {
      eventBus.removeEventListener(EVENTS.broadcastToUI, boardcastCallback)
    })

    return
  }
})

declare global {
  interface Window {
    wallet: WalletController
  }
}

// for popup operate
window.wallet = new Proxy(walletController, {
  get(target, propKey, receiver) {
    if (!appStoreLoaded) {
      throw ethErrors.provider.disconnected()
    }
    return Reflect.get(target, propKey, receiver)
  }
})
