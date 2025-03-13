import React, { useCallback, useEffect, useRef, useState } from 'react';
import './ControllerContainer.css';
import '../../App.css'
import {Button} from '../Button/Button';
import { checkValidDropPos, findClosestEmptySpot } from '../../utils/position';
import classNames from 'classnames';
import { DropdownOption } from '../Button/DropdownOptions';
import { Selector } from './Selector';
import { GetSelectedComponents, SelectionInteraction, checkOverlap } from '../../utils/selector';
import { checkValidSelectionDropPos } from '../../utils/selector';
import DeleteSnackbar from '../Snackbar/DeleteSnackbar';
import ClickAwayListener from 'react-click-away-listener';

export interface ComponentRepresentation {
  type: 'button' | 'joystick',
  styling: string[],
  mapping: DropdownOption['value'][],
  container: 'center' | 'left' | 'right',
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
  pressed?: boolean,
  capturedTouchPositions: {x: number, y: number}[]
}

interface Props{
  screenOrientation: 'portrait' | 'landscape',
  position: 'center' | 'left' | 'right',
  unitWidth: number,
  defaultComponentRepresentations: ComponentRepresentation[],
  editing: boolean,
  updateComponentRepresentations: React.Dispatch<React.SetStateAction<ComponentRepresentation[]>>,
  handheldMode: boolean
}

type SelectionType = 'move' | 'add'

export const ControllerContainer: React.FC<Props> = ({screenOrientation, position, unitWidth, defaultComponentRepresentations, editing, updateComponentRepresentations, handheldMode}:Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [touchEvents, setTouchEvents] = useState<React.TouchEvent<HTMLDivElement> | null>(null)
  const [componentRepresentations, setComponentRepresentations] = useState(defaultComponentRepresentations)
  const [pointerEvents, setPointerEvents] = useState<React.PointerEvent<HTMLDivElement> | null>(null)
  const [noTransition, setNoTransition] = useState(false);

  const [isSelectorDragging, setIsSelectorDragging] = useState(false);
  const [isSelectorSelecting, setIsSelectorSelecting] = useState(false);
  const [selectorDeltaPosition, setSelectorDeltaPosition] = useState({ deltaX: 0, deltaY: 0 });
  const [selectorStartPosition] = useState({ x: 0, y: 0 });
  const [selectorSize, setSelectorSize] = useState({ w: 1, h: 1 });
  const [selectorPosition, setSelectorPosition] = useState({ x: 0, y: 0 });
  const [selectorSelectedComponents, setSelectorSelectedComponents] = useState<ComponentRepresentation[]>([])
  const [selectionType, setSelectionType] = useState<SelectionType>('add')

  const [previouslyDeleted, setPreviouslyDeleted] = useState<ComponentRepresentation[]>([])
  const [deleteSnackbarIsOpen, setDeleteSnackbarIsOpen] = useState(false);
  const [noOfDeletedComponents, setNoOfDeletedComponents] = useState(0);

  const [singleSelectedComponentId, setSingleSelectedComponentId] = useState<number>(-1)
  const [customizationMenuOpen, setCustomizationMenuOpen] = useState(false)

  const [colorsUsed, setColorsUsed] = useState<string[]>(new Array(6))

  const [dragResizeCorner, setDragResizeCorner] = useState<string>()

  useEffect(()=>{
    updateComponentRepresentations(componentRepresentations)
  },[componentRepresentations])

  useEffect(()=>{
    var tempColors = new Array(6);
    const uniqueColors = new Set<string>(); // Keep track of unique colors encountered

    for (const component of componentRepresentations) {
      const { color } = component;

      if (color && !uniqueColors.has(color)) {
        uniqueColors.add(color);
        tempColors[uniqueColors.size - 1] = color;

        if (uniqueColors.size === 6) {
          break; // Stop the loop once 6 unique colors are found
        }
      }
    }
    // console.log(tempColors)
    setColorsUsed(tempColors);
  },[componentRepresentations])

  useEffect(()=>{
    document.documentElement.style.setProperty('--button-width', unitWidth+"px");
  },[unitWidth])

  // useEffect(()=>{
  //   console.trace("Selector selected components: " + [...selectorSelectedComponents])
  // },[selectorSelectedComponents])

  const updateCurrentConfig = useCallback((index: number, component: ComponentRepresentation) => {
    if(component.type === 'joystick'){  
      const { x, y } = component.capturedTouchPositions[0];
      console.log(`Joystick ${index} update called with captured touch positions: x=${x}, y=${y}`);
    }
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

  // useEffect(()=>{
  //   console.log(componentRepresentations)
  // }, [componentRepresentations])

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
      const menuAncestor = target.closest('.MuiPaper-root')||target.closest('#color-popover');
      const menuRootAncestor = target.closest('.MuiPopover-root');


      if (buttonAncestor) {
        console.log('Button captured the event');
        setIsSelectorSelecting(false)
        setSelectorSelectedComponents([])
        console.log(buttonAncestor.id)
        setSingleSelectedComponentId(parseInt(buttonAncestor.id))
        //set this button as selected

        //check if the touch is a drag to resize the button?
        setDragResizeCorner(undefined)
        const topLeftHandler = target.closest('.top-left')
        const topRightHandler = target.closest('.top-right')
        const bottomLeftHandler = target.closest('.bottom-left')
        const bottomRightHandler = target.closest('.bottom-right')
        if(topLeftHandler){
          console.log('dragging top left!')
          setDragResizeCorner('top-left')
        }else if(topRightHandler){
          console.log('dragging top right!')
          setDragResizeCorner('top-right')
        }else if(bottomLeftHandler){
          console.log('dragging bottom left!')
          setDragResizeCorner('bottom-left')
        }else if(bottomRightHandler){
          console.log('dragging bottom right!')
          setDragResizeCorner('bottom-right')
        }
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
      }else if(menuAncestor){
        console.log('menu captured the event - do nothing');
      }else if(menuRootAncestor){
        console.log('close customize submenu');
        setCustomizationMenuOpen(false)
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

    
  }, [editing, selectorSelectedComponents, deleteSelectedComponents, singleSelectedComponentId, dragResizeCorner])

  const handleDragResize = useCallback((e: React.PointerEvent<HTMLDivElement>) =>{
    e.preventDefault();
    if(singleSelectedComponentId === -1){
      return
    }
    if(!containerRef.current){
      return
    }
    const selectedComponent = componentRepresentations[singleSelectedComponentId]
    // console.log(selectedComponent)
    var anchorPos
    if(dragResizeCorner === 'top-left'){
      anchorPos = {anchorX: selectedComponent.x + selectedComponent.w - 1, anchorY: selectedComponent.y + selectedComponent.h - 1}
    }else if(dragResizeCorner === 'top-right'){
      anchorPos = {anchorX: selectedComponent.x, anchorY: selectedComponent.y + selectedComponent.h - 1}
    }else if(dragResizeCorner === 'bottom-right'){
      anchorPos = {anchorX: selectedComponent.x, anchorY: selectedComponent.y}
    }else{
      anchorPos = {anchorX: selectedComponent.x + selectedComponent.w - 1, anchorY: selectedComponent.y}
    }
    // console.log(anchorPos)

    var targetPos
    const divRect = containerRef.current?.getBoundingClientRect();
    const { clientX, clientY } = e;
    if (!(divRect && clientX >= divRect.left && clientX <= divRect.right && clientY >= divRect.top && clientY <= divRect.bottom)){
      return
    }
    const localX = clientX - divRect.left;
    const localY = clientY - divRect.top;
    const localGridX = Math.floor(localX/unitWidth)
    const localGridY = Math.floor(localY/unitWidth)
    targetPos = {targetX: localGridX, targetY: localGridY}
    // console.log(targetPos)

    var topLeftPos = {x: Math.min(anchorPos.anchorX, targetPos.targetX), y: Math.min(anchorPos.anchorY, targetPos.targetY)}
    var bottomRightPos = {x: Math.max(anchorPos.anchorX, targetPos.targetX), y: Math.max(anchorPos.anchorY, targetPos.targetY)}

    if(dragResizeCorner === 'top-left'){
      topLeftPos = {x: Math.min(anchorPos.anchorX, targetPos.targetX), y: Math.min(anchorPos.anchorY, targetPos.targetY)}
      bottomRightPos = {x: Math.max(anchorPos.anchorX, targetPos.targetX), y: Math.max(anchorPos.anchorY, targetPos.targetY)}
    }else if(dragResizeCorner === 'top-right'){
      topLeftPos = {x: Math.min(anchorPos.anchorX), y: Math.min(anchorPos.anchorY, targetPos.targetY)}
      bottomRightPos = {x: Math.max(anchorPos.anchorX, targetPos.targetX), y: Math.max(anchorPos.anchorY, targetPos.targetY)}
  }else if(dragResizeCorner === 'bottom-right'){
    topLeftPos = {x: Math.min(anchorPos.anchorX), y: Math.min(anchorPos.anchorY)}
    bottomRightPos = {x: Math.max(anchorPos.anchorX, targetPos.targetX), y: Math.max(anchorPos.anchorY, targetPos.targetY)}
  }else{
    topLeftPos = {x: Math.min(anchorPos.anchorX, targetPos.targetX), y: Math.min(anchorPos.anchorY)}
    bottomRightPos = {x: Math.max(anchorPos.anchorX, targetPos.targetX), y: Math.max(anchorPos.anchorY, targetPos.targetY)}
  }

    var validPos = []
    for(var i = topLeftPos.x; i <= bottomRightPos.x; i++){
      for(var j = topLeftPos.y; j <= bottomRightPos.y; j++){
        //test for collisions for box defined by (i, j) to anchorPos
        //define box
        let testBox = {
          x: Math.min(i, anchorPos.anchorX),
          y: Math.min(j, anchorPos.anchorY),
          w: Math.max(i, anchorPos.anchorX) - Math.min(i, anchorPos.anchorX) + 1,
          h: Math.max(j, anchorPos.anchorY) - Math.min(j, anchorPos.anchorY) + 1
        }
        // console.log(testBox)
        //check collisions
        const nonSelectedComponents = componentRepresentations.filter(
          (component) =>
            component !== selectedComponent
        );
        let isValid = true
        for (const nonSelectedComponent of nonSelectedComponents){
            if(checkOverlap(
              testBox.x,
              testBox.y,
              testBox.w,
              testBox.h,
              nonSelectedComponent.x,
              nonSelectedComponent.y,
              nonSelectedComponent.w,
              nonSelectedComponent.h
            )){
              isValid = false
            }
        }
        //compare distance to target pos according to which corner is dragged
        if(isValid){
          validPos.push(testBox)
        }
      }
    }
    // console.log(validPos)
    let closestPos = validPos[0]
    let closestDistance = Number.MAX_VALUE
    for(const pos of validPos){
      if(dragResizeCorner === 'top-left'){
        if(distanceToTarget(pos.x*unitWidth, pos.y*unitWidth, localX, localY)<closestDistance){
          closestDistance = distanceToTarget(pos.x*unitWidth, pos.y*unitWidth, localX, localY)
          closestPos = pos
        }
      }else if(dragResizeCorner === 'top-right'){
        if(distanceToTarget((pos.x+pos.w)*unitWidth, pos.y*unitWidth, localX, localY)<closestDistance){
          closestDistance = distanceToTarget((pos.x+pos.w)*unitWidth, pos.y*unitWidth, localX, localY)
          closestPos = pos
        }
      }else if(dragResizeCorner === 'bottom-left'){
        if(distanceToTarget(pos.x*unitWidth, (pos.y+pos.h)*unitWidth, localX, localY)<closestDistance){
          closestDistance = distanceToTarget(pos.x*unitWidth, (pos.y+pos.h)*unitWidth, localX, localY)
          closestPos = pos
        }
      }else{
        if(distanceToTarget((pos.x+pos.w)*unitWidth, (pos.y+pos.h)*unitWidth, localX, localY)<closestDistance){
          closestDistance = distanceToTarget((pos.x+pos.w)*unitWidth, (pos.y+pos.h)*unitWidth, localX, localY)
          closestPos = pos
        }
      }
    }
    // console.log(closestPos)
    updateCurrentConfig(singleSelectedComponentId, {
      ...selectedComponent,
      ...closestPos
    })
  },[dragResizeCorner, singleSelectedComponentId, componentRepresentations])

  function distanceToTarget(x: number, y: number, targetX: number, targetY: number): number {
    const deltaX = targetX - x;
    const deltaY = targetY - y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    return distance;
  }

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    setPointerEvents(e);
    if(!containerRef.current){
      return
    }

    //handle drag to resize recursively
    if(dragResizeCorner !== undefined){
      handleDragResize(e)
    }

    if (!isSelectorDragging) {
      return;
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
  }, [dragResizeCorner, selectorStartPosition, selectorPosition, isSelectorDragging, containerRef, componentRepresentations, selectorSize.h, selectorSize.w, unitWidth])

  const handlePointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    setPointerEvents(e);
    setIsSelectorDragging(false);
    setDragResizeCorner(undefined)
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

 
  }, [dragResizeCorner, selectorPosition, selectorSize, componentRepresentations])


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

  const handleClickAway = () => {
    setIsSelectorSelecting(false)
    setSingleSelectedComponentId(-1)
	};

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
    <div 
      id='controllerContainer'
      className={
        classNames(
          "controller-container",
          screenOrientation,
          {
            [position]: true,
            editing,
            isSelectorDragging,
            handheldMode,
          },
          dragResizeCorner,
        )
      } 
      ref={containerRef}
      onTouchStart={handleTouch}
      onTouchMove={handleTouch}
      onTouchEnd={handleTouch}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
      onPointerCancel={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >  
      {componentRepresentations.map((component, index)=>(
        (component.type === 'button' || component.type === 'joystick' ) ?
        <Button
        variant='component' 
        dragResizing={dragResizeCorner!==undefined && singleSelectedComponentId === index}
        cornerDragged={dragResizeCorner}
        colorsUsed={colorsUsed}
        customizationMenuOpen={customizationMenuOpen}
        setCustomizationMenuOpen={setCustomizationMenuOpen}
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
    </ClickAwayListener>
  );
}
