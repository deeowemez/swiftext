import React, { useState, useRef } from 'react';
import { PdfLoader, PdfHighlighter } from 'react-pdf-highlighter-extended';
import Toolbar from '../components/EditPage/Toolbar';
import ExpandableTip from '../components/EditPage/ExpandableTip';

const EditPage = () => {
  const [pdfFile, setPdfFile] = useState(null); // Store the uploaded file
  const [url, setUrl] = useState(null); // Store the PDF file URL
  const [highlights, setHighlights] = useState([]);
  const highlighterUtilsRef = useRef();
  const [pdfScaleValue, setPdfScaleValue] = useState(undefined);
  const [highlightPen, setHighlightPen] = useState(false);

  // Function to add highlight to the state
  const addHighlight = (highlight) => {
    const newHighlight = { ...highlight, id: String(Math.random()).slice(2) };
    setHighlights((prev) => [...prev, newHighlight]); // Add the new highlight
    console.log('highlights: ', highlights);
  };

  const editHighlight = (idToUpdate, edit) => {
    console.log(`Editing highlight ${idToUpdate} with `, edit);
    setHighlights(
      highlights.map((highlight) =>
        highlight.id === idToUpdate ? { ...highlight, ...edit } : highlight
      )
    );
  };


  // Handle selection event
  const handleSelection = (selection) => {
    // if (selection && selection.content && selection.content.text) {
    if (selection && selection.content) {
      const ghostHighlight = selection.makeGhostHighlight();
      addHighlight(ghostHighlight);
      // (selection) => addHighlight(selection.makeGhostHighlight(), "")
    }
  };

  // Function to handle file input change
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPdfFile(file); // Store the uploaded file
      const reader = new FileReader();
      reader.onload = (e) => {
        setUrl(e.target.result); // Convert file to a URL and set it as PDF URL
      };
      reader.readAsDataURL(file); // Read the file as Data URL
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* PDF Upload Section */}
      <div style={{ width: '250px', padding: '10px', overflowY: 'auto' }}>
        <h3>Upload PDF</h3>
        <input type="file" accept="application/pdf" onChange={handleFileChange} />
        <h3>Highlights</h3>
        <ul>
          {highlights.map((highlight) => (
            <li key={highlight.id}>{highlight.content.text}</li>
          ))}
        </ul>
      </div>

      {/* PDF Viewer Section */}
      <div style={{
        width: 'calc(100% - 700px)', // Crop gray part of PDF
        overflow: 'hidden',
        position: 'relative',
      }}>
        
        {url ? (
          <PdfLoader document={url}>
            {(pdfDocument) => (
              <>
                <Toolbar setPdfScaleValue={(value) => setPdfScaleValue(value)} toggleHighlightPen={() => setHighlightPen(prev => !prev)} />
                <PdfHighlighter
                  pdfDocument={pdfDocument}
                  onSelection={handleSelection} // Handle the selection
                  highlights={highlights} // List of highlights
                  selectionTip={highlightPen ? undefined : <ExpandableTip addHighlight={addHighlight} />}
                  textSelectionColor={highlightPen ? "rgba(125, 11, 45, 1)" : undefined}
                  utilsRef={(utils) => { highlighterUtilsRef.current = utils; }}
                  enableAreaSelection={(event) => event.altKey} // Enable area selection with Alt key
                  style={{
                    height: "calc(100% - 41px)",
                  }}
                />
                {/* <HighlightContainer
                  editHighlight={editHighlight}
                  onContextMenu={handleContextMenu}
                /> */}
              </>
            )}
          </PdfLoader>
        ) : (
          <p>Please upload a PDF file to highlight</p>
        )}


      </div>

      {/* Preview Section */}
      <div style={{ width: '250px', padding: '10px', overflowY: 'auto' }}>
        <h3>Preview</h3>
      </div>
    </div>
  );
};

export default EditPage;