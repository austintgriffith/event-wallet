import { useEffect, useState } from "react";
import ReactCardFlip from "react-card-flip";
import Tilt from "react-parallax-tilt";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

type TNFTBalanceProps = {
  scannedToAddress?: string;
  openScanner?: () => void;
  address: string;
};

interface ICollectible {
  name: string;
  description: string;
  image: string;
  id: number;
  isFlipped: boolean;
  external_url: string;
  drawing: string;
  attributes: any[];
}

/**
 * Display Balance of token
 */
export const NFTBalance = ({ address }: TNFTBalanceProps) => {
  const { data: balance } = useScaffoldContractRead({
    contractName: "YourMintableSoulboundCollectible",
    functionName: "balanceOf",
    args: [address],
  });

  const { data: allCollectibles } = useScaffoldContractRead({
    contractName: "YourMintableSoulboundCollectible",
    functionName: "getAllCollectibles",
    args: [address],
  });

  const [loadedCollectibles, setLoadedCollectibles] = useState<ICollectible[]>([]);

  const handleFlip = (id: any) => {
    setLoadedCollectibles(prevState => {
      return prevState.map((val: any) => {
        return val.id === id ? { ...val, isFlipped: !val.isFlipped } : val;
      });
    });
  };
  useEffect(() => {
    const loadCollectibles = async () => {
      const collectibles = [];
      if (allCollectibles) {
        //allCollectibles
        for (let i = 0; i < allCollectibles.length; i++) {
          const collectible = await fetch(allCollectibles[i]);
          const collectibleJson = await collectible.json();
          collectibles.push({ ...collectibleJson, id: i, isFlipped: false });
        }
        setLoadedCollectibles(collectibles);
      }
    };

    loadCollectibles();
  }, [allCollectibles]);

  console.log("balance", balance);
  console.log("allCollectibles", allCollectibles);

  //const { data: yourMintableSoulboundCollectibleData } = useDeployedContractInfo("YourMintableSoulboundCollectible");

  const renderedCollectibles = loadedCollectibles?.map((collectible: any, index) => {
    console.log("collectible", collectible);
    return (
      <Tilt key={index} scale={1.1} perspective={400}>
        <ReactCardFlip isFlipped={collectible.isFlipped} flipDirection="horizontal">
          <div key={index} onClick={() => handleFlip(index)} className="flex flex-col items-center justify-center">
            <img src={collectible.image} alt={collectible.name} />
            <div className="text-center">
              <div className="text-sm font-bold">{collectible.name}</div>
            </div>
          </div>

          <div
            key={index}
            onClick={() => handleFlip(index)}
            className="flex hover:cursor-pointer flex-col items-center justify-center"
          >
            <div className="text-center p-2">
              <div className="text-sm  font-bold">{collectible.description}</div>
            </div>
          </div>
        </ReactCardFlip>
      </Tilt>
    );
  });

  /*
  const [allCollectibles, setAllCollectibles] = useState([]);

  const provider = useProvider();

  

  useEffect(() => {
    const getAllCollectibles = async () => {
      const contractAddress = yourMintableSoulboundCollectibleData?.address;
      const contractABI = yourMintableSoulboundCollectibleData?.abi;

      console.log("contractAddress", contractAddress);
      console.log("contractABI", contractABI);
      console.log("provider", provider);

      const yourMintableSoulboundCollectibleContract = new ethers.Contract(
        contractAddress || "",
        contractABI || [],
        provider || ethers.getDefaultProvider(),
      );

      if (
        yourMintableSoulboundCollectibleContract &&
        yourMintableSoulboundCollectibleContract.balanceOf &&
        typeof yourMintableSoulboundCollectibleContract.balanceOf === "function"
      ) {
        console.log("the contract:", yourMintableSoulboundCollectibleContract);
        // call the mint function with the specified argument
        const yourBalance = await yourMintableSoulboundCollectibleContract.balanceOf([address]);
        console.log("yourBalance", yourBalance);

        const allCollectibles = [];
        for (let i = 0; i < yourBalance; i++) {
          console.log("iteration", i);
          const tokenId = await yourMintableSoulboundCollectibleContract.tokenOfOwnerByIndex(address, i);
          console.log("tokenId", tokenId);
          const tokenURI = await yourMintableSoulboundCollectibleContract.tokenURI(tokenId);
          console.log("tokenURI", tokenURI);
          const response = await fetch(tokenURI);
          console.log("response", response);
          const json = await response.json();
          console.log("json", json);
          allCollectibles.push(json);
        }
        setAllCollectibles(allCollectibles);
      } else {
        console.log("waiting for contract");
      }
    };
    getAllCollectibles();
  }, [balance]);
  */
  return (
    <div className="w-full flex items-center justify-center">
      <div className="p-4 bg-primary">{balance && balance.toNumber()}</div>
      <div className="m-8">
        <div className="grid grid-cols-2 gap-4">{renderedCollectibles}</div>
      </div>
    </div>
  );
};
