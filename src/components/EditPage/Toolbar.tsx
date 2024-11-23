import React from 'react';
import eraserIcon from "../../assets/images/eraser-alt.svg";
import handIcon from "../../assets/images/hand.svg";
import highlightIcon from "../../assets/images/highlight-alt.svg";
import redoIcon from "../../assets/images/redo.svg";
import undoIcon from "../../assets/images/undo.svg";

interface ToolbarProps {
    toggleHighlightPen: () => void; // Define the expected function type
  }

const Toolbar: React.FC<ToolbarProps> = (
    { toggleHighlightPen }) => {
    return (
        <div className="flex gap-10 bg-[#F4F4F4] rounded-3xl px-5 py-2 z-50 relative">
            <div className="cursor-pointer w-9 h-9 flex items-center justify-center rounded-xl bg-[#FFE7D4]" onClick={toggleHighlightPen}>
                <img src={highlightIcon} alt="highlight icon" className="w-5" />
            </div>
            <div className="cursor-pointer w-9 h-9 flex items-center justify-center rounded-xl hover:bg-[#FFE7D4]">
                <img src={undoIcon} alt="undo icon" className="cursor-pointer w-5" />
            </div>
            <div className="cursor-pointer w-9 h-9 flex items-center justify-center rounded-xl hover:bg-[#FFE7D4]">
                <img src={redoIcon} alt="redo icon" className="cursor-pointer w-5" />
            </div>
            <div className="cursor-pointer w-9 h-9 flex items-center justify-center rounded-xl hover:bg-[#FFE7D4]">
                <img src={eraserIcon} alt="eraser icon" className="cursor-pointer w-5" />
            </div>
        </div>
    )
}

export default Toolbar;