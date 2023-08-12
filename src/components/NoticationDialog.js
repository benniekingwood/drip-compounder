import React, { useContext } from "react";
import { CheckCircle2 } from "lucide-react";
import { Context } from "../contexts/NotificationContext";

/**
 * Dialog component for notifications
 * @returns HTML for the notification dialog
 */
const NotificationDialog = () => {
  const [notification] = useContext(Context);

  return (
    <>
      <dialog id="notification_modal" className="modal">
        <form
          method="dialog"
          className="modal-box w-11/12 max-w-5xl absolute h-56"
        >
          <button
            id="notification_dialog_close"
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          >
            x
          </button>
          <h1 className="font-bold text-center py-10 text-5xl">
            {notification?.text ? notification?.text : ""}
          </h1>
          <div className="text-center text-xl relative">
            {notification?.txnHash ? (
              <>
                <div className="w-fit mx-auto relative">
                  <div className="absolute -left-7 top-0.5">
                    <CheckCircle2 color="#00f900" />
                  </div>
                  Txn Hash:{" "}
                  <a
                    rel="noreferrer nofollow"
                    className="text-blue-600 no-underline"
                    target="_blank"
                    href={`https://bscscan.com/tx/${notification?.txnHash}`}
                  >
                    {notification?.txnHash}
                  </a>
                </div>
              </>
            ) : (
              ""
            )}
          </div>
        </form>
      </dialog>
    </>
  );
};

export default NotificationDialog;
