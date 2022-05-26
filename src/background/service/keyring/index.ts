/// fork from https://github.com/MetaMask/KeyringController/blob/master/index.js

import { ObservableStore } from '@metamask/obs-store'
import { HdKeyring } from '@paragon/novo-hd-keyring'
import { SimpleKeyring } from '@paragon/novo-simple-keyring'
import * as novo from '@paragon/novocore-lib'
import * as bip39 from 'bip39'
import encryptor from 'browser-passworder'
import { EventEmitter } from 'events'
import log from 'loglevel'
import i18n from '../i18n'
import DisplayKeyring from './display'
export const KEYRING_SDK_TYPES = {
  SimpleKeyring,
  HdKeyring
}

export const KEYRING_CLASS = {
  PRIVATE_KEY: SimpleKeyring.type,
  MNEMONIC: HdKeyring.type
}

interface MemStoreState {
  isUnlocked: boolean
  keyringTypes: any[]
  keyrings: any[]
  preMnemonics: string
}

export interface DisplayedKeryring {
  type: string
  accounts: {
    address: string
    brandName: string
    type?: string
    keyring?: DisplayKeyring
    alianName?: string
  }[]
  keyring: DisplayKeyring
}

class KeyringService extends EventEmitter {
  //
  // PUBLIC METHODS
  //
  keyringTypes: any[]
  store!: ObservableStore<any>
  memStore: ObservableStore<MemStoreState>
  keyrings: any[]
  encryptor: typeof encryptor = encryptor
  password: string | null = null

  constructor() {
    super()
    this.keyringTypes = Object.values(KEYRING_SDK_TYPES)
    this.memStore = new ObservableStore({
      isUnlocked: false,
      keyringTypes: this.keyringTypes.map((krt) => krt.type),
      keyrings: [],
      preMnemonics: ''
    })

    this.keyrings = []
  }

  loadStore(initState) {
    this.store = new ObservableStore(initState)
  }

  async boot(password: string) {
    this.password = password
    const encryptBooted = await this.encryptor.encrypt(password, 'true')
    this.store.updateState({ booted: encryptBooted })
    this.memStore.updateState({ isUnlocked: true })
  }

  isBooted() {
    return !!this.store.getState().booted
  }

  hasVault() {
    return !!this.store.getState().vault
  }

  /**
   * Full Update
   *
   * Emits the `update` event and @returns a Promise that resolves to
   * the current state.
   *
   * Frequently used to end asynchronous chains in this class,
   * indicating consumers can often either listen for updates,
   * or accept a state-resolving promise to consume their results.
   *
   * @returns {Object} The controller state.
   */
  fullUpdate(): MemStoreState {
    this.emit('update', this.memStore.getState())
    return this.memStore.getState()
  }

  /**
   * Import Keychain using Private key
   *
   * @emits KeyringController#unlock
   * @param  privateKey - The privateKey to generate address
   * @returns  A Promise that resolves to the state.
   */
  async importPrivateKey(privateKey: string) {
    await this.persistAllKeyrings()
    const keyring = await this.addNewKeyring('Simple Key Pair', [privateKey])
    await this.persistAllKeyrings()
    await this.setUnlocked()
    await this.fullUpdate()
    return keyring
  }

  private generateMnemonic(): string {
    return bip39.generateMnemonic()
  }

  async generatePreMnemonic(): Promise<string> {
    if (!this.password) {
      throw new Error(i18n.t('you need to unlock wallet first'))
    }
    const mnemonic = this.generateMnemonic()
    const preMnemonics = await this.encryptor.encrypt(this.password, mnemonic)
    this.memStore.updateState({ preMnemonics })

    return mnemonic
  }

  getKeyringByType(type: string) {
    const keyring = this.keyrings.find((keyring) => keyring.type === type)

    return keyring
  }

  removePreMnemonics() {
    this.memStore.updateState({ preMnemonics: '' })
  }

  async getPreMnemonics(): Promise<any> {
    if (!this.memStore.getState().preMnemonics) {
      return ''
    }

    if (!this.password) {
      throw new Error(i18n.t('you need to unlock wallet first'))
    }

    return await this.encryptor.decrypt(this.password, this.memStore.getState().preMnemonics)
  }

  /**
   * CreateNewVaultAndRestore Mnenoic
   *
   * Destroys any old encrypted storage,
   * creates a new HD wallet from the given seed with 1 account.
   *
   * @emits KeyringController#unlock
   * @param  seed - The BIP44-compliant seed phrase.
   * @returns  A Promise that resolves to the state.
   */
  async createKeyringWithMnemonics(seed: string) {
    if (!bip39.validateMnemonic(seed)) {
      return Promise.reject(new Error(i18n.t('mnemonic phrase is invalid')))
    }

    await this.persistAllKeyrings()
    const keyring = await this.addNewKeyring('HD Key Tree', {
      mnemonic: seed,
      activeIndexes: [0]
    })
    const accounts = await keyring.getAccounts()
    if (!accounts[0]) {
      throw new Error('KeyringController - First Account not found.')
    }
    this.persistAllKeyrings()
    this.setUnlocked()
    this.fullUpdate()
    return keyring
  }

  async addKeyring(keyring: SimpleKeyring) {
    const accounts = await keyring.getAccounts()
    await this.checkForDuplicate(keyring.type, accounts)
    this.keyrings.push(keyring)
    await this.persistAllKeyrings()
    await this._updateMemStoreKeyrings()
    await this.fullUpdate()
    return keyring
  }

  /**
   * Set Locked
   * This method deallocates all secrets, and effectively locks MetaMask.
   *
   * @emits KeyringController#lock
   * @returns {Promise<Object>} A Promise that resolves to the state.
   */
  async setLocked(): Promise<MemStoreState> {
    // set locked
    this.password = null
    this.memStore.updateState({ isUnlocked: false })
    // remove keyrings
    this.keyrings = []
    await this._updateMemStoreKeyrings()
    this.emit('lock')
    return this.fullUpdate()
  }

  /**
   * Submit Password
   *
   * Attempts to decrypt the current vault and load its keyrings
   * into memory.
   *
   * Temporarily also migrates any old-style vaults first, as well.
   * (Pre MetaMask 3.0.0)
   *
   * @emits KeyringController#unlock
   * @param {string} password - The keyring controller password.
   * @returns {Promise<Object>} A Promise that resolves to the state.
   */
  async submitPassword(password: string): Promise<MemStoreState> {
    await this.verifyPassword(password)
    this.password = password
    try {
      this.keyrings = await this.unlockKeyrings(password)
    } catch {
      //
    } finally {
      this.setUnlocked()
    }

    return this.fullUpdate()
  }

  /**
   * Verify Password
   *
   * Attempts to decrypt the current vault with a given password
   * to verify its validity.
   *
   * @param {string} password
   */
  async verifyPassword(password: string): Promise<void> {
    const encryptedBooted = this.store.getState().booted
    if (!encryptedBooted) {
      throw new Error(i18n.t('Cannot unlock without a previous vault'))
    }
    await this.encryptor.decrypt(password, encryptedBooted)
  }

  /**
   * Add New Keyring
   *
   * Adds a new Keyring of the given `type` to the vault
   * and the current decrypted Keyrings array.
   *
   * All Keyring classes implement a unique `type` string,
   * and this is used to retrieve them from the keyringTypes array.
   *
   * @param {string} type - The type of keyring to add.
   * @param {Object} opts - The constructor options for the keyring.
   * @returns {Promise<Keyring>} The new keyring.
   */
  addNewKeyring(type: string, opts?: unknown): Promise<any> {
    const Keyring = this.getKeyringClassForType(type)
    const keyring = new Keyring(opts)
    return this.addKeyring(keyring)
  }

  /**
   * Remove Empty Keyrings
   *
   * Loops through the keyrings and removes the ones with empty accounts
   * (usually after removing the last / only account) from a keyring
   */
  async removeEmptyKeyrings(): Promise<undefined> {
    const validKeyrings: unknown[] = []

    // Since getAccounts returns a Promise
    // We need to wait to hear back form each keyring
    // in order to decide which ones are now valid (accounts.length > 0)

    await Promise.all(
      this.keyrings.map(async (keyring) => {
        const accounts = await keyring.getAccounts()
        if (accounts.length > 0) {
          validKeyrings.push(keyring)
        }
      })
    )
    this.keyrings = validKeyrings
    return
  }

  /**
   * Checks for duplicate keypairs, using the the first account in the given
   * array. Rejects if a duplicate is found.
   *
   * Only supports 'Simple Key Pair'.
   *
   * @param {string} type - The key pair type to check for.
   * @param {Array<string>} newAccountArray - Array of new accounts.
   * @returns {Promise<Array<string>>} The account, if no duplicate is found.
   */
  async checkForDuplicate(type: string, newAccountArray: string[]): Promise<string[]> {
    const keyrings = this.getKeyringsByType(type)
    const _accounts = await Promise.all(keyrings.map((keyring) => keyring.getAccounts()))

    const accounts: string[] = _accounts.reduce((m, n) => m.concat(n), [] as string[])

    const isIncluded = newAccountArray.some((account) => {
      return accounts.find((key) => key === account)
    })

    return isIncluded ? Promise.reject(new Error(i18n.t('duplicateAccount'))) : Promise.resolve(newAccountArray)
  }

  /**
   * Add New Account
   *
   * Calls the `addAccounts` method on the given keyring,
   * and then saves those changes.
   *
   * @param {Keyring} selectedKeyring - The currently selected keyring.
   * @returns {Promise<Object>} A Promise that resolves to the state.
   */
  async addNewAccount(selectedKeyring: SimpleKeyring): Promise<string[]> {
    const accounts = await selectedKeyring.addAccounts(1)
    accounts.forEach((hexAccount) => {
      this.emit('newAccount', hexAccount)
    })
    await this.persistAllKeyrings()
    await this._updateMemStoreKeyrings()
    await this.fullUpdate()
    return accounts
  }

  /**
   * Export Account
   *
   * Requests the private key from the keyring controlling
   * the specified address.
   *
   * Returns a Promise that may resolve with the private key string.
   *
   * @param {string} address - The address of the account to export.
   * @returns {Promise<string>} The private key of the account.
   */
  async exportAccount(address: string): Promise<string> {
    const keyring: SimpleKeyring = await this.getKeyringForAccount(address)
    const privkey = await keyring.exportAccount(address)
    return privkey
  }

  /**
   *
   * Remove Account
   *
   * Removes a specific account from a keyring
   * If the account is the last/only one then it also removes the keyring.
   *
   * @param {string} address - The address of the account to remove.
   * @returns {Promise<void>} A Promise that resolves if the operation was successful.
   */
  removeAccount(address: string, type: string, brand?: string): Promise<any> {
    return this.getKeyringForAccount(address, type)
      .then((keyring) => {
        // Not all the keyrings support this, so we have to check
        if (typeof keyring.removeAccount === 'function') {
          keyring.removeAccount(address, brand)
          this.emit('removedAccount', address)
          return keyring.getAccounts()
        }
        return Promise.reject(new Error(`Keyring ${keyring.type} doesn't support account removal operations`))
      })
      .then((accounts) => {
        // Check if this was the last/only account
        if (accounts.length === 0) {
          return this.removeEmptyKeyrings()
        }
        return undefined
      })
      .then(this.persistAllKeyrings.bind(this))
      .then(this._updateMemStoreKeyrings.bind(this))
      .then(this.fullUpdate.bind(this))
      .catch((e) => {
        return Promise.reject(e)
      })
  }

  //
  // SIGNING METHODS
  //

  /**
   * Sign Novo Transaction
   *
   * Signs an Novo transaction object.
   *
   * @param novoTx - The transaction to sign.
   * @param fromAddress - The transaction 'from' address.
   * @returns  The signed transactio object.
   */
  signTransaction(keyring: SimpleKeyring, novoTx: novo.Transaction, fromAddress: string) {
    return keyring.signTransaction(fromAddress, novoTx)
  }

  /**
   * Sign Message
   *
   * Attempts to sign the provided message parameters.
   */
  async signMessage(address: string, data: string) {
    const keyring: SimpleKeyring = await this.getKeyringForAccount(address)
    const sig = await keyring.signMessage(address, data)
    return sig
  }

  /**
   * Decrypt Message
   *
   * Attempts to verify the provided message parameters.
   */
  async verifyMessage(address: string, data: string, sig: string) {
    const keyring: SimpleKeyring = await this.getKeyringForAccount(address)
    const result = await keyring.verifyMessage(address, data, sig)
    return result
  }

  //
  // PRIVATE METHODS
  //

  /**
   * Create First Key Tree
   *
   * - Clears the existing vault
   * - Creates a new vault
   * - Creates a random new HD Keyring with 1 account
   * - Makes that account the selected account
   * - Faucets that account on testnet
   * - Puts the current seed words into the state tree
   *
   * @returns {Promise<void>} - A promise that resovles if the operation was successful.
   */
  createFirstKeyTree() {
    this.clearKeyrings()
    return this.addNewKeyring('HD Key Tree', { activeIndexes: [0] })
      .then((keyring) => {
        return keyring.getAccounts()
      })
      .then(([firstAccount]) => {
        if (!firstAccount) {
          throw new Error('KeyringController - No account found on keychain.')
        }
        const hexAccount = firstAccount
        this.emit('newVault', hexAccount)
        return null
      })
  }

  /**
   * Persist All Keyrings
   *
   * Iterates the current `keyrings` array,
   * serializes each one into a serialized array,
   * encrypts that array with the provided `password`,
   * and persists that encrypted string to storage.
   *
   * @param {string} password - The keyring controller password.
   * @returns {Promise<boolean>} Resolves to true once keyrings are persisted.
   */
  persistAllKeyrings(): Promise<boolean> {
    if (!this.password || typeof this.password !== 'string') {
      return Promise.reject(new Error('KeyringController - password is not a string'))
    }

    return Promise.all(
      this.keyrings.map((keyring) => {
        return Promise.all([keyring.type, keyring.serialize()]).then((serializedKeyringArray) => {
          // Label the output values on each serialized Keyring:
          return {
            type: serializedKeyringArray[0],
            data: serializedKeyringArray[1]
          }
        })
      })
    )
      .then((serializedKeyrings) => {
        return this.encryptor.encrypt(this.password as string, serializedKeyrings as unknown as Buffer)
      })
      .then((encryptedString) => {
        this.store.updateState({ vault: encryptedString })
        return true
      })
  }

  /**
   * Unlock Keyrings
   *
   * Attempts to unlock the persisted encrypted storage,
   * initializing the persisted keyrings to RAM.
   *
   * @param {string} password - The keyring controller password.
   * @returns {Promise<Array<Keyring>>} The keyrings.
   */
  async unlockKeyrings(password: string): Promise<any[]> {
    const encryptedVault = this.store.getState().vault
    if (!encryptedVault) {
      throw new Error(i18n.t('Cannot unlock without a previous vault'))
    }

    await this.clearKeyrings()
    const vault = await this.encryptor.decrypt(password, encryptedVault)
    // TODO: FIXME
    await Promise.all(Array.from(vault).map(this._restoreKeyring.bind(this)))
    await this._updateMemStoreKeyrings()
    return this.keyrings
  }

  /**
   * Restore Keyring
   *
   * Attempts to initialize a new keyring from the provided serialized payload.
   * On success, updates the memStore keyrings and returns the resulting
   * keyring instance.
   *
   * @param {Object} serialized - The serialized keyring.
   * @returns {Promise<Keyring>} The deserialized keyring.
   */
  async restoreKeyring(serialized: any) {
    const keyring = await this._restoreKeyring(serialized)
    await this._updateMemStoreKeyrings()
    return keyring
  }

  /**
   * Restore Keyring Helper
   *
   * Attempts to initialize a new keyring from the provided serialized payload.
   * On success, returns the resulting keyring instance.
   *
   * @param {Object} serialized - The serialized keyring.
   * @returns {Promise<Keyring>} The deserialized keyring.
   */
  async _restoreKeyring(serialized: any): Promise<SimpleKeyring> {
    const { type, data } = serialized
    const Keyring = this.getKeyringClassForType(type)
    const keyring = new Keyring()
    await keyring.deserialize(data)

    // getAccounts also validates the accounts for some keyrings
    await keyring.getAccounts()
    this.keyrings.push(keyring)
    return keyring
  }

  /**
   * Get Keyring Class For Type
   *
   * Searches the current `keyringTypes` array
   * for a Keyring class whose unique `type` property
   * matches the provided `type`,
   * returning it if it exists.
   *
   * @param {string} type - The type whose class to get.
   * @returns {Keyring|undefined} The class, if it exists.
   */
  getKeyringClassForType(type: string) {
    return this.keyringTypes.find((kr) => kr.type === type)
  }

  /**
   * Get Keyrings by Type
   *
   * Gets all keyrings of the given type.
   *
   * @param {string} type - The keyring types to retrieve.
   * @returns {Array<Keyring>} The keyrings.
   */
  getKeyringsByType(type: string): SimpleKeyring[] {
    return this.keyrings.filter((keyring) => keyring.type === type)
  }

  /**
   * Get Accounts
   *
   * Returns the public addresses of all current accounts
   * managed by all currently unlocked keyrings.
   *
   * @returns {Promise<Array<string>>} The array of accounts.
   */
  async getAccounts(): Promise<string[]> {
    const keyrings = this.keyrings || []
    let addrs: string[] = []
    for (let i = 0; i < keyrings.length; i++) {
      const keyring: SimpleKeyring = keyrings[i]
      const accounts = await keyring.getAccounts()
      addrs = addrs.concat(accounts)
    }
    return addrs
  }

  /**
   * Get Keyring For Account
   *
   * Returns the currently initialized keyring that manages
   * the specified `address` if one exists.
   *
   * @param {string} address - An account address.
   * @returns {Promise<Keyring>} The keyring of the account, if it exists.
   */
  async getKeyringForAccount(address: string, type?: string, start?: number, end?: number, includeWatchKeyring = true): Promise<any> {
    log.debug(`KeyringController - getKeyringForAccount: ${address}`)
    const keyrings = type ? this.keyrings.filter((keyring) => keyring.type === type) : this.keyrings
    for (let i = 0; i < keyrings.length; i++) {
      const keyring: SimpleKeyring = keyrings[i]
      const accounts = await keyring.getAccounts()
      if (accounts.includes(address)) {
        return keyring
      }
    }
    throw new Error('No keyring found for the requested account.')
  }

  /**
   * Display For Keyring
   *
   * Is used for adding the current keyrings to the state object.
   * @param {Keyring} keyring
   * @returns {Promise<Object>} A keyring display object, with type and accounts properties.
   */
  displayForKeyring(keyring, includeHidden = true): Promise<DisplayedKeryring> {
    const accounts: Promise<({ address: string; brandName: string } | string)[]> = keyring.getAccountsWithBrand ? keyring.getAccountsWithBrand() : keyring.getAccounts()

    return accounts.then((accounts) => {
      const allAccounts = accounts.map((account) => ({
        address: typeof account === 'string' ? account : account.address,
        brandName: typeof account === 'string' ? keyring.type : account.brandName
      }))

      return {
        type: keyring.type,
        accounts: allAccounts,

        keyring
      }
    })
  }

  getAllTypedAccounts(): Promise<DisplayedKeryring[]> {
    return Promise.all(this.keyrings.map((keyring) => this.displayForKeyring(keyring)))
  }

  async getAllTypedVisibleAccounts(): Promise<DisplayedKeryring[]> {
    const keyrings = await Promise.all(this.keyrings.map((keyring) => this.displayForKeyring(keyring, false)))
    return keyrings.filter((keyring) => keyring.accounts.length > 0)
  }

  async getAllVisibleAccountsArray() {
    const typedAccounts = await this.getAllTypedVisibleAccounts()
    const result: { address: string; type: string; brandName: string }[] = []
    typedAccounts.forEach((accountGroup) => {
      result.push(
        ...accountGroup.accounts.map((account) => ({
          address: account.address,
          brandName: account.brandName,
          type: accountGroup.type
        }))
      )
    })

    return result
  }

  async getAllAdresses() {
    const keyrings = await this.getAllTypedAccounts()
    const result: { address: string; type: string; brandName: string }[] = []
    keyrings.forEach((accountGroup) => {
      result.push(
        ...accountGroup.accounts.map((account) => ({
          address: account.address,
          brandName: account.brandName,
          type: accountGroup.type
        }))
      )
    })

    return result
  }

  async hasAddress(address: string) {
    const addresses = await this.getAllAdresses()
    return !!addresses.find((item) => item.address === address)
  }

  /**
   * Clear Keyrings
   *
   * Deallocates all currently managed keyrings and accounts.
   * Used before initializing a new vault.
   */
  /* eslint-disable require-await */
  async clearKeyrings(): Promise<void> {
    // clear keyrings from memory
    this.keyrings = []
    this.memStore.updateState({
      keyrings: []
    })
  }

  /**
   * Update Memstore Keyrings
   *
   * Updates the in-memory keyrings, without persisting.
   */
  async _updateMemStoreKeyrings(): Promise<void> {
    const keyrings = await Promise.all(this.keyrings.map((keyring) => this.displayForKeyring(keyring)))
    return this.memStore.updateState({ keyrings })
  }

  /**
   * Unlock Keyrings
   *
   * Unlocks the keyrings.
   *
   * @emits KeyringController#unlock
   */
  setUnlocked(): void {
    this.memStore.updateState({ isUnlocked: true })
    this.emit('unlock')
  }
}

export default new KeyringService()
