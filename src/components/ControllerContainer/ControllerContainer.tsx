import React, { useCallback, useEffect, useRef, useState } from 'react';
import './ControllerContainer.css';
import '../../App.css'
import {Button} from '../Button/Button';
import { checkValidDropPos, findClosestEmptySpot } from '../../utils/position';
import classNames from 'classnames';
import { DropdownOption } from '../Button/Dropdown';
import { Selector } from './Selector';
import { GetSelectedComponents, SelectionInteraction } from '../../utils/selector';
import { checkValidSelectionDropPos } from '../../utils/selector';
import DeleteSnackbar from '../Snackbar/DeleteSnackbar';

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
  editing: boolean,
}

type SelectionType = 'move' | 'add'

export const ControllerContainer: React.FC<Props> = ({position, unitWidth, defaultComponentRepresentations, editing}:Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [touchEvents, setTouchEvents] = useState<React.TouchEvent<HTMLDivElement> | null>(null)
  const [componentRepresentations, setComponentRepresentations] = useState(defaultComponentRepresentations)
  const [pointerEvents, setPointerEvents] = useState<React.PointerEvent<HTMLDivElement> | null>(null)
  const [noTransition, setNoTransition] = useState(false);

  const [isSelectorDragging, setIsSelectorDragging] = useState(false);
  const [isSelectorSelecting, setIsSelectorSelecting] = useState(false);
  const [selectorDeltaPosition, setSelectorDeltaPosition] = useState({ deltaX: 0, deltaY: 0 });
  const [selectorStartPosition, setSelectorStartPosition] = useState({ x: 0, y: 0 });
  const [selectorSize, setSelectorSize] = useState({ w: 1, h: 1 });
  const [selectorPosition, setSelectorPosition] = useState({ x: 0, y: 0 });
  const [selectorSelectedComponents, setSelectorSelectedComponents] = useState<ComponentRepresentation[]>([])
  const [selectionType, setSelectionType] = useState<SelectionType>('add')

  const [previouslyDeleted, setPreviouslyDeleted] = useState<ComponentRepresentation[]>([])
  const [deleteSnackbarIsOpen, setDeleteSnackbarIsOpen] = useState(false);
  const [noOfDeletedComponents, setNoOfDeletedComponents] = useState(0);

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

  useEffect(()=>{
    console.log(componentRepresentations)
  }, [componentRepresentations])

  const deleteComponentRepresentation = useCallback((index: number) => {
    handleDeleteSnackbar(1);
    setNoTransition(true);
    setPreviouslyDeleted([componentRepresentations[index]])
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
    handleDeleteSnackbar(componentsToDelete.length)
    setPreviouslyDeleted(componentsToDelete)
    console.log("Handling request to delete: " + [...componentsToDelete])
    setNoTransition(true);
    setComponentRepresentations(prevComponents =>
      prevComponents.filter(component =>
        !componentsToDelete.some(item => item === component)
      )
    );
    setTimeout(() => {
      setNoTransition(false);
    }, 100); // Adjust the delay as needed
  }, [componentRepresentations, selectorSelectedComponents])



  const handleDeleteSnackbar = (num: number) => {
    setDeleteSnackbarIsOpen(true);
    setNoOfDeletedComponents(num);
  };

  const undoDelete = useCallback(()=>{
    setComponentRepresentations([...componentRepresentations, ...previouslyDeleted])
    setPreviouslyDeleted([])
  }, [componentRepresentations, previouslyDeleted])

  const handleTouch = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    setTouchEvents(e);
  }, [])
  

  useEffect(() =>{
    if(selectorSelectedComponents.length == 0){
      setSelectionType('add')
    }else{
      setSelectionType('move')
    }
  }, [selectorSelectedComponents])

  useEffect(() =>{
    if(!editing){
      setIsSelectorSelecting(false)
    }
  }, [editing])

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    setPointerEvents(e);
    if(!editing){
      setIsSelectorSelecting(false)
      return
    }
    const isEventCapturedByChild = e.currentTarget !== e.target;
    console.log(e.currentTarget, e.target)
    //check if the child target is button or drag handler
    if (isEventCapturedByChild) {
      // Child element captured the event
      console.log('Event captured by child element');
      const { target } = e;

    if (target instanceof Element) {
      const buttonAncestor = target.closest('.button');
      const selectorAncestor = target.closest('.selector-center-button');
      const closeBtnAncestor = target.closest('.delete-icon');

      if (buttonAncestor) {
        console.log('Button captured the event');
        setIsSelectorSelecting(false)
      } else if (selectorAncestor) {
        console.log('Selector captured the event');
      }else if(closeBtnAncestor){
        console.log('delete pressed')
        // const result = window.confirm("Remove " + selectorSelectedComponents.length + " component"+ (selectorSelectedComponents.length>1? "s":"") +"?");
      if (true) {
        // Perform additional actions if the user clicked OK
        deleteSelectedComponents(selectorSelectedComponents);
      }
        setIsSelectorSelecting(false)
      } else {
        console.log('No child captured the event');
        setIsSelectorSelecting(false)
      }
    }
    } else {
      // Event not captured by any child element
      console.log('Event not captured by any child element');
      setIsSelectorSelecting(true)
      const startParam = SelectionInteraction.startSelect(e, containerRef);
      if(!startParam){
        console.log('error in start param')
        return
      }
      setSelectionType('add')
      setSelectorSize({w: 1, h: 1})
      setIsSelectorDragging(true);
      setSelectorDeltaPosition({deltaX: 0, deltaY: 0})
      setSelectorStartPosition({ x: startParam.x, y: startParam.y });
      setSelectorPosition({ x: startParam.x, y: startParam.y });
    }

    
  }, [editing, selectorSelectedComponents, selectionType, selectorSize, isSelectorDragging, selectorDeltaPosition, selectorStartPosition, selectorPosition])

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
    setSelectorSelectedComponents(GetSelectedComponents({
      x: Math.floor(selectorPosition.x/unitWidth), 
      y: Math.floor(selectorPosition.y/unitWidth), 
      w: Math.ceil(selectorSize.w/unitWidth + 0.5), 
      h: Math.ceil(selectorSize.h/unitWidth + 0.5), 
      componentRepresentations: componentRepresentations
    }));
  }, [selectorStartPosition, selectorPosition, isSelectorDragging, containerRef, GetSelectedComponents])

  const handlePointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    setPointerEvents(e);
    setIsSelectorDragging(false);
    setSelectorSelectedComponents(GetSelectedComponents({
      x: Math.floor(selectorPosition.x/unitWidth), 
      y: Math.floor(selectorPosition.y/unitWidth), 
      w: Math.ceil(selectorSize.w/unitWidth + 0.5), 
      h: Math.ceil(selectorSize.h/unitWidth + 0.5), 
      componentRepresentations: componentRepresentations
    }));
  }, [selectorPosition, selectorSize])

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

  const handleCheckValidSelectionDropPos = useCallback(() =>{
    let result = checkValidSelectionDropPos({      
      deltaX: selectorDeltaPosition.deltaX,
      deltaY: selectorDeltaPosition.deltaY,
      unitWidth: unitWidth,
      componentRepresentations: componentRepresentations,
      selectorSelectedComponents: selectorSelectedComponents
    })
    if(result){
      setNoTransition(true)
      const localDX = Math.round(selectorDeltaPosition.deltaX / unitWidth);
      const localDY = Math.round(selectorDeltaPosition.deltaY / unitWidth);
    
      // Calculate the displaced positions of selected components
      const displacedComponents = selectorSelectedComponents.map((component) => ({
        ...component,
        x: component.x + localDX,
        y: component.y + localDY,
      }));
      const nonSelectedComponents = componentRepresentations.filter(
        (component) =>
          !selectorSelectedComponents.find(
            (selectedComponent) => selectedComponent === component
          )
      );
      
      const newComponentRepresentations = displacedComponents.concat(nonSelectedComponents)
      setComponentRepresentations(newComponentRepresentations)
      setIsSelectorSelecting(false)
      setSelectorSelectedComponents([])
      setTimeout(() => {
        setNoTransition(false);
      }, 100); 
    }else{
      setNoTransition(false)
      setSelectorDeltaPosition({deltaX: 0, deltaY: 0})
      setTimeout(() => {
        setNoTransition(false);
      }, 100); 
    }
  }, [
    noTransition,
    isSelectorSelecting,
    selectorDeltaPosition,
    unitWidth,
    componentRepresentations,
    selectorSelectedComponents
  ])

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
      id='controllerContainer'
      className={
        classNames(
          "controller-container",
          {
            [position]: true,
            editing,
            isSelectorDragging,
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
          selected={selectorSelectedComponents.includes(component)}
          selectorDeltaPosition={selectorDeltaPosition}
          updateCurrentConfig={updateCurrentConfig}
          deleteComponentRepresentation={deleteComponentRepresentation}
          checkValidDropPos={handleCheckValidDropPos}
          findClosestEmptySpot={handleFindClosestEmptySpot}
        />
        : null
      ))}
      <Selector 
      selecting={isSelectorSelecting}
      resizingSelectionArea={isSelectorDragging}
      x={Math.floor(selectorPosition.x/unitWidth)}
      y={Math.floor(selectorPosition.y/unitWidth)}
      w={Math.ceil(selectorSize.w/unitWidth + 0.5)}
      h={Math.ceil(selectorSize.h/unitWidth + 0.5)}
      unitWidth={unitWidth}
      container={position}
      selectionType={selectionType}
      setSelectorDeltaPosition={setSelectorDeltaPosition}
      checkValidSelectionDropPos={handleCheckValidSelectionDropPos}
      />

      <DeleteSnackbar 
      isOpen={deleteSnackbarIsOpen} 
      noOfDeletedComponents={noOfDeletedComponents} 
      setIsOpen={setDeleteSnackbarIsOpen}
      undoDelete={undoDelete}/>
    </div>
  );
}
