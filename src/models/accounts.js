let accounts = [];

try {
  const rawAccounts = localStorage.getItem("dc-accounts") || '[]';

  accounts = JSON.parse(rawAccounts);
} catch (e) {
  console.error(`Error parsing accounts: ${e.message}`);

  throw e;
}

export default accounts;