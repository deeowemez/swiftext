import React, { MouseEvent, useEffect, useRef, useState } from "react";
import CommentForm from "./CommentForm";
import ContextMenu, { ContextMenuProps } from "./ContextMenu";
import ExpandableTip from "./ExpandableTip";
import HighlightContainer from "./HighlightContainer";
import Sidebar from "./Sidebar";
import Toolbar from "./Toolbar";
import {
  GhostHighlight,
  Highlight,
  PdfHighlighter,
  PdfHighlighterUtils,
  PdfLoader,
  Tip,
  ViewportHighlight,
} from "react-pdf-highlighter-extended";
import "../../style/App.css";
import { testHighlights as _testHighlights } from "./test-highlights";
import { CommentedHighlight } from "./types";
import Quill from "quill";
import ControlBar from "./ControlBar";
import { useParams } from "react-router-dom";

const getNextId = () => String(Math.random()).slice(2);

const parseIdFromHash = () => {
  return document.location.hash.slice("#highlight-".length);
};

const resetHash = () => {
  document.location.hash = "";
};

const EditPage = ({ selectedFile, setSelectedFile }) => {
  const { '*': filePath } = useParams();
  // const [selectedFile, setSelectedFile] = useState(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [highlights, setHighlights] = useState<Array<CommentedHighlight>>([]);
  const currentPdfIndexRef = useRef(0);
  const [contextMenu, setContextMenu] = useState<ContextMenuProps | null>(null);
  const [pdfScaleValue, setPdfScaleValue] = useState<number | undefined>(undefined,);
  const [highlightPen, setHighlightPen] = useState<boolean>(false);
  const highlighterUtilsRef = useRef<PdfHighlighterUtils>();

  useEffect(() => {
    console.log('filepath: ', filePath);
    const loadFileByPath = async () => {
      if (filePath) {
        
      //   const file = await fetchFileByPath(filePath); // Fetch file by its path
      //   if (file) {
      //     setPdfFile(file);
      //     const reader = new FileReader();
      //     reader.onload = (e) => {
      //       setUrl(e.target.result); // Load file into the PdfLoader
      //     };
      //     reader.readAsDataURL(file);
      //   }
      }
    };
  
    loadFileByPath();
  }, [filePath]);

  
  // // Read selectedfile
  // useEffect(() => {
  //   console.log('Selected File from Edit Page: ', selectedFile);
  //   if (selectedFile) {
  //     const reader = new FileReader();
  //     reader.onload = (e: ProgressEvent<FileReader>) => {
  //       if (e.target?.result) {
  //         setUrl(e.target.result as string);
  //       }
  //     };
  //     reader.readAsDataURL(selectedFile);
  //     setPdfFile(selectedFile);
      
  //     const filePath = selectedFile.filepath;  // Or any unique identifier for the file
  //     // navigate(`/edit/${filePath}`); 
  //   }
  // }, [selectedFile, navigate]);

  // Click listeners for context menu
  useEffect(() => {
    const handleClick = () => {
      if (contextMenu) {
        setContextMenu(null);
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [contextMenu]);

  const handleContextMenu = (
    event: MouseEvent<HTMLDivElement>,
    highlight: ViewportHighlight<CommentedHighlight>,
  ) => {
    event.preventDefault();

    setContextMenu({
      xPos: event.clientX,
      yPos: event.clientY,
      deleteHighlight: () => deleteHighlight(highlight),
      editComment: () => editComment(highlight),
    });
  };


  const addHighlight = (highlight: GhostHighlight, comment: string) => {
    console.log("Saving highlight", highlight);
    setHighlights([{ ...highlight, comment, id: getNextId() }, ...highlights]);
  };

  // useEffect to log highlights whenever it changes
  useEffect(() => {
    console.log("Current highlights:", highlights);
  }, [highlights]); // This effect runs every time 'highlights' changes

  const deleteHighlight = (highlight: ViewportHighlight | Highlight) => {
    console.log("Deleting highlight", highlight);
    setHighlights(highlights.filter((h) => h.id != highlight.id));
  };

  const editHighlight = (
    idToUpdate: string,
    edit: Partial<CommentedHighlight>,
  ) => {
    console.log(`Editing highlight ${idToUpdate} with `, edit);
    setHighlights(
      highlights.map((highlight) =>
        highlight.id === idToUpdate ? { ...highlight, ...edit } : highlight,
      ),
    );
  };

  const resetHighlights = () => {
    setHighlights([]);
  };

  const getHighlightById = (id: string) => {
    return highlights.find((highlight) => highlight.id === id);
  };

  // Open comment tip and update highlight with new user input
  const editComment = (highlight: ViewportHighlight<CommentedHighlight>) => {
    if (!highlighterUtilsRef.current) return;

    const editCommentTip: Tip = {
      position: highlight.position,
      content: (
        <CommentForm
          placeHolder={highlight.comment}
          onSubmit={(input) => {
            editHighlight(highlight.id, { comment: input });
            highlighterUtilsRef.current!.setTip(null);
            highlighterUtilsRef.current!.toggleEditInProgress(false);
          }}
        ></CommentForm>
      ),
    };

    highlighterUtilsRef.current.setTip(editCommentTip);
    highlighterUtilsRef.current.toggleEditInProgress(true);
  };

  // Scroll to highlight based on hash in the URL
  const scrollToHighlightFromHash = () => {
    const highlight = getHighlightById(parseIdFromHash());

    if (highlight && highlighterUtilsRef.current) {
      highlighterUtilsRef.current.scrollToHighlight(highlight);
    }
  };

  // Hash listeners for autoscrolling to highlights
  useEffect(() => {
    window.addEventListener("hashchange", scrollToHighlightFromHash);

    return () => {
      window.removeEventListener("hashchange", scrollToHighlightFromHash);
    };
  }, [scrollToHighlightFromHash]);

  return (
    <div className="flex w-screen min-h-screen">
      <ControlBar />
      <div className="min-h-screen w-3/4 overflow-hidden relative flex flex-1">
        {url ? (
          <PdfLoader document={url}>
            {(pdfDocument) => (
              <>
                {/* <Toolbar setPdfScaleValue={(value) => setPdfScaleValue(value)} toggleHighlightPen={() => setHighlightPen(!highlightPen)} /> */}
                <PdfHighlighter
                  enableAreaSelection={(event) => event.altKey}
                  pdfDocument={pdfDocument}
                  onScrollAway={resetHash}
                  utilsRef={(_pdfHighlighterUtils) => {
                    highlighterUtilsRef.current = _pdfHighlighterUtils;
                  }}
                  pdfScaleValue={pdfScaleValue}
                  textSelectionColor={highlightPen ? "rgba(255, 226, 143, 1)" : undefined}
                  onSelection={highlightPen ? (selection) => addHighlight(selection.makeGhostHighlight(), "") : undefined}
                  selectionTip={highlightPen ? undefined : <ExpandableTip addHighlight={addHighlight} />}
                  highlights={highlights}
                >
                  <HighlightContainer
                    editHighlight={editHighlight}
                    onContextMenu={handleContextMenu}
                  />
                </PdfHighlighter>
              </>
            )}
          </PdfLoader>
        ) : (
          <p>Please upload a PDF file to highlight</p>
        )}
      </div>
      {contextMenu && <ContextMenu {...contextMenu} />}
    </div>
  );
};

export default EditPage;