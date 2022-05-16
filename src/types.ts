/* eslint-disable @typescript-eslint/naming-convention */
export interface ResultError {
  message: string;
  code?: number;
}

export interface NetworkAxiosDataResult {
  response?: any;
  error?: ResultError;
}

export interface NetworkAxiosResult {
  data: NetworkAxiosDataResult;
}

export interface NetworkAxiosHeaders {
  [key: string]: string | number;
  [index: number]: string;
}

export interface NetworkAxiosConfig {
  headers?: NetworkAxiosHeaders;
  params?: any;
}

export type BalanceResponse = {
  id: string;
  jsonrpc: string;
  result: string;
};

export interface BalanceDataResult extends NetworkAxiosDataResult {
  response?: BalanceResponse;
}

export interface ParsedData {}

export interface TransferInfo {
  address: string;
  amount: string;
}

export interface TransferReciever<T> {
  reciverWalletInfo: T;
  amount: string;
}

export interface SendTxInfo {
  from: string;
  to: string;
  value: string;
}

export type GasFeeResponse = {
  low: number;
  medium: number;
  high: number;
};
