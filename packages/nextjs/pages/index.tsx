import { useState } from "react";
import Head from "next/head";
import type { NextPage } from "next";
import QRCode from "react-qr-code";
import { useAccount, useBalance } from "wagmi";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import { Modal } from "~~/components/scaffold-eth/Modal";
import { TokenBalance } from "~~/components/scaffold-eth/TokenBalance";
import { useAutoConnect, useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import scaffoldConfig from "~~/scaffold.config";

const Home: NextPage = () => {
  useAutoConnect();

  const { address, isConnected } = useAccount();
  const { data: balance } = useScaffoldContractRead({
    contractName: "YourContract",
    functionName: "balanceOf",
    args: [address],
  });

  const { data: ethBalance } = useBalance({
    address: address,
  });

  console.log("ethBalance", ethBalance);

  const [selectedAsset, setSelectedAsset] = useState("");

  return (
    <>
      <Head>
        <title>Scaffold-eth App</title>
        <meta name="description" content="Created with 🏗 scaffold-eth" />
      </Head>

      <div className="flex flex-col items-center justify-center mt-8 py-2">
        <div className="card w-96 bg-base-100 shadow-xl p-8">
          <figure>
            <img src="https://edcon.io/_nuxt/img/edcon-banner.80a1b17.png" alt="EDCON WALLET" />
          </figure>
          <h2 className="card-title opacity-10 justify-center">EVENT WALLET PROTOTYPE</h2>
          <div className="card-body">
            {!isConnected ? (
              <div className="flex flex-col items-center justify-center my-16">
                <span className="animate-bounce text-8xl">{scaffoldConfig.tokenEmoji}</span>
              </div>
            ) : (
              <>
                <div className="flex mb-8">
                  <Address address={address} />
                </div>
                <div className={selectedAsset ? "" : "grid grid-cols-2 gap-4"}>
                  <TokenBalance
                    amount={balance}
                    emoji="💎"
                    name={"gems"}
                    selected={selectedAsset}
                    setSelected={setSelectedAsset}
                  />
                  <TokenBalance emoji="💊" name={"pills"} selected={selectedAsset} setSelected={setSelectedAsset} />
                  <TokenBalance emoji="🛢" name={"oil"} selected={selectedAsset} setSelected={setSelectedAsset} />
                  <TokenBalance emoji="🪵" name={"wood"} selected={selectedAsset} setSelected={setSelectedAsset} />
                  <TokenBalance emoji="🥩" name={"food"} selected={selectedAsset} setSelected={setSelectedAsset} />
                  <TokenBalance emoji="🔥" name={"fire"} selected={selectedAsset} setSelected={setSelectedAsset} />
                </div>

                <div className="card-actions block">
                  <Modal
                    id="receive"
                    button={
                      <label htmlFor={"receive"} className={`btn btn-neutral w-full mt-4`}>
                        <ArrowDownTrayIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                        Receive
                      </label>
                    }
                    content={
                      <div className="flex flex-col items-center justify-center p-8">
                        {address && (
                          <QRCode
                            size={256}
                            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                            value={address}
                            viewBox={`0 0 256 256`}
                          />
                        )}
                        <div className="mt-4">
                          <Address address={address} />
                        </div>
                      </div>
                    }
                  />
                </div>
              </>
            )}
          </div>
          <div className="flex justify-center opacity-60 mt-5">⛽️ {parseFloat(ethBalance?.formatted).toFixed(3)}</div>
        </div>
      </div>
    </>
  );
};

export default Home;
