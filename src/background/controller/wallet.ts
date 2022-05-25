import eventBus from '@/eventBus'
import WalletConnectKeyring from '@rabby-wallet/eth-walletconnect-keyring'
import WatchKeyring from '@rabby-wallet/eth-watch-keyring'
import {
  contactBookService,
  keyringService,
  notificationService,
  openapiService,
  pageStateCacheService,
  permissionService,
  preferenceService,
  sessionService
} from 'background/service'
import i18n from 'background/service/i18n'
import { DisplayedKeryring, KEYRING_CLASS } from 'background/service/keyring'
import { CacheState } from 'background/service/pageStateCache'
import { isSameAddress, setPageStateCacheWhenPopupClose } from 'background/utils'
import { openIndexPage } from 'background/webapi/tab'
import * as bip39 from 'bip39'
import { BRAND_ALIAN_TYPE_TEXT, CHAINS_ENUM, COIN_NAME, COIN_SYMBOL, EVENTS } from 'consts'
import { ethErrors } from 'eth-rpc-errors'
import * as ethUtil from 'ethereumjs-util'
import Wallet, { thirdparty } from 'ethereumjs-wallet'
import { groupBy } from 'lodash'
import { ContactBookItem } from '../service/contactBook'
import DisplayKeyring from '../service/keyring/display'
import { OpenApiService } from '../service/openapi'
import { ConnectedSite } from '../service/permission'
import { Account } from '../service/preference'
import BaseController from './base'

const stashKeyrings: Record<string, any> = {}

export class WalletController extends BaseController {
  openapi: OpenApiService = openapiService

  /* wallet */
  boot = (password) => keyringService.boot(password)
  isBooted = () => keyringService.isBooted()
  verifyPassword = (password: string) => keyringService.verifyPassword(password)

  getApproval = notificationService.getApproval
  resolveApproval = notificationService.resolveApproval
  rejectApproval = notificationService.rejectApproval

  transferNFT = async ({ to, contractId, tokenId, amount }: { to: string; contractId: string; tokenId: string; amount?: number }) => {
    const account = await preferenceService.getCurrentAccount()
    if (!account) throw new Error('no current account')
    throw new Error('not implemented')
  }

  initAlianNames = async () => {
    await preferenceService.changeInitAlianNameStatus()
    const contacts = await this.listContact()
    const keyrings = await keyringService.getAllTypedAccounts()
    const walletConnectKeyrings = keyrings.filter((item) => item.type === 'WalletConnect')
    const catergoryGroupAccount = keyrings.map((item) => ({
      type: item.type,
      accounts: item.accounts
    }))
    let walletConnectList: DisplayedKeryring['accounts'] = []
    for (let i = 0; i < walletConnectKeyrings.length; i++) {
      const keyring = walletConnectKeyrings[i]
      walletConnectList = [...walletConnectList, ...keyring.accounts]
    }
    const groupedWalletConnectList = groupBy(walletConnectList, 'brandName')
    if (keyrings.length > 0) {
      Object.keys(groupedWalletConnectList).forEach((key) => {
        groupedWalletConnectList[key].map((acc, index) => {
          if (contacts.find((contact) => isSameAddress(contact.address, acc.address))) {
            return
          }
          this.updateAlianName(acc?.address, `UNKOWN ${index + 1}`)
        })
      })
      const catergories = groupBy(
        catergoryGroupAccount.filter((group) => group.type !== 'WalletConnect'),
        'type'
      )
      const result = Object.keys(catergories)
        .map((key) =>
          catergories[key].map((item) =>
            item.accounts.map((acc) => ({
              address: acc.address,
              type: key
            }))
          )
        )
        .map((item) => item.flat(1))
      result.forEach((group) =>
        group.forEach((acc, index) => {
          this.updateAlianName(acc?.address, `${BRAND_ALIAN_TYPE_TEXT[acc?.type]} ${index + 1}`)
        })
      )
    }
    if (contacts.length !== 0 && keyrings.length !== 0) {
      const allAccounts = keyrings.map((item) => item.accounts).flat()
      const sameAddressList = contacts.filter((item) => allAccounts.find((contact) => isSameAddress(contact.address, item.address)))
      if (sameAddressList.length > 0) {
        sameAddressList.forEach((item) => this.updateAlianName(item.address, item.name))
      }
    }
  }

  unlock = async (password: string) => {
    const alianNameInited = await preferenceService.getInitAlianNameStatus()
    const alianNames = contactBookService.listAlias()
    await keyringService.submitPassword(password)
    sessionService.broadcastEvent('unlock')
    if (!alianNameInited && alianNames.length === 0) {
      this.initAlianNames()
    }
  }
  isUnlocked = () => keyringService.memStore.getState().isUnlocked

  lockWallet = async () => {
    await keyringService.setLocked()
    sessionService.broadcastEvent('accountsChanged', [])
    sessionService.broadcastEvent('lock')
  }
  setPopupOpen = (isOpen) => {
    preferenceService.setPopupOpen(isOpen)
  }
  openIndexPage = openIndexPage

  hasPageStateCache = () => pageStateCacheService.has()
  getPageStateCache = () => {
    if (!this.isUnlocked()) return null
    return pageStateCacheService.get()
  }
  clearPageStateCache = () => pageStateCacheService.clear()
  setPageStateCache = (cache: CacheState) => pageStateCacheService.set(cache)

  getAddressBalance = async (address: string) => {
    const data = await openapiService.getAddressBalance(address)
    preferenceService.updateAddressBalance(address, data as any)
    return data
  }
  getAddressCacheBalance = (address: string | undefined) => {
    if (!address) return null
    return preferenceService.getAddressBalance(address)
  }

  getExternalLinkAck = () => preferenceService.getExternalLinkAck()

  setExternalLinkAck = (ack) => preferenceService.setExternalLinkAck(ack)

  getLocale = () => preferenceService.getLocale()
  setLocale = (locale: string) => preferenceService.setLocale(locale)

  /* connectedSites */

  getConnectedSite = permissionService.getConnectedSite
  getSite = permissionService.getSite
  getConnectedSites = permissionService.getConnectedSites
  setRecentConnectedSites = (sites: ConnectedSite[]) => {
    permissionService.setRecentConnectedSites(sites)
  }
  getRecentConnectedSites = () => {
    return permissionService.getRecentConnectedSites()
  }
  getCurrentSite = (tabId: number): ConnectedSite | null => {
    const { origin, name, icon } = sessionService.getSession(tabId) || {}
    if (!origin) {
      return null
    }
    const site = permissionService.getSite(origin)
    if (site) {
      return site
    }
    return {
      origin,
      name,
      icon,
      chain: CHAINS_ENUM.NOVO,
      isConnected: false,
      isSigned: false,
      isTop: false
    }
  }
  getCurrentConnectedSite = (tabId: number) => {
    const { origin } = sessionService.getSession(tabId) || {}
    return permissionService.getWithoutUpdate(origin)
  }
  setSite = (data: ConnectedSite) => {
    permissionService.setSite(data)
    if (data.isConnected) {
      sessionService.broadcastEvent(
        'chainChanged',
        {
          networkVersion: '0x01'
        },
        data.origin
      )
    }
  }
  updateConnectSite = (origin: string, data: ConnectedSite) => {
    permissionService.updateConnectSite(origin, data)
    sessionService.broadcastEvent(
      'chainChanged',
      {
        networkVersion: '0x01'
      },
      data.origin
    )
  }
  removeAllRecentConnectedSites = () => {
    const sites = permissionService.getRecentConnectedSites().filter((item) => !item.isTop)
    sites.forEach((item) => {
      this.removeConnectedSite(item.origin)
    })
  }
  removeConnectedSite = (origin: string) => {
    sessionService.broadcastEvent('accountsChanged', [], origin)
    permissionService.removeConnectedSite(origin)
  }
  getSitesByDefaultChain = permissionService.getSitesByDefaultChain
  topConnectedSite = (origin: string) => permissionService.topConnectedSite(origin)
  unpinConnectedSite = (origin: string) => permissionService.unpinConnectedSite(origin)
  /* keyrings */

  clearKeyrings = () => keyringService.clearKeyrings()

  importWatchAddress = async (address) => {
    let keyring, isNewKey
    const keyringType = KEYRING_CLASS.WATCH
    try {
      keyring = this._getKeyringByType(keyringType)
    } catch {
      const WatchKeyring = keyringService.getKeyringClassForType(keyringType)
      keyring = new WatchKeyring()
      isNewKey = true
    }

    keyring.setAccountToAdd(address)
    await keyringService.addNewAccount(keyring)
    if (isNewKey) {
      await keyringService.addKeyring(keyring)
    }
    return this._setCurrentAccountFromKeyring(keyring, -1)
  }

  getWalletConnectStatus = (address: string, brandName: string) => {
    const keyringType = KEYRING_CLASS.WALLETCONNECT
    const keyring: WalletConnectKeyring = this._getKeyringByType(keyringType)
    if (keyring) {
      return keyring.getConnectorStatus(address, brandName)
    }
    return null
  }

  initWalletConnect = async (brandName: string, bridge?: string) => {
    let keyring: WalletConnectKeyring, isNewKey
    const keyringType = KEYRING_CLASS.WALLETCONNECT
    try {
      keyring = this._getKeyringByType(keyringType)
    } catch {
      const WalletConnect = keyringService.getKeyringClassForType(keyringType)
      keyring = new WalletConnect({
        accounts: [],
        brandName: brandName,
        clientMeta: {
          description: i18n.t('appDescription'),
          url: 'https://rabby.io',
          icons: ['https://rabby.io/assets/images/logo.png'],
          name: 'Rabby'
        }
      })
      isNewKey = true
    }
    const { uri } = await keyring.initConnector(brandName, bridge)
    let stashId: null | number = null
    if (isNewKey) {
      stashId = this.addKyeringToStash(keyring)
      eventBus.addEventListener(EVENTS.WALLETCONNECT.INIT, ({ address, brandName }) => {
        ;(keyring as WalletConnectKeyring).init(address, brandName)
      })
      ;(keyring as WalletConnectKeyring).on('inited', (uri) => {
        eventBus.emit(EVENTS.broadcastToUI, {
          method: EVENTS.WALLETCONNECT.INITED,
          params: { uri }
        })
      })
      keyring.on('statusChange', (data) => {
        eventBus.emit(EVENTS.broadcastToUI, {
          method: EVENTS.WALLETCONNECT.STATUS_CHANGED,
          params: data
        })
        if (!preferenceService.getPopupOpen()) {
          setPageStateCacheWhenPopupClose(data)
        }
      })
    }
    return {
      uri,
      stashId
    }
  }

  getWalletConnectBridge = (address: string, brandName: string) => {
    const keyringType = KEYRING_CLASS.WALLETCONNECT
    const keyring: WalletConnectKeyring = this._getKeyringByType(keyringType)
    if (keyring) {
      const target = keyring.accounts.find((account) => account.address.toLowerCase() === address.toLowerCase() && brandName === account.brandName)

      if (target) return target.bridge

      return null
    }
    return null
  }

  getWalletConnectConnectors = () => {
    const keyringType = KEYRING_CLASS.WALLETCONNECT
    const keyring: WalletConnectKeyring = this._getKeyringByType(keyringType)
    if (keyring) {
      const result: { address: string; brandName: string }[] = []
      for (const key in keyring.connectors) {
        const target = keyring.connectors[key]
        result.push({
          address: key.split('-')[1],
          brandName: target.brandName
        })
      }
      return result
    }
    return []
  }

  killWalletConnectConnector = async (address: string, brandName: string) => {
    const keyringType = KEYRING_CLASS.WALLETCONNECT
    const keyring: WalletConnectKeyring = this._getKeyringByType(keyringType)
    if (keyring) {
      const connector = keyring.connectors[`${brandName}-${address.toLowerCase()}`]
      if (connector) {
        await keyring.closeConnector(connector.connector, address, brandName)
      }
    }
  }

  importWalletConnect = async (address: string, brandName: string, bridge?: string, stashId?: number) => {
    let keyring: WalletConnectKeyring, isNewKey
    const keyringType = KEYRING_CLASS.WALLETCONNECT
    if (stashId !== null && stashId !== undefined) {
      keyring = stashKeyrings[stashId]
      isNewKey = true
    } else {
      try {
        keyring = this._getKeyringByType(keyringType)
      } catch {
        const WalletConnectKeyring = keyringService.getKeyringClassForType(keyringType)
        keyring = new WalletConnectKeyring()
        isNewKey = true
      }
    }

    keyring.setAccountToAdd({
      address,
      brandName,
      bridge
    })

    if (isNewKey) {
      await keyringService.addKeyring(keyring)
    }

    await keyringService.addNewAccount(keyring)
    this.clearPageStateCache()
    return this._setCurrentAccountFromKeyring(keyring, -1)
  }

  getPrivateKey = async (password: string, { address, type }: { address: string; type: string }) => {
    await this.verifyPassword(password)
    const keyring = await keyringService.getKeyringForAccount(address, type)
    if (!keyring) return null
    return await keyring.exportAccount(address)
  }

  getMnemonics = async (password: string) => {
    await this.verifyPassword(password)
    const keyring = this._getKeyringByType(KEYRING_CLASS.MNEMONIC)
    const serialized = await keyring.serialize()
    const seedWords = serialized.mnemonic

    return seedWords
  }

  importPrivateKey = async (data) => {
    const privateKey = ethUtil.stripHexPrefix(data)
    const buffer = Buffer.from(privateKey, 'hex')

    const error = new Error(i18n.t('the private key is invalid'))
    try {
      if (!ethUtil.isValidPrivate(buffer)) {
        throw error
      }
    } catch {
      throw error
    }

    const keyring = await keyringService.importPrivateKey(privateKey)
    return this._setCurrentAccountFromKeyring(keyring)
  }

  // json format is from "https://github.com/SilentCicero/ethereumjs-accounts"
  // or "https://github.com/ethereum/wiki/wiki/Web3-Secret-Storage-Definition"
  // for example: https://www.myetherwallet.com/create-wallet
  importJson = async (content: string, password: string) => {
    try {
      JSON.parse(content)
    } catch {
      throw new Error(i18n.t('the input file is invalid'))
    }

    let wallet
    try {
      wallet = thirdparty.fromEtherWallet(content, password)
    } catch (e) {
      wallet = await Wallet.fromV3(content, password, true)
    }

    const privateKey = wallet.getPrivateKeyString()
    const keyring = await keyringService.importPrivateKey(ethUtil.stripHexPrefix(privateKey))
    return this._setCurrentAccountFromKeyring(keyring)
  }

  getPreMnemonics = () => keyringService.getPreMnemonics()
  generatePreMnemonic = () => keyringService.generatePreMnemonic()
  removePreMnemonics = () => keyringService.removePreMnemonics()
  createKeyringWithMnemonics = async (mnemonic) => {
    const keyring = await keyringService.createKeyringWithMnemonics(mnemonic)
    keyringService.removePreMnemonics()
    return this._setCurrentAccountFromKeyring(keyring)
  }

  clearWatchMode = async () => {
    const keyrings: WatchKeyring[] = await keyringService.getKeyringsByType(KEYRING_CLASS.WATCH)
    let addresses: string[] = []
    for (let i = 0; i < keyrings.length; i++) {
      const keyring = keyrings[i]
      const accounts = await keyring.getAccounts()
      addresses = [...addresses, ...accounts]
    }
    await Promise.all(addresses.map((address) => this.removeAddress(address, KEYRING_CLASS.WATCH)))
  }

  removeAddress = async (address: string, type: string, brand?: string) => {
    await keyringService.removeAccount(address, type, brand)
    if (!(await keyringService.hasAddress(address))) {
      contactBookService.removeAlias(address)
    }
    preferenceService.removeAddressBalance(address)
    const current = preferenceService.getCurrentAccount()
    if (current?.address === address && current.type === type && current.brandName === brand) {
      this.resetCurrentAccount()
    }
  }

  resetCurrentAccount = async () => {
    const [account] = await this.getAccounts()
    if (account) {
      preferenceService.setCurrentAccount(account)
    } else {
      preferenceService.setCurrentAccount(null)
    }
  }

  generateKeyringWithMnemonic = (mnemonic) => {
    if (!bip39.validateMnemonic(mnemonic)) {
      throw new Error(i18n.t('mnemonic phrase is invalid'))
    }

    const Keyring = keyringService.getKeyringClassForType(KEYRING_CLASS.MNEMONIC)

    const keyring = new Keyring({ mnemonic })

    const stashId = Object.values(stashKeyrings).length
    stashKeyrings[stashId] = keyring

    return stashId
  }

  addKyeringToStash = (keyring) => {
    const stashId = Object.values(stashKeyrings).length
    stashKeyrings[stashId] = keyring

    return stashId
  }

  addKeyring = async (keyringId) => {
    const keyring = stashKeyrings[keyringId]
    if (keyring) {
      await keyringService.addKeyring(keyring)
      this._setCurrentAccountFromKeyring(keyring)
    } else {
      throw new Error('failed to addKeyring, keyring is undefined')
    }
  }

  getKeyringByType = (type: string) => keyringService.getKeyringByType(type)

  checkHasMnemonic = () => {
    try {
      const keyring = this._getKeyringByType(KEYRING_CLASS.MNEMONIC)
      return !!keyring.mnemonic
    } catch (e) {
      return false
    }
  }

  deriveNewAccountFromMnemonic = async () => {
    const keyring = this._getKeyringByType(KEYRING_CLASS.MNEMONIC)

    const result = await keyringService.addNewAccount(keyring)
    this._setCurrentAccountFromKeyring(keyring, -1)
    return result
  }

  getAccountsCount = async () => {
    const accounts = await keyringService.getAccounts()
    return accounts.filter((x) => x).length
  }

  getTypedAccounts = async (type) => {
    return Promise.all(keyringService.keyrings.filter((keyring) => !type || keyring.type === type).map((keyring) => keyringService.displayForKeyring(keyring)))
  }

  getAllVisibleAccounts: () => Promise<DisplayedKeryring[]> = async () => {
    const typedAccounts = await keyringService.getAllTypedVisibleAccounts()

    return typedAccounts.map((account) => ({
      ...account,
      keyring: new DisplayKeyring(account.keyring)
    }))
  }

  getAllVisibleAccountsArray: () => Promise<Account[]> = () => {
    return keyringService.getAllVisibleAccountsArray()
  }

  getAllClassAccounts: () => Promise<DisplayedKeryring[]> = async () => {
    const typedAccounts = await keyringService.getAllTypedAccounts()

    return typedAccounts.map((account) => ({
      ...account,
      keyring: new DisplayKeyring(account.keyring)
    }))
  }

  changeAccount = (account: Account) => {
    preferenceService.setCurrentAccount(account)
  }

  signPersonalMessage = async (type: string, from: string, data: string, options?: any) => {
    const keyring = await keyringService.getKeyringForAccount(from, type)
    const res = await keyringService.signPersonalMessage(keyring, { from, data }, options)
    eventBus.emit(EVENTS.broadcastToUI, {
      method: EVENTS.SIGN_FINISHED,
      params: {
        success: true,
        data: res
      }
    })
    return res
  }

  signTransaction = async (type: string, from: string, data: any, options?: any) => {
    const keyring = await keyringService.getKeyringForAccount(from, type)
    return keyringService.signTransaction(keyring, data, from, options)
  }

  requestKeyring = (type, methodName, keyringId: number | null, ...params) => {
    let keyring
    if (keyringId !== null && keyringId !== undefined) {
      keyring = stashKeyrings[keyringId]
    } else {
      try {
        keyring = this._getKeyringByType(type)
      } catch {
        const Keyring = keyringService.getKeyringClassForType(type)
        keyring = new Keyring()
      }
    }
    if (keyring[methodName]) {
      return keyring[methodName].call(keyring, ...params)
    }
  }

  getTransactionHistory = async (address: string) => {
    const result = await openapiService.getAddressRecentHistory(address)
    return result
  }

  private _getKeyringByType(type) {
    const keyring = keyringService.getKeyringsByType(type)[0]

    if (keyring) {
      return keyring
    }

    throw ethErrors.rpc.internal(`No ${type} keyring found`)
  }

  addContact = (data: ContactBookItem) => {
    contactBookService.addContact(data)
  }
  updateContact = (data: ContactBookItem) => {
    contactBookService.updateContact(data)
  }
  removeContact = (address: string) => {
    contactBookService.removeContact(address)
  }
  listContact = (includeAlias = true) => {
    const list = contactBookService.listContacts()
    if (includeAlias) {
      return list
    } else {
      return list.filter((item) => !item.isAlias)
    }
  }
  getContactsByMap = () => contactBookService.getContactsByMap()
  getContactByAddress = (address: string) => contactBookService.getContactByAddress(address)

  private async _setCurrentAccountFromKeyring(keyring, index = 0) {
    const accounts = keyring.getAccountsWithBrand ? await keyring.getAccountsWithBrand() : await keyring.getAccounts()
    const account = accounts[index < 0 ? index + accounts.length : index]

    if (!account) {
      throw new Error('the current account is empty')
    }

    const _account = {
      address: typeof account === 'string' ? account : account.address,
      type: keyring.type,
      brandName: typeof account === 'string' ? keyring.type : account.brandName
    }
    preferenceService.setCurrentAccount(_account)

    return [_account]
  }

  getHighlightWalletList = () => {
    return preferenceService.getWalletSavedList()
  }

  updateHighlightWalletList = (list) => {
    return preferenceService.updateWalletSavedList(list)
  }

  getAlianName = (address: string) => {
    const contactName = contactBookService.getContactByAddress(address)?.name
    return contactName
  }

  updateAlianName = (address: string, name: string) => {
    contactBookService.updateAlias({
      name,
      address
    })
  }

  getAllAlianName = () => {
    return contactBookService.listAlias()
  }

  getInitAlianNameStatus = () => preferenceService.getInitAlianNameStatus()
  updateInitAlianNameStatus = () => preferenceService.changeInitAlianNameStatus()

  getIsFirstOpen = () => {
    return preferenceService.getIsFirstOpen()
  }
  updateIsFirstOpen = () => {
    return preferenceService.updateIsFirstOpen()
  }
  listChainAssets = async (address: string) => {
    const { confirmed, unconfirmed } = await openapiService.getAddressBalance(address)
    const amount = (confirmed + unconfirmed) / 10000
    const assets = [{ name: COIN_NAME, symbol: COIN_SYMBOL, amount, value: '$6.748.29' }]
    return assets
  }

  reportErrors = (error: string) => {
    console.error('report not implemented')
  }
}

export default new WalletController()
