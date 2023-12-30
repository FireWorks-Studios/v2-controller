import React, { useEffect } from "react"
import './CenterContainer.css'
import { IconButton } from "@mui/material"
import {FaFlag, FaPause, FaGear} from 'react-icons/fa6'
import { TbOctagonFilled } from "react-icons/tb"
import { PiFlagBold } from "react-icons/pi";
import { PiPauseBold } from "react-icons/pi";
import { PiOctagonBold } from "react-icons/pi";
import { PiGearSixBold } from "react-icons/pi";
import { PiInfoBold } from "react-icons/pi";
import { TbVolume } from "react-icons/tb";
import classNames from "classnames"





interface Props{
    screenOrientation: string
    screenWidth: number
    screenHeight: number
    toggleEditing(): void
    centerContainerWidth: number
}

export const CenterContainer: React.FC<Props> = ({
    screenOrientation,
    screenWidth,
    screenHeight,
    toggleEditing,
    centerContainerWidth
}:Props) => {

  const styles = {
    '--screenWidth': screenWidth,
    '--screenHeight': screenHeight,
    // '--centerContainerWidth': (screenOrientation === 'portrait'? (screenWidth - 12) + "px" : (screenHeight - 40)/0.75 - 6 + "px")
  }as React.CSSProperties;

    return(
        <div
            id="centerContainer"
            className={
                classNames(
                    'centerContainer',
                    screenOrientation
                )
            }
            style={styles}
        >
            <div className="menuBar">
                <PiFlagBold className="IconBtn" style={{color: '#4cbf55'}}/>
                <PiPauseBold className="IconBtn" style={{color: '#e8a554'}}/>
                <PiOctagonBold className="IconBtn" style={{color: '#e85454'}}/>
                <input className="searchBar"></input>
                <PiGearSixBold className="IconBtn right" onClick={toggleEditing}/>
                <PiInfoBold className="IconBtn right"/>
                <TbVolume className="IconBtn right"/>
            </div>
            <iframe id="iframe" src="/projectPlayer.html#60917032"/>
        </div>
    )
}