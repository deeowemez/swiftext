import React from "react";

import arrowRightIcon from "../../assets/images/arrow-right.svg";
import tutorialGif from "../../assets/images/tutorial.gif";
import hlBlob1 from "../../assets/images/blob/headline/hl-blob-1.svg";
import hlBlob2 from "../../assets/images/blob/headline/hl-blob-2.svg";

const Headline = () => {
  return (
    <div className="w-screen flex flex-col items-center font-sserif p-16 relative">
      <p className="text-6xl text-black font-bold z-10">Easy-to-use</p>
      <p className="text-6xl text-[#FF903D] font-bold z-10">Annotations App</p>
      <p className="text-sm text-[#5A5959] mt-4 z-10">
        Format your annotations effortlessly
      </p>
      <p className="text-sm text-[#5A5959] mb-4 z-10">
        within Swiftext’s streamlined interface
      </p>
      <a
        href="/files"
        className="bg-[#FF903D] rounded-lg text-white px-5 py-3 flex gap-3 z-10"
      >
        <p>Try Swiftext for free</p>
        <img src={arrowRightIcon} alt="Arrow pointing right" />
      </a>
      <div className="z-10 flex justify-center border-[#F4F4F4] mt-20 p-3 rounded-[1rem]">
        <img
          src={tutorialGif}
          alt="Tutorial GIF"
          className="w-11/12 z-10 rounded-[0.5rem] border-1 border-[#F4F4F4] shadow-xl"
        />
      </div>
      <img
        src={hlBlob1}
        alt="blob design 1"
        className="absolute top-0 left-0 z-0"
      />
      <img
        src={hlBlob2}
        alt="blob design 2"
        className="absolute bottom-0 right-0 z-0"
      />
    </div>
  );
};

export default Headline;
