import React, { MouseEvent, useEffect, useRef, useState } from "react";
import CommentForm from "./CommentForm";
import ContextMenu, { ContextMenuProps, HighlightColorProfileProps } from "./ContextMenu";
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

export interface User {
  userID: string;
  username: string;
  email: string;
}

const EditPage: React.FC<{
  user: User;
  setUser: void;
}> = ({
  user,
  setUser }) => {
    const [highlightColor, setHighlightColor] = useState("");
    const [configID, setConfigID] = useState("default-1");
    const [forceRenderProfile, setForceRenderProfile] = useState<boolean>(false);
    const [highlightColorProfile, setHighlightColorProfile] = useState<HighlightColorProfileProps[]>([]);
    const [highlightColorProfileID, setHighlightColorProfileID] = useState("");
    const { '*': filePath } = useParams();
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [url, setUrl] = useState<string | null>(null);
    const [highlights, setHighlights] = useState<Array<CommentedHighlight>>([]);
    const undoStack = useRef<Array<Array<CommentedHighlight>>>([]);
    const redoStack = useRef<Array<Array<CommentedHighlight>>>([]);
    const currentPdfIndexRef = useRef(0);
    const [contextMenu, setContextMenu] = useState<ContextMenuProps | null>(null);
    const [pdfScaleValue, setPdfScaleValue] = useState<number | undefined>(undefined,);
    const [highlightPen, setHighlightPen] = useState<boolean>(true);
    const [activeTool, setActiveTool] = useState<string>('highlightPen');
    const highlighterUtilsRef = useRef<PdfHighlighterUtils>();

    useEffect(() => {
      console.log('file details: ', pdfFile);
    }, [pdfFile]);

    useEffect(() => {
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      console.log('user editpage: ', storedUser);

      const loadFileByPath = async () => {
        if (filePath) {
          try {
            // Fetch the file
            const response = await axios.get(`http://localhost:5000/api/files/edit?filePath=${encodeURIComponent(filePath)}`, {
              responseType: 'blob', // Ensures we get the file as a Blob
            });

            // Create a File object from the response Blob
            const blob = response.data;
            const file = new File([blob], filePath.split('/').pop() || "file", { type: blob.type });

            // Use the file object in your component
            setPdfFile(file);

            const profile = fetchAndSetProfile(storedUser.userID);
            console.log('editpage profile: ', profile);

            // Convert File to Data URL for preview or further usage
            const reader = new FileReader();
            reader.onload = (e) => {
              const result = e.target?.result;
              if (result) {
                setUrl(result as string);
              }
            };

            reader.readAsDataURL(file);

            // Fetch the highlights for the file using the filePath
            const response_highlights = await axios.get(`http://localhost:5000/api/highlights?filePath=${encodeURIComponent(filePath)}`);

            if (response_highlights.data.success) {
              // Assuming highlights data is returned as an object or array
              setHighlights(response_highlights.data.highlights);
            } else {
              console.log("No highlights found.");
            }

          } catch (error) {
            console.error("Error fetching file or highlights:", error);
          }
        }
      };

      loadFileByPath();
    }, [filePath]);

    useEffect(() => {
      console.log('forceRenderProfile: ', forceRenderProfile);
      fetchAndSetProfile(user.userID);
    }, [forceRenderProfile]);

    useEffect(() => {
      console.log('configID: ', configID);
    }, [configID]);

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

    const saveToUndoStack = () => {
      undoStack.current.push([...highlights]);
      redoStack.current = [];
    };

    const handleUndo = () => {
      if (undoStack.current.length > 0) {
        const lastState = undoStack.current.pop();
        redoStack.current.push([...highlights]);
        if (lastState) {
          setHighlights(lastState);
        }
      }
    };

    const handleRedo = () => {
      if (redoStack.current.length > 0) {
        const nextState = redoStack.current.pop();
        undoStack.current.push([...highlights]);
        if (nextState) {
          setHighlights(nextState);
        }
      }
    };

    const fetchAndSetProfile = async (userID: string) => {
      try {
        const response = await axios.get(`http://localhost:5000/api/profile/${userID}`);
        const { data } = response;
        console.log('fetchprofile data: ', data.data)

        if (data.success && data.data.length > 0) {
          setHighlightColorProfile(data.data);
          return data.data;
        } else {
          console.error("Error fetching profiles:", data.error);
        }
      } catch (error) {
        console.error("Axios error:", error);
        return [];
      }
    };

    const handleViewportContextMenu = async (
      event: MouseEvent<HTMLDivElement>,
    ) => {
      const target = event.target as HTMLElement;

      // Check if the right-click is not within a highlight container
      if (
        !target.closest('.TextHighlight__part') &&
        !target.closest('.AreaHighlight__part')
      ) {
        if (activeTool == 'highlightPen') {
          event.preventDefault();
          setContextMenu({
            xPos: event.clientX,
            yPos: event.clientY,
            menuType: "viewport-menu",
            listHighlightColorProfile: highlightColorProfile,
            setHighlightColor: setHighlightColor,
            setConfigID: setConfigID,
          })
        };
      }
    };

    const handleContextMenu = (
      event: MouseEvent<HTMLDivElement>,
      highlight: ViewportHighlight<CommentedHighlight>,
    ) => {
      event.preventDefault();

      setContextMenu({
        xPos: event.clientX,
        yPos: event.clientY,
        menuType: "context-menu",
        deleteHighlight: () => deleteHighlight(highlight),
        editComment: () => editComment(highlight),
      });
    };

    const addHighlight = (highlight: GhostHighlight, comment: string) => {
      console.log("Saving highlight", highlight);
      saveToUndoStack();
      setHighlights([...highlights, { ...highlight, comment, id: getNextId(), color: highlightColor, configID: configID, profileID: highlightColorProfileID, }]);
    };

    // useEffect to log highlights whenever it changes
    useEffect(() => {
      console.log("Current highlights:", highlights);
      // console.log("Current profile: ", highlightColorProfile[0].highlightColorProfile.S);
    }, [highlights, highlightColorProfile]); // This effect runs every time 'highlights' changes

    const deleteHighlight = (highlight: ViewportHighlight | Highlight) => {
      console.log("Deleting highlight", highlight);
      saveToUndoStack();
      setTimeout(() => {
        setHighlights(highlights.filter((h) => h.id != highlight.id));
      }, 0);
    };

    const editHighlight = (
      idToUpdate: string,
      edit: Partial<CommentedHighlight>,
    ) => {
      console.log(`Editing highlight ${idToUpdate} with `, edit);
      saveToUndoStack();
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

    const toggleActiveTool = (activeTool: string) => {
      setActiveTool(activeTool);
      console.log('Active Tool: ', activeTool);
      if (activeTool == 'eraser') {
        setHighlightPen(false);
      }
      if (highlightPen == false && activeTool == 'highlightPen') {
        setHighlightPen(true);
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
        <ControlBar
          user={user}
          setPdfScaleValue={(value) => setPdfScaleValue(value)}
          highlightColorProfile={highlightColorProfile}
          setForceRenderProfile={setForceRenderProfile}
          forceRenderProfile={forceRenderProfile}
          setHighlights={setHighlights}
          highlights={highlights}
          resetHighlights={resetHighlights}
        />
        <div className="min-h-screen overflow-hidden relative flex flex-1" onContextMenu={handleViewportContextMenu}>
          {url ? (
            <PdfLoader document={url}>
              {(pdfDocument) => (
                <>
                  <PdfHighlighter
                    enableAreaSelection={(event) => event.altKey}
                    pdfDocument={pdfDocument}
                    onScrollAway={resetHash}
                    utilsRef={(_pdfHighlighterUtils) => { highlighterUtilsRef.current = _pdfHighlighterUtils }}
                    pdfScaleValue={pdfScaleValue}
                    textSelectionColor={highlightPen ? highlightColor : undefined}
                    onSelection={highlightPen ? (selection) => addHighlight(selection.makeGhostHighlight(), "") : undefined}
                    // selectionTip={highlightPen ? undefined : <ExpandableTip addHighlight={addHighlight} />}
                    selectionTip={undefined}
                    highlights={highlights}
                  >
                    {highlights.map((highlight) => (
                      <HighlightContainer
                        key={highlight.id}
                        highlight={highlight}
                        editHighlight={editHighlight}
                        onContextMenu={handleContextMenu}
                        highlightColor={highlight.color}
                      />
                    ))}
                  </PdfHighlighter>
                </>
              )}
            </PdfLoader>
          ) : (
            <div className="flex justify-center items-center">
              <p>Please upload a PDF file to highlight</p>
            </div>
          )}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10"> {/* transform */}
            <Toolbar
              toggleActiveTool={toggleActiveTool}
              activeTool={activeTool}
              handleRedo={handleRedo}
              handleUndo={handleUndo}
              highlights={highlights}
            />
          </div>
        </div>
        <div className="w-2/5">
          <ConfigBar
            user={user}
            setUser={setUser}
            highlights={highlights}
            highlightColorProfile={highlightColorProfile}
          />
        </div>
        {contextMenu && <ContextMenu {...contextMenu} />}
      </div>
    );
  };

export default EditPage;
