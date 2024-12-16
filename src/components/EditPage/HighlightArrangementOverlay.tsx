import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { CommentedHighlight } from "./types";
import arrangeIcon from "../../assets/images/line-double.svg";

interface HighlightArrangementOverlayProps {
    highlights: Array<CommentedHighlight>;
    setHighlights: (highlights: Array<CommentedHighlight>) => void;
}

const HighlightArrangementOverlay: React.FC<HighlightArrangementOverlayProps> = ({
    highlights,
    setHighlights,
}) => {

    // Handle Drag-and-Drop
    const onDragEnd = (result: any) => {
        const { destination, source } = result;

        // If dropped outside the list or in the same position, do nothing
        if (!destination || destination.index === source.index) {
            return;
        }

        const updatedHighlights = Array.from(highlights);
        const [movedItem] = updatedHighlights.splice(source.index, 1);
        updatedHighlights.splice(destination.index, 0, movedItem);

        setHighlights(updatedHighlights);
    };

    return (
        <div className="absolute top-2 left-2 bg-white">
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="highlights-list">
                    {(provided) => (
                        <ul
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="highlight-list"
                        >
                            {highlights.map((highlight, index) => (
                                <Draggable
                                    key={highlight.id}
                                    draggableId={highlight.id}
                                    index={index}
                                >
                                    {(provided) => (
                                        <li
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            ref={provided.innerRef}
                                            className="highlight-item text-black text-left mb-1"
                                        >
                                            <div className="flex ">
                                                <img src={arrangeIcon} alt="" className="w-3 mx-2" />
                                                <p style={{ color: highlight.color }}>• </p>
                                                <span>{highlight.content.text}</span>
                                            </div>
                                        </li>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </ul>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    )
}

export default HighlightArrangementOverlay;