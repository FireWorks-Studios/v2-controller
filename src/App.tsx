import {
  ComponentRepresentation,
  ControllerContainer,
} from "./components/ControllerContainer/ControllerContainer";
import "./App.css";
import React, { useCallback, useEffect, useState } from "react";
import {
  CenterContainer,
  CustomWindow,
} from "./components/CenterContainer/CenterContainer";
import classNames from "classnames";
import { checkValidAppend, findClosestEmptySpot } from "./utils/position";
import {
  centerDefaultComponentRepresentations,
  keyDict,
  leftDefaultComponentRepresentations,
  rightDefaultComponentRepresentations,
} from "./utils/keyMapping";
import { useWindowSize } from "./utils/windowResize";
// import { useRenderCount } from "@uidotdev/usehooks";
import { MdFullscreen } from "react-icons/md";
import { MdFullscreenExit } from "react-icons/md";
import { FaCaretUp } from "react-icons/fa6";
import { FaCaretDown } from "react-icons/fa";

function App() {
  // console.trace();
  const [fullscreen, setFullscreen] = useState(false);
  // const renderCount = useRenderCount();
  const { width, height } = useWindowSize();

  const [editing, setEditing] = useState(false);
  const [description, setDescription] = useState(false);
  const [selectedTab, setSelectedTab] = useState("");
  const [screenWidth, setScreenWidth] = useState(width);
  const [screenHeight, setScreenHeight] = useState(height);
  const [screenOritentation, setScreenOrientation] = useState<
    "portrait" | "landscape"
  >(
    window.matchMedia("(orientation: portrait)").matches
      ? "portrait"
      : "landscape"
  );
  const [centerContainerWidth, setCenterContainerWidth] = useState(
    screenWidth - 12
  );
  const [overlay] = useState(false);
  const [unitWidth, setUnitWidth] = useState<{
    portrait: number;
    landscape: number;
  }>({ portrait: 150, landscape: 150 });

  const [draggingComponent, setDraggingComponent] =
    useState<ComponentRepresentation | null>(null);
  const [centerComponentRepresentations, setCenterComponentRepresentations] =
    useState<ComponentRepresentation[]>(centerDefaultComponentRepresentations);
  const [leftComponentRepresentations, setLeftComponentRepresentations] =
    useState<ComponentRepresentation[]>(leftDefaultComponentRepresentations);
  const [rightComponentRepresentations, setRightComponentRepresentations] =
    useState<ComponentRepresentation[]>(rightDefaultComponentRepresentations);

  const [validDropCancelTransition, setValidDropCancelTransition] =
    useState(false);

  const [scaffolding, setScaffolding] = useState<any>();

  const [pointerEvents, setPointerEvents] =
    useState<React.PointerEvent<HTMLDivElement> | null>(null);
  const [pointerMousePos, setPointerMousePos] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [pointerMouseDown, setPointerMouseDown] = useState(false);

  const [controllerAdvancedConfig, setControllerAdvancedConfig] = useState<
    string[]
  >(["mouseAndKeyboardMode"]); //'turboMode', 'safetyMargin', 'mouseAndKeyboardMode', 'handheldMode'

  const [menuBarShown, setMenuBarShown] = useState(true);

  useEffect(() => {
    const handleOrientationChange = (e: MediaQueryListEvent) => {
      const portrait = e.matches;
      if (portrait) {
        setScreenOrientation("portrait");
      } else {
        setScreenOrientation("landscape");
      }
    };

    const mediaQueryList = window.matchMedia("(orientation: portrait)");
    mediaQueryList.addEventListener("change", handleOrientationChange);

    return () => {
      mediaQueryList.removeEventListener("change", handleOrientationChange);
    };
  }, []);

  const toggleFullscreen = useCallback(() => {
    setFullscreen((prevFullscreen) => !prevFullscreen);
  }, []);

  const toggleMenuBar = useCallback(() => {
    setMenuBarShown((prevMenuBar) => !prevMenuBar);
  }, []);

  useEffect(() => {
    if (fullscreen) {
      // document.body.classList.add('fullscreen')
      if (document.fullscreenEnabled) {
        document.getElementById("App")?.requestFullscreen();
      }
    } else {
      // document.body.classList.remove('fullscreen');
      setControllerAdvancedConfig(
        controllerAdvancedConfig.filter((e) => e !== "handheldMode")
      );
      if (document.fullscreenElement) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    }
  }, [fullscreen]);

  useEffect(() => {
    if (controllerAdvancedConfig.includes("handheldMode")) {
      setFullscreen(true);
    } else {
      setFullscreen(false);
    }
  }, [controllerAdvancedConfig]);

  const handleFullscreenChange = useCallback(() => {
    if (document.fullscreenElement) {
      console.log(
        `Element: ${document.fullscreenElement.id} entered fullscreen mode.`
      );
    } else {
      console.log("Leaving fullscreen mode.");
      setFullscreen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [handleFullscreenChange]);

  // useEffect(() => {
  //   console.log("App render count:", renderCount);
  // }, [renderCount]);

  useEffect(() => {
    if (scaffolding === undefined) {
      return;
    }
    var keysToFire: string[] = [];
    var keysToKill: string[] = [];
    const readKey = (componentRepresentations: ComponentRepresentation[]) => {
      var index = 0;
      for (const componentRepresentation of componentRepresentations) {
        if (componentRepresentation.type == "button") {
          if (!keysToKill.includes(componentRepresentation.mapping[0])) {
            keysToKill.push(componentRepresentation.mapping[0]);
          }
          if (componentRepresentation.pressed) {
            if (!keysToFire.includes(componentRepresentation.mapping[0])) {
              keysToFire.push(componentRepresentation.mapping[0]);
            }
          }
        } else if (componentRepresentation.type === "joystick") {
          const upKey = componentRepresentation.mapping[0];
          const downKey = componentRepresentation.mapping[1];
          const leftKey = componentRepresentation.mapping[2];
          const rightKey = componentRepresentation.mapping[3];
          const deadZone = 0.1;
          const { x, y } = componentRepresentation.capturedTouchPositions[0];
          console.log(
            "app reading joystick " +
              index +
              " val pressed: " + componentRepresentation.pressed +
              " x: " +
              x +
              " y: " +
              y +
              " up: " +
              upKey +
              " down: " +
              downKey +
              " left: " +
              leftKey +
              " right: " +
              rightKey
          );

          if (!keysToKill.includes(upKey)) {
            keysToKill.push(upKey);
          }
          if (!keysToKill.includes(downKey)) {
            keysToKill.push(downKey);
          }
          if (!keysToKill.includes(leftKey)) {
            keysToKill.push(leftKey);
          }
          if (!keysToKill.includes(rightKey)) {
            keysToKill.push(rightKey);
          }

          if (componentRepresentation.pressed) {
            if (y > deadZone && !keysToFire.includes(upKey)) {
              keysToFire.push(upKey);
            }
            if (y < -deadZone && !keysToFire.includes(downKey)) {
              keysToFire.push(downKey);
            }
            if (x > deadZone && !keysToFire.includes(rightKey)) {
              keysToFire.push(rightKey);
            }
            if (x < -deadZone && !keysToFire.includes(leftKey)) {
              keysToFire.push(leftKey);
            }
          }
        }
        index++;
      }
    };

    readKey(centerComponentRepresentations);
    readKey(leftComponentRepresentations);
    readKey(rightComponentRepresentations);

    // Filter out keysToFire from keysToKill
    keysToKill = keysToKill.filter((key) => !keysToFire.includes(key));

    console.log("keys to fire: " + keysToFire);
    console.log("keys to kill: " + keysToKill);

    keysToKill.forEach((key) => {
      if (key === "Space") {
        key = " ";
      }
      scaffolding.vm.postIOData("keyboard", {
        key: key,
        keyCode: keyDict[key],
        isDown: false,
      });
    });

    keysToFire.forEach((key) => {
      if (key === "Space") {
        key = " ";
      }
      scaffolding.vm.postIOData("keyboard", {
        key: key,
        keyCode: keyDict[key],
        isDown: true,
      });
    });
  }, [
    scaffolding,
    centerComponentRepresentations,
    leftComponentRepresentations,
    rightComponentRepresentations,
  ]);

  useEffect(() => {
    updateScreenDimensions();
  }, [controllerAdvancedConfig, screenOritentation, width, height]);

  const updateScreenDimensions = useCallback(() => {
    console.log("screen dimension update requested");
    if (!controllerAdvancedConfig.includes("safetyMargin")) {
      setScreenWidth(width);
      setScreenHeight(height);
    } else {
      setScreenWidth(width - 36);
      setScreenHeight(height - 36);
    }
  }, [controllerAdvancedConfig, width, height, screenOritentation]);

  useEffect(() => {
    if (screenOritentation === "portrait") {
      setCenterContainerWidth(width - 12);
      setUnitWidth({ ...unitWidth, portrait: (screenWidth - 8) / 6 });
    } else {
      if (menuBarShown) {
        setCenterContainerWidth((height - 40) / 0.75 - 6);
      } else {
        setCenterContainerWidth(height / 0.75 - 6);
      }
      if (overlay) {
        setUnitWidth({ ...unitWidth, landscape: (screenHeight - 46) / 6 });
      } else {
        if (menuBarShown) {
          setUnitWidth({
            ...unitWidth,
            landscape: Math.min(
              (screenHeight - 46) / 6,
              (screenWidth - ((screenHeight - 40) / 0.75 - 6)) / 6
            ),
          });
        } else {
          setUnitWidth({
            ...unitWidth,
            landscape: Math.min(
              (screenHeight - 46) / 6,
              (screenWidth - (screenHeight / 0.75 - 6)) / 6
            ),
          });
        }
      }
    }
  }, [
    screenWidth,
    screenHeight,
    screenOritentation,
    width,
    height,
    overlay,
    controllerAdvancedConfig,
  ]);

  const toggleEditing = useCallback(() => {
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
  }, [editing, selectedTab, description]);

  const toggleDescription = useCallback(() => {
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
  }, [description, selectedTab, editing]);

  const appStyles = {
    "--screenWidth": screenWidth + "px",
    "--screenHeight": screenHeight + "px",
    "--centerContainerWidth":
      screenOritentation === "portrait"
        ? screenWidth - 12 + "px"
        : menuBarShown
        ? (screenHeight - 40) / 0.75 - 6 + "px"
        : screenHeight / 0.75 + "px",
    // '--unitWidth': (screenOritentation === 'portrait'? ((screenWidth - 8) / 6)  + "px": (overlay? ((screenHeight - 46) / 6) : (Math.min(((screenHeight - 46) / 6), (screenWidth - ((screenHeight - 40)/0.75 - 6))/6))) + "px"),
    "--unitWidth": unitWidth[screenOritentation] + "px",
  } as React.CSSProperties;

  useEffect(() => {
    if (pointerEvents === null) {
      setPointerMouseDown(false);
      return;
    }
    console.log(pointerEvents);
    const { clientX, clientY, type } = pointerEvents;
    const iframeMask = document.getElementById("iframeMask");
    if (!iframeMask) {
      return;
    }
    if (
      clientX > iframeMask.getBoundingClientRect().left &&
      iframeMask.getBoundingClientRect().right > clientX &&
      clientY > iframeMask.getBoundingClientRect().top &&
      iframeMask.getBoundingClientRect().bottom > clientY
    ) {
      console.log("pointer in frame");
      console.log(
        clientX - iframeMask.getBoundingClientRect().x,
        clientY - iframeMask.getBoundingClientRect().y
      );
      if (type === "pointerdown") {
        console.log("pointer down read");
        setPointerMouseDown(true);
        setPointerMousePos({
          x: clientX - iframeMask.getBoundingClientRect().x,
          y: clientY - iframeMask.getBoundingClientRect().y,
        });
      } else if (type === "pointermove") {
        console.log("pointer move read");
        setPointerMouseDown(true);
        setPointerMousePos({
          x: clientX - iframeMask.getBoundingClientRect().x,
          y: clientY - iframeMask.getBoundingClientRect().y,
        });
      } else {
        console.log("pointer up read");
        setPointerMouseDown(false);
      }

      // scaffolding.vm.postIOData('mouse', {isDown: true, x: clientX-iframeMask.getBoundingClientRect().x, y: clientY-iframeMask.getBoundingClientRect().y})
    } else {
      // scaffolding.vm.postIOData('mouse', {isDown: false})
      setPointerMouseDown(false);
    }
  }, [pointerEvents]);

  useEffect(() => {
    var iframe = document.getElementById("iframe") as HTMLIFrameElement;
    if (scaffolding === undefined || iframe === null) {
      return;
    }
    console.log("scaffolding found on recive mouse change");
    var customContentWindow = iframe?.contentWindow as CustomWindow;
    if (pointerMouseDown) {
      if (!customContentWindow?.hasStarted) {
        console.log("should start vm");
        customContentWindow.start();
      }
    }
    if (pointerMousePos !== null) {
      scaffolding.vm.postIOData("mouse", {
        isDown: pointerMouseDown,
        x: pointerMousePos.x,
        y: pointerMousePos.y,
        canvasWidth: iframe.clientWidth,
        canvasHeight: iframe.clientHeight,
      });
      console.log(
        "mouse down sent to scaffolding, position: ",
        pointerMousePos.x,
        pointerMousePos.y
      );
    } else {
      console.log("mouse position missing");
    }
  }, [pointerMousePos, scaffolding, pointerMouseDown]);

  const handlePointerMoveCapture = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (pointerEvents?.pointerId === e.pointerId) {
        setPointerEvents(e);
      }
    },
    [pointerEvents]
  );

  const handlePointerDownCapture = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const { target } = e;
      if (pointerEvents === null) {
        if (target instanceof Element) {
          if (target.closest(".iframeMask")) {
            setPointerEvents(e);
          }
        }
      }
      if (target instanceof Element) {
        if (target.closest(".draggable-dummy")) {
          console.log(target.closest(".draggable-dummy"));
          setValidDropCancelTransition(false);
          // dragging dummy component -> add componentRepresentation of dummy component to the useState (hardcoded as default button for now) TODO: pass setDraggingComponent into dummy components so they can define the componentRepresentation themselves
          if(target.closest(".draggable-dummy")?.classList.contains("joystick")){
            setDraggingComponent({
              type: "joystick",
              styling: [],
              mapping: ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"],
              container: "left",
              x: 0,
              y: 0,
              w: 2,
              h: 2,
              color: "#006aff",
              capturedTouchPositions: [{x: 0, y: 0}]
            });
          }else{
            setDraggingComponent({
              type: "button",
              styling: [],
              mapping: ["ArrowUp"],
              container: "left",
              x: 0,
              y: 0,
              w: 1,
              h: 1,
              color: "#006aff",
              capturedTouchPositions: [{x: 0, y: 0}]
            });
          }
        }
      }
    },
    [pointerEvents]
  );

  const appendComponent = useCallback(
    (container: "center" | "left" | "right", x: number, y: number) => {
      if (draggingComponent === null) {
        return;
      }
      console.log({ ...draggingComponent, container, x, y });
      const tempComponent = { ...draggingComponent, container, x, y };
      var tempComponentRepresentations: ComponentRepresentation[];
      if (container === "center") {
        tempComponentRepresentations = centerComponentRepresentations;
      } else if (container === "left") {
        tempComponentRepresentations = leftComponentRepresentations;
      } else {
        tempComponentRepresentations = rightComponentRepresentations;
      }
      //check for collisions
      let valid = checkValidAppend({
        x,
        y,
        component: tempComponent,
        componentRepresentations: tempComponentRepresentations,
      });
      //add tempComponent to corresponding controller
      if (valid) {
        setValidDropCancelTransition(true);
        document
          .getElementsByClassName("draggable-dummy")[0]
          .classList.add("append-successful");
        console.log(
          document.getElementsByClassName("draggable-dummy")[0].classList
        );
        tempComponentRepresentations.push(tempComponent);
        if (container === "center") {
          setCenterComponentRepresentations(tempComponentRepresentations);
        } else if (container === "left") {
          setLeftComponentRepresentations(tempComponentRepresentations);
        } else {
          setRightComponentRepresentations(tempComponentRepresentations);
        }
      } else {
        console.log("invalid append!");
      }

      setDraggingComponent(null);
    },
    [
      draggingComponent,
      centerComponentRepresentations,
      leftComponentRepresentations,
      rightComponentRepresentations,
    ]
  );

  const handlePointerUpCapture = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (pointerEvents?.pointerId === e.pointerId) {
        setPointerEvents(null);
      }
      if (draggingComponent !== null) {
        // const { clientX, clientY } = e;
        let clientX = e.clientX;
        let clientY = e.clientY;
        //use top left corner of the dragging component as the reference point instead of clientX and clientY
        const draggingComponentElement = document.querySelector(".react-draggable-dragging");
        if (draggingComponentElement) {
          const { left: draggingLeft, top: draggingTop } = draggingComponentElement.getBoundingClientRect();
          clientX = draggingLeft;
          clientY = draggingTop;
        }
        //check if the pointer up is inside a controller box
        if (screenOritentation === "portrait") {
          const centerControllerContainer = document.getElementsByClassName(
            "controller-container center"
          )[0];
          const { left, top, right, bottom } =
            centerControllerContainer.getBoundingClientRect();
            const componentWidth = draggingComponentElement?.clientWidth || 0;
            const componentHeight = draggingComponentElement?.clientHeight || 0;
            if (
            clientX + componentWidth / 2 >= left &&
            clientX + componentWidth / 2 <= right &&
            clientY + componentHeight / 2 >= top &&
            clientY + componentHeight / 2 <= bottom
            ) {
            console.log(`Pointer is inside center controller`);
            //determine localX and localY of where the drop occured
            let actualX = Math.max(left, Math.min(clientX, right));
            let actualY = Math.max(top, Math.min(clientY, bottom));
            let closest: {x: number, y:number} = findClosestEmptySpot({
              actualX: actualX - left,
              actualY: actualY - top,
              unitWidth: unitWidth[screenOritentation],
              index: -1,
              containerWidth: 6,
              containerHeight: 3,
              componentRepresentation: draggingComponent,
              componentRepresentations: centerComponentRepresentations
            })

            appendComponent("center", closest.x, closest.y);
          }
        } else if (screenOritentation === "landscape") {
          //landscape part
          const leftControllerContainer = document.getElementsByClassName(
            "controller-container left"
          )[0];
          const { left, top, right, bottom } = leftControllerContainer.getBoundingClientRect();
          const componentWidth = draggingComponentElement?.clientWidth || 0;
          const componentHeight = draggingComponentElement?.clientHeight || 0;
          if (
            clientX + componentWidth / 2 >= left &&
            clientX + componentWidth / 2 <= right &&
            clientY + componentHeight / 2 >= top &&
            clientY + componentHeight / 2 <= bottom
          ) {
            console.log(`Pointer is inside left controller`);
            //determine localX and localY of where the drop occured
            let actualX = Math.max(left, Math.min(clientX, right));
            let actualY = Math.max(top, Math.min(clientY, bottom));
            let closest: {x: number, y:number} = findClosestEmptySpot({
              actualX: actualX - left,
              actualY: actualY - top,
              unitWidth: unitWidth[screenOritentation],
              index: -1,
              containerWidth: 3,
              containerHeight: 6,
              componentRepresentation: draggingComponent,
              componentRepresentations: leftComponentRepresentations
            })

            appendComponent("left", closest.x, closest.y);
          }
          const rightControllerContainer = document.getElementsByClassName(
            "controller-container right"
          )[0];
          const r =
            rightControllerContainer.getBoundingClientRect();
          if (
            clientX + componentWidth / 2 >= r.left &&
            clientX + componentWidth / 2 <= r.right &&
            clientY + componentHeight / 2 >= r.top &&
            clientY + componentHeight / 2 <= r.bottom
          ) {
            console.log(`Pointer is inside right controller`);
            let actualX = Math.max(r.left, Math.min(clientX, r.right));
            let actualY = Math.max(r.top, Math.min(clientY, r.bottom));
            let closest: {x: number, y:number} = findClosestEmptySpot({
              actualX: actualX - r.left,
              actualY: actualY - r.top,
              unitWidth: unitWidth[screenOritentation],
              index: -1,
              containerWidth: 3,
              containerHeight: 6,
              componentRepresentation: draggingComponent,
              componentRepresentations: rightComponentRepresentations
            })

            appendComponent("right", closest.x, closest.y);
          }
        }
      }
    },
    [draggingComponent, pointerEvents, screenOritentation, unitWidth]
  );

  return (
    <div
      id="App"
      className={classNames("App noscroll prevent-select", screenOritentation, {
        safetyMargin: controllerAdvancedConfig.includes("safetyMargin"),
        handheldModeBg: controllerAdvancedConfig.includes("handheldMode"),
      })}
      style={appStyles}
      onPointerDownCapture={handlePointerDownCapture}
      onPointerMoveCapture={handlePointerMoveCapture}
      onPointerUpCapture={handlePointerUpCapture}
    >
      {controllerAdvancedConfig.includes("handheldMode") ? (
        fullscreen ? (
          <>
            {menuBarShown ? (
              <MdFullscreenExit
                id="FullscreenBtn"
                className="IconBtn FullscreenBtn"
                onClick={toggleFullscreen}
              />
            ) : (
              ""
            )}

            {menuBarShown ? (
              <FaCaretUp
                className={classNames("IconBtn", "MenuBarToggleBtn", {
                  menuBarShown,
                })}
                onClick={toggleMenuBar}
              />
            ) : (
              <FaCaretDown
                className={classNames("IconBtn", "MenuBarToggleBtn", {
                  menuBarShown,
                })}
                onClick={toggleMenuBar}
              />
            )}
          </>
        ) : (
          <MdFullscreen
            id="FullscreenBtn"
            className="IconBtn FullscreenBtn"
            onClick={toggleFullscreen}
          />
        )
      ) : (
        ""
      )}
      <CenterContainer
        controllerAdvancedConfig={controllerAdvancedConfig}
        setControllerAdvancedConfig={setControllerAdvancedConfig}
        validDropCancelTransition={validDropCancelTransition}
        unitWidth={unitWidth[screenOritentation]}
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
        menuBarShown={menuBarShown}
      />

      <ControllerContainer
        screenOrientation={screenOritentation}
        position={"left"}
        unitWidth={unitWidth.landscape}
        defaultComponentRepresentations={leftComponentRepresentations}
        editing={editing}
        updateComponentRepresentations={setLeftComponentRepresentations}
        handheldMode={controllerAdvancedConfig.includes("handheldMode")}
      />
      <ControllerContainer
        screenOrientation={screenOritentation}
        position={"center"}
        unitWidth={unitWidth.portrait}
        defaultComponentRepresentations={centerComponentRepresentations}
        editing={editing}
        updateComponentRepresentations={setCenterComponentRepresentations}
        handheldMode={controllerAdvancedConfig.includes("handheldMode")}
      />
      <ControllerContainer
        screenOrientation={screenOritentation}
        position={"right"}
        unitWidth={unitWidth.landscape}
        defaultComponentRepresentations={rightComponentRepresentations}
        editing={editing}
        updateComponentRepresentations={setRightComponentRepresentations}
        handheldMode={controllerAdvancedConfig.includes("handheldMode")}
      />
    </div>
  );
}

export default App;
