/* eslint-disable @typescript-eslint/naming-convention */

import {
  DECIMAL_LENGTH,
  EVM_MAIN_URL,
  RADIX_NUMBER,
  ETH_GASSTATION_MAIN_URL,
  NETWORK_FEETYPE_MEDIUM,
  NETWORK_FEETYPE_HIGH,
} from '../config';
import { apiGet, apiPost } from '../services/network';
import { applyDecimalPrecision } from '../services/utils';
import * as Types from '../types';

const queryConfig = {
  headers: {
    'Content-Type': 'application/json',
  },
};

const getBalanceResponse = async (address: string): Promise<Types.BalanceResponse> => {
  const url = EVM_MAIN_URL;

  const params = {
    jsonrpc: '2.0',
    method: 'eth_getBalance',
    params: [address, 'latest'],
    id: 1,
  };

  const dataResult = await apiPost(url, params, { ...queryConfig });

  const { response, error } = dataResult;

  if (error) {
    const msg = 'Could not fetch account balance. Response contains an error. Details are below.';
    throw new Error(`${msg} ${(error as Error).message}`);
  }

  if (!response) {
    const msg = 'Could not fetch account balance. Response is undefined.';
    throw new Error(msg);
  }

  return response;
};

export const getBalance = async (address: string): Promise<string> => {
  const response = await getBalanceResponse(address);

  const { result } = response;

  const parsedBalanceNumber = parseInt(result, RADIX_NUMBER);

  if (Number.isNaN(parsedBalanceNumber)) {
    throw Error('Could not parse the balance response. It is not a number');
  }

  try {
    const balance = applyDecimalPrecision(parsedBalanceNumber, DECIMAL_LENGTH);
    return balance;
  } catch (error) {
    const msg = `Could not apply decimal precision to the parsed balance response. Details: ${
      (error as Error).message
    } `;
    throw Error(msg);
  }
};

export const getCurrentGasPrices = async (): Promise<Types.GasFeeResponse> => {
  const url = ETH_GASSTATION_MAIN_URL;

  const dataResult = await apiGet(url, { ...queryConfig });

  const { response } = dataResult;
  const gasObj = JSON.parse(response);

  const prices = {
    low: gasObj.safeLow / 10,
    medium: gasObj.average / 10,
    high: gasObj.fast / 10,
  };

  return prices;
};

export const getGasPrice = async (feeType: string, gasPrices: Types.GasFeeResponse): Promise<string> => {
  let gasPrice;

  switch (feeType) {
    case NETWORK_FEETYPE_MEDIUM:
      gasPrice = (gasPrices.medium * 1e9).toString(RADIX_NUMBER);
      break;
    case NETWORK_FEETYPE_HIGH:
      if (typeof gasPrices.high === 'string') {
        gasPrice = '0x9184e72a';
      } else {
        gasPrice = (gasPrices.high * 1e9).toString(RADIX_NUMBER);
      }
      break;
    default:
      gasPrice = (gasPrices.low * 1e9).toString(RADIX_NUMBER);
  }

  return gasPrice;
};

// Please use this code stub to implement `eth_sendTransaction`
export const sendTransaction = async (parameters: Types.SendTxInfo[]): Promise<string> => {
  if (parameters.length < 1) throw new Error('Invalid parameters');

  const url = EVM_MAIN_URL;

  const gas = 0x76c0;

  const gasPrices = await getCurrentGasPrices();

  const gasPrice = await getGasPrice(NETWORK_FEETYPE_MEDIUM, gasPrices);

  const rpcParams = {
    jsonrpc: '2.0',
    method: 'eth_sendTransaction',
    params: parameters.map(item => ({
      from: item.from,
      to: item.to,
      gas: gas, // gas: '0x76c0', // 30400
      gasPrice: gasPrice, // gasPrice: '0x9184e72a', // 10000000000000
      value: item.value,
    })),
  };

  const dataResult = await apiPost(url, rpcParams, { ...queryConfig });

  const { response, error } = dataResult;

  if (error) {
    const msg = 'Could not send transaction. Response contains an error. Details are below.';
    throw new Error(`${msg} ${(error as Error).message}`);
  }

  if (!response) {
    const msg = 'Could not send transaction. Response is undefined.';
    throw new Error(msg);
  }

  const { result } = response;

  const isValid = result && /^0x([A-Fa-f0-9]{64})$/.test(result);
  if (!isValid) {
    throw new Error('Could not parse transaction hash');
  }

  return result;
};
