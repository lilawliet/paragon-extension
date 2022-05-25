export * from './WalletContext'
export * from './hooks'

const UI_TYPE = {
  Tab: 'index',
  Pop: 'popup',
  Notification: 'notification'
}

type UiTypeCheck = {
  isTab: boolean
  isNotification: boolean
  isPop: boolean
}

export const getUiType = (): UiTypeCheck => {
  const { pathname } = window.location
  return Object.entries(UI_TYPE).reduce((m, [key, value]) => {
    m[`is${key}`] = pathname === `/${value}.html`

    return m
  }, {} as UiTypeCheck)
}

export const hex2Text = (hex: string) => {
  try {
    return hex.startsWith('0x') ? decodeURIComponent(hex.replace(/^0x/, '').replace(/[0-9a-f]{2}/g, '%$&')) : hex
  } catch {
    return hex
  }
}

export const getUITypeName = (): string => {
  // need to refact
  const UIType = getUiType()

  if (UIType.isPop) return 'popup'
  if (UIType.isNotification) return 'notification'
  if (UIType.isTab) return 'tab'

  return ''
}

/**
 *
 * @param origin (exchange.pancakeswap.finance)
 * @returns (pancakeswap)
 */
export const getOriginName = (origin: string) => {
  const matches = origin.replace(/https?:\/\//, '').match(/^([^.]+\.)?(\S+)\./)

  return matches ? matches[2] || origin : origin
}

export const hashCode = (str: string) => {
  if (!str) return 0
  let hash = 0,
    i,
    chr,
    len
  if (str.length === 0) return hash
  for (i = 0, len = str.length; i < len; i++) {
    chr = str.charCodeAt(i)
    hash = (hash << 5) - hash + chr
    hash |= 0 // Convert to 32bit integer
  }
  return hash
}

export const ellipsisOverflowedText = (str: string, length = 5, removeLastComma = false) => {
  if (str.length <= length) return str
  let cut = str.substring(0, length)
  if (removeLastComma) {
    if (cut.endsWith(',')) {
      cut = cut.substring(0, length - 1)
    }
  }
  return `${cut}...`
}

export const isSameAddress = (a: string, b: string) => {
  if (!a || !b) return false
  return a.toLowerCase() === b.toLowerCase()
}