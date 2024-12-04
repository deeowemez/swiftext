import React from "react";
import "../../style/ContextMenu.css";

export interface HighlightColorProfileProps {
  userID: { S: string },
  highlightColorProfile: { S: string },
  configColor: { S: string },
  configID: { S: string },
  color: { S: string },
  background: { S: string },
  font: { S: string },
  bold: { BOOL: boolean },
  italic: { BOOL: boolean },
  underline: { BOOL: boolean },
  strike: { BOOL: boolean },
  header: { N: number },
  list: { S: string },
  script: { S: string },
  indent: { N: number },
  align: { S: string },
  size: { S: string },
}

export interface ContextMenuProps {
  xPos: any;
  yPos: any;
  menuType: "context-menu" | "viewport-menu";
  editComment?: () => void;
  deleteHighlight?: () => void;
  listHighlightColorProfile?: HighlightColorProfileProps[];
  changeHighlightColor?: (hiColor: string) => void;
  setConfigID?: (configID: string) => void;
}

const ContextMenu = ({
  xPos,
  yPos,
  menuType,
  editComment,
  deleteHighlight,
  listHighlightColorProfile,
  changeHighlightColor,
  setConfigID,
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
      <div className="viewport-menu font-sserif cursor-pointer" style={{ top: yPos + 2, left: xPos + 2 }}>
        {listHighlightColorProfile && listHighlightColorProfile.length > 0 ? (
          <div className="flex gap-2 p-1 w-40 max-w-xs overflow-x-scroll 
           [&::-webkit-scrollbar]:h-2
            [&::-webkit-scrollbar-track]:rounded-full
            [&::-webkit-scrollbar-track]:bg-gray-100
            [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar-thumb]:bg-gray-300
            ">
            {listHighlightColorProfile.map((profile, index) => (
              <div
                key={index}
                className="w-5 h-5 rounded-full flex-shrink-0"
                style={{ backgroundColor: profile.configColor.S }}
                onClick={() => {
                  if (changeHighlightColor) {
                    changeHighlightColor(profile.configColor.S);
                  }
                  if (setConfigID) {
                    setConfigID(profile.configID.S);
                  }
                }}
              />
            ))}
          </div>
        ) : (
          <p>No profile selected</p>
        )}
      </div>
    );
  }
}

export default ContextMenu;
