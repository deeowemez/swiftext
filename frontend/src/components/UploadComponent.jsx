import React, { useRef, useState } from "react";
import '../styles/index.css';

import uploadIcon from "../assets/images/upload-2.svg";

const UploadComponent = ({
    user,
    setUser,
    onFileUploaded
}) => {
    const fileInputRef = useRef(null);
    const [isVideoVisible, setIsVideoVisible] = useState(false);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            console.log("File uploaded:", file);
            setIsVideoVisible(true);
            if (onFileUploaded) {
                setTimeout(() => onFileUploaded(file), 4000); 
            }
        }
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file) {
            console.log("File dropped:", file);
            setIsVideoVisible(true);
            if (onFileUploaded) {
                setTimeout(() => onFileUploaded(file), 4000); 
            }
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
        <div className="flex flex-col flex-1 w-screen p-0 m-0 overflow-x-hidden relative">
            {isVideoVisible && (
                <div className="fixed top-0 left-0 flex flex-col w-full h-full justify-center items-center bg-white z-50 opacity-90">
                    <video
                        src="upload-video.mp4"
                        autoPlay
                        muted
                        className="w-[1100px] h-[700px] p-10 z-10"
                        onEnded={() => setIsVideoVisible(false)}
                    />
                </div>
            )}

            <div
                className="flex flex-grow justify-center items-center"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
            >
                <div
                    className="flex flex-col justify-center items-center rounded-lg font-sserif text-gray-400 border-dashed border-2 border-gray-300 hover:border-gray-400 hover:text-gray-500 cursor-pointer w-3/4 h-2/3 m-12 p-56"
                    onClick={() => fileInputRef.current.click()}
                >
                    <img src={uploadIcon} alt="Upload symbol"  />
                    Upload PDF File
                    <input
                        type="file"
                        accept=".pdf"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </div>
            </div>
        </div>
    );
}

export default UploadComponent;
