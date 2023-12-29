import { ControllerContainer } from "./components/ControllerContainer/ControllerContainer";
import "./App.css";
import React, { useEffect, useState, useRef } from "react";
import { createTheme, ThemeProvider } from "@material-ui/core";
import { CenterContainer } from "./components/CenterContainer/CenterContainer";

const theme = createTheme({
  palette: {
    primary: {
      main: '#4d96fe',
    },
    secondary: {
      main: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
  },
});

function App() {
  const [editing, setEditing] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [screenHeight, setScreenHeight] = useState(window.innerHeight);
  const [screenOritentation, setScreenOrientation] = useState(window.matchMedia("(orientation: portrait)").matches? 'portrait':'landscape')

  window.matchMedia("(orientation: portrait)").addEventListener("change", e => {
    const portrait = e.matches;

    if (portrait) {
        // do something
        setScreenOrientation('portrait')
    } else {
        // do something else
        setScreenOrientation('landscape')
    }
});

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
      setScreenHeight(window.innerHeight);

    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  function toggleEditing(){
    setEditing(!editing)
  }

  const appStyles = {
    '--screenWidth': screenWidth,
    '--screenHeight': screenHeight,
  }as React.CSSProperties;

  return (
    <ThemeProvider theme={theme}>
      <div className="App noscroll prevent-select" style={appStyles}>
        <CenterContainer
        toggleEditing={toggleEditing}
          screenOrientation={screenOritentation}
          screenWidth={screenWidth}
          screenHeight={screenHeight}
        />
        {/* <button className="edit" onClick={() => setEditing(!editing)}>
          edit
        </button> */}
        {screenOritentation === 'portrait'? 
        <ControllerContainer
          position={"center"}
          unitWidth={(screenWidth - 8) / 6}
          defaultComponentRepresentations={[
            {
              type: "button",
              styling: [],
              mapping: "ArrowUp",
              container: "center",
              x: 1,
              y: 0,
              w: 1,
              h: 1,
              color: '#006aff'
            },
            {
              type: "button",
              styling: ["round", "short"],
              mapping: "Green Flag",
              container: "center",
              x: 2,
              y: 0,
              w: 1,
              h: 1,
              color: '#006aff'
            },
            {
              type: "button",
              styling: ["round", "short"],
              mapping: "Pause",
              container: "center",
              x: 3,
              y: 0,
              w: 1,
              h: 1,
              color: '#006aff'
            },
            {
              type: "button",
              styling: ["round", "short"],
              mapping: "Stop",
              container: "center",
              x: 4,
              y: 0,
              w: 2,
              h: 1,
              color: '#006aff'
            },
            {
              type: "button",
              styling: [],
              mapping: "ArrowLeft",
              container: "center",
              x: 0,
              y: 1,
              w: 2,
              h: 1,
              color: '#006aff'
            },
            {
              type: "button",
              styling: [],
              mapping: "ArrowDown",
              container: "center",
              x: 1,
              y: 2,
              w: 1,
              h: 1,
              color: '#006aff'
            },
            {
              type: "button",
              styling: [],
              mapping: "ArrowRight",
              container: "center",
              x: 2,
              y: 1,
              w: 2,
              h: 2,
              color: '#006aff'
            },
            {
              type: "button",
              styling: [],
              mapping: "a",
              container: "center",
              x: 5,
              y: 1,
              w: 1,
              h: 2,
              color: '#006aff'
            },
            {
              type: "button",
              styling: [],
              mapping: "b",
              container: "center",
              x: 4,
              y: 2,
              w: 1,
              h: 1,
              color: '#006aff'
            },
          ]}
          editing={editing}
        />:''
        }
        {screenOritentation === 'landscape'?
          <ControllerContainer
          position={"left"}
          unitWidth={(screenHeight - 8 - 48) / 7}
          defaultComponentRepresentations={[
            {
              type: "button",
              styling: [],
              mapping: "ArrowUp",
              container: "center",
              x: 1,
              y: 0,
              w: 1,
              h: 1,
              color: '#006aff'
            }
          ]}
          editing={editing}
        />:''}
        {screenOritentation === 'landscape'?
          <ControllerContainer
          position={"right"}
          unitWidth={(screenHeight - 8 - 48) / 7}
          defaultComponentRepresentations={[]}
          editing={editing}
        />:''}

        
      </div>
    </ThemeProvider>
  );
}

export default App;
