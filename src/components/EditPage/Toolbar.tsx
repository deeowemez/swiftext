import React from 'react';
import eraserIcon from "../../assets/images/eraser-alt.svg";
import handIcon from "../../assets/images/hand.svg";
import highlightIcon from "../../assets/images/highlight-alt.svg";
import redoIcon from "../../assets/images/redo.svg";
import undoIcon from "../../assets/images/undo.svg";

const Toolbar = () => {
    return(
        <div className="flex gap-10 bg-[#F4F4F4] rounded-3xl px-5 py-3 z-50 relative">
            <img src={highlightIcon} alt="highlight icon" className="cursor-pointer w-5" />
            <img src={undoIcon} alt="undo icon" className="cursor-pointer w-5" />
            <img src={redoIcon} alt="redo icon" className="cursor-pointer w-5" />
            <img src={eraserIcon} alt="eraser icon" className="cursor-pointer w-5" />
            <img src={handIcon} alt="hand icon" className="cursor-pointer w-5" />
        </div>
    )
}

export default Toolbar;