import React, { useState, useRef } from 'react';
import { PdfLoader, PdfHighlighter } from 'react-pdf-highlighter-extended';

const EditPage = () => {
  const [url, setUrl] = useState("https://arxiv.org/pdf/2203.11115");
  const [highlights, setHighlights] = useState([]);
  const [isPreviewVisible, setIsPreviewVisible] = useState(true);
  const highlighterUtilsRef = useRef();

  const addHighlight = (highlight) => {
    setHighlights((prev) => [...prev, { ...highlight, id: String(Math.random()).slice(2) }]);
    console.log(highlights);
  };

  const handleSelection = (selection) => {
    if (!selection.isEmpty()) {
      const ghostHighlight = selection.makeGhostHighlight();
      addHighlight(ghostHighlight);
    }
  };

  const togglePreview = () => {
    setIsPreviewVisible((prev) => !prev);
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>

      <div style={{ width: '250px', padding: '10px', overflowY: 'auto' }}>
        <h3>Highlights</h3>
        <ul>
          {highlights.map((highlight) => (
            <li key={highlight.id}>{highlight.content.text}</li>
          ))}
        </ul>
      </div>

      <div style={{ 
        width: 'calc(100% - 700px)', // crop gray part of PDF
        overflow: 'hidden', 
        position: 'relative',
      }}>
        <PdfLoader document={url}>
          {(pdfDocument) => (
            <PdfHighlighter
              pdfDocument={pdfDocument}
              onSelection={handleSelection}
              highlights={highlights}
              utilsRef={(utils) => { highlighterUtilsRef.current = utils; }}
              enableAreaSelection={(event) => event.altKey} 
            />
          )}
        </PdfLoader>
      </div>

      <div style={{ width: '250px', padding: '10px', overflowY: 'auto' }}>
        <h3>Preview</h3>
      </div>
    </div>
  );
};

export default EditPage;
