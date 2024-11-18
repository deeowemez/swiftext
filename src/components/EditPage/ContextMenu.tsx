import React from "react";
import "../../style/ContextMenu.css";

export interface ContextMenuProps {
  xPos: any;
  yPos: any;
  menuType: "context-menu" | "viewport-menu";
  editComment?: () => void;
  deleteHighlight?: () => void;
  highlightColorProfile?: () => void;
}

const ContextMenu = ({
  xPos,
  yPos,
  menuType,
  editComment,
  deleteHighlight,
  highlightColorProfile,
}: ContextMenuProps) => {
  if (menuType === "context-menu") {
    return (
      <div className="context-menu font-sserif" style={{ top: yPos + 2, left: xPos + 2 }}>
        {editComment && <button onClick={editComment}>Edit Comment</button>}
        {deleteHighlight && <button onClick={deleteHighlight}>Delete</button>}
      </div>
    );
  } else if (menuType === "viewport-menu") {
    return (
      <div className="viewport-menu font-sserif" style={{ top: yPos + 2, left: xPos + 2 }}>
        <button onClick={highlightColorProfile}>Custom Action</button>
      </div>
    );
  }
}

export default ContextMenu;
