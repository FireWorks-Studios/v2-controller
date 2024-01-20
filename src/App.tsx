import { ComponentRepresentation, ControllerContainer } from "./components/ControllerContainer/ControllerContainer";
import "./App.css";
import React, { useCallback, useEffect, useState } from "react";
import { createTheme, ThemeProvider } from "@material-ui/core";
import { CenterContainer } from "./components/CenterContainer/CenterContainer";
import classNames from "classnames";
import { checkValidAppend } from "./utils/position";
import { keyDict } from "./utils/keyMapping";

const theme = createTheme({
  palette: {
    primary: {
      main: "#4d96fe",
    },
    secondary: {
      main: "#FFFFFF",
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

const centerDefaultComponentRepresentations:ComponentRepresentation[] = 
[
  {
      "type": "button",
      "styling": [],
      "mapping": "ArrowUp",
      "container": "center",
      "x": 1,
      "y": 0,
      "w": 1,
      "h": 1,
      "color": "#006aff",
      "pressed": false
  },
  {
      "type": "button",
      "styling": [],
      "mapping": "ArrowLeft",
      "container": "center",
      "x": 0,
      "y": 1,
      "w": 1,
      "h": 1,
      "color": "#006aff",
      "pressed": false
  },
  {
      "type": "button",
      "styling": [],
      "mapping": "ArrowDown",
      "container": "center",
      "x": 1,
      "y": 2,
      "w": 1,
      "h": 1,
      "color": "#006aff",
      "pressed": false
  },
  {
      "type": "button",
      "styling": [],
      "mapping": "ArrowRight",
      "container": "center",
      "x": 2,
      "y": 1,
      "w": 1,
      "h": 1,
      "color": "#006aff",
      "pressed": false
  },
  {
      "type": "button",
      "styling": [],
      "mapping": "a",
      "container": "center",
      "x": 5,
      "y": 1,
      "w": 1,
      "h": 1,
      "color": "#006aff",
      "pressed": false
  },
  {
      "type": "button",
      "styling": [],
      "mapping": "b",
      "container": "center",
      "x": 4,
      "y": 2,
      "w": 1,
      "h": 1,
      "color": "#006aff",
      "pressed": false
  }
]

  const leftDefaultComponentRepresentations:ComponentRepresentation[] = 
  [
    {
        "type": "button",
        "styling": [],
        "mapping": "w",
        "container": "left",
        "x": 1,
        "y": 0,
        "w": 1,
        "h": 1,
        "color": "#006aff",
        "pressed": false
    },
    {
        "type": "button",
        "styling": [],
        "mapping": "a",
        "container": "left",
        "x": 0,
        "y": 1,
        "w": 1,
        "h": 1,
        "color": "#006aff",
        "pressed": false
    },
    {
        "type": "button",
        "styling": [],
        "mapping": "s",
        "container": "left",
        "x": 1,
        "y": 2,
        "w": 1,
        "h": 1,
        "color": "#006aff",
        "pressed": false
    },
    {
        "type": "button",
        "styling": [],
        "mapping": "d",
        "container": "left",
        "x": 2,
        "y": 1,
        "w": 1,
        "h": 1,
        "color": "#006aff",
        "pressed": false
    },
    {
        "type": "button",
        "styling": [
            "short"
        ],
        "mapping": "e",
        "container": "left",
        "x": 2,
        "y": 0,
        "w": 1,
        "h": 1,
        "color": "#006aff",
        "pressed": false
    },
    {
        "type": "button",
        "styling": [
            "short"
        ],
        "mapping": "f",
        "container": "left",
        "x": 0,
        "y": 0,
        "w": 1,
        "h": 1,
        "color": "#006aff",
        "pressed": false
    },
    {
        "type": "button",
        "styling": [
            "round",
            "short"
        ],
        "mapping": "1",
        "container": "left",
        "x": 0,
        "y": 3,
        "w": 1,
        "h": 1,
        "color": "#006aff",
        "pressed": false
    },
    {
        "type": "button",
        "styling": [
            "round",
            "short"
        ],
        "mapping": "2",
        "container": "left",
        "x": 1,
        "y": 3,
        "w": 1,
        "h": 1,
        "color": "#006aff",
        "pressed": false
    },
    {
        "type": "button",
        "styling": [
            "round",
            "short"
        ],
        "mapping": "3",
        "container": "left",
        "x": 2,
        "y": 3,
        "w": 1,
        "h": 1,
        "color": "#006aff",
        "pressed": false
    },
    {
        "type": "button",
        "styling": [
            "round",
            "short"
        ],
        "mapping": "4",
        "container": "left",
        "x": 0,
        "y": 4,
        "w": 1,
        "h": 1,
        "color": "#006aff",
        "pressed": false
    },
    {
        "type": "button",
        "styling": [
            "round",
            "short"
        ],
        "mapping": "5",
        "container": "left",
        "x": 1,
        "y": 4,
        "w": 1,
        "h": 1,
        "color": "#006aff",
        "pressed": false
    },
    {
        "type": "button",
        "styling": [
            "round",
            "short"
        ],
        "mapping": "6",
        "container": "left",
        "x": 2,
        "y": 4,
        "w": 1,
        "h": 1,
        "color": "#006aff",
        "pressed": false
    },
    {
        "type": "button",
        "styling": [
            "round",
            "short"
        ],
        "mapping": "7",
        "container": "left",
        "x": 0,
        "y": 5,
        "w": 1,
        "h": 1,
        "color": "#006aff",
        "pressed": false
    },
    {
        "type": "button",
        "styling": [
            "round",
            "short"
        ],
        "mapping": "8",
        "container": "left",
        "x": 1,
        "y": 5,
        "w": 1,
        "h": 1,
        "color": "#006aff",
        "pressed": false
    },
    {
        "type": "button",
        "styling": [
            "round",
            "short"
        ],
        "mapping": "9",
        "container": "left",
        "x": 2,
        "y": 5,
        "w": 1,
        "h": 1,
        "color": "#006aff",
        "pressed": false
    }
]

  const rightDefaultComponentRepresentations:ComponentRepresentation[] = 
  [
    {
        "type": "button",
        "styling": [],
        "mapping": "Space",
        "container": "right",
        "x": 0,
        "y": 1,
        "w": 3,
        "h": 1,
        "color": "#006aff",
        "pressed": false
    },
    {
        "type": "button",
        "styling": [
            "round",
            "short"
        ],
        "mapping": "o",
        "container": "right",
        "x": 0,
        "y": 0,
        "w": 1,
        "h": 1,
        "color": "#006aff",
        "pressed": false
    },
    {
        "type": "button",
        "styling": [
            "round",
            "short"
        ],
        "mapping": "p",
        "container": "right",
        "x": 1,
        "y": 0,
        "w": 1,
        "h": 1,
        "color": "#006aff",
        "pressed": false
    },
    {
        "type": "button",
        "styling": [
            "short"
        ],
        "mapping": "e",
        "container": "right",
        "x": 2,
        "y": 0,
        "w": 1,
        "h": 1,
        "color": "#006aff",
        "pressed": false
    }
]

function App() {
  const [editing, setEditing] = useState(false);
  const [description, setDescription] = useState(false);
  const [selectedTab, setSelectedTab] = useState("");
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [screenHeight, setScreenHeight] = useState(window.innerHeight);
  const [screenOritentation, setScreenOrientation] = useState(window.matchMedia("(orientation: portrait)").matches? 'portrait':'landscape')
  const [centerContainerWidth, setCenterContainerWidth] = useState(screenWidth - 12)
  const [overlay] = useState(false);
  const [unitWidth, setUnitWidth] = useState(150);

  const [draggingComponent, setDraggingComponent] = useState<ComponentRepresentation|null>(null);
  const [centerComponentRepresentations, setCenterComponentRepresentations] = useState<ComponentRepresentation[]>(centerDefaultComponentRepresentations)
  const [leftComponentRepresentations, setLeftComponentRepresentations] = useState<ComponentRepresentation[]>(leftDefaultComponentRepresentations)
  const [rightComponentRepresentations, setRightComponentRepresentations] = useState<ComponentRepresentation[]>(rightDefaultComponentRepresentations)

  const [validDropCancelTransition, setValidDropCancelTransition] = useState(false)

  const [scaffolding, setScaffolding] = useState<any>();

  window
    .matchMedia("(orientation: portrait)")
    .addEventListener("change", (e) => {
      const portrait = e.matches;
      if (portrait) {
        setScreenOrientation("portrait");
      } else {
        setScreenOrientation("landscape");
      }
      setScreenWidth(window.innerWidth);
      setScreenHeight(window.innerHeight);
    });

  useEffect(()=>{
    if(scaffolding === undefined){
      return
    }
    var keysToFire: string[] = []
    var keysToKill: string[]  = []
    const readKeyDown = (componentRepresentations: ComponentRepresentation[]) => {
      for (const componentRepresentation of componentRepresentations){
        if(componentRepresentation.pressed){
          if(!keysToFire.includes(componentRepresentation.mapping)){
            keysToFire.push(componentRepresentation.mapping)
          }
        }
      }
    }
    const readKeyUp = (componentRepresentations: ComponentRepresentation[]) => {
      for (const componentRepresentation of componentRepresentations){
        if(!componentRepresentation.pressed){
          if(!keysToFire.includes(componentRepresentation.mapping)){
            if(!keysToKill.includes(componentRepresentation.mapping)){
              keysToKill.push(componentRepresentation.mapping)
            }
          }
        }
      }
    }
    readKeyDown(centerComponentRepresentations)
    readKeyDown(leftComponentRepresentations)
    readKeyDown(rightComponentRepresentations)
    readKeyUp(centerComponentRepresentations)
    readKeyUp(leftComponentRepresentations)
    readKeyUp(rightComponentRepresentations)
    console.log('keys to fire: ' + keysToFire)
    console.log('keys to kill: ' + keysToKill)
    // scaffolding.vm.postIOData("keyboard",{key:'ArrowUp', keyCode:38, isDown: true});
    keysToKill.forEach((key) => {
      scaffolding.vm.postIOData('keyboard',{key:key, keyCode:keyDict[key as keyof typeof keyDict], isDown: false})
    });

    keysToFire.forEach((key) => {
      scaffolding.vm.postIOData('keyboard',{key:key, keyCode:keyDict[key as keyof typeof keyDict], isDown: true})
    });

  }, [scaffolding, centerComponentRepresentations, leftComponentRepresentations, rightComponentRepresentations])

  useEffect(() => {
    setScreenWidth(window.innerWidth);
    setScreenHeight(window.innerHeight);

    setTimeout(() => {
      setScreenWidth(window.innerWidth);
      setScreenHeight(window.innerHeight);
    }, 50);
    setTimeout(() => {
      setScreenWidth(window.innerWidth);
      setScreenHeight(window.innerHeight);
    }, 100);
    setTimeout(() => {
      setScreenWidth(window.innerWidth);
      setScreenHeight(window.innerHeight);
    }, 300);
    setTimeout(() => {
      setScreenWidth(window.innerWidth);
      setScreenHeight(window.innerHeight);
    }, 500);
  }, [screenOritentation, setScreenWidth, setScreenHeight]);

  useEffect(() => {
    if (screenOritentation === "portrait") {
      setCenterContainerWidth(window.innerWidth - 12);
      setUnitWidth((screenWidth - 8) / 6);
    } else {
      setCenterContainerWidth((window.innerHeight - 40) / 0.75 - 6);
      if (overlay) {
        setUnitWidth((screenHeight - 46) / 6);
      } else {
        setUnitWidth(
          Math.min(
            (screenHeight - 46) / 6,
            (screenWidth - ((screenHeight - 40) / 0.75 - 6)) / 6
          )
        );
      }
    }
  }, [screenWidth, screenHeight, screenOritentation]);

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

  function toggleEditing() {
    if (editing) {
      if (selectedTab === "description") {
        setSelectedTab("editor");
        return;
      }
      if (description) {
        setSelectedTab("description");
      } else {
        setSelectedTab("");
      }
      setEditing(false);
    } else {
      setEditing(true);
      setSelectedTab("editor");
    }
  }

  function toggleDescription() {
    if (description) {
      if (selectedTab === "editor") {
        setSelectedTab("description");
        return;
      }
      if (editing) {
        setSelectedTab("editor");
      } else {
        setSelectedTab("");
      }
      setDescription(false);
    } else {
      setDescription(true);
      setSelectedTab("description");
    }
  }

  const appStyles = {
    "--screenWidth": screenWidth + "px",
    "--screenHeight": screenHeight + "px",
    "--centerContainerWidth":
      screenOritentation === "portrait"
        ? screenWidth - 12 + "px"
        : (screenHeight - 40) / 0.75 - 6 + "px",
    // '--unitWidth': (screenOritentation === 'portrait'? ((screenWidth - 8) / 6)  + "px": (overlay? ((screenHeight - 46) / 6) : (Math.min(((screenHeight - 46) / 6), (screenWidth - ((screenHeight - 40)/0.75 - 6))/6))) + "px"),
    "--unitWidth": unitWidth + "px",
  } as React.CSSProperties;



  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>)=>{
    const { target } = e;
    if(target instanceof Element){
      if(target.closest('.draggable-dummy')){
        console.log(target.closest('.draggable-dummy'))
        setValidDropCancelTransition(false)
        // dragging dummy component -> add componentRepresentation of dummy component to the useState (hardcoded as default button for now) TODO: pass setDraggingComponent into dummy components so they can define the componentRepresentation themselves
        setDraggingComponent({
          type: "button",
          styling: [],
          mapping: "ArrowUp",
          container: "left",
          x: 0,
          y: 0,
          w: 1,
          h: 1,
          color: '#006aff'
        })
      }
    }
  },[])

  const appendComponent = useCallback((container: 'center' | 'left' | 'right', x: number, y: number)=>{
    if(draggingComponent === null){
      return
    }
    console.log({...draggingComponent, container, x, y})
    const tempComponent = {...draggingComponent, container, x, y}
    var tempComponentRepresentations: ComponentRepresentation[]
    if(container === 'center'){
      tempComponentRepresentations = centerComponentRepresentations
    }else if(container === 'left'){
      tempComponentRepresentations = leftComponentRepresentations
    }else{
      tempComponentRepresentations = rightComponentRepresentations
    }

    //check for collisions
    let valid = checkValidAppend({x, y, component: tempComponent, componentRepresentations: tempComponentRepresentations})
    //add tempComponent to corresponding controller
    if(valid){    
      setValidDropCancelTransition(true)
      document.getElementsByClassName('draggable-dummy')[0].classList.add('append-successful')
      console.log(document.getElementsByClassName('draggable-dummy')[0].classList)
      tempComponentRepresentations.push(tempComponent)
      if(container === 'center'){
        setCenterComponentRepresentations(tempComponentRepresentations)
      }else if(container === 'left'){
        setLeftComponentRepresentations(tempComponentRepresentations)
      }else{
        setRightComponentRepresentations(tempComponentRepresentations)
      }
    }else{
      console.log('invalid append!')
    }


    setDraggingComponent(null)
  },[draggingComponent, centerComponentRepresentations, leftComponentRepresentations, rightComponentRepresentations])

  const handlePointerUpCapture = useCallback((e: React.PointerEvent<HTMLDivElement>)=>{
    if(draggingComponent !== null){
      const { clientX, clientY } = e;
      //check if the pointer up is inside a controller box
      if(screenOritentation === 'portrait'){
        const centerControllerContainer  = document.getElementsByClassName('controller-container center')[0]
        const { left, top, right, bottom } = centerControllerContainer.getBoundingClientRect();
        if (clientX >= left && clientX <= right && clientY >= top && clientY <= bottom) {
          console.log(`Pointer is inside center controller`);
          //determine localX and localY of where the drop occured
          const localX = Math.floor((clientX - left)/unitWidth)
          const localY = Math.floor((clientY - top)/unitWidth)
          appendComponent('center', localX, localY)
        }
      }else if(screenOritentation === 'landscape'){
        //landscape part
        const leftControllerContainer  = document.getElementsByClassName('controller-container left')[0]
        const l = leftControllerContainer.getBoundingClientRect();
        if (clientX >= l.left && clientX <= l.right && clientY >= l.top && clientY <= l.bottom) {
          console.log(`Pointer is inside left controller`);
          //determine localX and localY of where the drop occured
          const localX = Math.floor((clientX - l.left)/unitWidth)
          const localY = Math.floor((clientY - l.top)/unitWidth)
          appendComponent('left', localX, localY)
        }
        const rightControllerContainer  = document.getElementsByClassName('controller-container right')[0]
        const r = rightControllerContainer.getBoundingClientRect();
        if (clientX >= r.left && clientX <= r.right && clientY >= r.top && clientY <= r.bottom) {
          console.log(`Pointer is inside right controller`);
          //determine localX and localY of where the drop occured
          const localX = Math.floor((clientX - r.left)/unitWidth)
          const localY = Math.floor((clientY - r.top)/unitWidth)
          appendComponent('right', localX, localY)
        }
      }
    }
  },[draggingComponent])

  return (
    <ThemeProvider theme={theme}>
      <div
        className={classNames(
          "App noscroll prevent-select",
          screenOritentation
        )}
        style={appStyles}
        onPointerDown={handlePointerDown}
        onPointerUpCapture={handlePointerUpCapture}
      >
        <CenterContainer
        validDropCancelTransition={validDropCancelTransition}
          unitWidth={unitWidth}
          selectedTab={selectedTab}
          description={description}
          toggleDescription={toggleDescription}
          editing={editing}
          toggleEditing={toggleEditing}
          screenOrientation={screenOritentation}
          screenWidth={screenWidth}
          screenHeight={screenHeight}
          centerContainerWidth={centerContainerWidth}
          setAppScaffolding={setScaffolding}
        />
        {/* <button className="edit" onClick={() => setEditing(!editing)}>
          edit
        </button> */}
        {screenOritentation === "portrait" ? (
          <ControllerContainer
            position={"center"}
            // unitWidth={(screenWidth - 8) / 6}
            unitWidth={unitWidth}
            defaultComponentRepresentations={centerComponentRepresentations}
            editing={editing}
            updateComponentRepresentations={setCenterComponentRepresentations}
          />
        ) : (
          ""
        )}
        {screenOritentation === "landscape" ? (
          <ControllerContainer
            position={"left"}
            // unitWidth={overlay? ((screenHeight - 46) / 6) : (Math.min(((screenHeight - 46) / 6), (screenWidth - ((screenHeight - 40)/0.75 - 6))/6))}
            unitWidth={unitWidth}
            defaultComponentRepresentations={leftComponentRepresentations}
            editing={editing}
            updateComponentRepresentations={setLeftComponentRepresentations}
          />
        ) : (
          ""
        )}
        {screenOritentation === "landscape" ? (
          <ControllerContainer
            position={"right"}
            unitWidth={unitWidth}
            defaultComponentRepresentations={rightComponentRepresentations}
            editing={editing}
            updateComponentRepresentations={setRightComponentRepresentations}
          />
        ) : (
          ""
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;
