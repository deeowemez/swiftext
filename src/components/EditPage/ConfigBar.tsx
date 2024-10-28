import React from "react";
import arrowIcon from "../../assets/images/expand-arrow.svg";

const ConfigBar = () => {
    return(
        <div className="flex min-h-screen w-full items-start font-sserif">
            {/* <img src={arrowIcon} alt="arrow-icon" className="cursor-pointer w-5 my-2 mx-3" /> */}
            <div className="flex flex-1 flex-col gap-6 bg-[#F4F4F4] p-8 min-h-screen text-center" >
               <div className="bg-white flex-grow rounded-ss-lg">Highlighter color config</div>
               <div className="bg-white flex-grow rounded-ss-lg">export pdf file preview</div>
            </div>
        </div> 
    )
}

export default ConfigBar;