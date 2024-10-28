import React from "react";
import cottageIcon from "../../assets/images/cottage.svg";
import searchIcon from "../../assets/images/search-gr.svg";
import palletIcon from "../../assets/images/pallet-gr.svg";
import zoomInIcon from "../../assets/images/zoom-in.svg";
import zoomOutIcon from "../../assets/images/zoom-out.svg";

const ControlBar = () => {
  return (
    <div className="flex flex-col bg-[#F4F4F4] w-[56px] h-screen ">
      <div className="flex flex-col gap-10 p-[16px] ">
        <a href="/files">
          <img src={cottageIcon} alt="home-icon" className="cursor-pointer w-7" />
        </a>
        <img src={searchIcon} alt="search icon" className="cursor-pointer w-7" />
        <img src={palletIcon} alt="color-pallete icon" className="cursor-pointer w-7" />
        <img src={zoomInIcon} alt="zoom-in-icon" className="cursor-pointer w-7" />
        <img src={zoomOutIcon} alt="zoom-out-icon" className="cursor-pointer w-7" />
      </div>
      <div className="flex flex-col px-2 text-center pt-5">
        <div className="bg-white rounded-md">1</div>
        <p className="text-sm">of 57</p>
      </div>
    </div>
  )
}

export default ControlBar;