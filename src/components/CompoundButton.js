import React, { useContext } from "react";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import DRIP_FAUCET_ABI from "../constants/abis/drip-faucet-abi";
import CONTRACT_ADDRESSES from "../constants/contract-addresses";
import { Recycle } from "lucide-react";
import { Context } from "../contexts/NotificationContext";

/**
 * Component for the compounding button. Will handle all logic related to
 * compounding.
 *
 * @param {Object} props - will have the boolean disabled, float of roi, String address, and loadAccount function
 * @returns HTML button for compounding
 */
const CompoundButton = ({ disabled, roi, address, loadAccount }) => {
  const [notification, setNotification] = useContext(Context);
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
      setNotification({ text: 'Done.', txnHash: writeData.hash });

      // now reload the account to reflect the new data
      loadAccount.current(address);
      setTimeout(() => {
        window.notification_modal.close();
        setNotification(null);
      }, 7000);
    },
    onError(_error) {
      console.error("There was an issue claiming", _error);
      setNotification({ ...notification, text: 'Error. See console.' });
    },
  });

  return (
    <a
      className={`${
        isDisabled || isLoading ? "opacity-25" : ""
      } link link-hover  ${roi >= 1 ? "text-lime-400" : ""}`}
      onClick={isDisabled || isLoading ? () => {} : () => { 
        write?.(); 
        setNotification({ ...notification, text: 'Compounding...' });
        console.log('CompoundButton', notification);
        window.notification_modal.showModal();
      }}
    >
      <Recycle color="#000000" /> Compound
    </a>
  );
};

export default CompoundButton;
