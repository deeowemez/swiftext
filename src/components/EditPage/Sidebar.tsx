import React from "react";
import type { Highlight } from "react-pdf-highlighter-extended";
import "../../style/Sidebar.css";
import { CommentedHighlight } from "./types";


interface SidebarProps {
  highlights: Array<CommentedHighlight>;
  resetHighlights: () => void;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  // toggleDocument: () => void;
}

const updateHash = (highlight: Highlight) => {
  document.location.hash = `highlight-${highlight.id}`;
};

const Sidebar = ({
  highlights,
  // toggleDocument,
  resetHighlights,
  handleFileChange,
}: SidebarProps) => {
  return (
    <div className="sidebar" style={{ width: "25vw", maxWidth: "500px" }}>
      {/* Description section */}
      <div className="description" style={{ padding: "1rem" }}>

      <div>
        <h3>Upload PDF</h3>
        <input type="file" accept="application/pdf" onChange={handleFileChange} />
        <h3>Highlights</h3>
      </div> 

        {/* <p style={{ fontSize: "0.7rem" }}>
          <a href="https://github.com/DanielArnould/react-pdf-highlighter-extended">
            Open in GitHub
          </a>
        </p> */}

        <p>
          <small>
            To create an area highlight hold, press Alt key then click and drag.
          </small>
        </p>
      </div>

      {/* Highlights list */}
      {highlights && (
        <ul className="sidebar__highlights">
          {highlights.map((highlight, index) => (
            <li
              key={index}
              className="sidebar__highlight"
              onClick={() => {
                updateHash(highlight);
              }}
            >
              <div>
                {/* Highlight comment and text */}
                <strong>{highlight.comment}</strong>
                {highlight.content.text && (
                  <blockquote style={{ marginTop: "0.5rem" }}>
                    {`${highlight.content.text.slice(0, 90).trim()}…`}
                  </blockquote>
                )}

                {/* Highlight image */}
                {highlight.content.image && (
                  <div
                    className="highlight__image__container"
                    style={{ marginTop: "0.5rem" }}
                  >
                    <img
                      src={highlight.content.image}
                      alt={"Screenshot"}
                      className="highlight__image"
                    />
                  </div>
                )}
              </div>

              {/* Highlight page number */}
              <div className="highlight__location">
                Page {highlight.position.boundingRect.pageNumber}
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* <div style={{ padding: "0.5rem" }}>
        <button onClick={toggleDocument} className="sidebar__toggle">
          Toggle PDF document
        </button>
      </div> */}

      {highlights && highlights.length > 0 && (
        <div style={{ padding: "0.5rem" }}>
          <button onClick={resetHighlights} className="sidebar__reset">
            Reset highlights
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
