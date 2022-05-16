/* eslint-disable @typescript-eslint/naming-convention */

import dotenv from 'dotenv';
dotenv.config();

export const RADIX_NUMBER = 16;
export const DECIMAL_LENGTH = 18;

const {
  FINDORA_URL = 'https://prod-testnet.prod.findora.org',
  EVM_URL = 'http://localhost:8545',
  ETH_GASSTATION_URL = 'https://ethgasstation.info/json/ethgasAPI.json',
} = process.env;

export const EVM_MAIN_URL = EVM_URL;
export const FINDORA_MAIN_URL = FINDORA_URL;
export const ETH_GASSTATION_MAIN_URL = ETH_GASSTATION_URL;

export const NETWORK_FEETYPE_LOW = 'low';
export const NETWORK_FEETYPE_MEDIUM = 'avg';
export const NETWORK_FEETYPE_HIGH = 'max';
