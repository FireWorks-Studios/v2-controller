import React, { useCallback, useState } from "react";
import './Selector.css';
import classNames from "classnames";
import { SelectorCenterButton } from "./SelectorCenterButton";
import { IoClose } from "react-icons/io5";
import Draggable, { DraggableEventHandler } from "react-draggable";
import { ComponentRepresentation } from "./ControllerContainer";

interface Props{
    selecting: boolean;
    resizingSelectionArea: boolean;
    x: number;
    y: number;
    w: number;
    h: number;
    unitWidth: number;
    container: 'center' | 'left' | 'right'
    selectionType: 'move' | 'add'
    setSelectorDeltaPosition: React.Dispatch<React.SetStateAction<{
        deltaX: number;
        deltaY: number;
    }>>
    checkValidSelectionDropPos: () => void
}


export const Selector: React.FC<Props> = ({
    selecting, // is there a way to not have to repeat this twice?
    resizingSelectionArea,
    x = 0,
    y = 0,
    w = 0,
    h = 0,
    unitWidth,
    container,
    selectionType = 'move',
    setSelectorDeltaPosition,
    checkValidSelectionDropPos
}: Props) => {


    const styles = {
        width: `${w*unitWidth - 4}px`,
        height: `${h*unitWidth - 4}px`,
        // transform: `translate(${x*unitWidth}px, ${y*unitWidth}px)`,
      };

    const handleDrag: DraggableEventHandler = useCallback((_, data) =>{
        setSelectorDeltaPosition({deltaX: data.x - x*unitWidth, deltaY: data.y - y*unitWidth})
    }, [x, y, unitWidth])


    return(
        <Draggable
            handle=".selector-center-button.move"
            bounds={"parent"}
            // grid={[unitWidth, unitWidth]}
            position={{x: x*unitWidth, y: y*unitWidth}}
            scale={1}
            onDrag={handleDrag}
            onStop={checkValidSelectionDropPos}
            >
            <div className={
                classNames(
                    'selector',
                    selectionType,
                    {
                        selecting,
                        resizingSelectionArea
                    }
                )
            }
            style={styles}
            >
                <SelectorCenterButton type={selectionType} x={x} y={y} w={w} h={h} unitWidth={unitWidth}/>
                <IoClose className="delete-icon"></IoClose>
            </div>
        </Draggable>

    )
}