import Web3 from "web3";
import NFT_BALANCE_ABI from "../../../nft_balance_ABI.json";
import { NFT_BALANCE_CONTRACT } from "../../../constant";

function GetProvider() {
  // const { account } = useActiveWeb3React();
  // console.log("useWeb3React",account);
  const web3 = new Web3();
  web3.setProvider(window.web3.currentProvider);
  return web3;
}

export const GetNftBalanceContract = async () => {
  try {
    // const contractAddress = "0xE6d41aC36506C28672E358737dfE499807Db3bac";
    let web3 = GetProvider();

    if (web3.currentProvider) {
      const MyContract = new web3.eth.Contract(
        NFT_BALANCE_ABI,
        NFT_BALANCE_CONTRACT
      );
      return MyContract;
    } else return null;
  } catch (error) {
    console.log("error in contract ", error);
  }
};
