import React, { useCallback, useEffect, useRef, useState } from 'react';
import './ControllerContainer.css';
import '../../App.css'
import {Button} from '../Button/Button';
import { checkValidDropPos, findClosestEmptySpot } from '../../utils/position';
import classNames from 'classnames';
import { DropdownOption } from '../Button/Dropdown';
import { Selector } from './Selector';
import { SelectionInteraction } from '../../utils/selector';

export interface ComponentRepresentation {
  type: 'button' | 'joystick' | 'scroller' | 'wheel',
  styling: string[],
  mapping: DropdownOption['value'],
  container: 'center' | 'left' | 'right',
  x: number,
  y: number,
  w: number,
  h: number
}

interface Props{
  position: 'center' | 'left' | 'right',
  unitWidth: number,
  defaultComponentRepresentations: ComponentRepresentation[],
  editing: boolean
}

export const ControllerContainer: React.FC<Props> = ({position, unitWidth, defaultComponentRepresentations, editing}:Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [touchEvents, setTouchEvents] = useState<React.TouchEvent<HTMLDivElement> | null>(null)
  const [componentRepresentations, setComponentRepresentations] = useState(defaultComponentRepresentations)
  const [pointerEvents, setPointerEvents] = useState<React.PointerEvent<HTMLDivElement> | null>(null)
  const [noTransition, setNoTransition] = useState(false);

  const [isSelectorDragging, setIsSelectorDragging] = useState(false);
  const [isSelectorSelecting, setIsSelectorSelecting] = useState(false);
  const [selectorStartPosition, setSelectorStartPosition] = useState({ x: 0, y: 0 });
  const [selectorSize, setSelectorSize] = useState({ w: 1, h: 1 });
  const [selectorPosition, setSelectorPosition] = useState({ x: 0, y: 0 });
  const [selectorSelectedComponents, setSelectorSelectedComponents] = useState<ComponentRepresentation[]>([])

  useEffect(()=>{
    document.documentElement.style.setProperty('--button-width', unitWidth+"px");
  },[unitWidth])

  const updateCurrentConfig = useCallback((index: number, component: ComponentRepresentation) => {
    const newConfig = componentRepresentations.map((c, i)=>{
      if(i === index){
        return component
      }else{
        return c
      }
    })
    setComponentRepresentations(() => newConfig)
  }, [componentRepresentations])

  const deleteComponentRepresentation = useCallback((index: number) => {
    setNoTransition(true);
    setComponentRepresentations(prevComponentRepresentations => {
      const updatedComponentRepresentations = [...prevComponentRepresentations];
      updatedComponentRepresentations.splice(index, 1);
      return updatedComponentRepresentations;
    });
    setTimeout(() => {
      setNoTransition(false);
    }, 100); // Adjust the delay as needed
  }, [componentRepresentations]);

  const deleteSelectedComponents = useCallback((componentsToDelete: ComponentRepresentation[]) =>{
    setNoTransition(true);
    setComponentRepresentations(prevComponents =>
      prevComponents.filter(component =>
        !componentsToDelete.some(item => item === component)
      )
    );
    setTimeout(() => {
      setNoTransition(false);
    }, 100); // Adjust the delay as needed
  }, [])

  const handleTouch = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    setTouchEvents(e);
  }, [])
  

  useEffect(() =>{
    if(!editing){
      setIsSelectorSelecting(false)
    }
  }, [editing])

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    setPointerEvents(e);
    const isEventCapturedByChild = e.currentTarget !== e.target;
    console.log(e.currentTarget, e.target)
    //check if the child target is button or drag handler
    if(!editing){
      setIsSelectorSelecting(false)
      return
    }

    if (isEventCapturedByChild) {
      // Child element captured the event
      console.log('Event captured by child element');
      setIsSelectorSelecting(false)
    } else {
      // Event not captured by any child element
      console.log('Event not captured by any child element');
      setIsSelectorSelecting(true)
      const startParam = SelectionInteraction.startSelect(e, containerRef);
      if(!startParam){
        console.log('error in start param')
        return
      }
      setSelectorSize({w: 1, h: 1})
      setIsSelectorDragging(true);
      setSelectorStartPosition({ x: startParam.x, y: startParam.y });
      setSelectorPosition({ x: startParam.x, y: startParam.y });
    }

    
  }, [editing])

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    setPointerEvents(e);
    if (!isSelectorDragging) {
      return;
    }
    if(!containerRef.current){
      return
    }
    let dragSelect = SelectionInteraction.dragSelect(e, containerRef, selectorStartPosition)
    if(!dragSelect){
      return
    }
    setSelectorPosition({x: dragSelect.x, y: dragSelect.y})
    setSelectorSize({w: dragSelect.w, h: dragSelect.h})
    //checkSelect
  }, [selectorStartPosition, selectorPosition, isSelectorDragging])

  const handlePointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    setPointerEvents(e);
    setIsSelectorDragging(false);
  }, [])

  const handleCheckValidDropPos = useCallback((
    params: Omit<Parameters<typeof checkValidDropPos>[0], 'componentRepresentations'>
  ) => {
    return checkValidDropPos(
      {
        ...params,
        componentRepresentations
      }
    );
  }, [componentRepresentations])
  const handleFindClosestEmptySpot = useCallback((
    params: Omit<Parameters<typeof findClosestEmptySpot>[0], 'componentRepresentations'>
  ) => {
    return findClosestEmptySpot(
      {
        ...params,
        componentRepresentations
      }
    );
  }, [componentRepresentations])

  return (
    <div 
      className={
        classNames(
          "controller-container",
          {
            [position]: true,
            editing,
          }
        )
      } 
      ref={containerRef}
      onTouchStart={handleTouch}
      onTouchMove={handleTouch}
      onTouchEnd={handleTouch}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
    >  
      {componentRepresentations.map((component, index)=>(
        (component.type === 'button') ?
        <Button 
          key={index} 
          index={index}
          touchEvents={touchEvents} 
          pointerEvents={pointerEvents}
          component={component}
          unitWidth={unitWidth}
          editing={editing}
          noTransition={noTransition}
          updateCurrentConfig={updateCurrentConfig}
          deleteComponentRepresentation={deleteComponentRepresentation}
          checkValidDropPos={handleCheckValidDropPos}
          findClosestEmptySpot={handleFindClosestEmptySpot}
        />
        : null
      ))}
      <Selector 
      selecting={isSelectorSelecting}
      x={Math.floor(selectorPosition.x/unitWidth)}
      y={Math.floor(selectorPosition.y/unitWidth)}
      w={Math.ceil(selectorSize.w/unitWidth + 0.5)}
      h={Math.ceil(selectorSize.h/unitWidth + 0.5)}
      unitWidth={unitWidth}
      container={position}
      />
    </div>
  );
}
