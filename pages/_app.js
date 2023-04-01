import '../styles/globals.css'
import { ThemeProvider } from 'next-themes'
import Aos from 'aos';
import "aos/dist/aos.css";
import { useEffect } from 'react';
import { getDefaultWallets, RainbowKitProvider, ConnectButton } from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig, useAccount } from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { Chain, mainnet, goerli} from 'wagmi/chains';


const { provider, chains } = configureChains(
  [goerli, mainnet],
  [
    jsonRpcProvider({
      rpc: chain => ({ http: 'https://eth-goerli.g.alchemy.com/v2/bYwv6lWEDB1KoLyivwgn_7YhZNSOkCRy' }),
    }),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "Baggies",
  jsonRpcUrl: 'https://eth-goerli.g.alchemy.com/v2/bYwv6lWEDB1KoLyivwgn_7YhZNSOkCRy',
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
