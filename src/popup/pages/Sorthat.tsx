import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUiType, useApproval, useWallet } from 'ui/utils'
import Welcome from './Welcome'

const SortHat = () => {
  const navigate = useNavigate()
  const wallet = useWallet()
  const [to, setTo] = useState('')
  // eslint-disable-next-line prefer-const
  let [getApproval, , rejectApproval] = useApproval()

  const loadView = async () => {
    const UIType = getUiType()
    const isInNotification = UIType.isNotification
    const isInTab = UIType.isTab
    let approval = await getApproval()

    if (isInNotification && !approval) {
      window.close()
      return
    }

    if (!isInNotification) {
      // chrome.window.windowFocusChange won't fire when
      // click popup in the meanwhile notification is present
      await rejectApproval()
      approval = undefined
    }

    const isBooted = await wallet.isBooted()
    const hasVault = await wallet.hasVault()
    const isUnlocked = await wallet.isUnlocked()

    if (!hasVault) {
      navigate('/welcome')
      return
    }

    if (!isUnlocked) {
      navigate('/login')
      return
    }

    if ((await wallet.hasPageStateCache()) && !isInNotification && !isInTab) {
      const cache = await wallet.getPageStateCache()!
      navigate(cache.path)
      return
    }

    if ((await wallet.getPreMnemonics()) && !isInNotification && !isInTab) {
      navigate('/create-recovery')
      return
    }

    const currentAccount = await wallet.getCurrentAccount()

    if (!currentAccount) {
      navigate('/welcome')
      return
    } else if (approval) {
      navigate('/approval')
      return
    } else {
      navigate('/dashboard')
      return
    }
  }

  useEffect(() => {
    loadView()
  }, [])

  return <Welcome />
}

export default SortHat
