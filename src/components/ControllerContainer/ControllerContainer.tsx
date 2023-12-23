import React, { useCallback, useEffect, useRef, useState } from 'react';
import './ControllerContainer.css';
import '../../App.css'
import {Button} from '../Button/Button';
import { checkValidDropPos, findClosestEmptySpot } from '../../utils/position';
import classNames from 'classnames';
import { DropdownOption } from '../Button/Dropdown';
import { Selector } from './Selector';
import { GetSelectedComponents, SelectionInteraction, resizeSelectorToFitSelectedComponents } from '../../utils/selector';
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

  const [singleSelectedComponentId, setSingleSelectedComponentId] = useState<number>()

  useEffect(()=>{
    document.documentElement.style.setProperty('--button-width', unitWidth+"px");
  },[unitWidth])

  useEffect(()=>{
    console.trace("Selector selected components: " + [...selectorSelectedComponents])
  },[selectorSelectedComponents])

  const updateCurrentConfig = useCallback((index: number, component: ComponentRepresentation) => {
    const newConfig = componentRepresentations.map((c, i)=>{
      if(i === index){
        return component
      }else{
        return c
      }
    })
    setComponentRepresentations(() => newConfig)
    closeDeleteSnackbar()
  }, [componentRepresentations])

  useEffect(()=>{
    console.log(componentRepresentations)
  }, [componentRepresentations])

  const deleteComponentRepresentation = useCallback((index: number) => {
    handleDeleteSnackbar(1);
    setNoTransition(true);
    setSingleSelectedComponentId(-1);
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
  }, [])



  const handleDeleteSnackbar = (num: number) => {
    setDeleteSnackbarIsOpen(true);
    setNoOfDeletedComponents(num);
  };

  const closeDeleteSnackbar = () =>{
    setDeleteSnackbarIsOpen(false);
  };

  const undoDelete = useCallback(()=>{
    setComponentRepresentations([...componentRepresentations, ...previouslyDeleted])
    setPreviouslyDeleted([])
  }, [componentRepresentations, previouslyDeleted])

  const handleTouch = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    setTouchEvents(e);
  }, [])

  useEffect(()=>{
    if(!isSelectorSelecting){
      setSelectorSelectedComponents([])
    }
  }, [isSelectorSelecting])
  

  useEffect(() =>{
    if(selectorSelectedComponents.length === 0){
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
        setSelectorSelectedComponents([])
        console.log(buttonAncestor.id)
        setSingleSelectedComponentId(parseInt(buttonAncestor.id))
        //set this button as selected
      } else if (selectorAncestor) {
        console.log('Selector captured the event');
        setSingleSelectedComponentId(-1)
      }else if(closeBtnAncestor){
        console.log('delete pressed')
        setSingleSelectedComponentId(-1)
        // const result = window.confirm("Remove " + selectorSelectedComponents.length + " component"+ (selectorSelectedComponents.length>1? "s":"") +"?");
      if (true) {
        // Perform additional actions if the user clicked OK
        deleteSelectedComponents(selectorSelectedComponents);
      }
        setIsSelectorSelecting(false)
      } else {
        console.log('No child captured the event');
        setIsSelectorSelecting(false)
        setSingleSelectedComponentId(-1)
      }
    }
    } else {
      // Event not captured by any child element
      setSingleSelectedComponentId(-1)
      console.log('Event not captured by any child element');
      //code for getting the selector working, disabled for now...
      // setIsSelectorSelecting(true)
      // const startParam = SelectionInteraction.startSelect(e, containerRef);
      // if(!startParam){
      //   console.log('error in start param')
      //   return
      // }
      // setSelectionType('add')
      // setSelectorSize({w: 1, h: 1})
      // setIsSelectorDragging(true);
      // setSelectorDeltaPosition({deltaX: 0, deltaY: 0})
      // setSelectorStartPosition({ x: startParam.x, y: startParam.y });
      // setSelectorPosition({ x: startParam.x, y: startParam.y });
    }

    
  }, [editing, selectorSelectedComponents, deleteSelectedComponents, singleSelectedComponentId])

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
    console.log(dragSelect)
    setSelectorPosition({x: Math.floor(dragSelect.x/unitWidth), y: Math.floor(dragSelect.y/unitWidth)})
    setSelectorSize({w: Math.ceil(dragSelect.w/unitWidth + 0.5), h: Math.ceil(dragSelect.h/unitWidth + 0.5)})
    setSelectorSelectedComponents(GetSelectedComponents({
      x: selectorPosition.x, 
      y: selectorPosition.y, 
      w: selectorSize.w, 
      h: selectorSize.h, 
      componentRepresentations: componentRepresentations
    }));
  }, [selectorStartPosition, selectorPosition, isSelectorDragging, containerRef, componentRepresentations, selectorSize.h, selectorSize.w, unitWidth])

  const handlePointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    setPointerEvents(e);
    setIsSelectorDragging(false);
    // setSelectorSelectedComponents(GetSelectedComponents({
    //   x: selectorPosition.x, 
    //   y: selectorPosition.y, 
    //   w: selectorSize.w, 
    //   h: selectorSize.h, 
    //   componentRepresentations: componentRepresentations
    // }));
    // resizes the selection area to be exactly the area taken up by the components
    // didn't like the effect, unused now...
    // if(selectorSelectedComponents.length !== 0){
    //   console.log(selectorSelectedComponents)
    //   let resize = resizeSelectorToFitSelectedComponents(selectorSelectedComponents);
    //   console.log(resize)
    //   setSelectorPosition({x: resize.x, y: resize.y})
    //   setSelectorSize({w: resize.w, h: resize.h})
    // }

 
  }, [selectorPosition, selectorSize, componentRepresentations])


  const handleCheckValidDropPos = useCallback((
    params: Omit<Parameters<typeof checkValidDropPos>[0], 'componentRepresentations'>
  ) => {
    setSelectorSelectedComponents([])
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
      closeDeleteSnackbar()
      setIsSelectorSelecting(false)
      setIsSelectorDragging(false)
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
          singleSelected={index === singleSelectedComponentId}
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
      x={selectorPosition.x}
      y={selectorPosition.y}
      w={selectorSize.w}
      h={selectorSize.h}
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
