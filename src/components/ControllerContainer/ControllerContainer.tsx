import React, { useEffect, useRef, useState } from 'react';
import './ControllerContainer.css';
import '../../App.css'
import {Button} from '../Button/Button';

export interface component{
  type: string, //button, joystick, scroller, wheel
  styling: string[],
  mapping: string,
  container: string,
  x: number,
  y: number,
  w: number,
  h: number
}

interface Props{
  position: string,
  unitWidth: number,
  defaultConfig: component[],
  editing: boolean
}

export const ControllerContainer: React.FC<Props> = ({position, unitWidth, defaultConfig, editing}:Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [touchEvents, setTouchEvents] = useState<React.TouchEvent<HTMLDivElement> | null>(null)
  const [editingControllers, setEditingControllers] = useState(false)
  const [currentConfig, setCurrentConfig] = useState(defaultConfig)
  const [pointerEvents, setPointerEvents] = useState<React.PointerEvent<HTMLDivElement> | null>(null)
  // const containerWidth = containerRef.current?.offsetWidth;
  // if(position == "center"){
  //   if(containerWidth){
  //     unitWidth = containerWidth/6;
  //   }
  // }else if(position == "left" || position == "right"){
  //   if(containerWidth){
  //     unitWidth = containerWidth/3;
  //   }
  // }


  useEffect(()=>{
    setEditingControllers(editing)
  },[editing])

  useEffect(()=>{
    document.documentElement.style.setProperty('--button-width', unitWidth+"px");
  },[unitWidth])

  useEffect(()=>{
    console.log("Config updated")
    // console.trace('Initial function called');
    // console.log(currentConfig)
  }, [currentConfig])

  function updateCurrentConfig(index: number, component: component){
    const newConfig = currentConfig.map((c, i)=>{
      if(i === index){
        return component
      }else{
        return c
      }
    })
    setCurrentConfig(newConfig)
    //console.log(getCurrentConfig())
  }

  function checkValidDropPos(x: number, y: number, index: number){
    const droppedComponent = currentConfig[index];

  // Calculate the left, right, top, and bottom coordinates of the dropped component
  console.log(currentConfig[index]);
  const left = x - droppedComponent.w / 2;
  const right = x + droppedComponent.w / 2;
  const top = y - droppedComponent.h / 2;
  const bottom = y + droppedComponent.h / 2;

  // Check if the dropped component overlaps with any other components
  for (let i = 0; i < currentConfig.length; i++) {
    if (i !== index) {
      const currentComponent = currentConfig[i];

      // Calculate the left, right, top, and bottom coordinates of the current component
      const currentLeft = currentComponent.x - currentComponent.w / 2;
      const currentRight = currentComponent.x + currentComponent.w / 2;
      const currentTop = currentComponent.y - currentComponent.h / 2;
      const currentBottom = currentComponent.y + currentComponent.h / 2;

      // Check for overlap
      if (
        left < currentRight &&
        right > currentLeft &&
        top < currentBottom &&
        bottom > currentTop
      ) {
        // Overlap detected, return false
        return false;
      }
    }
  }

  // No overlap detected, return true
  return true;
}
  
function findClosestEmptySpot(x: number, y: number, index: number, containerWidth: number, containerHeight: number): { x: number, y: number } {
  const droppedComponent = currentConfig[index];

  // Calculate the left, right, top, and bottom coordinates of the dropped component
  const left = x - droppedComponent.w / 2;
  const right = x + droppedComponent.w / 2;
  const top = y - droppedComponent.h / 2;
  const bottom = y + droppedComponent.h / 2;

  let minDistance = Number.MAX_VALUE;
  let closestX = x;
  let closestY = y;

  // Iterate through all the possible empty spots within the container
  for (let xPos = 0; xPos <= containerWidth; xPos++) {
    for (let yPos = 0; yPos <= containerHeight; yPos++) {
      let isVacant = true;

      // Check if the current spot overlaps with any of the existing components
      for (let i = 0; i < currentConfig.length; i++) {
        if (i !== index) {
          const currentComponent = currentConfig[i];

          // Calculate the left, right, top, and bottom coordinates of the current component
          const currentLeft = currentComponent.x - currentComponent.w / 2;
          const currentRight = currentComponent.x + currentComponent.w / 2;
          const currentTop = currentComponent.y - currentComponent.h / 2;
          const currentBottom = currentComponent.y + currentComponent.h / 2;

          // Check for overlap
          if (
            xPos > currentLeft &&
            xPos < currentRight &&
            yPos > currentTop &&
            yPos < currentBottom
          ) {
            isVacant = false;
            break;
          }
        }
      }

      // If the spot is vacant, calculate the distance between the centers of the dropped component and the current spot
      if (isVacant) {
        const distance = Math.sqrt(
          Math.pow(x - xPos, 2) + Math.pow(y - yPos, 2)
        );

        // Update the closest vacant spot if the current spot is closer
        if (distance < minDistance) {
          minDistance = distance;
          closestX = xPos;
          closestY = yPos;
        }
      }
    }
  }

  // Return the closest vacant spot
  return { x: closestX, y: closestY };
}

  function getCurrentConfigJSON(){
    return JSON.stringify(currentConfig)
  }

  return (
    <div className={"controller-container "+ position + (editing? ' editing':'')} ref={containerRef}
    onTouchStart={(e) => setTouchEvents(e)}
    onTouchMove={(e)=> setTouchEvents(e)}
    onTouchEnd={(e)=> setTouchEvents(e)}
    onPointerDown={(e) => setPointerEvents(e)}
    onPointerUp={(e) => setPointerEvents(e)}
    onPointerMove={(e) => setPointerEvents(e)}
    >  
      {currentConfig.map((component, index)=>(
        (component.type == 'button')?
        <Button 
          key={index} 
          index={index}
          touchEvents={touchEvents} 
          pointerEvents={pointerEvents}
          component={component}
          unitWidth={unitWidth}
          editing={editingControllers}
          updateCurrentConfig={updateCurrentConfig}
          checkValidDropPos={checkValidDropPos}
          findClosestEmptySpot={findClosestEmptySpot}
        />
        :''
      ))}
      {/* <Button touchEvents={touchEvents} mapping='ArrowUp' container='center' x={0} y={0} unitWidth={unitWidth}/> */}
    </div>
  );
}
