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
import ConfigBar from "./ConfigBar";
import { useParams } from "react-router-dom";
import axios from "axios";

const getNextId = () => String(Math.random()).slice(2);

const parseIdFromHash = () => {
  return document.location.hash.slice("#highlight-".length);
};

const resetHash = () => {
  document.location.hash = "";
};

const EditPage = () => {
  const [highlightColor, setHighlightColor] = useState("#32a852");
  const { '*': filePath } = useParams();
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [highlights, setHighlights] = useState<Array<CommentedHighlight>>([]);
  const currentPdfIndexRef = useRef(0);
  const [contextMenu, setContextMenu] = useState<ContextMenuProps | null>(null);
  const [pdfScaleValue, setPdfScaleValue] = useState<number | undefined>(undefined,);
  const [highlightPen, setHighlightPen] = useState<boolean>(true);
  const highlighterUtilsRef = useRef<PdfHighlighterUtils>();

  useEffect(() => {
    console.log('filepath: ', filePath);
    const loadFileByPath = async () => {
      if (filePath) {
        try {
          const response = await axios.get(`http://localhost:5000/edit?filePath=${encodeURIComponent(filePath)}`, {
            responseType: 'blob', // Ensures we get the file as a Blob
          });

          // Create a File object from the response Blob
          const blob = response.data;
          const file = new File([blob], filePath.split('/').pop() || "file", { type: blob.type });

          // Use the file object in your component
          setPdfFile(file);

          // Convert File to Data URL for preview or further usage
          const reader = new FileReader();
          reader.onload = (e) => {
            const result = e.target?.result;
            if (result) {
              setUrl(result as string);
            }
          };
          reader.readAsDataURL(file);

        } catch (error) {
          console.error("Error fetching file:", error);
        }
      }
    };

    loadFileByPath();
  }, [filePath]);

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

  const changeHighlightColor = (hiColor: string) => {
    console.log('hicolor: ', hiColor);
    setHighlightColor(hiColor);
    // document.documentElement.style.setProperty('--highlight-color', hiColor); // Update the CSS variable
  };

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
    setHighlights([{ ...highlight, comment, id: getNextId(), color: highlightColor }, ...highlights]);
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
      <div className="color-picker flex flex-col">
        <button onClick={() => changeHighlightColor('#FF145A')}>Red</button>
        <button onClick={() => changeHighlightColor('#00FF00')}>Green</button>
        <button onClick={() => changeHighlightColor('#0000FF')}>Blue</button>
        <button onClick={() => changeHighlightColor('#FFFF00')}>Yellow</button>
      </div>
      <div className="min-h-screen overflow-hidden relative flex flex-1">
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
                  textSelectionColor={highlightPen ? highlightColor : undefined}
                  onSelection={highlightPen ? (selection) => addHighlight(selection.makeGhostHighlight(), "") : undefined}
                  selectionTip={highlightPen ? undefined : <ExpandableTip addHighlight={addHighlight} />}
                  highlights={highlights}
                >
                  {highlights.map((highlight) => (
                    <HighlightContainer
                      key={highlight.id} // Unique key for each highlight
                      highlight={highlight}
                      editHighlight={editHighlight}
                      onContextMenu={handleContextMenu}
                      highlightColor={highlight.color} // Pass specific color for each highlight
                    />
                  ))}
                  {/* <HighlightContainer
                    editHighlight={editHighlight}
                    onContextMenu={handleContextMenu}
                    highlightColor={highlightColor}
                  /> */}
                </PdfHighlighter>
              </>
            )}
          </PdfLoader>
        ) : (
          <div className="flex justify-center items-center">
            <p>Please upload a PDF file to highlight</p>
          </div>
        )}
        <div className="absolute bottom-5 left-1/3">
          <Toolbar />
        </div>
      </div>
      <div className="w-1/5">
        <ConfigBar />
      </div>
      {contextMenu && <ContextMenu {...contextMenu} />}
    </div>
  );
};

export default EditPage;