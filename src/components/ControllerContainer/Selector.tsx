import React from "react";
import './Selector.css';
import classNames from "classnames";

interface Props{
    selecting: boolean;
    x: number;
    y: number;
    w: number;
    h: number;
    unitWidth: number;
    container: 'center' | 'left' | 'right'
}

export const Selector: React.FC<Props> = ({
    selecting, // is there a way to not have to repeat this twice?
    x = 0,
    y = 0,
    w = 0,
    h = 0,
    unitWidth,
    container
}: Props) => {

    const styles = {
        width: `${w*unitWidth - 12}px`,
        height: `${h*unitWidth - 12}px`,
        transform: `translate(${x*unitWidth}px, ${y*unitWidth}px)`,
      };

    return(
        <div className={
            classNames(
                'selector',
                {
                    selecting
                }
            )
        }
        style={styles}
        ></div>
    )
}