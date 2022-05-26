import { keyringService, permissionService, sessionService } from 'background/service'
import { CHAINS } from 'consts'
import { ethErrors } from 'eth-rpc-errors'
import BaseController from '../base'

class ProviderController extends BaseController {
  ethRequestAccounts = async ({ session: { origin } }) => {
    if (!permissionService.hasPermission(origin)) {
      throw ethErrors.provider.unauthorized()
    }

    const _account = await this.getCurrentAccount()
    const account = _account ? [_account.address.toLowerCase()] : []
    sessionService.broadcastEvent('accountsChanged', account)
    const connectSite = permissionService.getConnectedSite(origin)
    if (connectSite) {
      const chain = CHAINS[connectSite.chain]
      sessionService.broadcastEvent(
        'chainChanged',
        {
          chain: chain.name,
          network: chain.network
        },
        origin
      )
    }

    return account
  }

  ethAccounts = async ({ session: { origin } }) => {
    if (!permissionService.hasPermission(origin)) {
      return []
    }

    const account = await this.getCurrentAccount()
    return account ? [account.address.toLowerCase()] : []
  }

  private _checkAddress = async (address) => {
    // eslint-disable-next-line prefer-const
    let { address: currentAddress, type } = (await this.getCurrentAccount()) || {}
    currentAddress = currentAddress?.toLowerCase()
    if (!currentAddress || currentAddress !== address) {
      throw ethErrors.rpc.invalidParams({
        message: 'Invalid parameters: must use the current user address to sign'
      })
    }
    const keyring = await keyringService.getKeyringForAccount(currentAddress, type)

    return keyring
  }
}

export default new ProviderController()
