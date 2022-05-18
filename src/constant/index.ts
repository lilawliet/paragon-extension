/* constants pool */
import { Chain } from '@/background/service/openapi';
import IconNovoLogo from './images/novo.svg';

export const INITIAL_OPENAPI_URL = 'https://api.novo.io';

export enum CHAINS_ENUM {
  NOVO = 'NOVO',
  ETH = 'ETH',
  BSC = 'BSC',
  GNOSIS = 'GNOSIS',
  HECO = 'HECO',
  POLYGON = 'POLYGON',
  FTM = 'FTM',
  OKT = 'OKT',
  ARBITRUM = 'ARBITRUM',
  AVAX = 'AVAX',
  OP = 'OP',
  CELO = 'CELO',
  MOVR = 'MOVR',
  CRO = 'CRO',
  BOBA = 'BOBA',
  METIS = 'METIS',
  BTT = 'BTT',
  AURORA = 'AURORA',
  MOBM = 'MOBM',
  SBCH = 'SBCH',
  FUSE = 'FUSE',
  HMY = 'HMY',
  PALM = 'PALM',
  ASTAR = 'ASTAR',
  SDN = 'SDN',
  KLAY = 'KLAY',
  IOTX = 'IOTX',
  RSK = 'RSK',
  WAN = 'WAN',
  KCC = 'KCC',
  SGB = 'SGB',
}

export const CHAINS: Record<string, Chain> = {
  [CHAINS_ENUM.NOVO]: {
    id: 1,
    serverId: 'eth',
    name: 'Novo',
    hex: '0x1',
    enum: CHAINS_ENUM.NOVO,
    logo: IconNovoLogo,
    network: '1',
    nativeTokenSymbol: 'NOVO',
    nativeTokenLogo:
      'https://static.debank.com/image/token/logo_url/eth/935ae4e4d1d12d59a99717a24f2540b5.png',
    nativeTokenDecimals: 18,
    nativeTokenAddress: 'eth',
    scanLink: 'https://etherscan.io/tx/_s_',
    thridPartyRPC:
      'https://eth-mainnet.alchemyapi.io/v2/hVcflvG3Hp3ufTgyfj-s9govLX5OYluf',
    eip: {
      '1559': true,
    },
  }
};