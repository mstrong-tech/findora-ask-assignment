import '@testing-library/jest-dom/extend-expect';

import { restoreKeypairFromPrivateKey } from './sdk';

describe('restoreKeypairFromPrivateKey', () => {
  it('returns proper wallet', async () => {
    const walletInfo = restoreKeypairFromPrivateKey('-RnyAMiC-9KPPmfiULWEpisFoblpfG2cPVYkLLBS4PE=');
    const address = (await walletInfo).address;

    expect(address).toEqual('fra1w25c45tt0kjg7ghgvvrsr4qnymxlmpe59szyx6cnp8ffz4ksegqsftmalc');
  });

  it('returns proper error when it can not parse the response', async () => {
    const walletInfo = restoreKeypairFromPrivateKey('-RnyAMiC-9KPPmfiULWEpisFoblpfG2cPVYkLLBS4PE=');

    try {
      (await walletInfo).address;
    } catch (e) {
      expect(e).toMatchObject('Cannot restore keypair.');
    }
  });
});
