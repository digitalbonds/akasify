import React, { useCallback, useEffect, useState, Image, Suspense } from 'react'
import { Switch, Route, BrowserRouter } from 'react-router-dom'
import 'antd/dist/antd.css'
import { getDefaultProvider, InfuraProvider, JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import './App.less';
import { Row, Col, Button, Layout } from 'antd'
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useUserAddress, useBalance } from "eth-hooks";
import { useExchangePrice, useGasPrice, useUserProvider } from './hooks'
import { HeaderComponent, Account, Faucet, Ramp, Contract, GasGauge } from './components'
import Hints from './Hints'
import HomeScreen from './screens/HomeScreen'
import './i18n'

/*
    Welcome to 🏗 scaffold-eth !

    Code:
    https://github.com/austintgriffith/scaffold-eth

    Support:
    https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA
    or DM @austingriffith on twitter or telegram

    You should get your own Infura.io ID and put it in `constants.js`
    (this is your connection to the main Ethereum network for ENS etc.)
*/
import { INFURA_ID, ETHERSCAN_KEY } from './constants'

const { Footer } = Layout

// 🛰 providers
console.log("📡 Connecting to mainnet")
// ⚠️ Getting "failed to meet quorum" errors? Check your INFURA_ID:
const mainnetProvider = getDefaultProvider("mainnet", { infura: INFURA_ID, etherscan: ETHERSCAN_KEY , quorum: 1 });
//const mainnetProvider = new InfuraProvider("mainnet",INFURA_ID);
//const mainnetProvider = new JsonRpcProvider("https://mainnet.infura.io/v3/5ce0898319eb4f5c9d4c982c8f78392a")

const localProviderUrl = process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : "http://localhost:8545"
console.log("📡 Connecting to",localProviderUrl)
const localProvider = new JsonRpcProvider(localProviderUrl);

/*
  Web3 modal helps us "connect" external wallets:
*/
const web3Modal = new Web3Modal({
  // network: "mainnet", // optional
  cacheProvider: true, // optional
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        infuraId: INFURA_ID,
      },
    },
  },
});

const logoutOfWeb3Modal = async () => {
  await web3Modal.clearCachedProvider();
  // console.log("Cleared cache provider!?!",clear)
  setTimeout(() => {
    window.location.reload();
  }, 1);
};

function App() {
  const [injectedProvider, setInjectedProvider] = useState();
  /* 💵 this hook will get the price of ETH from 🦄 Uniswap:*/
  const price = useExchangePrice(mainnetProvider);

  /* ⛽️ this hook will get the price of ETH from 🦄 Uniswap */
  const gasPrice = useGasPrice("fast");

  // For more hooks, check out 🔗eth-hooks at: https://www.npmjs.com/package/eth-hooks

  // Use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet.
  const userProvider = useUserProvider(injectedProvider, localProvider);
  const address = useUserAddress(userProvider);

  // 🏗 scaffold-eth is full of handy hooks like this one to get your balance:
  const yourLocalBalance = useBalance(localProvider, address);
  // just plug in different 🛰 providers to get your balance on different chains:
  // const yourMainnetBalance = useBalance(mainnetProvider, address);

  // Load in your local 📝 contract and read a value from it:
  // const readContracts = useContractLoader(localProvider)
  // console.log("readContracts",readContracts)
  // const owner = useCustomContractReader(readContracts?readContracts['YourContract']:"", "owner")

  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect();
    setInjectedProvider(new Web3Provider(provider));
  }, [setInjectedProvider]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
  }, [loadWeb3Modal]);

  console.log("localProvider",localProvider)

  return (
    <Suspense fallback={null}>
      <BrowserRouter>
        <Layout style={{ minHeight: '100vh' }}>
          <HeaderComponent />
          <div style={{ position: 'fixed', textAlign: 'right', right: 0, top: 0, padding: 10 }}>
            <Account
              address={address}
              localProvider={localProvider}
              userProvider={userProvider}
              mainnetProvider={mainnetProvider}
              price={price}
              web3Modal={web3Modal}
              loadWeb3Modal={loadWeb3Modal}
              logoutOfWeb3Modal={logoutOfWeb3Modal}
            />
          </div>
          <Switch>
            <Route exact path='/' component={HomeScreen} />
            <Footer className='footer'>© 2020 Created by Digital Bonds</Footer>
          </Switch>
        </Layout>
      </BrowserRouter>
    </Suspense>
  );
}

export default App;
