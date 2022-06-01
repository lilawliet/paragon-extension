import axios from 'axios'
import rateLimit from 'axios-rate-limit'
import { createPersistStore } from 'background/utils'
import { CHAINS_ENUM, INITIAL_OPENAPI_URL } from 'consts'

export type ExchangeRate = {
  EUR: number
  JPY: number
  GBP: number
  CHF: number
  CAD: number
}

interface OpenApiStore {
  host: string
  config?: {
    exchange_rate: ExchangeRate
  }
}

export interface Chain {
  name: string
  logo: string
  enum: CHAINS_ENUM
  network: string
  nativeTokenSymbol: string
  nativeTokenLogo: string
  nativeTokenAddress: string
  scanLink: string
  nativeTokenDecimals: number
}

export interface NovoBalance {
  confirm_amount: string
  pending_amount: string
  amount: string
  usd_value: string
}

// export interface TxHistoryItem {
//   txid: string
//   time: number
//   date: string
//   assets_transferred: {
//     amount: number
//     symbol: string
//   }[]
//   from_addrs: string[]
//   to_addrs: string[]
// }

export interface TxHistoryItem {
  txid: string
  time: number
  date: string
  amount: string
  symbol: string
  address: string
}

const maxRPS = 100

enum API_STATUS {
  FAILED = '0',
  SUCCESS = '1'
}

export class OpenApiService {
  store!: OpenApiStore

  request = rateLimit(
    axios.create({
      headers: {
        'X-Client': 'Paragon',
        'X-Version': process.env.release!
      }
    }),
    { maxRPS }
  )

  setHost = async (host: string) => {
    this.store.host = host
    await this.init()
  }

  getHost = () => {
    return this.store.host
  }

  getExchangeRate = () => {
    return this.store.config?.exchange_rate
  }

  init = async () => {
    this.store = await createPersistStore({
      name: 'openapi',
      template: {
        host: INITIAL_OPENAPI_URL
      }
    })

    if (!process.env.DEBUG) {
      this.store.host = INITIAL_OPENAPI_URL
    }

    this.request = rateLimit(
      axios.create({
        baseURL: this.store.host,
        headers: {
          'X-Client': 'Paragon',
          'X-Version': process.env.release!
        }
      }),
      { maxRPS }
    )
    this.request.interceptors.response.use((response) => {
      const code = response.data?.err_code || response.data?.error_code
      const msg = response.data?.err_msg || response.data?.error_msg

      if (code && code !== 200) {
        if (msg) {
          let err
          try {
            err = new Error(JSON.parse(msg))
          } catch (e) {
            err = new Error(msg)
          }
          throw err
        }
        throw new Error(response.data)
      }
      return response
    })
    const getConfig = async () => {
      try {
        this.store.config = await this.getWalletConfig()
      } catch (e) {
        setTimeout(() => {
          getConfig() // reload openapi config if load failed 5s later
        }, 5000)
      }
    }
    getConfig()
  }

  async getWalletConfig(): Promise<{
    exchange_rate: ExchangeRate
  }> {
    const { status, data } = await this.request.get('/v1/wallet/config', {
      params: {}
    })
    if (data.status == API_STATUS.FAILED) {
      throw new Error(data.message)
    }
    return data.result
  }

  async getAddressBalance(address: string): Promise<NovoBalance> {
    const { status, data } = await this.request.get('/v1/address/balance', {
      params: {
        address
      }
    })
    if (data.status == API_STATUS.FAILED) {
      throw new Error(data.message)
    }
    return data.result
  }

  async getAddressUtxo(address: string): Promise<{ txId: string; outputIndex: number; satoshis: number }[]> {
    const { status, data } = await this.request.get('/v1/address/utxo', {
      params: {
        address
      }
    })
    if (data.status == API_STATUS.FAILED) {
      throw new Error(data.message)
    }
    return data.result
  }

  async getAddressRecentHistory(address: string): Promise<TxHistoryItem[]> {
    const { status, data } = await this.request.get('/v1/address/recent-history', {
      params: {
        address
      }
    })
    if (data.status == API_STATUS.FAILED) {
      throw new Error(data.message)
    }
    return data.result
  }

  async pushTx(rawtx: string): Promise<string> {
    const { data } = await this.request.post('/v1/tx/broadcast', {
      rawtx
    })
    if (data.status == API_STATUS.FAILED) {
      throw new Error(data.message)
    }
    return data.result
  }
}

export default new OpenApiService()
