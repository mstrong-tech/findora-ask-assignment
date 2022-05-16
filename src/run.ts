/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-console */

import dotenv from 'dotenv';

import Api from './api';
import { RADIX_NUMBER } from './config';

dotenv.config();

const _runCreateKeypair = async (): Promise<void> => {
  const walletInfo = await Api.createKeypair();

  console.log('walletInfo is', walletInfo);
};

const _runCreateKeypairFromPriKey = async (): Promise<void> => {
  const { FRA_PRIVATE_KEY = '' } = process.env;

  const walletInfo = await Api.restoreKeypairFromPrivateKey(FRA_PRIVATE_KEY);

  console.log('walletInfo is', walletInfo);
};

const _runGetBalance = async (): Promise<void> => {
  const { FRA_MNEMONIC_STRING = '', ETH_ADDRESS = '' } = process.env;

  const senderMnemonic = FRA_MNEMONIC_STRING;

  const address = ETH_ADDRESS;
  const balance = await Api.getBalance(address);
  console.log('\n');
  console.log('\n');
  console.log('ETH balance is', balance);

  const fraBalance = await Api.getFraBalance(senderMnemonic);

  console.log('\n');
  console.log('\n');
  console.log('FRA balance is', fraBalance);
};

const _runGetFraBalance = async (): Promise<void> => {
  const { FRA_PRIVATE_KEY = '' } = process.env;

  const senderPriKey = FRA_PRIVATE_KEY;

  const fraBalance = await Api.getFraBalanceFromPrikey(senderPriKey);

  console.log('\n');
  console.log('\n');
  console.log('FRA balance is', fraBalance);
};

const _runSendFra = async (): Promise<void> => {
  const { FRA_MNEMONIC_STRING = '' } = process.env;

  const senderMnemonic = FRA_MNEMONIC_STRING;

  // please update those addresses with yours, which you have mnemonics for. otherwise you would not be able to check the balance for those addresses
  // and, most importantly, you would lose your funds
  const transferInfo = [
    {
      address: 'fra1xe49fmdju4meynvamxe3arxn36vscpgfsrvjqzgx288m5cq6xc2q0ndjcy',
      amount: '0.01',
    },
    {
      address: 'fra1rkvlrs8j8y7rlud9qh6ndg5nr4ag7ar4640dr8h0ys6zfrwv25as42zptu',
      amount: '0.02',
    },
  ];

  const resultHandle = await Api.transferFraToMultipleRecepients(senderMnemonic, transferInfo);

  console.log('send to multiple receipients result handle', resultHandle);
};

const _runSendTransaction = async (): Promise<void> => {
  const { FROM_ADDRESS, TO_ADDRESS, VALUE } = process.env;
  if (!FROM_ADDRESS || !TO_ADDRESS || !VALUE) {
    throw new Error('Invalid parameter to send transaction');
  }

  const txHash = await Api.sendTransaction([
    {
      from: FROM_ADDRESS,
      to: TO_ADDRESS,
      value: `0x${parseInt(VALUE, 10).toString(RADIX_NUMBER)}`,
    },
  ]);

  console.log('\n');
  console.log('\n');
  console.log('Transaction Hash is', txHash);
};
// void _runCreateKeypair();
// void _runCreateKeypairFromPriKey();
// void _runGetFraBalance();
// void _runGetBalance();
// void _runSendFra();
void _runSendTransaction();
