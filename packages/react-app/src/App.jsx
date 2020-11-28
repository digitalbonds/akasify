import React, { useCallback, useEffect, useState, Suspense, Fragment } from "react";
import { Switch, Route, BrowserRouter } from 'react-router-dom'
import "antd/dist/antd.css";
import { getDefaultProvider, InfuraProvider, JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import "./App.less";
import { Menu, Layout } from 'antd';
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useUserAddress } from "eth-hooks";
import { useExchangePrice, useGasPrice, useUserProvider, useContractLoader, useContractReader, useBalance, useEventListener } from "./hooks";
import { HeaderComponent, Account, Faucet, Ramp, Contract, GasGauge, Address } from "./components";
import { Transactor } from "./helpers";
import { parseEther, formatEther } from "@ethersproject/units";
//import Hints from "./Hints";
import { Hints, ExampleUI, Subgraph } from "./views"

import { ReactComponent as Logo } from './assets/vectors/akasify_icon.svg';
import CallbackScreen from './screens/CallbackScreen'
import RegisterScreen from './screens/RegisterScreen'
import RegisterSucessScreen from './screens/RegisterSucessScreen'
import HomeScreen from './screens/HomeScreen'
import OpportunityScreen from './screens/OpportunityScreen'
import OpportunityDetailScreen from './screens/OpportunityDetailScreen'
import OpportunityEditScreen from './screens/OpportunityEditScreen'
import OrganizationScreen from './screens/OrganizationScreen'
import ProfileScreen from './screens/ProfileScreen'
import BeneficiaryScreen from './screens/BeneficiaryScreen'
import AdminScreen from './screens/AdminScreen'
import ProfileDrawer from './components/ProfileDrawer'
import '../../../packages/react-app/src/i18n'
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
import { INFURA_ID, ETHERSCAN_KEY } from "./constants";
const { Footer } = Layout;

const DEBUG = false

// 🔭 block explorer URL
const blockExplorer = "https://etherscan.io/" // for xdai: "https://blockscout.com/poa/xdai/"

// 🛰 providers
if(DEBUG) console.log("📡 Connecting to Mainnet Ethereum");
//const mainnetProvider = getDefaultProvider("mainnet", { infura: INFURA_ID, etherscan: ETHERSCAN_KEY, quorum: 1 });
// const mainnetProvider = new InfuraProvider("mainnet",INFURA_ID);
const mainnetProvider = new JsonRpcProvider("https://mainnet.infura.io/v3/"+INFURA_ID)
// ( ⚠️ Getting "failed to meet quorum" errors? Check your INFURA_ID)

// 🏠 Your local provider is usually pointed at your local blockchain
const localProviderUrl = "http://localhost:8545"; // for xdai: https://dai.poa.network
// as you deploy to other networks you can set REACT_APP_PROVIDER=https://dai.poa.network in packages/react-app/.env
const localProviderUrlFromEnv = process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : localProviderUrl;
if(DEBUG) console.log("🏠 Connecting to provider:", localProviderUrlFromEnv);
const localProvider = new JsonRpcProvider(localProviderUrlFromEnv);



function App(props) {
  const [injectedProvider, setInjectedProvider] = useState();
  
  const [showProfileDrawer, setShowProfileDrawer] = useState(false);
  /* 💵 this hook will get the price of ETH from 🦄 Uniswap: */
  const price = useExchangePrice(mainnetProvider); //1 for xdai

  /* 🔥 this hook will get the price of Gas from ⛽️ EtherGasStation */
  const gasPrice = useGasPrice("fast"); //1000000000 for xdai

  // For more hooks, check out 🔗eth-hooks at: https://www.npmjs.com/package/eth-hooks

  // Use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet.
  const userProvider = useUserProvider(injectedProvider, localProvider);
  const address = useUserAddress(userProvider);

  // The transactor wraps transactions and provides notificiations
  const tx = Transactor(userProvider, gasPrice)

  // 🏗 scaffold-eth is full of handy hooks like this one to get your balance:
  const yourLocalBalance = useBalance(localProvider, address);
  if(DEBUG) console.log("💵 yourLocalBalance",yourLocalBalance?formatEther(yourLocalBalance):"...")

  // just plug in different 🛰 providers to get your balance on different chains:
  const yourMainnetBalance = useBalance(mainnetProvider, address);
  if(DEBUG) console.log("💵 yourMainnetBalance",yourMainnetBalance?formatEther(yourMainnetBalance):"...")

  // Load in your local 📝 contract and read a value from it:
  const readContracts = useContractLoader(localProvider)
  if(DEBUG) console.log("📝 readContracts",readContracts)

  // Get the role to manage access control
  const role = useContractReader(readContracts, 'AkasifyCoreContract', "getRole", [address]);
  //console.log("user role: ", role);
  //console.log("user role: ", role);

  // If you want to make 🔐 write transactions to your contracts, use the userProvider:
  const writeContracts = useContractLoader(userProvider)
  if(DEBUG) console.log("🔐 writeContracts",writeContracts)


  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect();
    setInjectedProvider(new Web3Provider(provider));
  }, [setInjectedProvider]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
  }, [loadWeb3Modal]);

  const [route, setRoute] = useState();
  useEffect(() => {
    setRoute(window.location.pathname)
  }, [ window.location.pathname ]);

  return (
    <Suspense fallback={null}>
      <Fragment>
        <BrowserRouter>
          <Layout style={{ minHeight: '100vh' }}>
            <HeaderComponent role={role} handleProfileDrawer={() => setShowProfileDrawer(true)} />     
            <ProfileDrawer
              data-testid='profile-drawer'
              show={showProfileDrawer}
              handleOnClose={() => setShowProfileDrawer(false)}
              address={address}
              localProvider={localProvider}
              userProvider={userProvider}
              mainnetProvider={mainnetProvider}
              price={price}
              role={role}
              web3Modal={web3Modal}
              loadWeb3Modal={loadWeb3Modal}
              logoutOfWeb3Modal={logoutOfWeb3Modal}
            />
            <Switch>
              <Route path='/opportunityedit:id' render={() => <OpportunityEditScreen address={address} gasPrice={gasPrice} userProvider={userProvider} localProvider={localProvider} mainnetProvider={mainnetProvider} tx={tx} />}/>
              <Route path='/opportunity:id' render={() => <OpportunityDetailScreen address={address} gasPrice={gasPrice} userProvider={userProvider} localProvider={localProvider} mainnetProvider={mainnetProvider} tx={tx} role={role} />}/>
              <Route path='/opportunity' render={() => <OpportunityScreen address={address} gasPrice={gasPrice} userProvider={userProvider} localProvider={localProvider} mainnetProvider={mainnetProvider} tx={tx} role={role} />}/>
              <Route path='/organization:id' component={OpportunityDetailScreen} />
              <Route path='/organization' component={OrganizationScreen} />              
              <Route path='/profile' component={ProfileScreen} />
              <Route path='/register' render={() => <RegisterScreen address={address} gasPrice={gasPrice} userProvider={userProvider} localProvider={localProvider} mainnetProvider={mainnetProvider} tx={tx} />}/>
              <Route path='/sucess' render={() => <RegisterSucessScreen />}/>
              <Route path='/admin' render={() => <AdminScreen address={address} gasPrice={gasPrice} userProvider={userProvider} localProvider={localProvider} mainnetProvider={mainnetProvider} tx={tx} />}/>
              {/* <Route exact path='/callback' render={() => <HomeScreen localProvider={localProvider} mainnetProvider={mainnetProvider} price={price} />}/> */}
              <Route path={'/callback'} render={routeProps => <CallbackScreen {...routeProps} />} />
              <Route exact path='/' render={() => <HomeScreen localProvider={localProvider} mainnetProvider={mainnetProvider} price={price} />}/>
              
              <Footer className='footer'>© 2020 Created by Digital Bonds</Footer>
            </Switch>
          </Layout>
        </BrowserRouter>
      </Fragment>
    </Suspense>
  );
}


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
  setTimeout(() => {
    window.location.reload();
  }, 1);
};

export default App;
