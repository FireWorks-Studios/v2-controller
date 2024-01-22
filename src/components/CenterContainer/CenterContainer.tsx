import React, { useCallback, useEffect, useState } from "react";
import "./CenterContainer.css";
import { PiFlagBold } from "react-icons/pi";
import { PiPauseBold } from "react-icons/pi";
import { PiOctagonBold } from "react-icons/pi";
import { PiGearSixBold } from "react-icons/pi";
import { PiInfoBold } from "react-icons/pi";
import { PiLinkBold } from "react-icons/pi";
import { TbVolume } from "react-icons/tb";
import { TbVolume3 } from "react-icons/tb";
import { IoSearch } from "react-icons/io5";
import classNames from "classnames";
import Editor from "./Editor";
import { PiPlayBold } from "react-icons/pi";
import { parseScratchProjectId } from "../../utils/parseURL";

interface Props {
  screenOrientation: string;
  screenWidth: number;
  screenHeight: number;
  toggleEditing(): void;
  toggleDescription(): void;
  centerContainerWidth: number;
  editing: boolean;
  description: boolean;
  selectedTab: string;
  unitWidth: number;
  validDropCancelTransition: boolean;
  setAppScaffolding: React.Dispatch<React.SetStateAction<any>>
}

interface CustomWindow extends Window {
  scaffolding: any; // Replace 'any' with the appropriate type
  pause: () => void;
  resume: () => void;
  start: () => void;
  stop: () => void;
  mute: () => void;
  unmute: () => void;
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
  validDropCancelTransition,
  setAppScaffolding
}: Props) => {
  const styles = {
    "--screenWidth": screenWidth,
    "--screenHeight": screenHeight,
    // '--centerContainerWidth': (screenOrientation === 'portrait'? (screenWidth - 12) + "px" : (screenHeight - 40)/0.75 - 6 + "px")
  } as React.CSSProperties;

  const [projectID, setProjectID] = useState("10128407");
  const [iframeKey, setIframeKey] = useState('');
  const [paused, setPaused] = useState(false)
  const [muted, setMuted] = useState(false)
  const [scaffolding, setScaffolding] = useState<any>();
  var iframe = document.getElementById('iframe') as HTMLIFrameElement;
  var customContentWindow = iframe?.contentWindow as CustomWindow;

  const handleLoad = () => {
    iframe = document.getElementById('iframe') as HTMLIFrameElement;
    customContentWindow = iframe?.contentWindow as CustomWindow;
    setScaffolding(customContentWindow?.scaffolding);
    console.log(scaffolding)
  };

  useEffect(()=>{
    setAppScaffolding(scaffolding)
  },[scaffolding])

  useEffect(() => {
    console.log(selectedTab);
  }, [selectedTab]);

  const handleChangeProjectID = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setProjectID(parseScratchProjectId(event.target.value)||"https://scratch.mit.edu/projects/736088939/");

    // Generate a new key to trigger iframe reload
    const newKey = Date.now().toString();

    // Update the key state to trigger the reload
    setIframeKey(newKey);
  }, [projectID]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Submitted Project ID:', projectID);
        // Generate a new key to trigger iframe reload
    const newKey = Date.now().toString();

    // Update the key state to trigger the reload
    setIframeKey(newKey);

  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
              // Generate a new key to trigger iframe reload
    const newKey = Date.now().toString();

    // Update the key state to trigger the reload
    setIframeKey(newKey);
    }
  };

  useEffect(()=>{
    if(paused){
      console.log('trigger pause')
      customContentWindow?.pause()
    }else{
      console.log('trigger resume')
      customContentWindow?.resume()
    }
  },[paused])

  useEffect(()=>{
    if(muted){
      console.log('trigger mute')
      customContentWindow?.mute()
    }else{
      console.log('trigger unmute')
      customContentWindow?.unmute()
    }
  },[muted])

  return (
    <div
      id="centerContainer"
      className={classNames("centerContainer", screenOrientation)}
      style={styles}
    >
      <div className="menuBar">
        <PiFlagBold id="GreenFlagBtn" className="IconBtn" style={{ color: "#4cbf55" }} onClick={customContentWindow?.start}/>
        {paused? <PiPlayBold id="PauseBtn" className="IconBtn" style={{ color: "#e8a554" }} onClick={()=>{setPaused(false)}}/>:<PiPauseBold id="PauseBtn" className="IconBtn" style={{ color: "#e8a554" }} onClick={()=>{setPaused(true)}}/>}
        <PiOctagonBold id="StopBtn" className="IconBtn" style={{ color: "#e85454" }} onClick={customContentWindow?.stop}/>
        <form className="searchBarContainer" onSubmit={handleSubmit}>
            <button className="linkButton">
                <PiLinkBold/>
            </button>
          <input className="searchBar" type="text" placeholder={"https://scratch.mit.edu/projects/"+projectID+'/'} onChange={handleChangeProjectID} onKeyPress={handleKeyPress} inputMode="search"></input>
          <button type="submit" className="searchButton">
            <IoSearch />
          </button>
        </form>
        <PiGearSixBold
          className={classNames("IconBtn right", {
            editing,
            selected: selectedTab === "editor",
          })}
          onClick={toggleEditing}
        />
        <PiInfoBold
          className={classNames("IconBtn right", {
            description,
            selected: selectedTab === "description",
          })}
          onClick={toggleDescription}
        />
        {muted? <TbVolume3 id="MuteBtn" className="IconBtn right" onClick={()=>setMuted(false)}/>:<TbVolume id="MuteBtn" className="IconBtn right" onClick={()=>setMuted(true)}/>}
        <TbVolume id="MuteBtn" className="IconBtn right" />
      </div>
      <iframe id="iframe" key={iframeKey} src={"/projectPlayer.html#" + projectID} onLoad={handleLoad}/>
      <div id="iframeMask" className="iframeMask MouseAndKeyboard"></div>
      <div
        className={classNames("centerContentFrame", { editing, description })}
      >
        <div
          id="descriptionContainer"
          className={classNames("descriptionContainer", {
            selected: selectedTab === "description",
          })}
        >
          description
        </div>
        <div
          id="editorContainer"
          className={classNames("editorContainer", {
            selected: selectedTab === "editor",
          })}
        >
          <Editor
            validDropCancelTransition={validDropCancelTransition}
            toggleEditing={toggleEditing}
            unitWidth={unitWidth}
          />
        </div>
      </div>
    </div>
  );
};
