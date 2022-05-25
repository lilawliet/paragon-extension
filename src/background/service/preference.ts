import eventBus from '@/eventBus'
import { createPersistStore } from 'background/utils'
import compareVersions from 'compare-versions'
import { EVENTS } from 'consts'
import cloneDeep from 'lodash/cloneDeep'
import { browser } from 'webextension-polyfill-ts'
import { i18n, keyringService, sessionService } from './index'
import { TotalBalanceResponse } from './openapi'

const version = process.env.release || '0'

export interface Account {
  type: string
  address: string
  brandName: string
  alianName?: string
  displayBrandName?: string
  index?: number
  balance?: number
}

export interface ChainGas {
  gasPrice?: number | null // custom cached gas price
  gasLevel?: string | null // cached gasLevel
  lastTimeSelect?: 'gasLevel' | 'gasPrice' // last time selection, 'gasLevel' | 'gasPrice'
}

export interface GasCache {
  [chainId: string]: ChainGas
}

export interface addedToken {
  [address: string]: string[]
}

export interface PreferenceStore {
  currentAccount: Account | undefined | null
  externalLinkAck: boolean
  balanceMap: {
    [address: string]: TotalBalanceResponse
  }
  locale: string
  watchAddressPreference: Record<string, number>
  walletSavedList: []
  alianNames?: Record<string, string>
  initAlianNames: boolean
  currentVersion: string
  firstOpen: boolean
}

const SUPPORT_LOCALES = ['en']

class PreferenceService {
  store!: PreferenceStore
  popupOpen = false
  hasOtherProvider = false

  init = async () => {
    const defaultLang = 'en'
    this.store = await createPersistStore<PreferenceStore>({
      name: 'preference',
      template: {
        currentAccount: undefined,
        externalLinkAck: false,
        balanceMap: {},
        locale: defaultLang,
        watchAddressPreference: {},
        walletSavedList: [],
        alianNames: {},
        initAlianNames: false,
        currentVersion: '0',
        firstOpen: false
      }
    })
    if (!this.store.locale || this.store.locale !== defaultLang) {
      this.store.locale = defaultLang
    }
    i18n.changeLanguage(this.store.locale)

    if (!this.store.initAlianNames) {
      this.store.initAlianNames = false
    }
    if (!this.store.externalLinkAck) {
      this.store.externalLinkAck = false
    }

    if (!this.store.balanceMap) {
      this.store.balanceMap = {}
    }

    if (!this.store.walletSavedList) {
      this.store.walletSavedList = []
    }
  }

  getAcceptLanguages = async () => {
    let langs = await browser.i18n.getAcceptLanguages()
    if (!langs) langs = []
    return langs.map((lang) => lang.replace(/-/g, '_')).filter((lang) => SUPPORT_LOCALES.includes(lang))
  }

  /**
   * If current account be hidden or deleted
   * call this function to reset current account
   * to the first address in address list
   */
  resetCurrentAccount = async () => {
    const [account] = await keyringService.getAllVisibleAccountsArray()
    this.setCurrentAccount(account)
  }

  getCurrentAccount = (): Account | undefined | null => {
    return cloneDeep(this.store.currentAccount)
  }

  setCurrentAccount = (account: Account | null) => {
    this.store.currentAccount = account
    if (account) {
      sessionService.broadcastEvent('accountsChanged', [account.address.toLowerCase()])
      eventBus.emit(EVENTS.broadcastToUI, {
        method: 'accountsChanged',
        params: account
      })
    }
  }

  setPopupOpen = (isOpen) => {
    this.popupOpen = isOpen
  }

  getPopupOpen = () => this.popupOpen

  updateAddressBalance = (address: string, data: TotalBalanceResponse) => {
    const balanceMap = this.store.balanceMap || {}
    this.store.balanceMap = {
      ...balanceMap,
      [address.toLowerCase()]: data
    }
  }

  removeAddressBalance = (address: string) => {
    const key = address.toLowerCase()
    if (key in this.store.balanceMap) {
      const map = this.store.balanceMap
      delete map[key]
      this.store.balanceMap = map
    }
  }

  getAddressBalance = (address: string): TotalBalanceResponse | null => {
    const balanceMap = this.store.balanceMap || {}
    return balanceMap[address.toLowerCase()] || null
  }

  getExternalLinkAck = (): boolean => {
    return this.store.externalLinkAck
  }

  setExternalLinkAck = (ack = false) => {
    this.store.externalLinkAck = ack
  }

  getLocale = () => {
    return this.store.locale
  }

  setLocale = (locale: string) => {
    this.store.locale = locale
    i18n.changeLanguage(locale)
  }

  getWalletSavedList = () => {
    return this.store.walletSavedList || []
  }

  updateWalletSavedList = (list: []) => {
    this.store.walletSavedList = list
  }
  getInitAlianNameStatus = () => {
    return this.store.initAlianNames
  }
  changeInitAlianNameStatus = () => {
    this.store.initAlianNames = true
  }
  getIsFirstOpen = () => {
    if (!this.store.currentVersion || compareVersions(version, this.store.currentVersion)) {
      this.store.currentVersion = version
      this.store.firstOpen = true
    }
    return this.store.firstOpen
  }
  updateIsFirstOpen = () => {
    this.store.firstOpen = false
  }
}

export default new PreferenceService()
