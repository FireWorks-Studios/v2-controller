import React from "react";
import './Selector.css';
import classNames from "classnames";
import {TbArrowsMove} from 'react-icons/tb'
import { FaPlus } from "react-icons/fa6";



interface Props{
    type: 'move' | 'add';
    x: number;
    y: number;
    w: number;
    h: number;
    unitWidth: number;
}

export const SelectorCenterButton: React.FC<Props> = ({
    type,
    x = 0,
    y = 0,
    w = 0,
    h = 0,
    unitWidth,
}: Props) =>{
    const styles = {
        transform: `translate(${((w-1)/2)*unitWidth}px, ${((h-1)/2)*unitWidth}px)`,
      };

    return(
        <div className={
            classNames(
                'selector-center-button',
                type
            )
        }
        style={styles}
        >
            <div className="center-icon-container">
                {type == 'move'? <TbArrowsMove/>: <FaPlus/>}
            </div>
        </div>
    )
}