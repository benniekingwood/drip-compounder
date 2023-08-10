import React, { createContext, useState } from "react";
const initialState = {
  text: null,
  txnHash: null,
};
export const Context = createContext();

const NotificationContext = ({ children }) => {
  const [notification, setNotification] = useState(initialState);

  return (
    <Context.Provider value={[notification, setNotification]}>{children}</Context.Provider>
  );
};

export default NotificationContext;
