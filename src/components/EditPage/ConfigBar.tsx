import React, { useState, useRef, useEffect, Profiler } from "react";
import ReactQuill from 'react-quill';
import { useParams } from "react-router-dom";
import Quill from "quill";
import 'react-quill/dist/quill.snow.css';
import arrowIcon from "../../assets/images/expand-arrow.svg";
import axios, { AxiosError } from "axios";
import { CommentedHighlight } from "./types";
import { HighlightColorProfileProps } from "./ContextMenu";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { saveAs } from 'file-saver';
import * as quillToWord from 'quill-to-word';
import { pdfExporter } from 'quill-to-pdf';

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
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null);
  const { '*': filePath } = useParams();

  useEffect(() => {
    // Auto-save highlights after 5 seconds of inactivity
    const autoSave = async () => {
      if (highlights.length > 0) {
        console.log('Auto-saving highlights...');
        try {
          await axios.post(
            `http://localhost:5000/api/highlights?filePath=${encodeURIComponent(filePath || "")}`,
            { highlights }
          );
          console.log('Highlights saved successfully');
        } catch (error) {
          console.error('Error saving highlights:', error);
        }
      }
    };

    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer);
    }

    const timer = setTimeout(() => {
      autoSave();
    }, 5000); // Delay auto-save for 5 seconds

    setAutoSaveTimer(timer);

    return () => {
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
      }
    };
  }, [highlights, filePath]);

  useEffect(() => {
    // Generate content based on highlights and their associated color profiles

    const content = highlights.flatMap((highlight) => {
      // console.log('highlights: ', highlight);
      // console.log('profile: ', highlightColorProfile);
      const matchingProfile = highlightColorProfile.find(
        (profile) =>
          profile.configID.S === highlight.configID
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

  const exportToPDF = async () => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      try {
        // Use the editor's HTML content
        const delta = editor.getContents();
        const pdfAsBlob = await pdfExporter.generatePdf(delta); // converts to PDF
        saveAs(pdfAsBlob, 'pdf-export.pdf'); // downloads from the browser
      } catch (error) {
        console.error("Error generating PDF:", error);
      }
    } else {
      console.error("Quill editor content not found");
    }
  };
  


  const exportToWord = async () => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      const delta = editor.getContents(); // Get the Quill editor's delta

      const quillToWordConfig: { exportAs: "blob" | "doc" | "buffer" | "base64" } = {
        exportAs: 'blob', // Explicitly type as one of the allowed values
      };

      const docAsBlob = await quillToWord.generateWord(delta, quillToWordConfig) as Blob;
      saveAs(docAsBlob, 'word-export.docx');
    }
  };

  // const saveHighlights = async () => {
  //   console.log('filepath: ', filePath);
  //   if (highlights.length > 0) {
  //     // Send highlights data to the server
  //     const response = await axios.post(
  //       `http://localhost:5000/highlights?filePath=${encodeURIComponent(filePath || "")}`,
  //       { highlights } // Send highlights in the request body
  //     );

  //     console.log('Highlights saved successfully:', response.data);
  //   } else {
  //     console.log('No highlights to save.');
  //   }
  // }


  return (
    <div className="flex min-h-screen w-full items-start font-sserif relative">
      {/* <img src={arrowIcon} alt="arrow-icon" className="cursor-pointer w-5 my-2 mx-3" /> */}
      <div className="flex flex-1 flex-col gap-2 bg-[#F4F4F4] p-8 h-screen text-center " >
        {/* <div className="bg-white flex-[1] rounded-ss-lg">Highlighter color config</div> */}
        <div>
          {/* <button className="px-8 py-2 font-sserif border border-[#FFBF8F] text-[#FFBF8F] rounded-md text-xs"
            onClick={saveHighlights}
          >
            Save highlights
          </button> */}
          Annotations
          <button className="px-8 py-2 font-sserif border border-[#FFBF8F] text-[#FFBF8F] rounded-md text-xs"
            onClick={exportToPDF}>
            PDF
          </button>
          <button className="px-8 py-2 font-sserif border border-[#FFBF8F] text-[#FFBF8F] rounded-md text-xs"
            onClick={exportToWord}>
            Word
          </button>
        </div>
        <div className="bg-white flex-1 rounded-ss-lg overflow-y-auto">
          <ReactQuill
            value={editorHtml}
            onChange={handleChange}
            ref={quillRef}
            readOnly={true}
            theme="snow"
            className="h-full"
            modules={{ toolbar: false }}
          />
          <div></div>
        </div>
      </div>
    </div>
  )
}

export default ConfigBar;