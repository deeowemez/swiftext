import React, { useRef, useState } from "react";
import '../styles/index.css';

import Header from "../components/Homepage/Header";
import Footer from "../components/Homepage/Footer";

const UploadPage = () => {
    const fileInputRef = useRef(null);
    const [isVideoVisible, setIsVideoVisible] = useState(false);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            console.log("File uploaded:", file);
            setIsVideoVisible(true);
        }
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file) {
            console.log("File dropped:", file);
            setIsVideoVisible(true);
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault(); 
    };

    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    const handleVideoEnd = () => {
        setIsVideoVisible(false);
    };

    return (
        <div className="flex flex-col w-screen p-0 m-0 overflow-x-hidden relative min-h-screen">
            <Header />
            {isVideoVisible && (
                <div className="fixed top-0 left-0 flex flex-col w-full h-full justify-center items-center bg-white z-50 opacity-90">
                    <video src="upload-video.mp4" autoPlay muted className="w-[1100px] h-[700px] p-10 z-10"onEnded={handleVideoEnd}
                    />
                </div>
            )}

            <div className="flex flex-grow justify-center items-center border-[1px]"onDrop={handleDrop} onDragOver={handleDragOver}>
                <div className="flex flex-col justify-center items-center rounded-lg border-dashed border-2 border-gray-300 hover:border-gray-400 cursor-pointer w-3/4 h-2/3 m-32 p-32" onClick={handleImageClick}>
                    <img src="src/assets/images/upload-2.svg" alt="Upload symbol" className="flex" />
                    <div className="font-sserif text-[#A3A3A3] font-semibold">Upload PDF/Word File</div>
                    <input type="file" accept=".pdf,.doc,.docx" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default UploadPage;
