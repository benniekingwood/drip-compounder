# Running the app

 Drip Compounder utilizes the [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) object in the browser for the accounts you would like to manage and the address you would like to send the BNB to when taking profits. Below are the specifics around each attribute.


### Accounts

`localStorage.setItem('dc-accounts', 'YOUR_JSON_STRING')`

 JSON Format for YOUR_JSON_STRING. Each object must have a `address` and `alias` attribute.

 ```
 [ ...{ address: "0xlksjdfsl...", alias: "myAlias" } ]
 ```

### Send To Address

 `localStorage.setItem('dc-sendToAddress', 'YOUR_SEND_TO_ADDRESS')`


For additional application settings, see the `configuration.js` file.