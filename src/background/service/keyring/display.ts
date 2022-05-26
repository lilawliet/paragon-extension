import KeyringService, { Keyring } from './index'

class DisplayKeyring {
  accounts: string[] = []
  type = ''

  constructor(keyring: Keyring) {
    this.accounts = keyring.accounts || []
    this.type = keyring.type
  }

  async unlock(): Promise<void> {
    const keyring = await KeyringService.getKeyringForAccount(this.accounts[0], this.type)
    if (keyring.unlock) await keyring.unlock()
  }

  async getFirstPage() {
    const keyring = await KeyringService.getKeyringForAccount(this.accounts[0], this.type)
    if (keyring.getFirstPage) {
      return await keyring.getFirstPage()
    } else {
      return []
    }
  }

  async getNextPage() {
    const keyring = await KeyringService.getKeyringForAccount(this.accounts[0], this.type)
    if (keyring.getNextPage) {
      return await keyring.getNextPage()
    } else {
      return []
    }
  }

  async getAccounts() {
    const keyring = await KeyringService.getKeyringForAccount(this.accounts[0], this.type)
    return await keyring.getAccounts()
  }

  async activeAccounts(indexes: number[]): Promise<string[]> {
    const keyring = await KeyringService.getKeyringForAccount(this.accounts[0], this.type)
    if (keyring.activeAccounts) {
      return keyring.activeAccounts(indexes)
    } else {
      return []
    }
  }
}

export default DisplayKeyring
