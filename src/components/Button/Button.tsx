import React, { useEffect, useState, useRef } from 'react'
import './Button.css'

interface Props{
    touchEvents: React.TouchEvent<HTMLDivElement> | null;
    mapping: string; //key mapping
    container: string; //left, right, or center
    x: number; //local xpos in container
    y: number; //local ypos in container
}

export const Button: React.FC<Props> = ({
  touchEvents,
  mapping,
  container = "center",
  x = 0,
  y = 0,
  ...props
}:Props) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [pressed, setPressed] = useState(false)

  useEffect(()=>{
    //detect if any location of event.touches is overlapping in the button
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
  return (
    <button className={pressed? 'button pressed':'button'} ref={buttonRef}
    />
  )
}

