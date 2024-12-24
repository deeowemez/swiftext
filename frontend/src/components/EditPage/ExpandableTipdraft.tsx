import React, { useLayoutEffect, useRef, useState } from "react";
import {
  GhostHighlight,
  PdfSelection,
  usePdfHighlighterContext,
} from "react-pdf-highlighter-extended";
import "../../styles/ExpandableTip.css";

interface ExpandableTipProps {
  addHighlight: (highlight: GhostHighlight, comment: string) => void;
}

const ExpandableTip = ({ addHighlight }: ExpandableTipProps) => {
  const [compact, setCompact] = useState(true);
  const selectionRef = useRef<PdfSelection | null>(null);

  const {
    getCurrentSelection,
    removeGhostHighlight,
    setTip,
    updateTipPosition,
  } = usePdfHighlighterContext();

  useLayoutEffect(() => {
    updateTipPosition();
  }, [compact]);

  return (
    <div className="Tip">
      {(
        <button
          className="Tip__compact"
          onClick={() => {
            setCompact(false);
            selectionRef.current = getCurrentSelection();
            console.log("Current Selection:", selectionRef.current); // Log the selection
            selectionRef.current!.makeGhostHighlight();
          }}
          
          // onMouseUp={
          //   addHighlight(
          //     {
          //       content: selectionRef.current.content,
          //       type: selectionRef.current.type,
          //       position: selectionRef.current.position,
          //     }
          //   )
          //   // removeGhostHighlight();
          //   // setTip(null);
          // }
        >
          Add highlight
        </button>
      )}
        

    </div >
  );
};

export default ExpandableTip;