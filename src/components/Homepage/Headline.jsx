import React from "react";

const Headline = () => {
    return (
        <div className="w-screen flex flex-col items-center font-sserif p-16 relative">
            <p className="text-6xl text-black font-bold z-10">Easy-to-use</p>
            <p className="text-6xl text-[#FF903D] font-bold z-10">Annotations App</p>
            <p className="text-sm text-[#5A5959] mt-4 z-10">Format your annotations effortlessly</p>
            <p className="text-sm text-[#5A5959] mb-4 z-10">within Swiftext’s streamlined interface</p>
                <button className="bg-[#FF903D] rounded-lg text-white px-5 py-3 flex gap-3 z-10"
                     onClick={() => window.location.href = "/upload"}
                >
                    <p>Try Swiftext for free</p>
                    <img src="src/assets/images/arrow-right.svg" alt="Arrow pointing right" />
                </button>
            <img src="src/assets/images/cat-dancing.gif" alt="Dancing Chrome" className="w-[1300px] h-[800px] p-10 z-10" />
            <img src="src/assets/images/blob/headline/hl-blob-1.svg" alt="blob design 1" className="absolute top-0 left-0 z-0" />
            <img src="src/assets/images/blob/headline/hl-blob-2.svg" alt="blob design 2" className="absolute bottom-0 right-0 z-0" />
        </div>
    )
}

export default Headline;