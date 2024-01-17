import React, { useCallback, useEffect, useRef, useState } from "react";
import "./CenterContainer.css";
import { PiFlagBold } from "react-icons/pi";
import { PiPauseBold } from "react-icons/pi";
import { PiOctagonBold } from "react-icons/pi";
import { PiGearSixBold } from "react-icons/pi";
import { PiInfoBold } from "react-icons/pi";
import { PiLinkBold } from "react-icons/pi";
import { TbVolume } from "react-icons/tb";
import { IoSearch } from "react-icons/io5";
import classNames from "classnames";
import Editor from "./Editor";
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
}: Props) => {
  const styles = {
    "--screenWidth": screenWidth,
    "--screenHeight": screenHeight,
    // '--centerContainerWidth': (screenOrientation === 'portrait'? (screenWidth - 12) + "px" : (screenHeight - 40)/0.75 - 6 + "px")
  } as React.CSSProperties;

  const [projectID, setProjectID] = useState("10128407");
  const [iframeKey, setIframeKey] = useState('');
  const iframeRef = useRef<HTMLIFrameElement | null>(null)

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

  useEffect(() => {
    // Message event listener
    const handleMessage = (event: { source: any; data: { scaffolding: any; }; }) => {
      // Ensure the message is sent from the iframe
      if (event.source !== iframeRef.current?.contentWindow) {
        return;
      }

      // Get the scaffolding object from the message
      const { scaffolding } = event.data;

      // Now you can use the scaffolding object
      console.log(scaffolding);

      // Do something with the scaffolding object in your React app
      // ...
    };

    // Add event listener when the component mounts
    window.addEventListener('message', handleMessage);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);


  return (
    <div
      id="centerContainer"
      className={classNames("centerContainer", screenOrientation)}
      style={styles}
    >
      <div className="menuBar">
        <PiFlagBold id="GreenFlagBtn" className="IconBtn" style={{ color: "#4cbf55" }} />
        <PiPauseBold id="PauseBtn" className="IconBtn" style={{ color: "#e8a554" }} />
        <PiOctagonBold id="StopBtn" className="IconBtn" style={{ color: "#e85454" }} />
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
        <TbVolume id="MuteBtn" className="IconBtn right" />
      </div>
      <iframe ref={iframeRef} id="iframe" key={iframeKey} src={"/projectPlayer.html#" + projectID} />
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
