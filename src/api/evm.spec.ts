import '@testing-library/jest-dom/extend-expect';

import { rest } from 'msw';
import { setupServer } from 'msw/node';

import {
  EVM_MAIN_URL,
  RADIX_NUMBER,
  NETWORK_FEETYPE_LOW,
  NETWORK_FEETYPE_MEDIUM,
  NETWORK_FEETYPE_HIGH,
} from '../config';
import * as serviceUtils from '../services/utils';
import { getBalance, sendTransaction, getGasPrice } from './evm';
import * as Types from '../types';

const defaultUrl = EVM_MAIN_URL;

const myDefaultResponse = {
  id: 1,
  jsonrpc: '2.0',
  result: 'true',
};

const server = setupServer(
  rest.get(defaultUrl, (_req, res, ctx) => {
    return res(ctx.json(myDefaultResponse));
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('getBalance', () => {
  const address = 'foobar';

  it('returns proper balance', async () => {
    const myBalanceResponse = {
      id: 1,
      jsonrpc: '2.0',
      result: '0x6B14BD1E6EEA00000',
    };

    server.use(
      rest.post(defaultUrl, (_req, res, ctx) => {
        return res(ctx.json(myBalanceResponse));
      }),
    );

    const balance = await getBalance(address);

    expect(balance).toEqual('123.456');
  });

  it('returns proper error when it can not parse the response', async () => {
    const myBalanceResponse = 'foobar';

    server.use(
      rest.post(defaultUrl, (_req, res, ctx) => {
        return res(ctx.json(myBalanceResponse));
      }),
    );

    await expect(getBalance(address)).rejects.toThrow(
      'Could not parse the balance response. It is not a number',
    );
  });

  it('returns proper error when it can not apply decimal precision', async () => {
    const myBalanceResponse = {
      id: 1,
      jsonrpc: '2.0',
      result: '0x6B14BD1E6EEA00000',
    };

    server.use(
      rest.post(defaultUrl, (_req, res, ctx) => {
        return res(ctx.json(myBalanceResponse));
      }),
    );

    const applyDecimalPrecisionError = new Error('foobar error');

    const applyDecimalPrecision = jest.spyOn(serviceUtils, 'applyDecimalPrecision');

    applyDecimalPrecision.mockImplementationOnce(() => {
      throw applyDecimalPrecisionError;
    });

    await expect(getBalance(address)).rejects.toThrow(
      `Could not apply decimal precision to the parsed balance response. Details: ${applyDecimalPrecisionError.message}`,
    );
  });
});

describe('gasPrice', () => {
  const gasPrices = {
    low: 25,
    medium: 30,
    high: 35,
  };

  it('should return proper low gas price value', async () => {
    const networkFeeType = NETWORK_FEETYPE_LOW;

    const gasPrice = await getGasPrice(networkFeeType, gasPrices);

    const expectedGasPrice = (gasPrices.low * 1e9).toString(RADIX_NUMBER);

    expect(gasPrice).toEqual(expectedGasPrice);
  });

  it('should return proper medium gas price value', async () => {
    const networkFeeType = NETWORK_FEETYPE_MEDIUM;

    const gasPrice = await getGasPrice(networkFeeType, gasPrices);

    const expectedGasPrice = (gasPrices.medium * 1e9).toString(RADIX_NUMBER);

    expect(gasPrice).toEqual(expectedGasPrice);
  });

  it('should return proper high gas price value', async () => {
    const networkFeeType = NETWORK_FEETYPE_HIGH;

    const gasPrice = await getGasPrice(networkFeeType, gasPrices);

    const expectedGasPrice = (gasPrices.high * 1e9).toString(RADIX_NUMBER);

    expect(gasPrice).toEqual(expectedGasPrice);
  });

  it('should return proper error', async () => {
    const networkFeeType = '234';

    const gasPrice = await getGasPrice(networkFeeType, gasPrices);

    const expectedGasPrice = (gasPrices.low * 1e9).toString(RADIX_NUMBER);

    expect(gasPrice).toEqual(expectedGasPrice);
  });

  it('should return proper error1', async () => {
    const networkFeeType = NETWORK_FEETYPE_HIGH;

    const gasPrices = {
      low: 234,
      medium: 4544,
      high: 'xcv',
    };

    const gasPrice = await getGasPrice(networkFeeType, gasPrices as unknown as Types.GasFeeResponse);

    const expectedGasPrice = '0x9184e72a'; // (gasPrices.low * 1e9).toString(RADIX_NUMBER);

    expect(gasPrice).toEqual(expectedGasPrice);
  });
});

// Please finish implementation for this test
describe('sendTransaction', () => {
  it('should return proper transaction hash', async () => {
    const sendResponse = {
      id: 1,
      jsonrpc: '2.0',
      result: '0x84534ba6a43c5ec47c98a2bcc8bd7e2304edadbb01747dfd810e3c431115ce78',
    };

    server.use(
      rest.post(defaultUrl, (req, res, ctx) => {
        const method = (req.body as any)['method'];
        if (method === 'eth_sendTransaction') {
          return res(ctx.json(sendResponse));
        }
        return res(ctx.json('failure'));
      }),
    );
    const txHash = await sendTransaction([
      {
        from: 'from',
        to: 'to',
        value: '0x9184e72a00', // 10000000000000
      },
    ]);

    expect(txHash).toEqual(sendResponse.result);
  });

  it('should return error if invalid transaction hash', async () => {
    const sendResponse = 'invalid tx hash';

    server.use(
      rest.post(defaultUrl, (req, res, ctx) => {
        const method = (req.body as any)['method'];
        if (method === 'eth_sendTransaction') {
          return res(ctx.json(sendResponse));
        }
        return res(ctx.json('failure'));
      }),
    );

    await expect(
      sendTransaction([
        {
          from: 'from',
          to: 'to',
          value: '0x9184e72a00', // 10000000000000
        },
      ]),
    ).rejects.toThrow('Could not parse transaction hash');
  });
});
