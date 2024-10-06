import React from "react";

const Footline = () => {
    return (
        <div className="flex items-center justify-center h-[1000px] bg-[#FF903D]" >
            <div className="font-sserif flex flex-col items-center justify-center grid-rows-[1fr_1fr_1fr]">
                <ul className="flex flex-col items-center justify-center">
                    <li className="text-[50px] md:text-[80px] font-semi-bold pb-1 text-white ">Start Annotating Today</li>
                    <li className="text-[19px] font-light max-w-80 pb-16 text-center text-white ">Format your annotations effortlessly within Swiftext’s streamlined interface</li>
                    <button className="flex flex-row items-center py-4 px-5 rounded-xl bg-white">
                        <p className="text-[18px] text-[#FF903D]">Create Free Account</p>
                        <img src="src/assets/images/arrow-btn.svg" alt="arrow-btn" className='h-10 w-10 cursor-pointer pl-4' />
                    </button>
                </ul>
            </div>
        </div>
    )    
}

export default Footline