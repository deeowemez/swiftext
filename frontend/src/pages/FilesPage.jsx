import React, { useRef, useState, useEffect } from "react";
import axios from 'axios';
import Header from "../components/Homepage/Header";
import Footer from "../components/Homepage/Footer";
import { useNavigate } from 'react-router-dom';
import Login from "../components/Homepage/Login";
import CreateAccount from "../components/Homepage/CreateAccount";


const FilesPage = ({
    user,
    setUser
}) => {
    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    const [selectedUploadFile, setSelectedUploadFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('');
    const [fileMenu, setFileMenu] = useState(null);
    const [files, setFiles] = useState([]); // State to store uploaded files    
    const [overlayType, setOverlayType] = useState(null);
    const [showInvalidUserPopup, setShowInvalidUserPopup] = useState(false);

    // initial loading of files every time files page viewed
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        console.log('user filespage: ', storedUser);

        if (storedUser && storedUser.userID) {
            const fetchFiles = async () => {
                try {
                    const response = await axios.get(`http://localhost:5000/api/files?userID=${storedUser.userID}`);
                    console.log('response data: ', response.data);
                    setFiles(response.data);
                } catch (error) {
                    console.error('Error fetching files:', error);
                }
            };
            fetchFiles();
        } else {
            setFiles([]);
        }
    }, [user]);

    // Add event listener to close dropdown when clicking outside
    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (showInvalidUserPopup) {
            const timer = setTimeout(() => {
                setShowInvalidUserPopup(false); // Hide the popup after showing it
            }, 3000); // Adjust the delay (in milliseconds) as needed

            return () => clearTimeout(timer); // Cleanup timer on unmount or state change
        }
    }, [showInvalidUserPopup]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedUploadFile(file);
        if (file) {
            handleFileUpload(file);
        }
    };

    const handleOverlayClose = () => {
        setOverlayType(null);
    };

    // Toggle dropdown visibility
    const toggleDropdown = (fileId) => {
        setFileMenu((prevFileMenu) => (prevFileMenu === fileId ? null : fileId));
    };

    const handleClickOutside = (event) => {
        if (!event.target.closest('.file-card')) {
            setFileMenu(null); // Close the dropdown if clicked outside
        }
    };

    const handleFileUpload = async (file) => {
        if (!user || !user.userID) {
            setUploadStatus('You must be logged in to upload files.');
            // window.alert('You must be logged in to upload files.');
            setShowInvalidUserPopup(!showInvalidUserPopup);
            setOverlayType("login");
            return;
        }

        if (!file) {
            setUploadStatus('Please select a file to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        console.log('userID: ', user.userID);

        try {
            const response = await axios.post(`http://localhost:5000/api/files/upload?userID=${user.userID}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Fetch updated files list after successful upload
            const updatedFiles = await axios.get(`http://localhost:5000/api/files?userID=${user.userID}`);
            console.log('updatedFiles.data: ', updatedFiles.data)
            setFiles(updatedFiles.data);  // Update files state to trigger re-render

        } catch (error) {
            setUploadStatus('Upload failed. Please try again.');
        }
    };

    const handleDeleteFile = async (file) => {
        try {
            console.log('file info: ', file);
            const response = await axios.delete(`http://localhost:5000/api/files/${file.id}`);
            console.log('File deleted successfully:', response.data);

            const updatedFiles = await axios.get(`http://localhost:5000/api/files?userID=${user.userID}`);
            console.log('updatedFiles.data: ', updatedFiles.data)
            setFiles(updatedFiles.data);  // Update files state to trigger re-render
        } catch (error) {
            console.error('Error deleting file:', error);
        }
    }

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
        try {
            navigate(`/edit/${file.filepath}`);
        } catch (error) {
            console.error('Error fetching the file:', error);
        }
    };

    return (
        <div className="flex flex-col w-screen min-h-screen font-sserif">
            <Header
                user={user}
                setUser={setUser}
                onLoginClick={() => setOverlayType("login")}
                onSignUpClick={() => setOverlayType("createAccount")}
            />
            <div className="flex flex-col flex-1 py-10 px-36" onDrop={handleDrop} onDragOver={handleDragOver}>
                <div className="flex justify-between">
                    <div className="flex bg-[#F4F4F4] md:w-1/2 h-[35px] relative rounded-lg">
                        <img src="src/assets/images/search.svg" alt="search icon" className="w-[12px] absolute top-[12px] left-[15px]" />
                        <input type="text" placeholder="Search files" className="absolute h-[35px] left-[40px] bg-transparent text-[#333333] outline-none w-11/12 " />
                    </div>
                    <div className="flex gap-5 text-[#5A5959] text-sm items-center">
                        <div className="p-2 hover:bg-slate-100 rounded-full mr-3 cursor-pointer"
                            onClick={handleImageClick}
                        >
                            <input type="file" onChange={handleFileChange} accept="application/pdf" ref={fileInputRef} style={{ display: 'none' }} />
                            <img src="src/assets/images/plus.svg" alt="upload svg" className="w-[20px] " />
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
                    {files.map((file) => (
                        <div
                            key={file.id}
                            className="file-card flex items-center justify-start group bg-[#F4F4F4] rounded-md h-12 w-full min-w-full max-w-full gap-3 px-5 py-9 cursor-pointer"
                            onClick={() => selectEditFile(file)}
                        >
                            <div className="bg-[#333333] w-1/12 text-white text-center ">thumbnail prev</div>
                            <div className="flex flex-col w-11/12 relative">
                                <p className="text-left text-md overflow-clip">{file.filename}</p>
                                <div className="flex justify-between">
                                    <p className="text-right text-xs italic">{new Date(file.last_modified).toLocaleTimeString()}</p>
                                    <div className="flex gap-4 items-center relative group">
                                        <div className="bg-[#F8968E] w-3 h-3 rounded-full"></div>
                                        <div className="relative">
                                            <img src="src/assets/images/more-alt.svg" alt="more svg" className="cursor-pointer w-4"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleDropdown(file.id);
                                                }}
                                            />
                                            {/* Dropdown Menu */}
                                            {fileMenu === file.id && (
                                                <div className="dropdown-container absolute right-0 bg-white border border-gray-300 rounded shadow-md mt-2 w-40 z-20">
                                                    <ul className="text-[#5A5959]">
                                                        <li
                                                            className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteFile(file);
                                                                setFileMenu(false);
                                                            }}
                                                        >
                                                            Delete File
                                                        </li>
                                                        {/* <li
                                                            className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                // handleEditTag(file);
                                                                setFileMenu(false); // Close dropdown after action
                                                            }}
                                                        >
                                                            Edit Tag
                                                        </li> */}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {overlayType === "login" && <Login
                setUser={setUser}
                onClose={handleOverlayClose} />}
            {overlayType === "createAccount" && <CreateAccount onClose={handleOverlayClose} />}
            {showInvalidUserPopup && (
                <div className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded shadow-md">
                    Please login to save files in the system! Thank you for understanding.
                </div>
            )}
        </div >
    );
};

export default FilesPage;
