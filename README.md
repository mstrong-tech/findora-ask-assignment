# Findora JavaScript SDK exercise

Welcome to the JavaScript SDK exercise and thanks for taking time our of your day to complete this. We have designed this exercise to take a total of 4-5 hours to complete.


We will be evaluating based on the following factors:

- Correctness
- Testing
- Style and Documentation

### General notes

Please note that all the new methods should be tested for both happy path and negative path. Feel free to create test helpers if that is needed for better code reusability.

Upon completing the assignment, please make sure to run `yarn lint` to ensure code sanity. Also, please run `yarn jest-coverage` to check the testing coverage overall. The report would be generated in the `coverage` directory.

Please remember about documenting your code. You can generate documentation report by running `yarn doc`. The report would be generated in the `docs` directory.

If you have any questions about the exercise or if anything is unclear, please reach out to tanmay@findora.org or oleks@findora.org and we will work with you. We also welcome any and all feedback you have regarding this exercise. We are always trying to improve our processes!

## Technology Stack

TypeScript, axios, jest

## The Assignment

As some quick background information, Findora has built a hybrid model which features both UTXO and EVM account model ledgers running on the same consensus. https://medium.com/findorafoundation/2-findora-academy-two-is-better-than-one-introducing-findoras-multi-chain-structure-a6bf3e35e4d9

Thus we felt that it would be good to interact with both EVM and UTXO as part of this exercise. The task For assignment will be to write 2 API methods. The first one will be to implment eth_SendTransaction for any EVM compatible platform (Ganache is fine). The second one will be to implement a method to restore a Findora Wallet wallet from a Findora private key.

#### Task 1: Please add following functionality to the `evm` API:

- Implement `eth_sendTransaction` method

#### Task 2: Please add following functionality to the `sdk` API:

- Implement `restore a wallet from a private key` method

Please take a look at `src\api\evm.ts` and `src\api\evm.spec.ts`. Those files contain skeleton implementation with some relavent code.

## Prerequisites

### Packages to be installed on a global level

1. Install [Node.js](https://nodejs.org/en/download/) (version >=v15.13.0 );
2. Install **yarn** package management tool globally;

```bash
$ npm install -g yarn
```

### Project dependencies installation

In the project directory, execute the following command:

```bash
$ yarn install
```

## Environment preparation

### Configure nodes connections

You would need to connect to `Ethereum node` and `Findora node`. The easiest way for `Ethereum node` would, probably, to use a locally running [Ganache](https://trufflesuite.com/ganache/) instance, and for `Findora node` the easiest solution would be to use [Findora Anvil](https://prod-testnet.prod.findora.org).

Once you decide which URLs you would be connecting to, please update your environment configuration file and set those two values. Please note, following is just an example, you are free to use your own values, just please make sure you can connect to those nodes.

```
FINDORA_URL = 'https://prod-testnet.prod.findora.org'
EVM_URL = 'http://localhost:8545'
```

The environment configuration file is called `.env` and could be created by renaming `.env.example` and updating the values accodingly.

### Accounts configuration

Some API methods required account addresses to be provided (i.e. check the balance for ETH address or send an FRA transfer).

Those addresses should be also configured in `.env` file

```
ETH_ADDRESS='0x4XXX'
FRA_MNEMONIC_STRING="smoke XX XX XX"
```

You will recieve a `FRA_MNEMONIC_STRING` separately, so you can use it. That mnemonic phrase will allow to restore an FRA account, which would have some FRA tokens on `Findora Anvil`, so you would be able to test FRA transfer for example, or test `getFraBalance`.

As per `ETH_ADDRESS` - here you can use any ETH address from your `Ethereum node` (like `Ganache`).

### Start the development environment

For the purpose of developing new features, testing the changes, as well as the TS compilation, project has a **sandbox** file, which you can modify and save, and after that the source code would be re-compiled and executed.

To do so, first, in the project root directory execute this command, and wait for the console log output to appear.

```bash

$ yarn start

```

Then, modify `src/run.ts` file, and save it, so the code would be re-compiled, executed and re-rendered in the output.

### Testing

For the sake of consistency, all the tests should be created with `.spec.ts` extension, at the same level, where the tested file is located.

For example, for `src/services/utils.ts` the test file should be named as `src/services/utils.spec.ts`.

To run the tests, in the project root directory execute this command, and wait for the console log output to appear.

```bash

$ yarn test

```

### Code quality

With the idea of following good practices and standards, code should be **linted** and cleaned-up before being commited. The project is configured to use **eslint** and **prettier** for this purpose.

To run the linting, in the project root directory execute this command, and wait for the console log output to appear.

```bash

$ yarn lint

```

### Typing with \*.d.ts

The project is configured in such as way, so there is no need to manually create types. After running **build** command, all the types are generated automatiacally, based on _.ts_ files annotations.

## Build

Execute the following commands in the project directory to build resources for execution in the production environment.

```bash

$ yarn build

```

> Compiled bundles as well as the exported types, would be located in **"root directory/dist"**
