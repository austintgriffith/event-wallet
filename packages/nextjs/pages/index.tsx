import { useEffect, useState } from "react";
import Head from "next/head";
import type { NextPage } from "next";
import QrScanner from "qr-scanner";
import QRCode from "react-qr-code";
import { useAccount, useBalance } from "wagmi";
import { ArrowDownTrayIcon, QrCodeIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import { Modal } from "~~/components/scaffold-eth/Modal";
import { TokenBalance } from "~~/components/scaffold-eth/TokenBalance";
import { useAutoConnect, useScaffoldContractRead } from "~~/hooks/scaffold-eth";

interface IQrScanner {
  start: () => void;
  stop: () => void;
}

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

  const [selectedAsset, setSelectedAsset] = useState("");

  const [qrScanner, setQrScanner] = useState({});
  const [scanning, setScanning] = useState(false);
  const [scannedToAddress, setScannedToAddress] = useState("");

  const openScanner = () => {
    setScanning(true);
    qrScanner.start();
  };

  useEffect(() => {
    console.log("setup scanner...");
    const qrScannerObj: IQrScanner = new QrScanner(
      document.getElementById("qr-video")!,
      result => {
        setScanning(false);
        qrScannerObj.stop();
        console.log("REACT TO THIS SCAN IF IT ISNT JUST AN ADDRESS:", result);
        //if it is just an address, set this:
        setScannedToAddress(result.data);
        setSelectedAsset("gems"); // by default if nothing else take them to the gems send page
      },
      {
        /* your options or returnDetailedScanResult: true if you're not specifying any other options */
      },
    );
    setQrScanner(qrScannerObj);
  }, []);

  let displayed;
  if (!isConnected) {
    displayed = (
      <div className="flex flex-col items-center justify-center my-16">
        <span className="animate-bounce text-8xl">{"⚙️"}</span>
      </div>
    );
  } else if (scanning) {
    displayed = "";
  } else {
    displayed = (
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
            scannedToAddress={scannedToAddress}
            openScanner={openScanner}
          />
          <TokenBalance
            emoji="💊"
            name={"pills"}
            selected={selectedAsset}
            setSelected={setSelectedAsset}
            scannedToAddress={scannedToAddress}
            openScanner={openScanner}
          />
          <TokenBalance
            emoji="🛢"
            name={"oil"}
            selected={selectedAsset}
            setSelected={setSelectedAsset}
            scannedToAddress={scannedToAddress}
            openScanner={openScanner}
          />
          <TokenBalance
            emoji="🪵"
            name={"wood"}
            selected={selectedAsset}
            setSelected={setSelectedAsset}
            scannedToAddress={scannedToAddress}
            openScanner={openScanner}
          />
          <TokenBalance
            emoji="🥩"
            name={"food"}
            selected={selectedAsset}
            setSelected={setSelectedAsset}
            scannedToAddress={scannedToAddress}
            openScanner={openScanner}
          />
          <TokenBalance
            emoji="🔥"
            name={"fire"}
            selected={selectedAsset}
            setSelected={setSelectedAsset}
            scannedToAddress={scannedToAddress}
            openScanner={openScanner}
          />
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
            <div
              id="video-container"
              className="bg-primary w-full relative cursor-pointer overflow-hidden mt-8" //
              style={{ display: scanning ? "block" : "none" }}
              onClick={() => {
                setScanning(false);
                qrScanner.stop();
              }}
            >
              <div style={{ position: "absolute", transform: "scale(2)", top: 40, zIndex: 3 }}>
                <video id="qr-video"></video>
              </div>
              <div className="flex flex-col items-center justify-center my-16">
                <span className="animate-bounce text-8xl">{"⏳"}</span>
              </div>
            </div>
            {displayed}
          </div>
          {scanning ? (
            <button
              className="btn btn-secondary w-full mt-4"
              onClick={() => {
                setScanning(false);
                qrScanner.stop();
              }}
            >
              <XMarkIcon className="h-5 w-5 mr-2" aria-hidden="true" />
              CANCEL SCAN
            </button>
          ) : (
            <div style={{ position: "fixed", bottom: 25, right: 15, transform: "scale(2.5)" }}>
              <button
                className="btn btn-primary w-full mt-4"
                onClick={() => {
                  openScanner();
                }}
              >
                <QrCodeIcon className="h-5 w-5 mr-2" aria-hidden="true" />
              </button>
            </div>
          )}

          <div className="flex justify-center opacity-60 mt-5">⛽️ {parseFloat(ethBalance?.formatted).toFixed(3)}</div>
        </div>
      </div>
    </>
  );
};

export default Home;
