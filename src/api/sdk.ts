/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-console */

import { Api, Sdk } from '@findora-network/findora-sdk.js';

const { Keypair, Account, Asset, Transaction } = Api;

import { FINDORA_MAIN_URL } from '../config';
import { TransferInfo, TransferReciever } from '../types';

const sdkEnv = {
  hostUrl: FINDORA_MAIN_URL,
  cachePath: './cache',
};

Sdk.default.init(sdkEnv);

console.log(`Connecting to "${sdkEnv.hostUrl}"`);

const password = '12345';

export const createKeypair = async (): Promise<Api.Keypair.LightWalletKeypair> => {
  const mnemonic = await Keypair.getMnemonic(24);

  const walletInfo = await Keypair.restoreFromMnemonic(mnemonic, password);

  return walletInfo;
};

export const getFraBalance = async (senderMnemonic: string): Promise<string> => {
  const mm = senderMnemonic.split(' ');

  const newWallet = await Keypair.restoreFromMnemonic(mm, password);

  const walletBalance = await Account.getBalance(newWallet);

  return walletBalance;
};

export const getFraBalanceFromPrikey = async (pKey: string): Promise<string> => {
  const newWallet = await Keypair.restoreFromPrivateKey(pKey, password);

  const walletBalance = await Account.getBalance(newWallet);

  return walletBalance;
};

export const processTransferInfoItem = async (
  transferData: TransferInfo,
): Promise<TransferReciever<Api.Keypair.LightWalletKeypair>> => {
  const { address, amount } = transferData;

  const toWalletInfo = await Keypair.getAddressPublicAndKey(address);

  return { reciverWalletInfo: toWalletInfo, amount };
};

export const transferFraToMultipleRecepients = async (
  senderMnemonic: string,
  transferInfo: TransferInfo[],
): Promise<string> => {
  const assetCode = await Asset.getFraAssetCode();

  const mm = senderMnemonic.split(' ');

  const walletInfo = await Keypair.restoreFromMnemonic(mm, password);

  const recieversInfo = await Promise.all(transferInfo.map(txItem => processTransferInfoItem(txItem)));

  const transactionBuilder = await Transaction.sendToMany(walletInfo, recieversInfo, assetCode);

  const resultHandle = await Transaction.submitTransaction(transactionBuilder);

  return resultHandle;
};

// Please use this code stub to implement `restoreKeypairFromPrivateKey`
export const restoreKeypairFromPrivateKey = async (pKey: string): Promise<Api.Keypair.LightWalletKeypair> => {
  // restore from private key
  const walletInfo = await Keypair.restoreFromPrivateKey(pKey, password);

  // temporary forcibly casting the empty object to the KeyPairType
  return walletInfo as Api.Keypair.LightWalletKeypair;
};
