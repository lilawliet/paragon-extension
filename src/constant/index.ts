/* constants pool */
import { Chain } from '@/background/service/openapi'
// import IconNovoLogo from "./images/novo.svg";

export enum CHAINS_ENUM {
  NOVO = 'NOVO',
  BSV = 'BSV'
}

export const CHAINS: Record<string, Chain> = {
  [CHAINS_ENUM.NOVO]: {
    name: 'NOVO',
    enum: CHAINS_ENUM.NOVO,
    logo: '',
    network: 'mainnet',
    nativeTokenSymbol: 'NOVO',
    nativeTokenLogo: 'https://static.debank.com/image/token/logo_url/eth/935ae4e4d1d12d59a99717a24f2540b5.png',
    nativeTokenDecimals: 4,
    nativeTokenAddress: 'eth',
    scanLink: 'https://etherscan.io/tx/_s_'
  },
  [CHAINS_ENUM.BSV]: {
    name: 'BSV',
    enum: CHAINS_ENUM.BSV,
    logo: '',
    network: 'mainnet',
    nativeTokenSymbol: 'BSV',
    nativeTokenLogo: 'https://static.debank.com/image/token/logo_url/eth/935ae4e4d1d12d59a99717a24f2540b5.png',
    nativeTokenAddress: 'bsc',
    scanLink: 'https://bscscan.com/tx/_s_',
    nativeTokenDecimals: 4
  }
}

export const KEYRING_TYPE = {
  HdKeyring: 'HD Key Tree',
  SimpleKeyring: 'Simple Key Pair',
  WatchAddressKeyring: 'Watch Address',
  WalletConnectKeyring: 'WalletConnect'
}

export const KEYRING_CLASS = {
  PRIVATE_KEY: 'Simple Key Pair',
  MNEMONIC: 'HD Key Tree',
  WATCH: 'Watch Address',
  WALLETCONNECT: 'WalletConnect'
}

export const KEYRING_TYPE_TEXT = {
  [KEYRING_TYPE.HdKeyring]: 'Created by Mnemonic',
  [KEYRING_TYPE.SimpleKeyring]: 'Imported by Private Key',
  [KEYRING_TYPE.WatchAddressKeyring]: 'Watch Mode'
}
export const BRAND_ALIAN_TYPE_TEXT = {
  [KEYRING_TYPE.HdKeyring]: 'Mnemonic',
  [KEYRING_TYPE.SimpleKeyring]: 'Private Key',
  [KEYRING_TYPE.WatchAddressKeyring]: 'Watch'
}

export const IS_CHROME = /Chrome\//i.test(navigator.userAgent)

export const IS_FIREFOX = /Firefox\//i.test(navigator.userAgent)

export const IS_LINUX = /linux/i.test(navigator.userAgent)

let chromeVersion: number | null = null

if (IS_CHROME) {
  const matches = navigator.userAgent.match(/Chrome\/(\d+[^.\s])/)
  if (matches && matches.length >= 2) {
    chromeVersion = Number(matches[1])
  }
}

export const IS_AFTER_CHROME91 = IS_CHROME ? chromeVersion && chromeVersion >= 91 : false

export const GAS_LEVEL_TEXT = {
  slow: 'Standard',
  normal: 'Fast',
  fast: 'Instant',
  custom: 'Custom'
}

export const IS_WINDOWS = /windows/i.test(navigator.userAgent)

export const LANGS = [
  {
    value: 'en',
    label: 'English'
  },
  {
    value: 'zh_CN',
    label: '中文'
  }
]

export const CHECK_METAMASK_INSTALLED_URL = {
  Chrome: 'chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/phishing.html',
  Firefox: '',
  Brave: '',
  Edge: ''
}

export const MINIMUM_GAS_LIMIT = 21000

export enum WATCH_ADDRESS_CONNECT_TYPE {
  WalletConnect = 'WalletConnect'
}

export const WALLETCONNECT_STATUS_MAP = {
  PENDING: 1,
  CONNECTED: 2,
  WAITING: 3,
  SIBMITTED: 4,
  REJECTED: 5,
  FAILD: 6
}

export const INTERNAL_REQUEST_ORIGIN = 'https://paragon.li'

export const INTERNAL_REQUEST_SESSION = {
  name: 'Paragon',
  origin: INTERNAL_REQUEST_ORIGIN,
  icon: './images/icon-128.png'
}

export const INITIAL_OPENAPI_URL = 'https://api.paragon.li/v1'

export const EVENTS = {
  broadcastToUI: 'broadcastToUI',
  broadcastToBackground: 'broadcastToBackground',
  SIGN_FINISHED: 'SIGN_FINISHED',
  WALLETCONNECT: {
    STATUS_CHANGED: 'WALLETCONNECT_STATUS_CHANGED',
    INIT: 'WALLETCONNECT_INIT',
    INITED: 'WALLETCONNECT_INITED'
  }
}

export const SORT_WEIGHT = {
  [KEYRING_TYPE.HdKeyring]: 1,
  [KEYRING_TYPE.SimpleKeyring]: 2,
  [KEYRING_TYPE.WalletConnectKeyring]: 4,
  [KEYRING_TYPE.WatchAddressKeyring]: 5
}

export const GASPRICE_RANGE = {
  [CHAINS_ENUM.NOVO]: [0, 10000]
}

export const COIN_NAME = 'Novo'
export const COIN_SYMBOL = 'NOVO'

export const CURRENCIES = [
  { name: 'US Dollar', symbol: 'USD' },
  { name: 'Euro', symbol: 'EUR' },
  { name: 'Japanese Yen', symbol: 'JPY' },
  { name: 'British Pound', symbol: 'GBP' },
  { name: 'Swiss Franc', symbol: 'CHF' },
  { name: 'Canadian Dollar', symbol: 'CAD' }
]
