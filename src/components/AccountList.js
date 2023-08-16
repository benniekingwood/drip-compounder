import React, { useEffect, useState } from "react";
import accounts from "../models/accounts";
import Account from "./Account";

/**
 * Component that will have the list of the accounts
 * @returns HTML related to accounts
 */
const AccountList = () => {
  const [totalAvailable, setTotalAvailable] = useState(0);
  const [totalAvailableMap, setTotalAvailableMap] = useState({});
  // small helper method to update the total available map
  const updateTotalAvailable = (address, amount) => {
    setTotalAvailableMap((prev) => {
      const newMap = Object.assign({}, prev); // creating copy of state variable jasper
      newMap[address] = Number(amount); // update the name property, assign a new value
      return newMap;
    });
  };

  useEffect(() => {
    // recompute the account total available
    const newTotal = Object.values(totalAvailableMap).reduce(
      (a, b) => Number(a) + Number(b),
      0
    );

    setTotalAvailable(newTotal.toFixed(2));
  }, [totalAvailableMap]);

  return (
    <div>
      <h1 className="text-3xl font-bold m-10 text-center">Accounts</h1>
      <table className="table-auto mx-auto font-mono">
        <thead>
          <tr>
            <th className="px-5">Name</th>
            <th className="px-5">Address</th>
            <th className="px-5">
              <div className="indicator">
                {totalAvailable > 0 && (
                  <span className="indicator-item badge badge-primary text-success -top-1">
                    {totalAvailable}
                  </span>
                )}
                <div className="grid w-36 h-3 place-items-center">
                  Available
                </div>
              </div>
            </th>
            <th className="px-5">Deposits</th>
            <th className="px-5">ROI</th>
            <th className="px-5"></th>
          </tr>
        </thead>
        <tbody>
          {accounts.length > 0 ? (
            accounts.map((account) => {
              return (
                <tr key={account.address}>
                  <Account
                    address={account.address}
                    alias={account.alias}
                    updateTotalAvailable={updateTotalAvailable}
                  />
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={6} className="mx-auto text-center py-20">
                No Accounts
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AccountList;
