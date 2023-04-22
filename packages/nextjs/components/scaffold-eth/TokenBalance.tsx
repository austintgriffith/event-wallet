import { useEffect, useState } from "react";
import { AddressInput, InputBase } from ".";
import { BigNumber, ethers } from "ethers";
import { PaperAirplaneIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

type TTokenBalanceProps = {
  amount?: BigNumber;
  emoji?: string;
  name?: string;
  selected?: string;
  setSelected?: (asset: string) => void;
};

/**
 * Display Balance of token
 */
export const TokenBalance = ({
  amount,
  emoji,
  name,
  selected,
  setSelected,
  scannedToAddress,
  openScanner,
}: TTokenBalanceProps) => {
  const [toAddress, setToAddress] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  const { writeAsync: transfer, isMining } = useScaffoldContractWrite({
    contractName: "YourContract",
    functionName: "transfer",
    args: [toAddress, ethers.utils.parseEther(sendAmount || "0")],
  });

  useEffect(() => {
    if (scannedToAddress) {
      console.log("SETTING!!!!!", scannedToAddress);
      setToAddress(scannedToAddress);
    }
  }, [scannedToAddress]);

  console.log("toAddress", toAddress);
  let displayed;
  if (!selected) {
    displayed = (
      <>
        <span className="countdown font-mono text-6xl ">
          <span style={{ "--value": amount && ethers.utils.formatEther(amount) }}></span>
        </span>
        <span className="text-8xl font-bold">{emoji}</span>
      </>
    );
  } else if (selected === name) {
    displayed = (
      <div className="artboard phone-1">
        <div className="flex flex-row">
          <span className="countdown font-mono text-8xl">
            <span style={{ "--value": amount && ethers.utils.formatEther(amount) }}></span>
          </span>
          <span className="pl-16 text-9xl font-bold mr-1">{emoji}</span>
        </div>

        <div className="card w-full bg-white shadow-xl mt-6">
          <div className="card-body">
            <div>
              <AddressInput
                value={toAddress}
                onChange={v => {
                  console.log("UPDATEFROMTOADDRESS", v);
                  setToAddress(v);
                }}
                placeholder="To Address"
                suffix={<div>hi</div>}
                openScanner={openScanner}
              />
            </div>
            <div>
              <InputBase type="number" value={sendAmount} onChange={v => setSendAmount(v)} placeholder="Amount" />
            </div>
            <div className="card-actions">
              <button
                onClick={async () => {
                  await transfer();
                  setSendAmount("");
                  setSelected && setSelected("");
                }}
                className={`btn btn-primary w-full mt-4 ${isMining ? "loading" : ""}`}
              >
                <PaperAirplaneIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                Send
              </button>
            </div>
          </div>
        </div>
        <div
          className="card-actions justify-end"
          onClick={() => {
            setSelected && setSelected("");
          }}
        >
          <button className="btn btn-secondary w-full my-8">
            <XMarkIcon className="h-5 w-5 mr-2" aria-hidden="true" />
            cancel
          </button>
        </div>
      </div>
    );
  } else {
    return <></>;
  }

  return (
    <div className="w-full flex items-center justify-center">
      <div
        className={`flex flex-col p-2 bg-neutral rounded-box text-neutral-content cursor-pointer`}
        onClick={() => {
          if (selected) {
            if (selected === name) {
              //do nothing lol what a hack
            } else {
              setSelected && setSelected("");
            }
          } else {
            setSelected && setSelected(name || "");
          }
        }}
      >
        {displayed}
      </div>
    </div>
  );
};
