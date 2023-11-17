import React, { useState } from "react";
import './Selector.css';
import classNames from "classnames";
import { SelectorCenterButton } from "./SelectorCenterButton";
import { IoClose } from "react-icons/io5";

interface Props{
    selecting: boolean;
    x: number;
    y: number;
    w: number;
    h: number;
    unitWidth: number;
    container: 'center' | 'left' | 'right'
}

type SelectionType = 'move' | 'add'

export const Selector: React.FC<Props> = ({
    selecting, // is there a way to not have to repeat this twice?
    x = 0,
    y = 0,
    w = 0,
    h = 0,
    unitWidth,
    container
}: Props) => {

    const [selectionType, SetSelectionType] = useState<SelectionType>("move")

    const styles = {
        width: `${w*unitWidth - 4}px`,
        height: `${h*unitWidth - 4}px`,
        transform: `translate(${x*unitWidth}px, ${y*unitWidth}px)`,
      };

    return(
        <div className={
            classNames(
                'selector',
                selectionType,
                {
                    selecting
                }
            )
        }
        style={styles}
        >
            <SelectorCenterButton type={selectionType} x={x} y={y} w={w} h={h} unitWidth={unitWidth}/>
            <IoClose className="delete-icon"></IoClose>
        </div>
    )
}