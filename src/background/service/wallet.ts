const DUMMY_MNEMONICS =
  "danger come provide title interest cupboard skate shoe speak program hope hill";
const DUMMY_ADDRESS = "1BAU9S4yY6khNWxCSQfQQR7BNLRhRT1aHY";
const DUMMY_PRIVKEY = "L4xaZzEW1b4BMw7oFaRP1X9vSqUCgM5R3qXBteApfQE2vQmSSyfq";
export enum CURRENCY {
  USD,
  EUR,
  JPY,
  GBP,
  CHF,
  CAD,
}

const CURRENCY_NAMES = [
  "US Dollar(USD)",
  "Euro(EUR)",
  "Japanese Yen(JPY)",
  "British Pound(GBP)",
  "Swiss Franc(CHF)",
  "Canadian Dollar(CAD)",
];


export class ParagonAccount {
  private privateKey: string;
  currency!: CURRENCY;
  name!: string;
  constructor(privateKey: string) {
    this.privateKey = privateKey;
  }

  /**
   * 导出地址
   * @returns
   */
  getAddress() {
    return DUMMY_ADDRESS;
  }

  /**
   * 导出私钥
   * @returns
   */
  getPrivateKey() {
    return this.privateKey;
  }

  /**
   * 获得资产列表
   * @returns
   */
  getAssets() {
    let assets = [{ name: "Novo", amount: "13,000 NOVO", value: "$6.748.29" }];
    return assets;
  }

  /**
   * 获得活动列表（交易历史）
   * @returns
   */
  getActivities() {
    let activities = [
      { time: 1652188199, address: DUMMY_ADDRESS, amount: "+150" },
    ];
    return activities;
  }

  /**
   * 获取货币列表
   * @returns
   */
  getCurrencies() {
    return CURRENCY_NAMES;
  }

  /**
   * 设置货币
   */
  setCurrency(currency: CURRENCY) {
    this.currency = currency;
  }

  async sendNovo(receiver: string, amount: string) { }
}

export class ParagonWallet {
  mnemonics!: string;
  accounts!: ParagonAccount[];
  derivedIndex: number = 0;
  currentAccountIndex: number = 0;

  constructor(mnemonics?: string) { }

  static create(mnemonics?: string) {
    let wallet = new ParagonWallet(mnemonics);
    return wallet;
  }

  /**
   * 创建一个新的钱包，产生12个助记词
   */
  createNewAccount(name: string, importedPrivateKey?: string) {
    let account: ParagonAccount;
    if (importedPrivateKey) {
      account = new ParagonAccount(importedPrivateKey);
    } else {
      account = new ParagonAccount(DUMMY_PRIVKEY);
      this.derivedIndex++;
    }
    account.name = name;
    this.accounts.push(account);
    return account;
  }

  /**
   * 是否通过校验
   * @param words
   * @returns
   */
  checkMnemonics(words: string) {
    if (words == this.mnemonics) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * 获取账户列表
   * @returns
   */
  getAccounts() {
    return this.accounts;
  }

  /**
   * 获取当前账户
   * @returns
   */
  getCurrentAccount() {
    return this.accounts[this.currentAccountIndex];
  }

  /**
   * 切换账户
   * @param index
   */
  switchAccount(index: number) {
    this.currentAccountIndex = index;
  }

  exportData() { }

  /**
   * 从
   */
  unserialize(data: string) { }

  serialize() {
    return "";
  }
}
