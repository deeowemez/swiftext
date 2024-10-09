import React, { useLayoutEffect, useRef, useState } from "react";
import {
  usePdfHighlighterContext,
} from "react-pdf-highlighter-extended";
import "../../styles/ExpandableTip.css";

const ExpandableTip = ({ addHighlight }) => {
  const [compact, setCompact] = useState(true);
  const selectionRef = useRef(null); // No type annotations in JSX

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
      { (
        <button
          className="Tip__compact"
          onClick={() => {
            setCompact(false);
            const currentSelection = getCurrentSelection();
            if (currentSelection) {
              selectionRef.current = currentSelection;
              selectionRef.current.makeGhostHighlight();
            }
          }}
        >
          Add highlight
        </button>
      )} 
    </div>
  );
};

export default ExpandableTip;