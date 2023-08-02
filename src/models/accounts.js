let accounts = [];

try {
  // grab the accounts list from localStorage - see Help.md for JSON format
  const rawAccounts = localStorage.getItem("dc-accounts") || "[]";

  accounts = JSON.parse(rawAccounts);
} catch (e) {
  console.error(`Error parsing accounts: ${e.message}`);

  throw e;
}

export default accounts;
