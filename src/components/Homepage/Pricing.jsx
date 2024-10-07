import React from "react";

const Pricing = () => {
    return (
        // <div className="font-sserif grid grid-cols-1 md:grid-cols-2 relative overflow-x-hidden min-h-[950px] md:h-[950px]">
        //     <div className="flex flex-col items-center col-start-1 col-span-1 px-8 md:px-16 lg:px-36 h-full relative">
        //         <img src="src/assets/images/blob/pricing/p-blob.svg" 
        //              alt="pricing blob" 
        //              className='absolute w-[70%] md:w-[500px] lg:w-[700px] z-0' 
        //              style={{ top: '10%', left: '50%', transform: 'translateX(-50%)' }} />
        //         <img 
        //             src="src/assets/images/zero-dollar.svg" 
        //             alt="zero dollar" 
        //             className='absolute 
        //                         w-[35%] md:w-[190px] lg:w-[300px] 
        //                         top-[50%] md:top-[30%] lg:top-[40%] 
        //                         left-[50%] transform translate-x-[-50%]' />
        //     </div>
        //     <div className="flex flex-col col-start-1 md:col-start-2 col-span-1 pl-8 md:pl-28 justify-center items-center md:items-start text-center md:text-left">
        //         <ul>
        //             <li className="text-4xl xl:text-6xl font-bold leading-normal md:leading-relaxed">
        //                 Get Started Today, Absolutely Free!
        //             </li>
        //             <li className="flex items-center mt-12 md:mt-24">
        //                 <img src="src/assets/images/round-box-check.svg" className="h-8 w-8 md:h-10 md:w-10"/> 
        //                 <p className="pl-3 md:pl-5 text-2xl lg:text-5xl text-[#333333]"> Up to 10 files</p>
        //             </li>
        //             <li className="flex items-center mt-4 md:mt-12">
        //                 <img src="src/assets/images/round-box-check.svg" className="h-8 w-8 md:h-10 md:w-10"/> 
        //                 <p className="pl-3 md:pl-5 text-2xl lg:text-5xl text-[#333333]"> Up to 10Mb files</p>
        //             </li>
        //         </ul>
        //     </div>
        // </div>
        <div className="font-sserif flex flex-col lg:flex-row justify-center items-center px-5 py-20 ">
        <div className="w-full md:w-4/5 lg:w-5/6 max-w-screen-xl flex justify-center">
            <img src="src/assets/images/blob/pricing/price-blob.svg" alt="Price Blob" className="w:11/12 md:w-4/5 lg:w-4/5 p-16"/>
        </div>
        <div className="flex flex-col gap-6 ">
            <p className="text-3xl sm:text-4xl lg:text-4xl xl:text-6xl font-bold py-10">Get Started Today, Absolutely Free!</p>
            <div className="flex">
                <img src="src/assets/images/round-box-check.svg" alt="checkbox image" />
                <p className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-[#333333]"> Up to 10 files</p>
            </div>
            <div className="flex ">
                <img src="src/assets/images/round-box-check.svg" alt="checkbox image" />
                <p className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-[#333333]"> Up to 10Mb files</p>
            </div>
        </div>
    </div>
    );
};



export default Pricing;