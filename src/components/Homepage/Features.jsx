import React from "react";
import Footer from "./Footer";

const Features = () => {
    return (
        <div className="flex justify-center py-24 w-screen">
            <div className="w-4/5 py-20 bg-[#FFF9F5] rounded-3xl">
                <div className="font-sserif text-center">
                    <p className="text-4xl text-black font-medium">Swift Document Summarizer</p>
                    <p className="text-md text-[#5A5959]"> Highlight text and customize styles</p>
                </div>

                {/* Upload Feature */}
                <div className="flex flex-col sm:flex-col md:flex-col lg:flex-col xl:flex-row items-center justify-start">
                    <div className="relative w-4/5 lg:w-full xl:w-2/3">
                        <img src="src/assets/images/blob/features/ft-blob-1.svg" alt="Features Blob Design" className="my-12 md:-20 lg:m-20 xl:m-24 w-full lg:w-5/6 xl:w-5/6 max-w-[800px] " />
                        <img src="src/assets/images/gif/upload.gif" alt="" className="absolute top-24 left-14 md:top-[110px] md:left-[90px] lg:top-48 lg:left-[210px] xl:top-40 xl:left-[196px] w-3/5 lg:w-1/2 xl:w-1/2 max-w-[500px] " />
                    </div>
                    <div className="flex flex-col p-7 w-80 h-38 bg-[#FFFCFA] rounded-3xl ">
                        <div className="flex mb-3">
                            <img src="src/assets/images/upload.svg" alt="upload image" className="h-6 mr-3" />
                            <p className="font-sserif text-xl text-black font-medium">Convert Uploaded Files</p>
                        </div>
                        <p className="font-dmsans text-sm text-[#737373]">Upload PDF/Word files and interact by highlight key text for easy formatting and export</p>
                    </div>
                </div>

                {/* Custom Color Coding Feature */}
                <div className="flex flex-col sm:flex-col md:flex-col lg:flex-col xl:flex-row items-center justify-end">
                    <div className="flex flex-col p-7 w-80 h-38 bg-[#FFFCFA] rounded-3xl order-2 xl:order-1 ">
                        <div className="flex mb-3">
                            <img src="src/assets/images/pallet.svg" alt="pallet image" className="h-6 mr-3" />
                            <p className="font-sserif text-xl text-black font-medium">Custom Color Coding</p>
                        </div>
                        <p className="font-dmsans text-sm text-[#737373]">Highlight information in your documents by assigning different colors for different purposes with a customizable color palette </p>
                    </div>
                    <div className="relative w-4/5 lg:w-full xl:w-2/3 order-1 xl:order-2" >
                        <img src="src/assets/images/blob/features/ft-blob-2.svg" alt="Features Blob Design" className="my-12 md:-20 lg:m-20 xl:m-24 w-full lg:w-5/6 xl:w-5/6 max-w-[800px]" />
                        <img src="src/assets/images/gif/custom-gif.gif" alt="" className="absolute top-[110px] left-12 md:top-[140px] md:left-[80px] lg:top-48 lg:left-[150px] xl:top-52 xl:left-[180px] w-4/5 lg:w-2/3 xl:w-2/3 max-w-[650px] rounded-[180px] " />
                    </div>
                </div>

                {/* Real Time Preview Feature */}
                <div className="flex flex-col sm:flex-col md:flex-col lg:flex-col xl:flex-row items-center justify-start">
                    <div className="relative w-4/5 lg:w-full xl:w-2/3">
                        <img src="src/assets/images/blob/features/ft-blob-3.svg" alt="Features Blob Design" className="my-12 md:-20 lg:m-20 xl:m-24 w-full lg:w-5/6 xl:w-5/6 max-w-[800px] " />
                        <img src="src/assets/images/gif/real-time-gif.gif" alt="" className="absolute top-36 left-12 md:top-48 md:left-[90px] lg:top-64 lg:left-[210px] xl:top-64 xl:left-[196px] w-3/5 lg:w-1/2 xl:w-1/2 max-w-[500px] rounded-[180px]" />
                    </div>
                    <div className="flex flex-col p-7 w-80 h-38 bg-[#FFFCFA] rounded-3xl ">
                        <div className="flex mb-3">
                            <img src="src/assets/images/clock.svg" alt="clock image" className="h-6 mr-3" />
                            <p className="font-sserif text-xl text-black font-medium">Real-Time Preview</p>
                        </div>
                        <p className="font-dmsans text-sm text-[#737373]">See your changes as you make them. Get a real-time view of your document, complete with highlights and annotations.</p>
                    </div>
                </div>

                {/* Tagging Feature */}
                <div className="flex flex-col sm:flex-col md:flex-col lg:flex-col xl:flex-row items-center justify-end">
                    <div className="flex flex-col p-7 w-80 h-38 bg-[#FFFCFA] rounded-3xl order-2 xl:order-1  ">
                        <div className="flex mb-3">
                            <img src="src/assets/images/tag.svg" alt="tag image" className="h-6 mr-3" />
                            <p className="font-sserif text-xl text-black font-medium">Tagging & Organization</p>
                        </div>
                        <p className="font-dmsans text-sm text-[#737373]">Keep your files organized with custom tags and categories. Use filters to quickly find specific documents. </p>
                    </div>
                    <div className="relative w-4/5 lg:w-full xl:w-2/3 order-1 xl:order-2">
                        <img src="src/assets/images/blob/features/ft-blob-4.svg" alt="Features Blob Design" className="my-12 md:-20 lg:m-20 xl:m-24 w-full lg:w-5/6 xl:w-5/6 max-w-[800px]" />
                        <img src="src/assets/images/gif/tag.gif" alt="" className="absolute top-[130px] left-[70px] md:top-[160px] md:left-[110px] lg:top-60 lg:left-[200px] xl:top-[240px] xl:left-[220px] w-3/5 lg:w-1/2 xl:w-6/12 max-w-[600px] rounded-[80px] xl:rounded-[90px] " />
                    </div>
                </div>  

            </div>
        </div>
    )
}

export default Features;