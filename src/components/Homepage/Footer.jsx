import React from "react";

const Footer = () => {
    return (
        <div className="font-sserif grid grid-cols-1 md:grid-cols-4 gap-4 pt-8">
            <a href="/" className="flex col-start-1 col-span-1 px-8 md:px-16 md:pl-36 items-center" >
                <img src="src/assets/images/logo.svg" alt="Swiftext Logo" className='h-12 w-12 cursor-pointer' />
                <div className="font-title text-2xl md:text-3xl gradient-text font-bold py-2 px-1 cursor-pointer h-14">Swiftext</div>
            </a>
            <div className="flex col-start-2 col-span-3 md:col-span-3 justify-end gap-8 md:gap-32 pr-8 md:pr-36 pb-6">
                <div className="flex flex-col gap-1 text-left text-sm pt-4 text-[#5A5959]">
                    <p className="font-semibold pb-1">Company</p>
                    <p className="cursor-pointer">Contact Us</p>
                </div>
                <div className="flex flex-col gap-1 text-left text-sm pt-4 text-[#5A5959]">
                    <p className="font-semibold pb-1">Product</p>
                    <p className="cursor-pointer">About</p>
                    <p className="cursor-pointer">Features</p>
                </div>
                <div className="flex flex-col gap-1 text-left text-sm pt-4 text-[#5A5959]">
                    <p className="font-semibold pb-1">Legal</p>
                    <p className="cursor-pointer">Terms of Service</p>
                </div>
            </div>
            <div className="flex items-center col-start-1 col-span-4 justify-center md:justify-end bg-[#FF903D] px-8 md:px-16 py-4">
                <p className="text-white text-xs text-center md:text-left px-8 md:px-16">@2024 Power Duo. All Rights Reserved</p>
            </div>
        </div>
    );
}


export default Footer