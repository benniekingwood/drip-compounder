import React from "react";
import { useEffect, useState, useRef } from "react";
import { useAccount } from "wagmi";
import { readContracts } from "@wagmi/core";
import Web3 from "web3";
import TakeProfitsButton from "./TakeProfitsButton";
import CompoundButton from "./CompoundButton";
import CONTRACT_ADDRESSES from "../constants/contract-addresses";
import configuration from "../configuration";
import DRIP_FAUCET_ABI from "../constants/abis/drip-faucet-abi";

/**
 * Component that will handle the individual account information
 * @param {Object} props - will have String for address and String for the account alias
 * @returns HTML table cells with the account information
 */
const Account = ({ address, alias, setNotificationText, setTxnHash }) => {
  const [available, setAvailable] = useState(0);
  const [deposits, setDeposits] = useState(0);
  const [roi, setRoi] = useState(0);
  const { isConnected, address: selectedAddress } = useAccount();
  const buttonDisabled = !isConnected || selectedAddress !== address;
  const loadAccount = useRef(0);

  useEffect(() => {
    /**
     * Function will load claim and available/deposit information for the
     * address passed in
     * @param {String} address - the account address
     */
    loadAccount.current = async (address) => {
      const baseParams = {
        address: CONTRACT_ADDRESSES.DRIP_FAUCET,
        abi: DRIP_FAUCET_ABI,
        args: [address],
      };

      const data = await readContracts({
        contracts: [
          {
            ...baseParams,
            functionName: "claimsAvailable",
          },
          {
            ...baseParams,
            functionName: "userInfo",
          },
        ],
      });

      if (data) {
        // set the available
        let raw = Web3.utils.fromWei(data[0].result, "ether");
        setAvailable(parseFloat(raw).toFixed(2));

        // now set the deposits
        raw = Web3.utils.fromWei(data[1].result[2], "ether");
        setDeposits(parseFloat(raw).toFixed(2));

        // set the roi for the account
        setRoi(((available / deposits) * 100).toFixed(2));
      }
    };

    if (address) {
      loadAccount.current(address);
    }
  }, [address, available, deposits]);

  return (
    <>
      <td className="px-5 pb-2">{alias}</td>
      <td className="px-5 pb-2">{address}</td>
      <td className="px-5 pb-2">{available}</td>
      <td className="px-5 pb-2">{deposits}</td>
      <td className="px-5 pb-2">{roi}%</td>
      <td className="px-5 pb-2">
        <div className="dropdown">
          <label tabIndex={0} className="btn m-1">
            <div className={`${buttonDisabled ? "opacity-5" : "text-success"}`}>
              Actions
            </div>
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
          >
            {deposits > configuration.takeProfits.minimum && (
              <li>
                <TakeProfitsButton
                  disabled={buttonDisabled}
                  roi={roi}
                  address={address}
                  loadAccount={loadAccount}
                  setNotificationText={setNotificationText}
                  setTxnHash={setTxnHash}
                />
              </li>
            )}
            <li>
              <CompoundButton
                disabled={buttonDisabled}
                roi={roi}
                address={address}
                loadAccount={loadAccount}
                setNotificationText={setNotificationText}
                setTxnHash={setTxnHash}
              />
            </li>
          </ul>
        </div>
      </td>
    </>
  );
};

export default Account;
