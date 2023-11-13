import React, { useEffect, useState, useRef, useCallback } from 'react'
import './Button.css'
import Draggable, { DraggableEventHandler } from 'react-draggable';
import { ComponentRepresentation } from '../ControllerContainer/ControllerContainer';
import Dropdown, { DropdownOption } from './Dropdown';
import {TbArrowsMove} from 'react-icons/tb'
import classNames from 'classnames';
import { ParsedDropdownValue } from './ParsedDropdownValue';
import { checkValidDropPos, findClosestEmptySpot } from '../../utils/position';
import { UserInteraction } from '../../utils/interaction';

interface Props{
    index: number;
    touchEvents: React.TouchEvent<HTMLDivElement> | null;
    pointerEvents: React.PointerEvent<HTMLDivElement> | null;
    component: ComponentRepresentation;
    unitWidth: number;
    editing: boolean;
    updateCurrentConfig(index: number, component: ComponentRepresentation): void;
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
  updateCurrentConfig,
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

  const handleStop: DraggableEventHandler = useCallback((_, data) =>{
    const actualX = data.x
    const actualY = data.y
    const x = Math.round(data.x/unitWidth)
    const y = Math.round(data.y/unitWidth)
    // check if the x and y are valid positions
    if (checkValidDropPos({ x, y, index })) {
      updateCurrentConfig(index, {
        ...component,
        x,
        y
      })
    } else {
      let closestEmptySpot = findClosestEmptySpot({ actualX, actualY, unitWidth, index, containerWidth: 6, containerHeight: 3 })
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
      <button className={
        classNames(
          'button',
          component.styling.join(' '),
          {
            pressed,
            editing
          }
        )
      } ref={buttonRef}>
        {/* <div className={'button-text'}><span><FaPause /></span></div> */}
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
            'handle',
            {
              editing
            }
          )
        }>
          <TbArrowsMove className='move'/>
        </div>
      </button>
    </Draggable>
  )
}

