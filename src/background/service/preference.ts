import { createPersistStore } from '@/background/utils';
import { EVENTS } from '@/shared/constant';
import eventBus from '@/shared/eventBus';
import compareVersions from 'compare-versions';
import cloneDeep from 'lodash/cloneDeep';
import browser from '../webapi/browser';
import { i18n, keyringService, sessionService } from './index';
import { NovoBalance, TxHistoryItem } from './openapi';

const version = process.env.release || '0';

export interface Account {
  type: string;
  address: string;
  brandName: string;
  alianName?: string;
  displayBrandName?: string;
  index?: number;
  balance?: number;
}

export interface PreferenceStore {
  currentAccount: Account | undefined | null;
  externalLinkAck: boolean;
  balanceMap: {
    [address: string]: NovoBalance;
  };
  historyMap: {
    [address: string]: TxHistoryItem[];
  };
  locale: string;
  watchAddressPreference: Record<string, number>;
  walletSavedList: [];
  alianNames?: Record<string, string>;
  initAlianNames: boolean;
  currentVersion: string;
  firstOpen: boolean;
  currency: string;
}

const SUPPORT_LOCALES = ['en'];

class PreferenceService {
  store!: PreferenceStore;
  popupOpen = false;
  hasOtherProvider = false;

  init = async () => {
    const defaultLang = 'en';
    this.store = await createPersistStore<PreferenceStore>({
      name: 'preference',
      template: {
        currentAccount: undefined,
        externalLinkAck: false,
        balanceMap: {},
        historyMap: {},
        locale: defaultLang,
        watchAddressPreference: {},
        walletSavedList: [],
        alianNames: {},
        initAlianNames: false,
        currentVersion: '0',
        firstOpen: false,
        currency: 'USD'
      }
    });
    if (!this.store.locale || this.store.locale !== defaultLang) {
      this.store.locale = defaultLang;
    }
    i18n.changeLanguage(this.store.locale);

    if (!this.store.currency) {
      this.store.currency = 'USD';
    }

    if (!this.store.initAlianNames) {
      this.store.initAlianNames = false;
    }
    if (!this.store.externalLinkAck) {
      this.store.externalLinkAck = false;
    }

    if (!this.store.balanceMap) {
      this.store.balanceMap = {};
    }

    if (!this.store.historyMap) {
      this.store.historyMap = {};
    }

    if (!this.store.walletSavedList) {
      this.store.walletSavedList = [];
    }
  };

  getAcceptLanguages = async () => {
    let langs = await browser.i18n.getAcceptLanguages();
    if (!langs) langs = [];
    return langs.map((lang) => lang.replace(/-/g, '_')).filter((lang) => SUPPORT_LOCALES.includes(lang));
  };

  /**
   * If current account be hidden or deleted
   * call this function to reset current account
   * to the first address in address list
   */
  resetCurrentAccount = async () => {
    const [account] = await keyringService.getAllVisibleAccountsArray();
    this.setCurrentAccount(account);
  };

  getCurrentAccount = () => {
    return cloneDeep(this.store.currentAccount);
  };

  setCurrentAccount = (account?: Account | null) => {
    this.store.currentAccount = account;
    if (account) {
      sessionService.broadcastEvent('accountsChanged', [account.address]);
      eventBus.emit(EVENTS.broadcastToUI, {
        method: 'accountsChanged',
        params: account
      });
    }
  };

  setPopupOpen = (isOpen: boolean) => {
    this.popupOpen = isOpen;
  };

  getPopupOpen = () => {
    return this.popupOpen;
  };

  updateAddressBalance = (address: string, data: NovoBalance) => {
    const balanceMap = this.store.balanceMap || {};
    this.store.balanceMap = {
      ...balanceMap,
      [address]: data
    };
  };

  removeAddressBalance = (address: string) => {
    const key = address;
    if (key in this.store.balanceMap) {
      const map = this.store.balanceMap;
      delete map[key];
      this.store.balanceMap = map;
    }
  };

  getAddressBalance = (address: string): NovoBalance | null => {
    const balanceMap = this.store.balanceMap || {};
    return balanceMap[address] || null;
  };

  updateAddressHistory = (address: string, data: TxHistoryItem[]) => {
    const historyMap = this.store.historyMap || {};
    this.store.historyMap = {
      ...historyMap,
      [address]: data
    };
  };

  removeAddressHistory = (address: string) => {
    const key = address;
    if (key in this.store.historyMap) {
      const map = this.store.historyMap;
      delete map[key];
      this.store.historyMap = map;
    }
  };

  getAddressHistory = (address: string): TxHistoryItem[] => {
    const historyMap = this.store.historyMap || {};
    return historyMap[address] || [];
  };

  getExternalLinkAck = (): boolean => {
    return this.store.externalLinkAck;
  };

  setExternalLinkAck = (ack = false) => {
    this.store.externalLinkAck = ack;
  };

  getLocale = () => {
    return this.store.locale;
  };

  setLocale = (locale: string) => {
    this.store.locale = locale;
    i18n.changeLanguage(locale);
  };

  getCurrency = () => {
    return this.store.currency;
  };

  setCurrency = (currency: string) => {
    this.store.currency = currency;
  };

  getWalletSavedList = () => {
    return this.store.walletSavedList || [];
  };

  updateWalletSavedList = (list: []) => {
    this.store.walletSavedList = list;
  };

  getInitAlianNameStatus = () => {
    return this.store.initAlianNames;
  };

  changeInitAlianNameStatus = () => {
    this.store.initAlianNames = true;
  };

  getIsFirstOpen = () => {
    if (!this.store.currentVersion || compareVersions(version, this.store.currentVersion)) {
      this.store.currentVersion = version;
      this.store.firstOpen = true;
    }
    return this.store.firstOpen;
  };

  updateIsFirstOpen = () => {
    this.store.firstOpen = false;
  };
}

export default new PreferenceService();
