import React, { useEffect, useRef, useState } from 'react';
import './ControllerContainer.css';
import {Button} from '../Button/Button';

interface component{
  type: string, //button, joystick, scroller, wheel
  mapping: string,
  container: string,
  x: number,
  y: number
}

interface Props{
  position: string,
  unitWidth: number,
  controlConfig: component[]
}

export const ControllerContainer: React.FC<Props> = ({position, unitWidth, controlConfig}:Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [touchEvents, setTouchEvents] = useState<React.TouchEvent<HTMLDivElement> | null>(null)

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
    document.documentElement.style.setProperty('--button-width', unitWidth+"px");
  },[unitWidth])

  return (
    <div className={"controller-container "+ position} ref={containerRef}
    onTouchStart={(e) => setTouchEvents(e)}
    onTouchMove={(e)=> setTouchEvents(e)}
    onTouchEnd={(e)=> setTouchEvents(e)}>  
      {controlConfig.map((component, index)=>(
        (component.type == 'button')?
        <Button key={index} touchEvents={touchEvents} mapping={component.mapping} container={component.container} x={component.x} y={component.y} unitWidth={unitWidth}/>
        :''
      ))}
      {/* <Button touchEvents={touchEvents} mapping='ArrowUp' container='center' x={0} y={0} unitWidth={unitWidth}/> */}
    </div>
  );
}
