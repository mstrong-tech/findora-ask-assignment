/* eslint-disable @typescript-eslint/naming-convention */

import dotenv from 'dotenv';
dotenv.config();

export const RADIX_NUMBER = 16;
export const DECIMAL_LENGTH = 18;

const { FINDORA_URL = 'https://prod-testnet.prod.findora.org', EVM_URL = 'http://localhost:8545' } =
  process.env;

export const EVM_MAIN_URL = EVM_URL;
export const FINDORA_MAIN_URL = FINDORA_URL;
