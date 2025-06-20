import React, {
  useState,
  useRef,
  useEffect,
  Profiler,
  Dispatch,
  SetStateAction,
} from "react";
import ReactQuill from "react-quill";
import { useParams } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import arrowIcon from "../../assets/images/expand-arrow.svg";
import axios, { AxiosError } from "axios";
import { CommentedHighlight } from "./types";
import { HighlightColorProfileProps } from "./ContextMenu";
import { saveAs } from "file-saver";
import * as quillToWord from "quill-to-word";
import { User } from "../../pages/EditPage";
import Quill from "quill";
import IcontipButton from "./IcontipButton";
import wordIcon from "../../assets/images/word.svg";
import pdfIcon from "../../assets/images/pdf.svg";
import rearrangeIcon from "../../assets/images/rearrange.svg";
import indicatorIcon from "../../assets/images/indicator.svg";
// import "dotenv/config.js";
// require('dotenv').config();

interface ConfigBarProps {
  user: User;
  setUser: void;
  highlights: Array<CommentedHighlight>;
  setHighlights: (highlights: Array<CommentedHighlight>) => void;
  highlightColorProfile: HighlightColorProfileProps[];
  showArrangementOverlay: boolean;
  setShowArrangementOverlay: Dispatch<SetStateAction<boolean>>;
}

const ConfigBar: React.FC<ConfigBarProps> = ({
  user,
  setUser,
  highlights,
  setHighlights,
  highlightColorProfile,
  showArrangementOverlay,
  setShowArrangementOverlay,
}) => {
  const [editorHtml, setEditorHtml] = useState("");
  const quillRef = useRef<ReactQuill | null>(null);
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(
    null,
  );
  const [showColorIndicator, setShowColorIndicator] = useState<boolean>(false);
  const { "*": filePath } = useParams();
  const [showDownloadSuccess, setDownloadSuccess] = useState<boolean | null>(
    null,
  ); // Update the state type
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    // setUser(storedUser);
    console.log("user configbar: ", storedUser);
  }, []);

  // Download File Prompts
  useEffect(() => {
    if (showDownloadSuccess !== null) {
      const timer = setTimeout(() => {
        setDownloadSuccess(null);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [showDownloadSuccess]);

  useEffect(() => {
    // Auto-save highlights after 5 seconds of inactivity
    const autoSave = async () => {
      console.log("Auto-saving highlights...");
      try {
        await axios.post(
          `${backendUrl}/api/highlights?filePath=${encodeURIComponent(filePath || "")}`,
          { highlights },
        );
        console.log("Highlights saved successfully");
      } catch (error) {
        console.error("Error saving highlights:", error);
      }
    };

    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer);
    }

    const timer = setTimeout(() => {
      autoSave();
    }, 1000); // Delay auto-save for 5 seconds

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
      console.log("profile: ", highlightColorProfile);
      const matchingProfile = highlightColorProfile.find(
        (profile) => profile.configID.S === highlight.configID,
      );

      if (matchingProfile) {
        // console.log('mp: ', matchingProfile);
        if (highlight.type === "text") {
          if (showColorIndicator) {
            return [
              {
                insert: "❚ ",
                attributes: {
                  color: matchingProfile.configColor.S,
                  bold: true,
                  align: matchingProfile.align.S,
                  size: matchingProfile.size.S,
                },
              },
              {
                insert: highlight.content.text + "\n",
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
                  indent: matchingProfile.indent.N,
                  align: matchingProfile.align.S,
                  size: matchingProfile.size.S,
                },
              },
            ];
          } else {
            return [
              {
                insert: highlight.content.text + "\n",
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
                  indent: matchingProfile.indent.N,
                  align: matchingProfile.align.S,
                  size: matchingProfile.size.S,
                },
              },
            ];
          }
        }
      } else if (highlight.type === "area") {
        return [
          {
            insert: {
              image: highlight.content.image,
            },
          },

          { insert: "\n" }, // Insert a newline after the image
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
  }, [highlights, highlightColorProfile, showColorIndicator]);

  useEffect(() => {
    if (showDownloadSuccess !== null) {
      // Message appears and disappears after 3 seconds
      const timer = setTimeout(() => {
        setDownloadSuccess(null); // Hide the message
      }, 3000);

      return () => clearTimeout(timer); // Clean up the timer if the component is unmounted
    }
  }, [showDownloadSuccess]); // Run this effect whenever showDownloadSuccess changes

  const handleChange = (value: string) => {
    setEditorHtml(value); // This will capture the content of the editor
  };

  const toolbarOptions = [
    ["bold", "italic", "underline", "strike"], // toggled buttons
    ["blockquote", "code-block"],
    ["link", "image", "video", "formula"],

    [{ header: 1 }, { header: 2 }], // custom button values
    [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
    [{ script: "sub" }, { script: "super" }], // superscript/subscript
    [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
    [{ direction: "rtl" }], // text direction

    [{ size: ["small", false, "large", "huge"] }], // custom dropdown
    [{ header: [1, 2, 3, 4, 5, 6, false] }],

    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ font: [] }],
    [{ align: [] }],

    ["clean"], // remove formatting button
  ];

  const exportToPDF = async () => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    console.log("user configbar: ", storedUser);

    try {
      const docFile = await exportToWord(false);
      if (!(docFile instanceof Blob)) {
        console.error(
          "Error: Failed to generate Word file or the result is not a Blob",
        );
        setDownloadSuccess(false);
        return;
      }

      const formData = new FormData();
      console.log("export pdf user: ", storedUser.userID);
      console.log("docfile", docFile);
      formData.append("file", docFile, "pdf-export.docx");
      const responseUpload = await axios.post(
        `${backendUrl}/api/files/upload?userID=${storedUser.userID}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      const fileId = responseUpload.data.id;
      console.log("wordtopdf fileid: ", responseUpload.data);

      const response = await axios.get(
        `${backendUrl}/api/files/convert?fileId=${fileId}`,
        {
          responseType: "blob", // Important to handle binary data
        },
      );

      console.log("convertResponse headers:", response.headers);

      if (response.status === 200) {
        // Create a Blob from the response data
        const blob = new Blob([response.data], { type: "application/pdf" });

        // Create a URL for the Blob
        const blobUrl = window.URL.createObjectURL(blob);

        // Create a hidden anchor element to trigger the download
        const a = document.createElement("a");
        a.href = blobUrl;

        // Extract the filename from the Content-Disposition header, if available
        const contentDisposition = response.headers["content-disposition"];
        console.log("content disposition: ", contentDisposition);
        let fileName = "downloaded-file.pdf"; // Default filename
        if (contentDisposition) {
          const match = contentDisposition.match(/filename="(.+)"/);
          if (match && match[1]) {
            fileName = match[1];
          }
        }

        a.download = fileName; // Set the filename for the download
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Clean up the Blob URL
        window.URL.revokeObjectURL(blobUrl);

        console.log("File downloaded successfully.");
        setDownloadSuccess(true);
      } else {
        console.error("Error during file download:", response.statusText);
        setDownloadSuccess(false);
      }
    } catch (error) {
      setDownloadSuccess(false);
      console.error("Error fetching the file:", error);
    }
  };

  const exportToWord = async (exportWordOnly: boolean) => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      const delta = editor.getContents();
      console.log("delta: ", delta);

      // Filter out all ops where 'insert' is equal to '• '
      const cleanedOps = delta.ops.filter((op) => op.insert !== "❚ ");

      // Optionally, you can set the cleaned delta back into the editor
      // editor.setContents(cleanedOps);

      const quillToWordConfig: {
        exportAs: "blob" | "doc" | "buffer" | "base64";
      } = {
        exportAs: "blob",
      };

      const docAsBlob = (await quillToWord.generateWord(
        { ops: cleanedOps },
        quillToWordConfig,
      )) as Blob;
      if (exportWordOnly) {
        saveAs(docAsBlob, "word-export.docx");
        setDownloadSuccess(true);
      } else {
        setDownloadSuccess(true);
        return docAsBlob;
      }
    }
  };

  // const saveHighlights = async () => {
  //   console.log('filepath: ', filePath);
  //   if (highlights.length > 0) {
  //     // Send highlights data to the server
  //     const response = await axios.post(
  //       `${backendUrl}/highlights?filePath=${encodeURIComponent(filePath || "")}`,
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
      <div className="flex flex-1 flex-col gap-2 bg-[#F4F4F4] px-8 py-6 h-screen text-center ">
        {/* <div className="bg-white flex-[1] rounded-ss-lg">Highlighter color config</div> */}
        <div className="flex justify-between items-center mb-1">
          {/* <button className="px-8 py-2 font-sserif border border-[#FFBF8F] text-[#FFBF8F] rounded-md text-xs" onClick={saveHighlights}> Save highlights</button> */}

          <div className="flex gap-2 items-center">
            <IcontipButton
              className="p-1.5 flex items-center justify-center rounded-xl hover:bg-[#FFE7D4] cursor-pointer "
              icon={indicatorIcon}
              iconSize="w-5"
              altText="indicator-icon"
              tooltipText="Show Highlight Colors"
              direction="bottom"
              onClick={() => {
                setShowColorIndicator(!showColorIndicator);
                console.log("showColorIndicator: ", showColorIndicator);
              }}
            />

            <IcontipButton
              className="p-1.5 flex items-center justify-center rounded-xl hover:bg-[#FFE7D4] cursor-pointer"
              icon={rearrangeIcon}
              iconSize="w-[1rem]"
              altText="rearrange-icon"
              tooltipText="Rearrange Highlights"
              direction="bottom"
              onClick={() => {
                setShowArrangementOverlay(!showArrangementOverlay);
              }}
            />
          </div>

          <div className="flex gap-2">
            <IcontipButton
              className="p-1.5 flex items-center justify-center rounded-xl hover:bg-[#FFE7D4] cursor-pointer"
              icon={pdfIcon}
              iconSize="w-5"
              altText="pdf-icon"
              tooltipText="Save as PDF"
              direction="bottom"
              onClick={exportToPDF}
            />
            <IcontipButton
              className="p-1.5 flex items-center justify-center rounded-xl hover:bg-[#FFE7D4] cursor-pointer"
              icon={wordIcon}
              iconSize="w-5"
              altText="word-icon"
              tooltipText="Save as Word"
              direction="bottom"
              onClick={() => exportToWord(true)}
            />
          </div>
        </div>
        <div className="bg-white flex-1 rounded-ss-lg overflow-y-auto border border-red p-10">
          <ReactQuill
            value={editorHtml}
            onChange={handleChange}
            ref={quillRef}
            readOnly={true}
            theme="snow"
            className="h-full"
            modules={{ toolbar: false }}
          />
        </div>
      </div>
      {showDownloadSuccess !== null && (
        <div
          className={`fixed top-10 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded shadow-md ${
            showDownloadSuccess ? "bg-green-500" : "bg-red-500"
          } text-white`}
        >
          {showDownloadSuccess
            ? "File downloaded successfully!"
            : "Error downloading file. Please try again."}
        </div>
      )}
    </div>
  );
};

export default ConfigBar;
