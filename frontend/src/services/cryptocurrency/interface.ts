export interface CryptocurrencyData {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  quote: {
    USD: {
      price: number;
      volume_24h: number;
      market_cap: number;
      percent_change_24h: number;
      percent_change_7d?: number;
      percent_change_1h?: number;
    };
  };
}

export interface TopCryptocurrenciesResponse {
  status: {
    timestamp: string;
    error_code: number;
    error_message: string | null;
    elapsed: number;
    credit_count: number;
  };
  data: CryptocurrencyData[];
}

// {
//   id: 1,
//   name: 'Bitcoin',
//   symbol: 'BTC',
//   slug: 'bitcoin',
//   num_market_pairs: 11962,
//   date_added: '2010-07-13T00:00:00.000Z',
//   tags: [
//     { slug: 'mineable', name: 'Mineable', category: 'OTHERS' },
//     { slug: 'pow', name: 'PoW', category: 'ALGORITHM' },
//     { slug: 'sha-256', name: 'SHA-256', category: 'ALGORITHM' },
//     {
//       slug: 'store-of-value',
//       name: 'Store Of Value',
//       category: 'CATEGORY'
//     },
//     {
//       slug: 'state-channel',
//       name: 'State Channel',
//       category: 'CATEGORY'
//     },
//     {
//       slug: 'coinbase-ventures-portfolio',
//       name: 'Coinbase Ventures Portfolio',
//       category: 'CATEGORY'
//     },
//     {
//       slug: 'three-arrows-capital-portfolio',
//       name: 'Three Arrows Capital Portfolio',
//       category: 'CATEGORY'
//     },
//     {
//       slug: 'polychain-capital-portfolio',
//       name: 'Polychain Capital Portfolio',
//       category: 'CATEGORY'
//     },
//     {
//       slug: 'binance-labs-portfolio',
//       name: 'Binance Labs Portfolio',
//       category: 'CATEGORY'
//     },
//     {
//       slug: 'blockchain-capital-portfolio',
//       name: 'Blockchain Capital Portfolio',
//       category: 'CATEGORY'
//     },
//     {
//       slug: 'boostvc-portfolio',
//       name: 'BoostVC Portfolio',
//       category: 'CATEGORY'
//     },
//     {
//       slug: 'cms-holdings-portfolio',
//       name: 'CMS Holdings Portfolio',
//       category: 'CATEGORY'
//     },
//     {
//       slug: 'dcg-portfolio',
//       name: 'DCG Portfolio',
//       category: 'CATEGORY'
//     },
//     {
//       slug: 'dragonfly-capital-portfolio',
//       name: 'DragonFly Capital Portfolio',
//       category: 'CATEGORY'
//     },
//     {
//       slug: 'electric-capital-portfolio',
//       name: 'Electric Capital Portfolio',
//       category: 'CATEGORY'
//     },
//     {
//       slug: 'fabric-ventures-portfolio',
//       name: 'Fabric Ventures Portfolio',
//       category: 'CATEGORY'
//     },
//     {
//       slug: 'framework-ventures-portfolio',
//       name: 'Framework Ventures Portfolio',
//       category: 'CATEGORY'
//     },
//     {
//       slug: 'galaxy-digital-portfolio',
//       name: 'Galaxy Digital Portfolio',
//       category: 'CATEGORY'
//     },
//     {
//       slug: 'huobi-capital-portfolio',
//       name: 'Huobi Capital Portfolio',
//       category: 'CATEGORY'
//     },
//     {
//       slug: 'alameda-research-portfolio',
//       name: 'Alameda Research Portfolio',
//       category: 'CATEGORY'
//     },
//     {
//       slug: 'a16z-portfolio',
//       name: 'a16z Portfolio',
//       category: 'CATEGORY'
//     },
//     {
//       slug: '1confirmation-portfolio',
//       name: '1Confirmation Portfolio',
//       category: 'CATEGORY'
//     },
//     {
//       slug: 'winklevoss-capital-portfolio',
//       name: 'Winklevoss Capital Portfolio',
//       category: 'CATEGORY'
//     },
//     {
//       slug: 'usv-portfolio',
//       name: 'USV Portfolio',
//       category: 'CATEGORY'
//     },
//     {
//       slug: 'placeholder-ventures-portfolio',
//       name: 'Placeholder Ventures Portfolio',
//       category: 'CATEGORY'
//     },
//     {
//       slug: 'pantera-capital-portfolio',
//       name: 'Pantera Capital Portfolio',
//       category: 'CATEGORY'
//     },
//     {
//       slug: 'multicoin-capital-portfolio',
//       name: 'Multicoin Capital Portfolio',
//       category: 'CATEGORY'
//     },
//     {
//       slug: 'paradigm-portfolio',
//       name: 'Paradigm Portfolio',
//       category: 'CATEGORY'
//     },
//     {
//       slug: 'bitcoin-ecosystem',
//       name: 'Bitcoin Ecosystem',
//       category: 'PLATFORM'
//     },
//     {
//       slug: 'ftx-bankruptcy-estate',
//       name: 'FTX Bankruptcy Estate ',
//       category: 'CATEGORY'
//     },
//     {
//       slug: '2017-2018-alt-season',
//       name: '2017/18 Alt season',
//       category: 'CATEGORY'
//     }
//   ],
//   max_supply: 21000000,
//   circulating_supply: 19830450,
//   total_supply: 19830450,
//   is_active: 1,
//   infinite_supply: false,
//   platform: null,
//   cmc_rank: 1,
//   is_fiat: 0,
//   self_reported_circulating_supply: null,
//   self_reported_market_cap: null,
//   tvl_ratio: null,
//   last_updated: '2025-02-28T18:02:00.000Z',
//   quote: {
//     USD: {
//       price: 83707.70632064914,
//       volume_24h: 86810310422.00346,
//       volume_change_24h: 31.6303,
//       percent_change_1h: -0.62370025,
//       percent_change_24h: -1.13284254,
//       percent_change_7d: -13.62538952,
//       percent_change_30d: -18.10442373,
//       percent_change_60d: -10.563358,
//       percent_change_90d: -13.60151861,
//       market_cap: 1659961484806.317,
//       market_cap_dominance: 59.8475,
//       fully_diluted_market_cap: 1757861832733.63,
//       tvl: null,
//       last_updated: '2025-02-28T18:02:00.000Z'
//     }
//   },
//   logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png',
//   description: 'Bitcoin (BTC) is a cryptocurrency launched in 2010. Users are able to generate BTC through the process of mining. Bitcoin has a current supply of 19,830,450. The last known price of Bitcoin is 83,599.23528037 USD and is down -0.96 over the last 24 hours. It is currently trading on 11962 active market(s) with $85,701,916,430.81 traded over the last 24 hours. More information can be found at https://bitcoin.org/.',
//   urls: {
//     website: [ 'https://bitcoin.org/' ],
//     twitter: [],
//     message_board: [ 'https://bitcointalk.org' ],
//     chat: [],
//     facebook: [],
//     explorer: [
//       'https://blockchain.info/',
//       'https://live.blockcypher.com/btc/',
//       'https://blockchair.com/bitcoin',
//       'https://explorer.viabtc.com/btc',
//       'https://www.okx.com/web3/explorer/btc'
//     ],
//     reddit: [ 'https://reddit.com/r/bitcoin' ],
//     technical_doc: [ 'https://bitcoin.org/bitcoin.pdf' ],
//     source_code: [ 'https://github.com/bitcoin/bitcoin' ],
//     announcement: []
//   }
// }
export interface CryptocurrencyDetailResponse {
  status: {
    timestamp: string;
    error_code: number;
    error_message: string | null;
    elapsed: number;
    credit_count: number;
  };
  data: CryptocurrencyDetail;
}

export interface CryptocurrencyDetail {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  num_market_pairs?: number;
  date_added: string;
  tags: Tag[] | string[];
  max_supply: number | null;
  circulating_supply: number;
  total_supply: number;
  is_active: number;
  infinite_supply?: boolean;
  platform: {
    id: number;
    name: string;
    symbol: string;
    slug: string;
    token_address: string;
  } | null;
  cmc_rank?: number;
  is_fiat?: number;
  self_reported_circulating_supply?: number | null;
  self_reported_market_cap?: number | null;
  tvl_ratio?: number | null;
  last_updated: string;
  quote: {
    USD: {
      price: number;
      volume_24h: number;
      volume_change_24h: number;
      volume_7d?: number;
      volume_30d?: number;
      market_cap: number;
      market_cap_dominance?: number;
      fully_diluted_market_cap: number;
      tvl?: number | null;
      percent_change_1h: number;
      percent_change_24h: number;
      percent_change_7d: number;
      percent_change_30d: number;
      percent_change_60d: number;
      percent_change_90d: number;
      last_updated: string;
    };
  };
  logo: string;
  description: string;
  urls: {
    website: string[];
    twitter: string[];
    message_board: string[];
    chat: string[];
    facebook?: string[];
    explorer: string[];
    reddit: string[];
    technical_doc: string[];
    source_code: string[];
    announcement: string[];
  };
  category?: string;
}

export interface Tag {
  slug: string;
  name: string;
  category: string;
}
