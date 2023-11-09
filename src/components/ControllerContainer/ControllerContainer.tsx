import React, { useEffect, useRef, useState } from 'react';
import './ControllerContainer.css';
import {Button} from '../Button/Button';

export interface component{
  type: string, //button, joystick, scroller, wheel
  mapping: string,
  container: string,
  x: number,
  y: number
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
    console.trace('Initial function called');
    console.log(currentConfig)
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
        />
        :''
      ))}
      {/* <Button touchEvents={touchEvents} mapping='ArrowUp' container='center' x={0} y={0} unitWidth={unitWidth}/> */}
    </div>
  );
}
