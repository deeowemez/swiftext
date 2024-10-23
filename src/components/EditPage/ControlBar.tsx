import React from "react";

const ControlBar = () => {
  return (
    <div className="flex flex-col bg-[#F4F4F4] w-[56px] h-screen ">
      <div className="flex flex-col gap-10 p-[16px] ">
        <a href="/files">
          <img src="src/assets/images/cottage.svg" alt="home icon" className="cursor-pointer w-7" />
        </a>
        <img src="src/assets/images/search-gr.svg" alt="" className="cursor-pointer w-7" />
        <img src="src/assets/images/pallet-gr.svg" alt="" className="cursor-pointer w-7" />
        <img src="src/assets/images/zoom-in.svg" alt="" className="cursor-pointer w-7" />
        <img src="src/assets/images/zoom-out.svg" alt="" className="cursor-pointer w-7" />
      </div>
      <div className="flex flex-col px-2 text-center pt-5">
        <div className="bg-white rounded-md">1</div>
        <p className="text-sm">of 57</p>
      </div>
    </div>
  )
}

export default ControlBar;