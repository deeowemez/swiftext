import React, { useState } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import arrowIcon from "../../assets/images/expand-arrow.svg";

const ConfigBar = () => {
    const [editorHtml, setEditorHtml] = useState('');

    const handleChange = (value: string) => {
        setEditorHtml(value); // This will capture the content of the editor
    };

    return (
        <div className="flex min-h-screen w-full items-start font-sserif">
            {/* <img src={arrowIcon} alt="arrow-icon" className="cursor-pointer w-5 my-2 mx-3" /> */}
            <div className="flex flex-1 flex-col gap-6 bg-[#F4F4F4] p-8 min-h-screen text-center" >
                <div className="bg-white flex-grow rounded-ss-lg">Highlighter color config</div>
                <div className="bg-white flex-grow rounded-ss-lg">
                    <ReactQuill
                        value='gay adee'
                        onChange={handleChange}
                        theme="snow" // You can also use 'bubble' theme
                        modules={{
                            toolbar: [
                                [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                ['bold', 'italic', 'underline'],
                                [{ 'align': [] }],
                                ['link'],
                                [{ 'color': [] }, { 'background': [] }],
                                ['blockquote', 'code-block'],
                                ['image'],
                            ],
                        }}
                    />
                    <h3>Editor Output:</h3>
                    <div></div>
                </div>
            </div>
        </div>
    )
}

export default ConfigBar;