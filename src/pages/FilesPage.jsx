import React, { useRef, useState, useEffect } from "react";
import axios from 'axios';
import Header from "../components/Homepage/Header";
import Footer from "../components/Homepage/Footer";
import { useNavigate } from 'react-router-dom';


const FilesPage = ({ selectedFile, setSelectedFile }) => {
    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    const [selectedUploadFile, setSelectedUploadFile] = useState(null);
    // const [selectedFile, setSelectedFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('');
    const [files, setFiles] = useState([]); // State to store uploaded files    

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/uploads');
                console.log('response data: ', response.data);
                setFiles(response.data);
            } catch (error) {
                console.error('Error fetching files:', error);
            }
        };
        fetchFiles();
    }, []);


    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedUploadFile(file);
        if (file) {
            handleFileUpload(file);
        }
    };

    const handleFileUpload = async (file) => {
        if (!file) {
            setUploadStatus('Please select a file to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:5000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Fetch updated files list after successful upload
            const updatedFiles = await axios.get('http://localhost:5000/api/uploads');
            console.log('updatedFiles.data: ', updatedFiles.data)
            setFiles(updatedFiles.data);  // Update files state to trigger re-render

        } catch (error) {
            setUploadStatus('Upload failed. Please try again.');
        }
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const file = event.dataTransfer?.files[0];
        if (file) {
            setSelectedUploadFile(file);
            handleFileUpload(file);
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    const selectEditFile = async (file) => {
        console.log('Selected file for Edit Page: ', file.filename);
        try {
            const response = await fetch(file.filepath);
            const modResponse = 'backend' + response;
            console.log('response: ', response);
            console.log('modresponse: ', modResponse);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const blob = await response.blob();

            const selectedFile = new File([blob], file.filename, { type: blob.type });
            setSelectedFile(selectedFile);
            navigate('/edit');
        } catch (error) {
            console.error('Error fetching the file:', error);
        }
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
                        <div className="px-8">
                            <input type="file" onChange={handleFileChange} accept="application/pdf" ref={fileInputRef} style={{ display: 'none' }} />
                            <img src="src/assets/images/circle-plus.svg" alt="upload svg" className="w-[20px] cursor-pointer hover:bg-slate-200 rounded-full" onClick={handleImageClick} />
                        </div>
                        <p>File</p>
                        <img src="src/assets/images/line.svg" alt="" />
                        <p>Folder</p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-10 max-w-4/5 px-3 py-4">
                    <button className="bg-[#F8968E] text-white px-3 py-1 rounded-2xl">#urgent</button>
                </div>
                <div className="flex px-7 py-2 gap-6">
                    <img src="src/assets/images/mark-dropdown.svg" alt="reload svg" className="w-[35px]" />
                    <img src="src/assets/images/reload.svg" alt="reload svg" className="w-[18px]" />
                </div>
                <div className="file-cards flex flex-col gap-2 py-6 w-full">
                    {/* Dynamically create file cards */}
                    {files.map((file, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-start bg-[#F4F4F4] rounded-md h-12 w-full min-w-full max-w-full gap-3 px-5 py-9 cursor-pointer"
                            onClick={() => selectEditFile(file)}
                        >
                            <div className="bg-[#333333] w-1/12 text-white text-center ">thumbnail prev</div>
                            <div className="flex flex-col w-11/12">
                                <p className="text-left text-md overflow-clip">{file.filename}</p>
                                <div className="flex justify-between">
                                    <p className="text-right text-xs italic">{new Date(file.last_modified).toLocaleTimeString()}</p>
                                    <div className="flex gap-4 items-center">
                                        <div className="bg-[#F8968E] w-3 h-3 rounded-full"></div>
                                        <img src="src/assets/images/more-alt.svg" alt="more svg" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* <Footer /> */}
        </div>
    );
};

export default FilesPage;
