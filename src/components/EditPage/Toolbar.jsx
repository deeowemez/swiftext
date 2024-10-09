import React, { useState } from "react";
import "../../styles/Toolbar.css";

const Toolbar = ({ setPdfScaleValue, toggleHighlightPen }) => {
  const [zoom, setZoom] = useState(null);
  const [isHighlightPen, setIsHighlightPen] = useState(false);

  const zoomIn = () => {
    if (zoom !== null) {
      if (zoom < 4) {
        setPdfScaleValue(zoom + 0.1);
        setZoom(zoom + 0.1);
      }
    } else {
      setPdfScaleValue(1);
      setZoom(1);
    }
  };

  const zoomOut = () => {
    if (zoom !== null) {
      if (zoom > 0.2) {
        setPdfScaleValue(zoom - 0.1);
        setZoom(zoom - 0.1);
      }
    } else {
      setPdfScaleValue(1);
      setZoom(1);
    }
  };

  return (
    <div className="Toolbar">
      <div className="ZoomControls">
        <button title="Zoom in" onClick={zoomIn}>+</button>
        <button title="Zoom out" onClick={zoomOut}>-</button>
        {zoom !== null ? `${(zoom * 100).toFixed(0)}%` : "Auto"}
      </div>
      <button
        title="Highlight"
        className={`HighlightButton ${isHighlightPen ? 'active' : ''}`}
        onClick={() => {
          toggleHighlightPen();
          setIsHighlightPen(!isHighlightPen);
        }}
      >
        Toggle Highlights
      </button>
    </div>
  );
};

export default Toolbar;