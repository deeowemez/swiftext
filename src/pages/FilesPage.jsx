import React from "react";
import Header from "../components/Homepage/Header";
import Footer from "../components/Homepage/Footer";

const FilesPage = () => {
    return (
        <div className="flex flex-col w-screen min-h-screen font-sserif">
            <Header />
            <div className="flex flex-col flex-1 py-10 px-36">
                <div className="flex bg-[#F4F4F4] md:w-1/2 h-[35px] relative rounded-lg">
                    <img src="src/assets/images/search.svg" alt="search icon" className="w-[12px] absolute top-[12px] left-[15px]" />
                    <input type="text" placeholder="Search files" className="absolute h-[35px] left-[40px] bg-transparent text-[#333333] outline-none w-11/12 " />
                </div>
                <div className="flex flex-wrap gap-10 max-w-4/5 px-3 py-4">
                    <button className="bg-[#F8968E] text-white px-3 py-1 rounded-2xl">#urgent</button>
                </div>
                <div className="flex gap-5 px-7 py-2">
                    <img src="src/assets/images/mark-dropdown.svg" alt="reload svg" className="w-6" />
                    <img src="src/assets/images/reload.svg" alt="reload svg" className="w-3.5" />
                </div>
                <div className="flex gap-8 py-6">
                    <div className="flex flex-col items-center justify-center bg-[#F4F4F4] rounded-2xl h-56 min-w-48 max-w-48 gap-3">
                        <div className="bg-[#333333] w-3/4 h-3/5 text-white text-center">thumbnail prev</div>
                        <div className="flex flex-col w-3/4">
                            <p className="text-left text-md overflow-clip">NameNameNameNameNameNameNameNameNameNameNameNameNameNameNameNameNameName</p>
                            <div className="flex justify-between">
                                <p className="text-right text-xs italic">last modified</p>
                                <div className="bg-[#F8968E] w-3 h-3 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <Footer /> */}
        </div>
    )
}

export default FilesPage;