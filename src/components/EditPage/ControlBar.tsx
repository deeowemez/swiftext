import React, { useState } from "react";
import cottageIcon from "../../assets/images/cottage.svg";
import searchIcon from "../../assets/images/search-gr.svg";
import palletIcon from "../../assets/images/pallet-gr.svg";
import zoomInIcon from "../../assets/images/zoom-in.svg";
import zoomOutIcon from "../../assets/images/zoom-out.svg";

interface ControlBarProps {
  setPdfScaleValue: (value: number) => void;
}

const ControlBar = ({ setPdfScaleValue }: ControlBarProps) => {
  const [zoom, setZoom] = useState<number | null>(null);

  const zoomIn = () => {
    if (zoom) {
      if (zoom < 4) {
        setPdfScaleValue(zoom + 0.1);
        setZoom(zoom + 0.1);
      }
    } else {
      setPdfScaleValue(1);
      setZoom(1);
    }
  };

  const zoomOut = () => {
    if (zoom) {
      if (zoom > 0.2) {
        setPdfScaleValue(zoom - 0.1);
        setZoom(zoom - 0.1);
      }
    } else {
      setPdfScaleValue(1);
      setZoom(1);
    }
  };

  return (
    <div className="flex flex-col bg-[#F4F4F4] w-[56px] h-screen ">
      <div className="flex flex-col gap-5 p-[10px] ">

        <a href="/files" className="p-1.5 flex items-center justify-center rounded-xl hover:bg-[#FFE7D4]">
          <img src={cottageIcon} alt="home-icon" className="cursor-pointer w-7" />
        </a>
        <div className="p-1.5 flex items-center justify-center rounded-xl hover:bg-[#FFE7D4] focus:bg-[#FFE7D4]">
          <img src={searchIcon} alt="search icon" className="cursor-pointer w-7" />
        </div>
        <div className="p-1.5 flex items-center justify-center rounded-xl hover:bg-[#FFE7D4]">
          <img src={palletIcon} alt="color-pallete icon" className="cursor-pointer w-7" />
        </div>
        <div className="p-1.5 flex items-center justify-center rounded-xl hover:bg-[#FFE7D4]" onClick={zoomIn}>
          <img src={zoomInIcon} alt="zoom-in-icon" className="cursor-pointer w-7" />
        </div>
        <div className="p-1.5 flex items-center justify-center rounded-xl hover:bg-[#FFE7D4]" onClick={zoomOut}>
          <img src={zoomOutIcon} alt="zoom-out-icon" className="cursor-pointer w-7" />
        </div>
      </div>
      <div className="flex flex-col px-2 text-center pt-5">
        <div className="bg-white rounded-md">1</div>
        <p className="text-sm">of 57</p>
      </div>
    </div>
  )
}

export default ControlBar;