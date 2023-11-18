import React, { useEffect, useState, useRef, useCallback } from 'react'
import './Button.css'
import Draggable, { DraggableEventHandler } from 'react-draggable';
import { ComponentRepresentation } from '../ControllerContainer/ControllerContainer';
import Dropdown, { DropdownOption } from './Dropdown';
import {TbArrowsMove} from 'react-icons/tb'
import classNames from 'classnames';
import { ParsedDropdownValue } from './ParsedDropdownValue';
import { checkValidDropPos, findClosestEmptySpot, checkOutOfBounds, getControllerContainerDimensions} from '../../utils/position';
import { UserInteraction } from '../../utils/interaction';
import { IoClose } from "react-icons/io5";




interface Props{
    index: number;
    touchEvents: React.TouchEvent<HTMLDivElement> | null;
    pointerEvents: React.PointerEvent<HTMLDivElement> | null;
    component: ComponentRepresentation;
    unitWidth: number;
    editing: boolean;
    noTransition: boolean;
    selected: boolean;
    selectorDeltaPosition: {deltaX: number, deltaY: number};
    updateCurrentConfig(index: number, component: ComponentRepresentation): void;
    deleteComponentRepresentation(index: number): void;
    checkValidDropPos(
      params: Omit<Parameters<typeof checkValidDropPos>[0], 'componentRepresentations'>
    ): ReturnType<typeof checkValidDropPos>
    findClosestEmptySpot(
      params: Omit<Parameters<typeof findClosestEmptySpot>[0], 'componentRepresentations'>
    ): ReturnType<typeof findClosestEmptySpot>
}

export const Button: React.FC<Props> = ({
  index,
  touchEvents,
  pointerEvents,
  component,
  unitWidth = 100,
  editing = false,
  noTransition = false,
  selected = false,
  selectorDeltaPosition = {deltaX: 0, deltaY: 0},
  updateCurrentConfig,
  deleteComponentRepresentation,
  checkValidDropPos,
  findClosestEmptySpot,
}: Props) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [pressed, setPressed] = useState(false)

  useEffect(()=>{
    // never happens, just for ts type checking
    if (!buttonRef.current) return
    if (editing) {
      setPressed(false)
      return
    }
    if (touchEvents) {
      const pressed = 
        UserInteraction.identifyPressFromTouchEvents(touchEvents, buttonRef.current?.getBoundingClientRect())
      setPressed(pressed)
    } else if (pointerEvents) {
      const pressed = 
        UserInteraction.identifyPressFromPointerEvents(pointerEvents, buttonRef.current?.getBoundingClientRect())
      setPressed(pressed)
    }
  },[touchEvents, pointerEvents, editing])

  // useEffect(()=>{
  //   if(component.mapping == 'Delete'){
  //     deleteComponentRepresentation(index)
  //   }
  // }, [component.mapping])

  const handleStop: DraggableEventHandler = useCallback((_, data) =>{
    const actualX = data.x
    const actualY = data.y
    const x = Math.round(data.x/unitWidth)
    const y = Math.round(data.y/unitWidth)
    // check if the x and y are valid positions
    const containerDimensions = getControllerContainerDimensions(component.container)
    const containerWidth = containerDimensions.w
    const containerHeight = containerDimensions.h
    if (checkValidDropPos({ x, y, index })) {
      console.log(checkOutOfBounds({x, y, containerWidth, containerHeight}))
      switch(checkOutOfBounds({x, y, containerWidth, containerHeight})){
        case 'inBounds':
          updateCurrentConfig(index, {
            ...component,
            x,
            y
          })
          return
        case 'topOutOfBounds':
          console.log('delete this component if in portrait')
          if(component.container == 'center'){
            // console.log('delete this!')
            deleteComponentRepresentation(index);
          }
          return
        case 'leftOutOfBounds':
          console.log('delete this component if in landscape and is in right container')
          return
          case 'rightOutOfBounds':
            console.log('delete this component if in landscape and is in left container')
            return
        case 'invalidOutOfBounds':
          console.log('do nothing. let button return to original position')
          return 
      }

    } else {
      let closestEmptySpot = findClosestEmptySpot({ actualX, actualY, unitWidth, index, containerWidth, containerHeight})
      updateCurrentConfig(index, {
        ...component,
        x: closestEmptySpot.x,
        y: closestEmptySpot.y
      })
    }
  }, [checkValidDropPos, component, findClosestEmptySpot, index, unitWidth, updateCurrentConfig])

  const updateMapping = useCallback((mapping: DropdownOption['value']) => {
    // TODO: why do we need this line?
    // if (mapping === ''){
    //   return
    // }
    updateCurrentConfig(index, {
      ...component,
      mapping
    })
  }, [component, index, updateCurrentConfig])

  const componentPosition = useCallback((): {x: number, y:number} =>{
    if(selected){
      // noTransition = true;
      if(selectorDeltaPosition.deltaX !==0 || selectorDeltaPosition.deltaY !==0){
        buttonRef.current?.classList.add("selected");
        buttonRef.current?.classList.add("noTransition");
      }else{
        buttonRef.current?.classList.remove("noTransition");
      }
      return {
        x: unitWidth*component.x + selectorDeltaPosition.deltaX, 
        y: unitWidth*component.y + selectorDeltaPosition.deltaY
      }
    }
    buttonRef.current?.classList.remove("selected");
    return{
      x: unitWidth*component.x,
      y: unitWidth*component.y
    }
  }, [component, selected, selectorDeltaPosition, unitWidth, buttonRef]) 
  
  return (
    <Draggable
      handle=".handle"
      // grid={[unitWidth, unitWidth]}
      defaultPosition={{x: unitWidth*component.x, y: unitWidth*component.y}}
      bounds={"parent"}
      scale={1}
      position={componentPosition()}
      allowAnyClick={true}
      disabled={!editing}
      onStop={handleStop}
    >
      <button className={
        classNames(
          'button',
          component.styling.join(' '),
          {
            pressed,
            editing,
            noTransition
          }
        )
      } ref={buttonRef}>
        <div className={'button-text'}>
          <ParsedDropdownValue 
            value={component.mapping}
          />
        </div>
        <Dropdown 
          editing={editing} 
          updateMapping={updateMapping} 
          value={component.mapping}
        />
        <div className={
          classNames(
            'button-bottom',
            {
              editing
            }
          )
        }>
          <IoClose className='delete' onClick={() => deleteComponentRepresentation(index)}/>
          <TbArrowsMove className='handle'/>
        </div>
      </button>
    </Draggable>
  )
}

