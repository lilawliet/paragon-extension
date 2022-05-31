import axios, { Method } from 'axios'
import rateLimit from 'axios-rate-limit'
import { createPersistStore } from 'background/utils'
import { CHAINS_ENUM, INITIAL_OPENAPI_URL } from 'consts'

interface OpenApiConfigValue {
  path: string
  method: Method
  params?: string[]
}

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

export interface ServerChain {
  id: string
  community_id: number
  name: string
  native_token_id: string
  logo_url: string
  wrapped_token_id: string
  symbol: string
}

export interface ChainWithBalance extends ServerChain {
  usd_value: number
}

export interface ChainWithPendingCount extends ServerChain {
  pending_tx_count: number
}

export type SecurityCheckDecision = 'pass' | 'warning' | 'danger' | 'forbidden' | 'loading' | 'pending'

export interface SecurityCheckItem {
  alert: string
  id: number
}

export interface SecurityCheckResponse {
  decision: SecurityCheckDecision
  alert: string
  danger_list: SecurityCheckItem[]
  warning_list: SecurityCheckItem[]
  forbidden_list: SecurityCheckItem[]
  trace_id: string
}

export interface Tx {
  chainId: number
  data: string
  from: string
  gas?: string
  gasLimit?: string
  maxFeePerGas?: string
  maxPriorityFeePerGas?: string
  gasPrice?: string
  nonce: string
  to: string
  value: string
  r?: string
  s?: string
  v?: string
}

export interface Eip1559Tx {
  chainId: number
  data: string
  from: string
  gas: string
  maxFeePerGas: string
  maxPriorityFeePerGas: string
  nonce: string
  to: string
  value: string
  r?: string
  s?: string
  v?: string
}

export interface NovoBalance {
  confirm_amount: string
  pending_amount: string
  amount: string
  usd_value: string
}

export interface TokenItem {
  content_type?: 'image' | 'image_url' | 'video_url' | 'audio_url' | undefined
  content?: string | undefined
  inner_id?: any
  amount: number
  chain: string
  decimals: number
  display_symbol: string | null
  id: string
  is_core: boolean
  is_verified: boolean
  is_wallet: boolean
  is_infinity?: boolean
  logo_url: string
  name: string
  optimized_symbol: string
  price: number
  symbol: string
  time_at: number
  usd_value?: number
  raw_amount?: number
  raw_amount_hex_str?: string
}

export interface Spender {
  id: string
  value: number
  exposure_usd: number
  protocol: {
    id: string
    name: string
    logo_url: string
    chain: string
  }
  is_contract: boolean
  is_open_source: boolean
  is_hacked: boolean
  is_abandoned: boolean
}

export interface TokenApproval {
  id: string
  name: string
  symbol: string
  logo_url: string
  chain: string
  price: number
  balance: number
  spenders: Spender[]
  sum_exposure_usd: number
  exposure_balance: number
}

export interface AssetItem {
  id: string
  chain: string
  name: string
  site_url: string
  logo_url: string
  has_supported_portfolio: boolean
  tvl: number
  net_usd_value: number
  asset_usd_value: number
  debt_usd_value: number
}

export interface Collection {
  id: string
  name: string
  description: null | string
  logo_url: string
  is_core: boolean
  contract_uuids: string[]
  create_at: number
}

export interface NFTItem {
  chain: string
  id: string
  contract_id: string
  inner_id: string
  token_id: string
  name: string
  contract_name: string
  description: string
  usd_price: number
  amount: number
  collection_id?: string
  pay_token: {
    id: string
    name: string
    symbol: string
    amount: number
    logo_url: string
    time_at: number
    date_at?: string
    price?: number
  }
  content_type: 'image' | 'image_url' | 'video_url' | 'audio_url'
  content: string
  detail_url: string
  total_supply?: string
  collection?: Collection | null
  is_erc1155?: boolean
  is_erc721: boolean
}

export interface NFTCollection {
  create_at: string
  id: string
  is_core: boolean
  name: string
  price: number
  chain: string
  tokens: NFTItem[]
}

export interface UserCollection {
  collection: Collection
  list: NFTItem[]
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
}

export interface GasResult {
  estimated_gas_cost_usd_value: number
  estimated_gas_cost_value: number
  estimated_gas_used: number
  estimated_seconds: number
  front_tx_count: number
  max_gas_cost_usd_value: number
  max_gas_cost_value: number
  fail?: boolean
}

export interface GasLevel {
  level: string
  price: number
  front_tx_count: number
  estimated_seconds: number
  base_fee: number
}

export interface BalanceChange {
  err_msg: string
  receive_token_list: TokenItem[]
  send_token_list: TokenItem[]
  success: boolean
  usd_value_change: number
}
interface NFTContractItem {
  id: string
  chain: string
  name: string
  symbol: string
  is_core: boolean
  time_at: number
  collection: {
    id: string
    name: string
    create_at: number
  }
}
export interface ExplainTxResponse {
  abi?: {
    func: string
    params: Array<string[] | number | string>
  }
  abiStr?: string
  balance_change: BalanceChange
  gas: {
    estimated_gas_cost_usd_value: number
    estimated_gas_cost_value: number
    estimated_gas_used: number
    estimated_seconds: number
  }
  native_token: TokenItem
  pre_exec: {
    success: boolean
    err_msg: string
  }
  recommend: {
    gas: string
    nonce: string
  }
  support_balance_change: true
  type_call?: {
    action: string
    contract: string
    contract_protocol_logo_url: string
    contract_protocol_name: string
  }
  type_send?: {
    to_addr: string
    token_symbol: string
    token_amount: number
    token: TokenItem
  }
  type_token_approval?: {
    spender: string
    spender_protocol_logo_url: string
    spender_protocol_name: string
    token_symbol: string
    token_amount: number
    is_infinity: boolean
    token: TokenItem
  }
  type_cancel_token_approval?: {
    spender: string
    spender_protocol_logo_url: string
    spender_protocol_name: string
    token_symbol: string
  }
  type_cancel_tx?: any // TODO
  type_deploy_contract?: any // TODO
  is_gnosis?: boolean
  gnosis?: ExplainTxResponse
  type_cancel_single_nft_approval?: {
    spender: string
    spender_protocol_name: null
    spender_protocol_logo_url: string
    token_symbol: null
    is_nft: boolean
    nft: NFTItem
  }
  type_cancel_nft_collection_approval?: {
    spender: string
    spender_protocol_name: string
    spender_protocol_logo_url: string
    token_symbol: string
    is_nft: boolean
    nft_contract: NFTContractItem
    token: TokenItem
  }
  type_nft_collection_approval?: {
    spender: string
    spender_protocol_name: string
    spender_protocol_logo_url: string
    token_symbol: string
    is_nft: boolean
    nft_contract: NFTContractItem
    token: TokenItem
    token_amount: number
    is_infinity: boolean
  }
  type_single_nft_approval?: {
    spender: string
    spender_protocol_name: string
    spender_protocol_logo_url: string
    token_symbol: string
    is_nft: boolean
    nft: NFTItem
    token: TokenItem
    token_amount: number
    is_infinity: boolean
  }
  type_nft_send?: {
    spender: string
    spender_protocol_name: null
    spender_protocol_logo_url: string
    token_symbol: string
    token_amount: number
    is_infinity: boolean
    is_nft: boolean
    nft: NFTItem
  }
}

interface RPCResponse<T> {
  result: T
  id: number
  jsonrpc: string
  error?: {
    code: number
    message: string
  }
}

interface GetTxResponse {
  blockHash: string
  blockNumber: string
  from: string
  gas: string
  gasPrice: string
  hash: string
  input: string
  nonce: string
  to: string
  transactionIndex: string
  value: string
  type: string
  v: string
  r: string
  s: string
  front_tx_count: number
  code: 0 | -1 // 0: success, -1: failed
  status: -1 | 0 | 1 // -1: failed, 0: pending, 1: success
  gas_used: number
  token: TokenItem
}

const maxRPS = 100

enum API_STATUS {
  FAILED = 0,
  SUCCESS = 1
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
          'X-Client': 'Rabby',
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
      throw new Error(data.messaage)
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
      throw new Error(data.messaage)
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
      throw new Error(data.messaage)
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
      throw new Error(data.messaage)
    }
    return data.result
  }

  async pushTx(rawtx: string): Promise<string> {
    const { data } = await this.request.post('/v1/tx/broadcast', {
      rawtx
    })
    if (data.status == API_STATUS.FAILED) {
      throw new Error(data.messaage)
    }
    return data.result
  }
}

export default new OpenApiService()
