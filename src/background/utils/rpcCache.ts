type CacheState = Map<string, { timeoutId: number; result: any; expireTime: number }>

class RpcCache {
  state: CacheState = new Map()

  start() {}

  async loadBlockNumber() {}

  set(address: string, data: { method: string; chainId: string; params: any; result: any }, expireTime = 150000) {}

  has(address: string, data: { method: string; params: any; chainId: string }) {
    return false
  }

  get(address: string, data: { method: string; params: any; chainId: string }) {
    return false
  }

  updateExpire(address: string, data: { method: string; params: any; chainId: string }, expireTime = 10000) {}

  canCache(data: { method: string; params: any }) {
    switch (data.method) {
      case "web3_clientVersion":
      case "web3_sha3":
      case "eth_protocolVersion":
      case "eth_getBlockTransactionCountByHash":
      case "eth_getUncleCountByBlockHash":
      case "eth_getCode":
      case "eth_getBlockByHash":
      case "eth_getUncleByBlockHashAndIndex":
      case "eth_getCompilers":
      case "eth_compileLLL":
      case "eth_compileSolidity":
      case "eth_compileSerpent":
      case "shh_version":
      case "eth_getBlockByNumber":
      case "eth_getBlockTransactionCountByNumber":
      case "eth_getUncleCountByBlockNumber":
      case "eth_getTransactionByBlockNumberAndIndex":
      case "eth_getUncleByBlockNumberAndIndex":
      case "eth_gasPrice":
      case "eth_blockNumber":
      case "eth_getStorageAt":
      case "eth_call":
      case "eth_estimateGas":
      case "eth_getFilterLogs":
      case "eth_getLogs":
        return true

      default:
        return false
    }
  }

  private getIfExist(key: string) {
    if (this.state.has(key)) return this.state.get(key)
    return null
  }
}

export default new RpcCache()
