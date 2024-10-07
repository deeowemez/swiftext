import React, { useState, useRef } from 'react';
import { PdfLoader, PdfHighlighter } from 'react-pdf-highlighter-extended';

const EditPage = () => {
  const [url, setUrl] = useState("https://arxiv.org/pdf/2203.11115");
  const [highlights, setHighlights] = useState([]);
  const highlighterUtilsRef = useRef();

  const addHighlight = (highlight) => {
    setHighlights((prev) => [...prev, { ...highlight, id: String(Math.random()).slice(2) }]);
  };

  const handleSelection = (selection) => {
    if (!selection.isEmpty()) {
      const ghostHighlight = selection.makeGhostHighlight();
      addHighlight(ghostHighlight);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <PdfLoader document={url}>
        {(pdfDocument) => (
          <PdfHighlighter
            pdfDocument={pdfDocument}
            onSelection={handleSelection}
            highlights={highlights}
            utilsRef={(utils) => { highlighterUtilsRef.current = utils; }}
            enableAreaSelection={(event) => event.altKey} // Enable area selection with the Alt key
          />
        )}
      </PdfLoader>
      <div style={{ width: '250px', padding: '10px', overflowY: 'auto' }}>
        <h3>Highlights</h3>
        <ul>
          {highlights.map((highlight) => (
            <li key={highlight.id}>{highlight.content.text}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EditPage;
