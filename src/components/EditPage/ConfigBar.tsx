import React, { useState, useRef, useEffect } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import arrowIcon from "../../assets/images/expand-arrow.svg";

const ConfigBar = () => {
    const [editorHtml, setEditorHtml] = useState('');

    const quillRef = useRef<ReactQuill | null>(null);

    useEffect(() => {
        // Define the pre-filled content and its custom formatting
        const content = [
          {
            insert: "This is a Heading 1 example\n",
            attributes: { header: 1 },
          },
          {
            insert: "This is a styled paragraph.\n",
            attributes: { bold: true, color: "#ff5733" },
          },
          {
            insert: "This text is highlighted in yellow.\n",
            attributes: { background: "#ffff00" },
          },
          {
            insert: "Another indented bullet list item.\n",
            attributes: { list: "", indent: 6 },
          },
        ];
    
        // Access Quill editor instance
        if (quillRef.current) {
          const editor = quillRef.current.getEditor();
          editor.setContents(content); // Set the custom content with formats
        }
      }, []);

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
                        value={editorHtml}
                        onChange={handleChange}
                        ref={quillRef}
                        readOnly={true} // Make editor read-only to hide toolbar and editing
                        theme="snow"
                        modules={{ toolbar: false }} // Disable toolbar
                    />
                    <h3>Editor Output:</h3>
                    <div></div>
                </div>
            </div>
        </div>
    )
}

export default ConfigBar;