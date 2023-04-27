import { useEffect, useState } from "react";
import Head from "next/head";
import type { NextPage } from "next";
import QrScanner from "qr-scanner";
import QRCode from "react-qr-code";
import { useAccount, useBalance } from "wagmi";
import { ArrowDownTrayIcon, QrCodeIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import { Modal } from "~~/components/scaffold-eth/Modal";
import { NFTBalance } from "~~/components/scaffold-eth/NFTBalance";
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

  const assets = [
    {
      name: "gems",
      emoji: "💎",
    },
  ];

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
          {
            //list all assets using a mapping and a token balance component
            assets.map((asset, i) => {
              return (
                <TokenBalance
                  key={i}
                  amount={balance}
                  emoji={asset.emoji}
                  name={asset.name}
                  selected={selectedAsset}
                  setSelected={setSelectedAsset}
                  scannedToAddress={scannedToAddress}
                  openScanner={openScanner}
                />
              );
            })
          }
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
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 611 118" class="css-112afnt">
              <path
                d="M83.7901 48.3109V2.30067C83.7901 1.42444 83.0797 0.714111 82.2035 0.714111C81.3273 0.714111 80.6169 1.42444 80.6169 2.30067V48.3109C80.6169 49.1871 81.3273 49.8975 82.2035 49.8975C83.0797 49.8975 83.7901 49.1871 83.7901 48.3109Z"
                fill="#629FFC"
              ></path>
              <path
                d="M67.1134 92.7348L53.6462 67.4931V44.5391H62.1702V56.0161H74.5476V44.5391H82.5267V92.5022L67.1134 92.7348Z"
                fill="#629FFC"
              ></path>
              <path
                d="M97.8626 92.7348L111.33 67.4931V44.5391H102.767V56.0161H90.4284V44.5391H82.4492V92.5022L97.8626 92.7348Z"
                fill="#A9CBFF"
              ></path>
              <path
                d="M82.5266 3.16309C85.8739 3.16309 89.2213 9.67707 93.1135 10.6464C97.0058 11.6158 98.8351 8.47509 104.362 9.09547C109.305 9.67707 108.838 16.4237 117.245 17.0441C114.171 19.2154 109.967 22.201 103.428 21.6194C98.4848 21.1929 97.0836 17.9359 91.4788 19.0991C85.8739 20.2235 84.6284 23.7519 82.5655 24.3335C82.5266 13.7483 82.5266 3.16309 82.5266 3.16309Z"
                fill="#629FFC"
              ></path>
              <path
                d="M39.5456 76.7457L13.2323 69.0332V68.1259L39.5456 60.4134V53.0033L5.8223 63.3623V73.7968L39.5456 84.1558V76.7457ZM275.158 93.5318C280.829 93.5318 284.156 90.5829 285.82 86.7266H286.651V92.7756H294.818V38.3345H286.425V60.489H285.593C283.854 56.8596 280.602 54.1375 275.007 54.1375H274.78C266.69 54.1375 261.548 60.7158 261.548 71.8309V76.0652C261.548 87.2559 266.463 93.5318 275.007 93.5318H275.158ZM277.729 85.7437C272.436 85.7437 269.865 82.1899 269.865 75.5359V72.1334C269.865 65.4794 272.436 61.9256 277.729 61.9256H278.032C283.551 61.9256 286.425 65.5551 286.425 72.1334V75.5359C286.425 82.2655 283.551 85.7437 278.032 85.7437H277.729ZM327.075 85.3656C325.033 85.3656 324.58 84.7607 324.58 82.946V38.3345H302.727V45.7445H316.187V82.0386C316.187 88.3145 320.194 92.7756 326.999 92.7756H340.383V85.3656H327.075ZM496.178 93.5318C501.849 93.5318 505.176 90.5829 506.839 86.7266H507.671V92.7756H515.837V38.3345H507.444V60.489H506.612C504.873 56.8596 501.622 54.1375 496.027 54.1375H495.8C487.709 54.1375 482.568 60.7158 482.568 71.8309V76.0652C482.568 87.2559 487.482 93.5318 496.027 93.5318H496.178ZM498.749 85.7437C493.456 85.7437 490.885 82.1899 490.885 75.5359V72.1334C490.885 65.4794 493.456 61.9256 498.749 61.9256H499.051C504.571 61.9256 507.444 65.5551 507.444 72.1334V75.5359C507.444 82.2655 504.571 85.7437 499.051 85.7437H498.749ZM548.094 85.3656C546.053 85.3656 545.599 84.7607 545.599 82.946V38.3345H523.747V45.7445H537.206V82.0386C537.206 88.3145 541.214 92.7756 548.019 92.7756H561.402V85.3656H548.094ZM604.774 73.7968V63.3623L571.051 53.0033V60.4134L597.364 68.1259V69.0332L571.051 76.7457V84.1558L604.774 73.7968Z"
                fill="#629FFC"
              ></path>
              <path
                d="M155.628 65.7063C160.24 64.1184 162.811 60.7158 162.811 55.2717V54.6668C162.811 46.1982 157.14 41.2078 147.083 41.2078H130.071V92.7756H148.974C158.879 92.7756 164.701 87.7852 164.701 78.7873V78.258C164.701 71.7553 161.299 67.9747 155.628 66.6136V65.7063ZM147.235 48.9959C152.679 48.9959 154.493 50.8106 154.493 55.4986V55.801C154.493 60.7915 152.679 62.7574 147.235 62.7574H138.312V48.9959H147.235ZM156.384 77.8799C156.384 83.0216 154.493 84.9875 149.125 84.9875H138.312V70.4699H149.125C154.493 70.4699 156.384 72.4358 156.384 77.5019V77.8799ZM198.017 54.8937V76.5189C198.017 82.1142 194.992 85.7437 189.246 85.7437H188.943C184.86 85.7437 182.138 83.5509 182.138 78.1068V54.8937H173.745V78.7873C173.745 88.3145 178.811 93.5318 186.297 93.5318H186.599C191.741 93.5318 195.446 91.1122 197.185 87.1803H198.017V92.7756H206.41V54.8937H198.017ZM230.576 37.0491V48.1641H242.221V37.0491H230.576ZM242.977 85.3656C241.011 85.3656 240.557 84.7607 240.557 82.946V54.8937H218.554V62.3793H232.164V82.0386C232.164 88.3145 236.172 92.7756 242.977 92.7756H254.243V85.3656H242.977ZM376.269 74.4017V74.6286C376.269 83.2484 372.564 85.9705 366.969 85.9705H366.591C360.39 85.9705 357.517 83.2484 357.517 74.6286V59.3548C357.517 50.735 360.39 48.0129 366.742 48.0129H367.12C373.396 48.0129 376.269 50.735 376.269 59.3548H384.662C384.662 46.7275 377.403 40.4516 367.12 40.4516H366.742C356.383 40.4516 349.124 46.7275 349.124 59.3548V74.6286C349.124 87.2559 355.249 93.5318 364.549 93.5318H364.927C370.825 93.5318 374.152 91.339 375.967 86.8022H376.798V92.7756H384.662V66.6892H367.876V74.4017H376.269ZM419.036 54.8937V76.5189C419.036 82.1142 416.012 85.7437 410.265 85.7437H409.963C405.88 85.7437 403.158 83.5509 403.158 78.1068V54.8937H394.765V78.7873C394.765 88.3145 399.831 93.5318 407.316 93.5318H407.619C412.761 93.5318 416.466 91.1122 418.205 87.1803H419.036V92.7756H427.429V54.8937H419.036ZM451.596 37.0491V48.1641H463.24V37.0491H451.596ZM463.996 85.3656C462.03 85.3656 461.577 84.7607 461.577 82.946V54.8937H439.573V62.3793H453.184V82.0386C453.184 88.3145 457.191 92.7756 463.996 92.7756H475.263V85.3656H463.996Z"
                fill="black"
              ></path>
            </svg>
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

          <NFTBalance address={address} scannedToAddress={scannedToAddress} openScanner={openScanner} />

          {ethBalance && parseFloat(ethBalance?.formatted) > 0 ? (
            <div className="flex justify-center opacity-60 mt-5">
              ⛽️ {parseFloat(ethBalance?.formatted).toFixed(3)}
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
