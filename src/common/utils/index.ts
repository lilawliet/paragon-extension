import { useEffect, useRef } from 'react'

export const copyToClipboard = (textToCopy: string) => {
  // navigator clipboard 需要https等安全上下文
  if (navigator.clipboard && window.isSecureContext) {
    // navigator clipboard 向剪贴板写文本
    return navigator.clipboard.writeText(textToCopy)
  } else {
    // 创建text area
    const textArea = document.createElement('textarea')
    textArea.value = textToCopy
    // 使text area不在viewport，同时设置不可见
    textArea.style.position = 'absolute'
    textArea.style.opacity = '0'
    textArea.style.left = '-999999px'
    textArea.style.top = '-999999px'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    return new Promise<void>((res, rej) => {
      // 执行复制命令并移除文本框
      document.execCommand('copy') ? res() : rej()
      textArea.remove()
    })
  }
}

export const formatAddr = (address: string) => {
  if (address.length > 16) {
    return `${address.slice(0, 8)}...${address.slice(-8)}`
  }
  return address
}

type Callback<T> = (prev?: T) => void
interface Config {
  immdiate: boolean
}

export const useWatch = <T>(data: T, callback: Callback<T>, config: Config = { immdiate: false }) => {
  const prev = useRef<T>()
  const { immdiate } = config
  const inited = useRef(false)
  const stop = useRef(false)
  useEffect(() => {
    const execute = () => callback(prev.current)
    if (!stop.current) {
      if (!inited.current) {
        inited.current = true
        immdiate && execute()
      } else {
        execute()
      }
      prev.current = data
    }
  }, [data])

  return () => (stop.current = true)
}

export const handleInputFocus = (e) => {
  e.target.setAttribute('class', `${e.target.getAttribute('class')} active`)
}

export const handleInputBlur = (e) => {
  e.target.setAttribute('class', `${e.target.getAttribute('class')?.split('active').join('').trim()}`)
}
