import React from "react";
import Header from "../components/Homepage/Header";
import Footer from "../components/Homepage/Footer";

const FilesPage = () => {
    const handleDrop = (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file) {
            console.log("File dropped:", file);
            // setIsVideoVisible(true);
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    return (
        <div className="flex flex-col w-screen min-h-screen font-sserif">
            <Header />
            <div className="flex flex-col flex-1 py-10 px-36" onDrop={handleDrop} onDragOver={handleDragOver}>
                <div className="flex justify-between">
                    <div className="flex bg-[#F4F4F4] md:w-1/2 h-[35px] relative rounded-lg">
                        <img src="src/assets/images/search.svg" alt="search icon" className="w-[12px] absolute top-[12px] left-[15px]" />
                        <input type="text" placeholder="Search files" className="absolute h-[35px] left-[40px] bg-transparent text-[#333333] outline-none w-11/12 " />
                    </div>
                    <div className="flex gap-5 text-[#5A5959] text-sm items-center">
                        <p>File</p>
                        <img src="src/assets/images/line.svg" alt="" />
                        <p>Folder</p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-10 max-w-4/5 px-3 py-4">
                    <button className="bg-[#F8968E] text-white px-3 py-1 rounded-2xl">#urgent</button>
                </div>
                <div className="flex px-7 py-2">
                    <img src="src/assets/images/circle-plus.svg" alt="upload svg" className="w-[16px]" />
                    <img src="src/assets/images/mark-dropdown.svg" alt="reload svg" className="w-[25px] ml-7 mr-5" />
                    <img src="src/assets/images/reload.svg" alt="reload svg" className="w-[13px]" />
                </div>
                <div className="flex flex-col gap-8 py-6 w-full">
                    <div className="flex items-center justify-start bg-[#F4F4F4] rounded-md h-12 w-full min-w-full max-w-full gap-3 px-5 py-9">
                        <div className="bg-[#333333] w-1/12 text-white text-center ">thumbnail prev</div>
                        <div className="flex flex-col w-11/12">
                            <p className="text-left text-md overflow-clip">Name</p>
                            <div className="flex justify-between">
                                <p className="text-right text-xs italic">last modified</p>
                                <div className="flex gap-4 items-center">
                                    <div className="bg-[#F8968E] w-3 h-3 rounded-full"></div>
                                    <img src="src/assets/images/more-alt.svg" alt="more svg" />
                                </div>

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