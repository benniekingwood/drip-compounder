import React from "react";
import Web3 from "web3";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
  useNetwork,
} from "wagmi";
import {
  fetchBalance,
  readContract,
  prepareWriteContract,
  writeContract,
  waitForTransaction,
  sendTransaction,
  prepareSendTransaction,
} from "@wagmi/core";
import configuration from "../configuration";
import { toast } from "react-toastify";
import CONTRACT_ADDRESSES from "../constants/contract-addresses";
import DRIP_FOUNTAIN_ABI from "../constants/abis/drip-fountain-abi";
import TOKEN_ADDRESSES from "../constants/token-addresses";
import DRIP_FAUCET_ABI from "../constants/abis/drip-faucet-abi";

/**
 * This component will handle all logic related to taking your profits
 * @param {Object} props - {Boolean} disabled, {Number} roi, {String} address, {Function} loadAccount 
 * @returns HTML for the take profits button
 */
const TakeProfitsButton = ({ disabled, roi, address, loadAccount }) => {
  let dripBalance = 0;
  let minBnbReceived = 0;
  const { chain } = useNetwork();
  const { config: claimConfig } = usePrepareContractWrite({
    address: CONTRACT_ADDRESSES.DRIP_FAUCET,
    abi: DRIP_FAUCET_ABI,
    functionName: "claim",
  });
  const { data: claimData, write: claimWrite } = useContractWrite(claimConfig);

  // wait for the claim 
  useWaitForTransaction({
    hash: claimData?.hash,
    onSuccess() {
      // of claim was successful, begin the swap
      prepareSwap();
    },
    onError(_error) {
      toast.error("There was an issue claiming", _error);
    },
  });

  /**
   * This function will send the desired amount of BNB from
   * the active account to the desired account
   */
  const sendToCrytoDotComWallet = async () => {
    const balance = await fetchBalance({
      address,
      chainId: chain.id,
    });

    const bnbToSend = Web3.utils.toWei(
      parseFloat(balance?.formatted) *
        configuration.takeProfits.bnbToSendPercentage,
      "ether"
    );

    try {
      const config = await prepareSendTransaction({
        account: address,
        to: configuration.takeProfits.sendToAddress,
        value: bnbToSend,
      });

      const { hash } = await sendTransaction(config);
      const receipt = await waitForTransaction({ hash });
   
      if (receipt.status === "success") {
        toast.success(
          () => (
            <a
              rel="noreferrer nofollow"
              target="_blank"
              href={`https://bscscan.com/tx/${receipt.transactionHash}`}
            >
              {receipt.transactionHash}
            </a>
          ),
          {}
        );

        // now reload the account to reflect the new data
        loadAccount.current(address);
      }
    } catch (e) {
      toast.error("There was an issue sending to your CRO wallet", e);
    }
  };

  /**
   * This function will perform the swap on the DRIP dex
   * @param {Number} dripBalance - the drip balance in the account
   * @param {Number} minBnbReceived - the minimum amount of BNB you can receive for swapping your DRIP
   * @returns Promise 
   */
  const doSwap = async (dripBalance, minBnbReceived) => {
    if (dripBalance === 0 || minBnbReceived === 0) return;
    try {
      const { request } = await prepareWriteContract({
        address: CONTRACT_ADDRESSES.DRIP_FOUNTAIN,
        abi: DRIP_FOUNTAIN_ABI,
        functionName: "tokenToBnbSwapInput",
        args: [dripBalance, minBnbReceived],
      });

      const { hash } = await writeContract(request);
      const receipt = await waitForTransaction({ hash });

      if (receipt.status === "success") {
        toast.success(
          () => (
            <a
              rel="noreferrer nofollow"
              target="_blank"
              href={`https://bscscan.com/tx/${receipt.transactionHash}`}
            >
              {receipt.transactionHash}
            </a>
          ),
          {}
        );
        console.log(
          "3. Send to Cryto.com Wallet (0x43F9E826C7D6e280C60425FbdAe5622195C15Cc2)"
        );
        await sendToCrytoDotComWallet();
      }
    } catch (e) {
      toast.error("There was an issue swapping", e);
    }
  };

  /**
   * This function will perform the steps necessary to prepare for the 
   * DRIP to BNB swap
   */
  const prepareSwap = async () => {
    // get the balance of DRIP from the account
    const balance = await fetchBalance({
      address,
      token: TOKEN_ADDRESSES.DRIP,
      chainId: chain.id,
    });

    // console.log("Balance:", balance);
    dripBalance = Web3.utils.toWei(balance?.formatted, "ether");
    // console.log(dripBalance);

    // grab how much BNB you can recieve for your DRIP, using the DRIP contract
    const data = await readContract({
      address: CONTRACT_ADDRESSES.DRIP_FOUNTAIN,
      abi: DRIP_FOUNTAIN_ABI,
      functionName: "getTokenToBnbInputPrice",
      args: [dripBalance],
    });

    // console.log("getTokenToBnbInputPrice", data);
    const dripPriceInBNB = Web3.utils.fromWei(data, "ether");
    // console.log("dripPriceInBNB", dripPriceInBNB);
    
    // apply the slippage to determin your mininum desired BNB
    minBnbReceived = Web3.utils.toWei(
      dripPriceInBNB * (0.9 - configuration.takeProfits.slippage),
      "ether"
    );
    // console.log("minBnbReceived", minBnbReceived);
    // now do the actual swap
    await doSwap(dripBalance, minBnbReceived);
  };

  return (
    <a
      className={`${disabled ? "opacity-25" : ""} link link-hover ${
        roi >= 7 ? "text-lime-400" : ""
      }`}
      onClick={disabled ? () => {} : () => claimWrite?.()}
    >
      Take Profits
    </a>
  );
};

export default TakeProfitsButton;
