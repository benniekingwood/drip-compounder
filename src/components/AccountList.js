import React from "react";
import accounts from "../models/accounts";
import Account from "./Account";

/**
 * Component that will have the list of the accounts
 * @returns HTML related to accounts
 */
const AccountList = ({setNotificationText, setTxnHash}) => {
  return (
    <div>
      <h1 className="text-3xl font-bold m-10 text-center">Accounts</h1>
      <table className="table-auto mx-auto font-mono">
        <thead>
          <tr>
            <th className="px-5">Name</th>
            <th className="px-5">Address</th>
            <th className="px-5">Available</th>
            <th className="px-5">Deposits</th>
            <th className="px-5">ROI</th>
            <th className="px-5"></th>
          </tr>
        </thead>
        <tbody>
          {accounts.length > 0 ? accounts.map((account) => {
             return (
              <tr key={account.address}>
                <Account address={account.address} alias={account.alias} setNotificationText={setNotificationText} setTxnHash={setTxnHash} />
              </tr>
            )
          }) : <tr><td colSpan={6} className="mx-auto text-center py-20">No Accounts</td></tr>}
        </tbody>
      </table>
    </div>
  );
};

export default AccountList;
