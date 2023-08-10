import React, { useState } from "react";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { bsc } from "wagmi/chains";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import WalletSection from "./components/WalletSection";
import HelpSection from "./components/HelpSection";
import AccountList from "./components/AccountList";
import NotificationDialog from "./components/NoticationDialog";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [bsc],
  [publicProvider()]
);

// create the Wagmi config, we are only supporting Metamask as of now
const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
  connectors: [
    new MetaMaskConnector({
      chains,
      options: {
        shimDisconnect: true,
      },
    }),
  ],
});

const App = () => {
  const [notificationText, setNotificationText] = useState(null);
  const [txnHash, setTxnHash] = useState(null);

  return (
    <>
      <WagmiConfig config={config}>
        <div className="container mx-auto h-screen w-screen text-white">
          <header className="container relative h-28">
            <ul className="menu menu-horizonal lg:menu-horizontal bg-base-200 rounded-box absolute top-10 right-0">
              <li>
                <HelpSection />
              </li>
              <li>
                <WalletSection />
              </li>
            </ul>
            <NotificationDialog text={notificationText} txnHash={txnHash} />
          </header>
          <AccountList setNotificationText={setNotificationText} setTxnHash={setTxnHash} />
        </div>
      </WagmiConfig>
    </>
  );
};

export default App;
