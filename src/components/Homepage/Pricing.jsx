import React from "react";

const Pricing = () => {
    return (
        <div className="font-sserif grid grid-cols-1 md:grid-cols-2 relative overflow-x-hidden min-h-[950px] md:h-[950px]">
            <div className="flex flex-col items-center col-start-1 col-span-1 px-8 md:px-16 lg:px-36 h-full relative">
                <img src="src/assets/images/blob/pricing/p-blob.svg" 
                     alt="pricing blob" 
                     className='absolute w-[70%] md:w-[500px] lg:w-[700px] z-0' 
                     style={{ top: '10%', left: '50%', transform: 'translateX(-50%)' }} />
                <img 
                    src="src/assets/images/zero-dollar.svg" 
                    alt="zero dollar" 
                    className='absolute 
                                w-[35%] md:w-[190px] lg:w-[300px] 
                                top-[50%] md:top-[30%] lg:top-[40%] 
                                left-[50%] transform translate-x-[-50%]' />
            </div>
            <div className="flex flex-col col-start-1 md:col-start-2 col-span-1 pl-8 md:pl-28 justify-center items-center md:items-start text-center md:text-left">
                <ul>
                    <li className="text-4xl xl:text-6xl font-bold leading-normal md:leading-relaxed">
                        Get Started Today, Absolutely Free!
                    </li>
                    <li className="flex items-center mt-12 md:mt-24">
                        <img src="src/assets/images/round-box-check.svg" className="h-8 w-8 md:h-10 md:w-10"/> 
                        <p className="pl-3 md:pl-5 text-2xl lg:text-5xl text-[#333333]"> Up to 10 files</p>
                    </li>
                    <li className="flex items-center mt-4 md:mt-12">
                        <img src="src/assets/images/round-box-check.svg" className="h-8 w-8 md:h-10 md:w-10"/> 
                        <p className="pl-3 md:pl-5 text-2xl lg:text-5xl text-[#333333]"> Up to 10Mb files</p>
                    </li>
                </ul>
            </div>
        </div>
    );
};



export default Pricing;