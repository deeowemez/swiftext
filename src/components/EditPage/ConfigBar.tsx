import React, { useState, useRef, useEffect, Profiler } from "react";
import ReactQuill from 'react-quill';
import Quill from "quill";
import 'react-quill/dist/quill.snow.css';
import arrowIcon from "../../assets/images/expand-arrow.svg";
import { CommentedHighlight } from "./types";
import { HighlightColorProfileProps } from "./ContextMenu";

interface ConfigBarProps {
  highlights: Array<CommentedHighlight>;
  highlightColorProfile: HighlightColorProfileProps[];
}

const ConfigBar: React.FC<ConfigBarProps> = ({
  highlights,
  highlightColorProfile
}) => {

  const [editorHtml, setEditorHtml] = useState('');

  const quillRef = useRef<ReactQuill | null>(null);

  useEffect(() => {
    // Generate content based on highlights and their associated color profiles
    const content = highlights.flatMap((highlight) => {
      const matchingProfile = highlightColorProfile.find(
        (profile) =>
          profile.highlightColorProfile.S === highlight.profileID &&
          profile.configColor.S === highlight.color
      );

      return [
        {
          insert: 'adsf',
          attributes: {
            color: '#a89932',
            size: 'medium',
            codeblock: 'true',
          },
        },
        {
          insert: "This is bold and italic text.\n",
          attributes: { bold: true, indent: 2, size: 'huge' },
        },
        {
          insert: "This is a code block.\n",
          attributes: { font: "monospace" },
        },
      ]

      // if (matchingProfile) {
      //   console.log('mp: ', matchingProfile);
      //   return [
      // {
      //   insert: highlight.content.text,
      //   attributes: {
      //     indent: matchingProfile.indent,
      //     color: matchingProfile.configColor.S,
      //     size: matchingProfile.indent.S,
      //   },
      // },
      // { insert: '\n' },
      // ];
      // }

      // return []; // Skip highlights without a matching profile
    });


    // Access Quill editor instance
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      editor.setContents(content); // Set the custom content with formats
    }
  }, [highlights, highlightColorProfile]);

  const handleChange = (value: string) => {
    setEditorHtml(value); // This will capture the content of the editor
  };

  const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],
    ['link', 'image', 'video', 'formula'],

    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
    [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction

    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],

    ['clean']                                         // remove formatting button
  ];

  const toolbarsize = [
    [{ 'size': ['14px', '16px', '18px'] }],
  ];

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
            // readOnly={true}
            theme="snow"
            modules={{ toolbar: false }}
          />
          <h3>Editor Output:</h3>
          <div></div>
        </div>
      </div>
    </div>
  )
}

export default ConfigBar;