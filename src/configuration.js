const configuation = {
  takeProfits: {
    minimum: 13800,
    slippage: 0.005,
    bnbToSendPercentage: 0.98,
    sendToAddress: localStorage.getItem("dc-sendToAddress") || "",
  },
};

export default configuation;
