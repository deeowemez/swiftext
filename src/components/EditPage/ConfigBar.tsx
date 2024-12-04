import React, { useState, useRef, useEffect, Profiler } from "react";
import ReactQuill from 'react-quill';
import Quill from "quill";
import 'react-quill/dist/quill.snow.css';
import arrowIcon from "../../assets/images/expand-arrow.svg";
import { CommentedHighlight } from "./types";
import { HighlightColorProfileProps } from "./ContextMenu";

const Font = Quill.import("formats/font") as any;
Font.whitelist = ["arial", "courier", "georgia", "times-new-roman", "verdana"];
Quill.register(Font, true);

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
      console.log('highlights: ', highlight);
      console.log('profile: ', highlightColorProfile);
      const matchingProfile = highlightColorProfile.find(
        (profile) =>
          // profile.highlightColorProfile.S === highlight.profileID &&
          profile.configColor.S === highlight.color
      );

      if (matchingProfile) {
        console.log('mp: ', matchingProfile);
        return [
          {
            insert: highlight.content.text + '\n',
            attributes: {
              color: matchingProfile.color.S,
              background: matchingProfile.background.S,
              font: matchingProfile.font.S,
              bold: matchingProfile.bold.BOOL,
              italic: matchingProfile.italic.BOOL,
              underline: matchingProfile.underline.BOOL,
              strike: matchingProfile.strike.BOOL,
              header: matchingProfile.header.N,
              list: matchingProfile.list.S,
              script: matchingProfile.script.S,
              indent: matchingProfile.indent.N,
              align: matchingProfile.align.S,
              size: matchingProfile.size.S,
            },
          },
        ];
      }

      return [];
    });

    // Access Quill editor instance
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      // editor.setContents([
      //   { insert: "This text is highlighted in yellow. \n", attributes: { list: "ordered", indent: 0 } },
      //   { insert: "This text is highlighted in yellow. \n", attributes: { list: "ordered", indent: 0 } },
      //   { insert: "This text is highlighted in yellow. \n", attributes: { list: "", indent: 0 } },
      //   { insert: "This text is highlighted in yellow. \n", attributes: { list: "ordered", indent: 0 } },
      // ]);
      editor.setContents(content);
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

  return (
    <div className="flex min-h-screen w-full items-start font-sserif relative">
      {/* <img src={arrowIcon} alt="arrow-icon" className="cursor-pointer w-5 my-2 mx-3" /> */}
      <div className="flex flex-1 flex-col gap-6 bg-[#F4F4F4] p-8 h-screen text-center " >
        {/* <div className="bg-white flex-[1] rounded-ss-lg">Highlighter color config</div> */}
        <div className="bg-white flex-[3] rounded-ss-lg overflow-y-auto">
          <ReactQuill
            value={editorHtml}
            onChange={handleChange}
            ref={quillRef}
            readOnly={true}
            theme="snow"
            modules={{ toolbar: false }}
          />
          <div></div>
        </div>
      </div>
    </div>
  )
}

export default ConfigBar;