import React, { useEffect, useState, useRef } from 'react'
import './Button.css'
import Draggable, { DraggableData, DraggableEvent, DraggableEventHandler } from 'react-draggable';

interface Props{
    touchEvents: React.TouchEvent<HTMLDivElement> | null;
    mapping: string; //key mapping
    container: string; //left, right, or center
    x: number; //local xpos in container
    y: number; //local ypos in container
    unitWidth: number;
    editing: boolean;
}

export const Button: React.FC<Props> = ({
  touchEvents,
  mapping,
  container = "center",
  x = 0,
  y = 0,
  unitWidth = 100,
  editing = false,
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
    x = data.x/unitWidth;
    y = data.y/unitWidth;
    buttonRef.current?.style.setProperty('--x', x.toString())
    buttonRef.current?.style.setProperty('--y', y.toString())
    console.log(x + " " + y)
  }

  return (
    <Draggable
      handle=".handle"
      grid={[unitWidth, unitWidth]}
      defaultPosition={{x: unitWidth*x, y: unitWidth*y}}
      bounds={"parent"}
      scale={1}
      allowAnyClick={true}
      disabled={!editing}
      onStop={handleStop}
    >
      <button className={(pressed? 'button pressed':'button') + " handle " + (editing? 'editing':'')} ref={buttonRef}/>
    </Draggable>
  )
}

