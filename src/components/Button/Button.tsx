import React, { useEffect, useState, useRef, MouseEventHandler } from 'react'
import './Button.css'
import Draggable, { DraggableData, DraggableEvent, DraggableEventHandler } from 'react-draggable';
import { component } from '../ControllerContainer/ControllerContainer';

interface Props{
    index: number;
    touchEvents: React.TouchEvent<HTMLDivElement> | null;
    component: component;
    unitWidth: number;
    editing: boolean;
    updateCurrentConfig: Function;
}

export const Button: React.FC<Props> = ({
  index,
  touchEvents,
  component,
  unitWidth = 100,
  editing = false,
  updateCurrentConfig,
  ...props
}:Props) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const dragRef = useRef<HTMLButtonElement | null>(null);
  const [pressed, setPressed] = useState(false)

  // useEffect(()=>{
  //   document.documentElement.style.setProperty('--button-width', unitWidth+"px");
  // },[unitWidth])

  useEffect(()=>{
    //detect if any location of event.touches is overlapping in the button
    if(editing){
      setPressed(false)
      return
    }
    if(touchEvents){
      //console.log(touchEvents.touches)
      if(touchEvents.touches.length === 0){
        setPressed(false)
      }else{
        const touches = Array.from(touchEvents.touches); // Convert TouchList to an array
        var flag = false
        touches.forEach((touch) => {
          const touchIdentifier = touch.identifier;
          const touchX = touch.clientX;
          const touchY = touch.clientY;
          
          // Rest of your logic with each touch
          const buttonRect = buttonRef.current?.getBoundingClientRect();
          //console.log(touchX, touchY, buttonRect)
          if (
            buttonRect &&
            touchX >= buttonRect.left &&
            touchX <= buttonRect.right &&
            touchY >= buttonRect.top &&
            touchY <= buttonRect.bottom
          ) {
            // Touch is within the bounding client rect of the button
            // Perform your logic here
            setPressed(true)
            flag = true
          }
        })
        if(!flag){
          setPressed(false)
        }
      }

    }else{
      console.log('touch events null')
      setPressed(false)
    }

    if(pressed){
      //request to container for the corresponding key to be fired
    }
  },[touchEvents])

  const handleStop: DraggableEventHandler = (e, data) =>{
    const x = Math.round(data.x/unitWidth)
    const y = Math.round(data.y/unitWidth)
    console.log(x + " " + y)
    const tempConfig = component
    tempConfig.x = x
    tempConfig.y = y
    updateCurrentConfig(index, tempConfig)
  }

  //Mouse event handler not supported on mobile should use pointer or touch events
  const handleClick: MouseEventHandler<HTMLButtonElement> = () => {
    if(editing){
      console.log("Editing!")
    }else{
      return
    }
  }

  return (
    <Draggable
      handle=".handle"
      grid={[unitWidth, unitWidth]}
      defaultPosition={{x: unitWidth*component.x, y: unitWidth*component.y}}
      bounds={"parent"}
      scale={1}
      allowAnyClick={true}
      disabled={!editing}
      onStop={handleStop}
    >
      <button className={(pressed? 'button pressed':'button') + " handle " + (editing? 'editing':'')} ref={buttonRef} onClick={handleClick}/>
    </Draggable>
  )
}

