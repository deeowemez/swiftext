import React from 'react';
import eraserIcon from "../../assets/images/eraser-alt.svg";
import handIcon from "../../assets/images/hand.svg";
import highlightIcon from "../../assets/images/highlight-alt.svg";
import redoIcon from "../../assets/images/redo.svg";
import undoIcon from "../../assets/images/undo.svg";

interface ToolbarProps {
    toggleActiveTool: (activeTool: string) => void;
    activeTool: string;
    handleRedo: () => void;
    handleUndo: () => void;
    highlights: Array<any>;
}

const Toolbar: React.FC<ToolbarProps> = ({ 
    toggleActiveTool, 
    activeTool,
    handleRedo,
    handleUndo,
    highlights
 }) => {
    return (
        <div className="flex gap-10 bg-[#F4F4F4] rounded-3xl px-5 py-2 z-50 relative shadow-md">
            <div className={`cursor-pointer w-9 h-9 flex items-center justify-center rounded-xl ${activeTool === 'highlightPen' ? 'bg-[#FFE7D4]' : "hover:bg-[#FFE7D4]"
                }`} onClick={() => toggleActiveTool('highlightPen')}>
                <img src={highlightIcon} alt="highlight icon" className="w-5" />
            </div>
            <div className={`cursor-pointer w-9 h-9 flex items-center justify-center rounded-xl ${
                    highlights.length === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-[#FFE7D4]"
                }`}
                onClick={highlights.length === 0 ? undefined : handleUndo}
            >
                <img src={undoIcon} alt="undo icon" className="cursor-pointer w-5" />
            </div>
            <div className={`cursor-pointer w-9 h-9 flex items-center justify-center rounded-xl hover:bg-[#FFE7D4]`}
                onClick={handleRedo}
            >
                <img src={redoIcon} alt="redo icon" className="cursor-pointer w-5" />
            </div>
            <div className={`cursor-pointer w-9 h-9 flex items-center justify-center rounded-xl ${activeTool === 'eraser' ? 'bg-[#FFE7D4]' : "hover:bg-[#FFE7D4]"
                }`} onClick={() => toggleActiveTool('eraser')}>
                <img src={eraserIcon} alt="eraser icon" className="cursor-pointer w-5" />
            </div>
        </div>
    )
}

export default Toolbar;