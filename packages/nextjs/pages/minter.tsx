import { useEffect, useState } from "react";
import Head from "next/head";
import { ethers } from "ethers";
import type { NextPage } from "next";
import QrScanner from "qr-scanner";
import { useAccount, useBalance, useSigner } from "wagmi";
import { Coin } from "~~/components/Coin";
import { Address } from "~~/components/scaffold-eth";
import { useAutoConnect, useDeployedContractInfo } from "~~/hooks/scaffold-eth";

interface IQrScanner {
  start: () => void;
  stop: () => void;
}

const Minter: NextPage = () => {
  useAutoConnect();

  const { address, isConnected } = useAccount();
  /*
  const { data: balance } = useScaffoldContractRead({
    contractName: "YourContract",
    functionName: "balanceOf",
    args: [address],
  });*/

  const { data: ethBalance } = useBalance({
    address: address,
  });

  const [scanning, setScanning] = useState(false);
  const [showSending, setShowSending] = useState("");

  const { data: yourMintableSoulboundCollectible } = useDeployedContractInfo("YourMintableSoulboundCollectible");

  const { data: signer } = useSigner();

  const doMint = async sendToAddress => {
    console.log("sendToAddress:", sendToAddress);
    setShowSending(sendToAddress);
    setTimeout(() => {
      setShowSending("");
      setAddressToMintTo("");
    }, 6000);

    console.log("yourMintableSoulboundCollectible", yourMintableSoulboundCollectible);
    const contractAddress = yourMintableSoulboundCollectible?.address;
    const contractABI = yourMintableSoulboundCollectible?.abi;

    const newContract = new ethers.Contract(
      contractAddress || "",
      contractABI || [],
      signer || ethers.getDefaultProvider(),
    );
    // call the mint function with the specified argument
    const mintResult = await newContract.mint(sendToAddress);

    console.log("mintResult", mintResult);
  };

  const [addressToMintTo, setAddressToMintTo] = useState("");

  //console.log("yourCollectibleContract", yourCollectibleContract);
  useEffect(() => {
    console.log("setup scanner...");
    const qrScannerObj: IQrScanner = new QrScanner(
      document.getElementById("qr-video")!,
      result => {
        console.log("SAVING ADDRESS ", result.data);
        setAddressToMintTo(result.data);
      },
      {
        /* your options or returnDetailedScanResult: true if you're not specifying any other options */
        preferredCamera: "user",
      },
    );
    qrScannerObj.start();
    setScanning(true);
  }, [setAddressToMintTo]);

  let displayed;
  if (!isConnected) {
    displayed = (
      <div className="flex flex-col items-center justify-center my-16">
        <span className="animate-bounce text-8xl">{"⚙️"}</span>
      </div>
    );
  } else if (showSending != "") {
    displayed = (
      <div
        style={{ position: "absolute", zIndex: 42 }}
        className="flex flex-col bg-primary items-center justify-center w-full h-full"
      >
        <h1>Sending to</h1>
        <Address address={showSending} />
        <span className="animate-bounce text-8xl">{"🛫"}</span>
      </div>
    );
  } else if (addressToMintTo) {
    displayed = (
      <div className="flex flex-col items-center justify-center my-16">
        <div className="p-4">
          <Address address={addressToMintTo} />
        </div>

        <button
          className="btn btn-primary"
          onClick={async () => {
            await doMint(addressToMintTo);
          }}
        >
          {`Mint NFT to ${addressToMintTo.substring(0, 12)}`}
        </button>
      </div>
    );
  }

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
            {displayed}
            <div>You found me!</div>
            <div>Show me your wallet QR to get this NFT:</div>
            <Coin image="https://ipfs.io/ipfs/QmPs8j7RwQrShNRF1ALW7TTYWpMsBepno7hpK3STxACmdG" />
            <div
              id="video-container"
              className="bg-primary w-full relative cursor-pointer overflow-hidden mt-8" //
              style={{ display: scanning ? "block" : "none" }}
              onClick={() => {
                //setScanning(false);
                //qrScanner.stop();
              }}
            >
              <div style={{ position: "absolute", transform: "scale(2)", top: 40, zIndex: 3 }}>
                <video id="qr-video"></video>
              </div>
              <div className="flex flex-col items-center justify-center my-16">
                <span className="animate-bounce text-8xl">{"⏳"}</span>
              </div>
            </div>
          </div>
          <div className="flex justify-center opacity-60 mt-5">
            <Address address={address} />
          </div>
          <div className="flex justify-center opacity-60 mt-5">⛽️ {parseFloat(ethBalance?.formatted).toFixed(3)}</div>
        </div>
      </div>
    </>
  );
};

export default Minter;
