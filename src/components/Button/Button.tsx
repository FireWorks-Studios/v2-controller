import React, { useEffect, useState, useRef, MouseEventHandler } from 'react'
import './Button.css'
import Draggable, { DraggableData, DraggableEvent, DraggableEventHandler } from 'react-draggable';
import { component } from '../ControllerContainer/ControllerContainer';
import Dropdown from './Dropdown';
import {TbArrowsMove} from 'react-icons/tb'
import {FaFlag, FaPause, FaGear} from 'react-icons/fa6'
import { TbOctagonFilled } from 'react-icons/tb';
import {BiSolidJoystickAlt} from 'react-icons/bi';
import {BsJoystick} from 'react-icons/bs';


interface Props{
    index: number;
    touchEvents: React.TouchEvent<HTMLDivElement> | null;
    pointerEvents: React.PointerEvent<HTMLDivElement> | null;
    component: component;
    unitWidth: number;
    editing: boolean;
    updateCurrentConfig: Function;
    checkValidDropPos: Function;
    findClosestEmptySpot: Function;
}

export const Button: React.FC<Props> = ({
  index,
  touchEvents,
  pointerEvents,
  component,
  unitWidth = 100,
  editing = false,
  updateCurrentConfig,
  checkValidDropPos,
  findClosestEmptySpot,
  ...props
}:Props) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
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
      if(pointerEvents){
        if(pointerEvents.pointerType == "mouse"){
          const mouseX = pointerEvents.clientX;
          const mouseY = pointerEvents.clientY;
          
          // Rest of your logic with each touch
          const buttonRect = buttonRef.current?.getBoundingClientRect();
          //console.log(touchX, touchY, buttonRect)
          if (
            buttonRect &&
            mouseX >= buttonRect.left &&
            mouseX <= buttonRect.right &&
            mouseY >= buttonRect.top &&
            mouseY <= buttonRect.bottom &&
            pointerEvents.pressure != 0
          ) {
            // Touch is within the bounding client rect of the button
            // Perform your logic here
            setPressed(true)
          }else{
            setPressed(false)
          }
        }
      }else{
        setPressed(false)
        return
      }
    }

    if(pressed){
      //request to container for the corresponding key to be fired
    }
  },[touchEvents, pointerEvents])



  const handleStop: DraggableEventHandler = (e, data) =>{
    const x = Math.round(data.x/unitWidth)
    const y = Math.round(data.y/unitWidth)
    // check if the x and y are valid positions
    if(checkValidDropPos(x, y, index)){
      var tempConfig = {...component}
      tempConfig.x = x
      tempConfig.y = y
      updateCurrentConfig(index, tempConfig)
    }else{
      let closestEmptySpot = findClosestEmptySpot(x, y, index, 6, 3)
      var tempConfig = {...component}
      tempConfig.x = closestEmptySpot.x
      tempConfig.y = closestEmptySpot.y
      updateCurrentConfig(index, tempConfig)
    }
  }

  const updateMapping = (mapping: string) => {
    if(mapping === ''){
      return
    }
    var tempConfig = {...component}
    tempConfig.mapping = mapping
    console.log(tempConfig)
    updateCurrentConfig(index, tempConfig)
  }

  const parseMapping = (mapping: string) =>{
    if(mapping == "ArrowUp"){
      return <span className="arrow up">▲</span>
    }
    if(mapping == "ArrowDown"){
      return <span className="arrow down">▲</span>
    }
    if(mapping == "ArrowLeft"){
      return <span className="arrow left">▲</span>
    }
    if(mapping == "ArrowRight"){
      return <span className="arrow right">▲</span>
    }
    if(mapping == "Space"){
      return '_'
    }
    if(mapping == "Green Flag"){
      return <FaFlag/>
    }
    if(mapping == "Pause"){
      return <FaPause/>
    }
    if(mapping == "Stop"){
      return <TbOctagonFilled/>
    }
    if(mapping == "Remap"){
      return <FaGear/>
    }
    return mapping
  }

  return (
    <Draggable
      handle=".handle"
      // grid={[unitWidth, unitWidth]}
      defaultPosition={{x: unitWidth*component.x, y: unitWidth*component.y}}
      bounds={"parent"}
      scale={1}
      position={{x: unitWidth*component.x, y: unitWidth*component.y}}
      allowAnyClick={true}
      disabled={!editing}
      onStop={handleStop}
    >
      <button className={"button " + component.styling.join(' ') + " " + (pressed? 'pressed':'') + " " + (editing? 'editing':'')} ref={buttonRef}>
        {/* <div className={'button-text'}><span><FaPause /></span></div> */}
        <div className={'button-text'}>{parseMapping(component.mapping)}</div>
        <Dropdown editing={editing} updateMapping={updateMapping} value={component.mapping}/>
        <div className={'handle ' + (editing? 'editing':'')}>
          <TbArrowsMove className='move'/>
        </div>
      </button>
    </Draggable>
  )
}

