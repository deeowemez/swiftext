import React, { useState, useRef, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist/webpack';

// Set up the worker for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const EditPage = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const canvasRef = useRef(null);

  useEffect(() => {
    const loadPdf = async () => {
      if (pdfFile) {
        try {
          const fileURL = URL.createObjectURL(pdfFile);
          const loadingTask = pdfjsLib.getDocument(fileURL);
          const pdf = await loadingTask.promise;

          setNumPages(pdf.numPages); // Set total number of pages

          const page = await pdf.getPage(currentPage); // Get the current page
          const scale = 1.5;
          const viewport = page.getViewport({ scale });

          const canvas = canvasRef.current;
          const context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          const renderContext = {
            canvasContext: context,
            viewport: viewport,
          };

          // Render the page on the canvas
          await page.render(renderContext).promise;
          console.log(`Page ${currentPage} rendered successfully.`);
        } catch (error) {
          console.error('Error rendering PDF:', error);
        }
      }
    };

    loadPdf();
  }, [pdfFile, currentPage]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      setCurrentPage(1); // Reset to the first page
    } else {
      alert('Please select a valid PDF file.');
    }
  };

  // Handle page navigation
  const handleNextPage = () => {
    if (currentPage < numPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="edit-page">
      {/* File Upload Button */}
      <div className="file-input">
        <input type="file" accept="application/pdf" onChange={handleFileChange} />
      </div>

      {/* Display PDF */}
      <div className="pdf-display-area">
        <canvas ref={canvasRef} />
      </div>

      {/* Pagination Controls */}
      {numPages > 0 && (
        <div className="pagination-controls">
          <button onClick={handlePrevPage} disabled={currentPage === 1}>
            Previous
          </button>
          <span>Page {currentPage} of {numPages}</span>
          <button onClick={handleNextPage} disabled={currentPage >= numPages}>
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default EditPage;
