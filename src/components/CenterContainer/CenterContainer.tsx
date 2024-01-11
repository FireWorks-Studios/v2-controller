import React, { useEffect } from "react"
import './CenterContainer.css'
import { PiFlagBold } from "react-icons/pi";
import { PiPauseBold } from "react-icons/pi";
import { PiOctagonBold } from "react-icons/pi";
import { PiGearSixBold } from "react-icons/pi";
import { PiInfoBold } from "react-icons/pi";
import { TbVolume } from "react-icons/tb";
import classNames from "classnames"
import Editor from "./Editor"




interface Props{
    screenOrientation: string
    screenWidth: number
    screenHeight: number
    toggleEditing(): void
    toggleDescription(): void
    centerContainerWidth: number
    editing: boolean
    description: boolean
    selectedTab: string
    unitWidth: number
    validDropCancelTransition: boolean
}

export const CenterContainer: React.FC<Props> = ({
    screenOrientation,
    screenWidth,
    screenHeight,
    toggleEditing,
    toggleDescription,
    editing,
    description,
    selectedTab,
    unitWidth,
    validDropCancelTransition
}:Props) => {

  const styles = {
    '--screenWidth': screenWidth,
    '--screenHeight': screenHeight,
    // '--centerContainerWidth': (screenOrientation === 'portrait'? (screenWidth - 12) + "px" : (screenHeight - 40)/0.75 - 6 + "px")
  }as React.CSSProperties;


  useEffect(()=>{
    console.log(selectedTab)
  },[selectedTab])

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
                <PiGearSixBold className={
                    classNames(
                        "IconBtn right",
                        {
                            editing,
                            selected: selectedTab === 'editor'
                        }
                    )} onClick={toggleEditing}/>
                <PiInfoBold className={
                    classNames(
                        "IconBtn right",
                        {
                            description,
                            selected: selectedTab === 'description'
                        }
                    )
                } onClick={toggleDescription}/>
                <TbVolume className="IconBtn right"/>
            </div>
            <iframe id="iframe" src="/projectPlayer.html#60917032"/>
            <div className={
                classNames(
                    "centerContentFrame",
                    {editing,
                    description}
                )}>
                <div id="descriptionContainer"
                    className={
                        classNames(
                            "descriptionContainer",
                            {
                              selected: selectedTab === 'description'
                            }
                          )}>
                    description 
                    {/* {'\nOrientation: ' + screenOrientation + '\nW: ' + screenWidth + '\nH: ' + screenHeight} */}
                </div>
                <div id="editorContainer" 
                className={
                classNames(
                    "editorContainer",
                    {
                    selected: selectedTab === 'editor'
                    }
                )}>
                    <Editor 
                    validDropCancelTransition={validDropCancelTransition}
                        toggleEditing={toggleEditing}
                        unitWidth={unitWidth}    
                    />
                </div>
            </div>
        </div>
    )
}