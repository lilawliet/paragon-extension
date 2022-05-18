import { CHAINS } from 'consts'
import { keyBy } from 'lodash'


const chainsDict = keyBy(CHAINS, 'serverId');

export const getChain = (chainId?: string) => {
    if (!chainId) {
      return null;
    }
    return chainsDict[chainId];
  };
  