import React, { useState, useEffect } from "react";

import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import Help from "../Help.md";

const HelpSection = () => {
  const [helpText, setHelpText] = useState("");

  useEffect(() => {
    fetch(Help)
      .then((res) => res.text())
      .then((text) => setHelpText(text));
  });

  return (
    <>
      <button onClick={() => window.help_modal.showModal()}>🤷‍♂️ Help</button>
      <dialog id="help_modal" className="modal">
        <form method="dialog" className="modal-box w-11/12 max-w-5xl absolute">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            x
          </button>
          <div>
            {
              // eslint-disable-next-line react/no-children-prop
              <ReactMarkdown children={helpText} className="markdown" />
            }
          </div>
        </form>
      </dialog>
    </>
  );
};

export default HelpSection;
