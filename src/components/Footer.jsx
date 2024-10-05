import React from "react";

const Footer = () => {
    return (
        <div className="font-sserif grid grid-cols-[fr_1fr_1fr_1fr] grid-rows-[3fr_1fr] pt-8">
            <div className="flex col-start-1 col-span-1 px-16 pl-36">
                <img src="src/assets/images/logo.svg" alt="Swiftext Logo" className='h-12 w-12 cursor-pointer' />
                <div className="font-title text-3xl gradient-text font-bold py-2 px-1 cursor-pointer h-14">Swiftext</div>
            </div>
            <div className="flex col-start-2 col-span-3 justify-end gap-32 pr-36">
                <div className="flex flex-col gap-1 col-start-2 col-span-1 text-left text-sm pl-36 pt-4 text-[#5A5959] ">
                    <p className="font-semibold pb-1">Company</p>
                    <p className="cursor-pointer">Contact Us</p>
                </div>
                <div className="flex flex-col gap-1 col-start-3 col-span-1 text-left text-sm pb-12 pt-4 text-[#5A5959]">
                    <p className="font-semibold pb-1">Product</p>
                    <p className="cursor-pointer">About</p>
                    <p className="cursor-pointer">Features</p>
                </div>
                <div className="flex flex-col gap-1 col-start-4 col-span-1 text-left text-sm pt-4 text-[#5A5959]">
                    <p className="font-semibold pb-1">Legal</p>
                    <p className="cursor-pointer">Terms of Service</p>
                </div>
            </div>
            <div className="flex items-center col-start-1 col-span-4 justify-end pr-36 bg-[#FF903D] px-16">
                <p className="text-white text-xs">@2024 Power Duo. All Rights Reserved</p>
            </div>
        </div>
    )
}

export default Footer