import { ChakraProvider, Container } from "@chakra-ui/react"
import {
  connectorsForWallets,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit"
import {
  coinbaseWallet,
  metaMaskWallet,
  trustWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets"
import { Provider, WebSocketProvider } from "@wagmi/core"
import type { AppProps } from "next/app"
import { Client, configureChains, createClient, WagmiConfig } from "wagmi"

//import { Inter } from "@next/font/google"
import { useEffect, useState } from "react"
import { foundry, polygonMumbai } from "wagmi/chains"
import { alchemyProvider } from "wagmi/providers/alchemy"
import { publicProvider } from "wagmi/providers/public"
import { Header } from "../components/Header"
import { theme } from "../theme"
import { SessionProvider } from "next-auth/react"
//const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
import "@rainbow-me/rainbowkit/styles.css"
import "react-datepicker/dist/react-datepicker.css"

const { chains, provider } = configureChains(
  [polygonMumbai, foundry],
  [
    alchemyProvider({
      apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY as string,
    }),
    publicProvider(),
  ]
)
export default function App({ Component, pageProps }: AppProps) {
  const [client, setClient] = useState<
    any & Client<Provider, WebSocketProvider>
  >()

  useEffect(() => {
    const connectors = connectorsForWallets([
      {
        groupName: "Wallets",
        wallets: [
          metaMaskWallet({ chains }),
          walletConnectWallet({ chains }),
          trustWallet({ chains }),
          coinbaseWallet({ appName: "@app", chains: chains }),
        ],
      },
    ])

    const wagmiClient = createClient({
      autoConnect: false,
      connectors,
      provider,
    })
    setClient(wagmiClient)
  }, [])

  return (
    <ChakraProvider theme={theme}>
      <SessionProvider session={pageProps.session}>
        {client && (
          <WagmiConfig client={client}>
            <RainbowKitProvider chains={chains}>
              <Container maxW="container.lg" my={1}>
                <Header />
                <Component {...pageProps} />
              </Container>
            </RainbowKitProvider>
          </WagmiConfig>
        )}
      </SessionProvider>
    </ChakraProvider>
  )
}
