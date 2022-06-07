import { EVENTS } from '@/constant'
import eventBus from '@/eventBus'
import { Message } from 'utils'
import { walletController } from './controller'
import { contactBookService, keyringService, openapiService, pageStateCacheService, permissionService, preferenceService } from './service'
import rpcCache from './utils/rpcCache'
import { storage } from './webapi'
import browser from './webapi/browser'
const { PortMessage } = Message

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
}

restoreAppState()

// for page provider
browser.runtime.onConnect.addListener((port) => {
  if (port.name === 'popup' || port.name === 'notification' || port.name === 'tab') {
    const pm = new PortMessage(port as any)
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
