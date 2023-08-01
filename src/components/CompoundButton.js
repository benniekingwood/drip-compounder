import React from "react";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { toast } from "react-toastify";
import DRIP_FAUCET_ABI from "../constants/abis/drip-faucet-abi";
import CONTRACT_ADDRESSES from "../constants/contract-addresses";

/**
 * Component for the compounding button. Will handle all logic related to
 * compounding.
 *
 * @param {Object} props - will have the boolean disabled, float of roi, String address, and loadAccount function
 * @returns HTML button for compounding
 */
const CompoundButton = ({ disabled, roi, address, loadAccount }) => {
  const { config } = usePrepareContractWrite({
    address: CONTRACT_ADDRESSES.DRIP_FAUCET,
    abi: DRIP_FAUCET_ABI,
    functionName: "roll",
  });
  const { data: writeData, write } = useContractWrite(config);
  const isDisabled = !write || disabled;
  const { isLoading } = useWaitForTransaction({
    hash: writeData?.hash,
    onSuccess() {
      toast.success(
        () => (
          <a
            rel="noreferrer nofollow"
            className="text-blue-600"
            target="_blank"
            href={`https://bscscan.com/tx/${writeData.hash}`}
          >
            {writeData.hash}
          </a>
        ),
        {}
      );
      // now reload the account to reflect the new data
      loadAccount.current(address);
    },
    onError(_error) {
      toast.error("There was an issue claiming", _error);
    },
  });

  return (
    <a
      className={`${
        isDisabled || isLoading ? "opacity-25" : ""
      } link link-hover  ${roi >= 1 ? "text-lime-400" : ""}`}
      onClick={isDisabled || isLoading ? () => {} : () => write?.()}
    >
      Compound
    </a>
  );
};

export default CompoundButton;
