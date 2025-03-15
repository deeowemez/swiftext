import React, { useState } from "react";
import CreateAccount from "./CreateAccount";

import arrowButtonIcon from "../../assets/images/arrow-btn.svg";

const Footline = ({ onSignUpClick }) => {
  const [overlayType, setOverlayType] = useState(null);

  const handleOverlayClose = () => {
    setOverlayType(null);
  };

  return (
    <div className="flex items-center justify-center h-[1000px] bg-[#FF903D]">
      <div className="font-sserif flex flex-col items-center justify-center grid-rows-[1fr_1fr_1fr]">
        <ul className="flex flex-col items-center justify-center">
          <li className="text-[50px] md:text-[80px] font-semi-bold pb-1 text-white ">
            Start Annotating Today
          </li>
          <li className="text-[19px] font-light max-w-80 pb-16 text-center text-white ">
            Format your annotations effortlessly within Swiftext’s streamlined
            interface
          </li>
          <button
            className="flex flex-row items-center py-4 px-5 rounded-xl bg-white"
            onClick={onSignUpClick}
          >
            <p className="text-[18px] text-[#FF903D]">Create Free Account</p>
            <img
              src={arrowButtonIcon}
              alt="arrow-btn"
              className="h-10 w-10 cursor-pointer pl-4"
            />
          </button>
        </ul>
      </div>
      {overlayType === "createAccount" && (
        <CreateAccount onClose={handleOverlayClose} />
      )}
    </div>
  );
};

export default Footline;
