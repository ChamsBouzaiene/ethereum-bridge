## Description

This tool enables any non-public blockchain instance to interact with the Public Blockchain

_Please note that at this point this tool is still **experimental** and subject to change without notice and still under developpment._

### Requirements

- node version **>= 5.0.0** (& npm)

#### Note

(on Ubuntu)

run `sudo apt-get install build-essential -y`

You should run the following commands from within the ethereum-bridge folder.

### Install

via git

```
git clone https://github.com/alchemist107/ethereum-bridge
cd ethereum-bridge
npm install
```

### How to use

You have 2 options:

- [active mode](#active-mode)
- [broadcast mode](#broadcast-mode)

After you have correctly deployed the smart contracts

#### Broadcast Server

Express Server that Brodcast on Port 8008

#### Add a custom address or smart contract

**Note:** The address chosen will be used to deploy all the Oraclize contracts, **make sure to not deploy contracts that use Oraclize on the same address.**

### How to update the bridge

If a new version is detected you can run `npm run update` to automatically donwload and install the latest version from github.
