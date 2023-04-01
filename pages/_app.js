import '../styles/globals.css'
import { ThemeProvider } from 'next-themes'
import Aos from 'aos';
import "aos/dist/aos.css";
import { useEffect } from 'react';
import { getDefaultWallets, RainbowKitProvider, ConnectButton } from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig, useAccount } from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { Chain, mainnet, polygon , polygonMumbai , sepolia} from 'wagmi/chains';


const { provider, chains } = configureChains(
  [sepolia, polygonMumbai, mainnet],
  [
    jsonRpcProvider({
      rpc: chain => ({ http: 'https://polygon-mumbai.g.alchemy.com/v2/shuTYtsoNXogQJNqZg-bhN4ReOXFiND4' }),
    }),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  jsonRpcUrl: 'https://polygon-mumbai.g.alchemy.com/v2/shuTYtsoNXogQJNqZg-bhN4ReOXFiND4',
  chains
});

const wagmiClient = createClient({
  autoConnect: false,
  connectors,
  provider
});


export default function App({ Component, pageProps }) {

  useEffect(() => {
    Aos.init({ duration : 1500,
               offset: 100,
               delay : 100})
  }, []);
  
  return (
   
    <div>
    <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains}>
  <Component {...pageProps} />
  </RainbowKitProvider>
      </WagmiConfig>
  </div>
  
  )
}
