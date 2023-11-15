import React, { useCallback, useEffect, useRef, useState } from 'react';
import './ControllerContainer.css';
import '../../App.css'
import {Button} from '../Button/Button';
import { checkValidDropPos, findClosestEmptySpot } from '../../utils/position';
import classNames from 'classnames';
import { DropdownOption } from '../Button/Dropdown';

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
  position: string,
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

  const handleTouch = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    setTouchEvents(e);
  }, [])
  const handlePointer = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    setPointerEvents(e);
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
      onPointerDown={handlePointer}
      onPointerUp={handlePointer}
      onPointerMove={handlePointer}
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
      {/* <Button touchEvents={touchEvents} mapping='ArrowUp' container='center' x={0} y={0} unitWidth={unitWidth}/> */}
    </div>
  );
}
