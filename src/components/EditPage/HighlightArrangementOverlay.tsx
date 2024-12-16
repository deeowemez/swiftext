import React, { useState, useEffect, useRef, Dispatch, SetStateAction } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { CommentedHighlight } from "./types";
import arrangeIcon from "../../assets/images/line-double.svg";

interface HighlightArrangementOverlayProps {
    highlights: Array<CommentedHighlight>;
    setHighlights: (highlights: Array<CommentedHighlight>) => void;
    setShowArrangementOverlay: Dispatch<SetStateAction<boolean>>;
}

const HighlightArrangementOverlay: React.FC<HighlightArrangementOverlayProps> = ({
    highlights,
    setHighlights,
    setShowArrangementOverlay
}) => {
    const overlayRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [setShowArrangementOverlay]);

    const handleClickOutside = (event: MouseEvent) => {
        if (overlayRef.current && !overlayRef.current.contains(event.target as Node)) {
            setShowArrangementOverlay(false);
        }
    };

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
        <div 
        ref={overlayRef }
        className="absolute top-[20px] left-[20px]
        p-5 h-5/6 w-11/12 bg-[#F4F4F4] rounded-xl z-20 overflow-x-auto">
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
                                            <div className="flex items-center">
                                                <div className="flex items-center">
                                                    <img src={arrangeIcon} alt="" className="w-3 mx-2" />
                                                    <p className="text-[25px] mr-1" style={{ color: highlight.color }}>• </p>
                                                </div>
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