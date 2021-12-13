# Deploying an Ethereum smart contract with React

This repo is almost exactly based on a project developed by [Buildspace](https://buildspace.so/) team. 

If you'd like to do it yourself, please take a look at <b>Build a Web3 App with Solidity + Ethereum Smart Contracts</b> which is developed by the Buildspace team. It allows you to write a smart contract with very little prior knowledge about blockchain.

This project is reliant on another [repo](https://github.com/ROZBEH/ethereum-smart-contract) for the ethereum smart contract part.


## Contract deployed, now what?

In our previous [repo](https://github.com/ROZBEH/ethereum-smart-contract) we deployed the ethereum smart contract to the ethereum blockchain network. Yes we wrote the contract, yes we deployed the contract to the ethereum test network. Now it's time to use the contract in an application. In order to do so, we need to put together the front-end pieces.



## Set up

- Start setting up the environment by running `npm install`

- Requirements. Please install `react-loader-spinner` and `ethers` by running `npm install --save package_name`.

- Before running the script, we have to provide contract information to our React front-end app. 

- Inside `App.js` we provide the contract address with 

```
const contractAddress = "0xaC0067a300b1C115C7334c988878Da343181a086"
```

- We also need to provide contract ABI. Once we deploy our smart contract like [here](https://github.com/ROZBEH/ethereum-smart-contract), it will generate an ABI file for us. We need to pass this ABI file to our front-end app. In the case of this example the ABI file is saved inside `utils` folder and then imported inside `App.js`

- Finally, its time to run the app. `npm start`

Happy writing a smart contract! This was my first time writing a smart contract and I was genuinely happy and surprised by what I learned. I hope you feel the same way. 