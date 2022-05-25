import React from 'react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWallet, getUiType, useApproval } from 'ui/utils'
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

    console.log('loadView')

    if (isInNotification && !approval) {
      window.close()
      console.log('window.close')
    }

    if (!isInNotification) {
      // chrome.window.windowFocusChange won't fire when
      // click popup in the meanwhile notification is present
      await rejectApproval()
      approval = undefined
      console.log('rejectApproval')
    }

    if (!(await wallet.isBooted())) {
      console.log('welcome')
      navigate('/welcome')
    }

    if (!(await wallet.isUnlocked())) {
      console.log('login')
      navigate('/login')
    }

    if ((await wallet.hasPageStateCache()) && !isInNotification && !isInTab) {
      const cache = await wallet.getPageStateCache()!
      console.log(cache.path)
      navigate(cache.path)
    }

    if ((await wallet.getPreMnemonics()) && !isInNotification && !isInTab) {
      console.log('create-recovery')
      navigate('/create-recovery')
    }

    const currentAccount = await wallet.getCurrentAccount()

    if (!currentAccount) {
      console.log('!currentAccount')
      navigate('/welcome')
    } else if (approval) {
      console.log('approval')
      navigate('/approval')
    } else {
      console.log('dashboard')
      navigate('/dashboard')
    }
  }

  useEffect(() => {
    loadView()
  }, [])

  return <Welcome />
}

export default SortHat
