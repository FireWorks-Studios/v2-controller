import React, { useEffect, useState, useRef, useCallback } from 'react'
import './Button.css'
import Draggable, { DraggableEventHandler } from 'react-draggable';
import { ComponentRepresentation } from '../ControllerContainer/ControllerContainer';
import Dropdown from './Dropdown';
import { DropdownOption } from './DropdownOptions';
import {TbArrowsMove} from 'react-icons/tb'
import classNames from 'classnames';
import { ParsedDropdownValue } from './ParsedDropdownValue';
import { checkValidDropPos, findClosestEmptySpot, checkOutOfBounds, getControllerContainerDimensions} from '../../utils/position';
import { UserInteraction } from '../../utils/interaction';
import { FaRegTrashAlt } from "react-icons/fa";
import { PiSparkleBold } from "react-icons/pi";
import { LuRectangleHorizontal } from "react-icons/lu";
import { FaRegCircle } from "react-icons/fa";
import { LuBrush } from "react-icons/lu";
import { FaSquare } from "react-icons/fa";

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { ListItemIcon, ListItemText, ThemeProvider, createTheme } from '@material-ui/core';


import { MuiColorInput } from 'mui-color-input'
import { Divider, IconButton } from '@mui/material';

import { BsToggleOff } from "react-icons/bs";
import { BsToggleOn } from "react-icons/bs";

import { lighten } from '../../utils/colorModifier';


interface Props{
  variant: 'component'|'static-dummy'|'draggable-dummy'
  componentType: 'button'|'joystick'
  dragResizing?: boolean;
  cornerDragged?: string|undefined;
  colorsUsed?: string[];
  customizationMenuOpen?: boolean;
  singleSelected?: boolean;
  index?: number;
  touchEvents?: React.TouchEvent<HTMLDivElement> | null;
  pointerEvents?: React.PointerEvent<HTMLDivElement> | null;
  component: ComponentRepresentation;
  unitWidth: number;
  editing?: boolean;
  noTransition?: boolean;
  selected?: boolean;
  selectorDeltaPosition?: {deltaX: number, deltaY: number};
  capturedTouchPositions?: {x: number, y: number, knobX: number, knobY: number}[];
  // eslint-disable-next-line no-unused-vars
  updateCurrentConfig?(index: number, component: ComponentRepresentation): void;
  // eslint-disable-next-line no-unused-vars
  deleteComponentRepresentation?(index: number): void;
  // eslint-disable-next-line no-unused-vars 
  checkValidDropPos?(
    // eslint-disable-next-line no-unused-vars 
    params: Omit<Parameters<typeof checkValidDropPos>[0], 'componentRepresentations'>
  ): ReturnType<typeof checkValidDropPos>
  // eslint-disable-next-line no-unused-vars
  findClosestEmptySpot?(
    // eslint-disable-next-line no-unused-vars 
    params: Omit<Parameters<typeof findClosestEmptySpot>[0], 'componentRepresentations'>
  ): ReturnType<typeof findClosestEmptySpot>
  // eslint-disable-next-line no-unused-vars
  setCustomizationMenuOpen?(value: boolean): void;
}

const theme = createTheme({
  typography: {
    body1: {
      fontSize: 14,
    }
  }
})

export const Button: React.FC<Props> = ({
  variant,
  componentType,
  dragResizing = false,
  cornerDragged = undefined,
  colorsUsed = [],
  customizationMenuOpen = false,
  singleSelected = false,
  index = -1,
  touchEvents,
  pointerEvents,
  component,
  unitWidth = 100,
  editing = false,
  noTransition = false,
  selected = false,
  selectorDeltaPosition = {deltaX: 0, deltaY: 0},
  capturedTouchPositions = [],
  updateCurrentConfig = ()=>{},
  deleteComponentRepresentation = ()=>{},
  checkValidDropPos = ()=>{return(false)},
  findClosestEmptySpot = ()=>{return({x:0, y:0})},
  setCustomizationMenuOpen = () => {},
}: Props) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [pressed, setPressed] = useState(false);
  const [touchPositions, setTouchPositions] = useState(capturedTouchPositions);

  useEffect(()=>{
    setTouchPositions([{x: 0, y: 0, knobX: (unitWidth*component.w - 12)/2, knobY: (unitWidth*component.h - 12)/2}])
  },[unitWidth])

  useEffect(()=>{
    if(component.pressed !== pressed){
      updateCurrentConfig(index, {...component, pressed})
    }
  }, [pressed])

  useEffect(()=>{
    if(componentType == "joystick"){
      const updatedPositions = touchPositions.map(({ x, y }) => ({ x, y }));
      updateCurrentConfig(index, {
        ...component,
        capturedTouchPositions: updatedPositions
      });
    }else if (componentType == "button"){
      updateCurrentConfig(index, {
        ...component,
        capturedTouchPositions: [{x:0, y:0}]
      });
    }
  },[touchPositions, setTouchPositions])

  useEffect(()=>{
    if(!singleSelected){
      setCustomizationMenuOpen(false)
    }
  },[singleSelected])

  useEffect(() => {
    if (!buttonRef.current) return;

    const handlePointerUp = () => {
      if (!buttonRef.current) return;
      setPressed(false);
      setTouchPositions([{ x: 0, y: 0, knobX: buttonRef.current!.clientWidth / 2, knobY: buttonRef.current!.clientHeight / 2 }]);
    };

    const handleTouchEnd = () => {
      if (!buttonRef.current) return;
      setPressed(false);
      setTouchPositions([{ x: 0, y: 0, knobX: buttonRef.current!.clientWidth / 2, knobY: buttonRef.current!.clientHeight / 2 }]);
    };

    buttonRef.current.addEventListener('pointerup', handlePointerUp);
    buttonRef.current.addEventListener('touchend', handleTouchEnd);

    return () => {
      if (buttonRef.current) {
        buttonRef.current.removeEventListener('pointerup', handlePointerUp);
        buttonRef.current.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [buttonRef, setPressed, setTouchPositions]);

  useEffect(()=>{
    // never happens, just for ts type checking
    if (!buttonRef.current) return
    if (editing) {
      setPressed(false)
      return
    }
    if (touchEvents) {
      const [tempPressed, capturedTouches] = UserInteraction.identifyPressFromTouchEvents(touchEvents, buttonRef.current?.getBoundingClientRect());
      if(tempPressed){
        setTouchPositions(capturedTouches);
        if(componentType == "joystick"){
          capturedTouches.forEach(({ x, y }) => {
            console.log(`joystick with id: ${index} captured touch: x: ${x}, y: ${y}`);
          });
        }
      }else{
        setTouchPositions([
          {
            x: 0,
            y: 0,
            knobX: buttonRef.current!.clientWidth / 2, 
            knobY: buttonRef.current!.clientHeight / 2 
          }
        ]);
      }
      if(!component.styling.includes('sticky')){
        setPressed(tempPressed)
      }else{
        if(tempPressed){
          setPressed(!pressed)
        }
      }
    } else if (pointerEvents) {
      const [tempPressed, capturedPointer] = UserInteraction.identifyPressFromPointerEvents(pointerEvents, buttonRef.current?.getBoundingClientRect());
      setTouchPositions(capturedPointer);
      if(!component.styling.includes('sticky')){
        setPressed(tempPressed)
        if(tempPressed){
          if(componentType == "joystick"){
            capturedPointer.forEach(({ x, y }) => {
              console.log(`joystick with id: ${index} captured touch: x: ${x}, y: ${y}`);
            });
          }
        }else{
          setTouchPositions([
            {
              x: 0,
              y: 0,
              knobX: buttonRef.current!.clientWidth / 2, 
              knobY: buttonRef.current!.clientHeight / 2 
            }
          ]);
        }
      }else{
        if(tempPressed){
          setPressed(!pressed)
        }
      }
    }
  },[touchEvents, pointerEvents, editing, setTouchPositions])

  // useEffect(()=>{
  //   if(component.mapping[0] == 'Delete'){
  //     deleteComponentRepresentation(index)
  //   }
  // }, [component.mapping[0]])

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
      console.log(checkOutOfBounds({x, y, droppedComponent: component}))
      switch(checkOutOfBounds({x, y, droppedComponent: component})){
        case 'inBounds':
          updateCurrentConfig(index, {
            ...component,
            x,
            y
          })
          return
        case 'topOutOfBounds':
          console.log('delete this component if in portrait')
          if(component.container === 'center'){
            // console.log('delete this!')
            deleteComponentRepresentation(index);
          }
          return
        case 'leftOutOfBounds':
          if(component.container == 'right'){
            // console.log('delete this!')
            deleteComponentRepresentation(index);
          }
          console.log('delete this component if in landscape and is in right container')
          return
          case 'rightOutOfBounds':
            if(component.container == 'left'){
              // console.log('delete this!')
              deleteComponentRepresentation(index);
            }
            console.log('delete this component if in landscape and is in left container')
            return
        case 'invalidOutOfBounds':
          console.log('do nothing. let button return to original position')
          return 
      }

    } else {
      if(component.w !== 1 || component.h !== 1){
        return
      }
      let closestEmptySpot = findClosestEmptySpot({ actualX, actualY, unitWidth, index, containerWidth, containerHeight})
      updateCurrentConfig(index, {
        ...component,
        x: closestEmptySpot.x,
        y: closestEmptySpot.y
      })
    }
  }, [checkValidDropPos, component, findClosestEmptySpot, index, unitWidth, updateCurrentConfig])

  const updateMapping = useCallback((newVal: DropdownOption['value'], id: number) => {
    const newMapping = [...component.mapping];
    newMapping[id] = newVal;
    updateCurrentConfig(index, {
      ...component,
      mapping: newMapping
    });
  }, [component, index, updateCurrentConfig]);

  const updateStyling = useCallback((styling: string[])=>{
    updateCurrentConfig(index, {
      ...component,
      styling
    })
  },[component, index, updateCurrentConfig])

  const updateColor = useCallback((color: string)=>{
    updateCurrentConfig(index, {
      ...component,
      color
    })
  },[component, index, updateCurrentConfig])

  const toggleStyling = useCallback((attribute: string)=>{
    var newStyling = component.styling
    if(component.styling.includes(attribute)){
      newStyling = newStyling.filter(e => e !== attribute)
    }else{
      newStyling.push(attribute)
    }
    updateStyling(newStyling)
  }, [component, updateStyling])

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
  
  const isDraggable = useCallback(():boolean => {
    if(variant === 'component'){
      return editing
    }else if(variant === 'draggable-dummy'){
      return true
    }else{
      return false
    }
  }, [variant, editing])

  const buttonStyles = {
    '--w': component.w,
    '--h': component.h,
    '--color': lighten(component.color, 0.2),
    '--colorDarker': lighten(component.color, -0.2),
    '--colorLighter': lighten(component.color, 0.2)
  } as React.CSSProperties;

  return (
    <Draggable
      handle=".handle"
      // grid={[unitWidth, unitWidth]}
      defaultPosition={{x: unitWidth*component.x, y: unitWidth*component.y}}
      scale={1}
      position={componentPosition()}
      allowAnyClick={true}
      disabled={!isDraggable}
      onStop={handleStop}
    >
      <button id={index.toString()} className={
        classNames(
          'button',
          variant,
          componentType,
          component.styling.join(' '),
          {
            pressed,
            editing,
            noTransition,
            singleSelected,
            dragResizing
          }
        )
      } 
      style={buttonStyles}
      ref={buttonRef}>
        <div className={'button-text'}>
          <ParsedDropdownValue 
            value={component.mapping[0]}
          />
        </div>
        <div className={
          classNames(
            'button-bottom',
            'handle',
            {
              editing,
              singleSelected,
              dragResizing
            },
            cornerDragged
          )
        }>
        {singleSelected? <TbArrowsMove className='handle dragHandle'/>:""}
        </div>

        <div className={'top-left resizeHandle ' + (dragResizing? (cornerDragged!=='top-left'? 'hidden':'big'): '')}/>
        <div className={'top-right resizeHandle ' + (dragResizing? (cornerDragged!=='top-right'? 'hidden':'big'): '')}/>
        <div className={'bottom-left resizeHandle ' + (dragResizing? (cornerDragged!=='bottom-left'? 'hidden':'big'): '')}/>
        <div className={'bottom-right resizeHandle ' + (dragResizing? (cornerDragged!=='bottom-right'? 'hidden':'big'): '')}/>

        <div id='menu' className={
          classNames(
            'menu',
            {
              singleSelected,
              dragResizing
            }
          )
        }> 
          <PiSparkleBold id={'customizationMenuBtn'+component.container+index} className='moreOptions' onClick={() => setCustomizationMenuOpen(!customizationMenuOpen)}/>
          <FaRegTrashAlt className='delete' onClick={() => deleteComponentRepresentation(index)}/> 
        </div>
        <ThemeProvider theme={theme}>
            <Menu
              anchorEl={document.getElementById('customizationMenuBtn'+component.container+index)}
              open={customizationMenuOpen && document.getElementById('customizationMenuBtn'+component.container+index)!= null && singleSelected}
            >
              <MenuItem dense={true} disableRipple sx={{pointerEvents: 'none', opacity: 1}}>
                <ListItemText primary={componentType?.charAt(0).toUpperCase() + componentType?.slice(1)} />
              </MenuItem>
            
            {componentType == "button" && (
              <MenuItem dense={true} onClick={()=>{toggleStyling('round')}}>
                <ListItemIcon><FaRegCircle /></ListItemIcon>
                <ListItemText>Round</ListItemText>
                <IconButton edge="end" size='large' sx={{... component.styling.includes('round')? {color: component.color}: {}, padding: '0px', marginRight: '0px'}}>
                {component.styling.includes('round')? <BsToggleOn/>: <BsToggleOff/>}
                </IconButton>
              </MenuItem>
            )}

            {componentType == "button" && (
              <MenuItem dense={true} onClick={()=>{toggleStyling('short')}}>
                <ListItemIcon><LuRectangleHorizontal /></ListItemIcon>
                <ListItemText>Short</ListItemText>
                <IconButton edge="end" size='large' sx={component.styling.includes('short')? {color: component.color, padding: '0px', marginRight: '3px'}: {padding: '0px', marginRight: '0px'}}>
                {component.styling.includes('short')? <BsToggleOn/>: <BsToggleOff/>}
                </IconButton>
              </MenuItem>
            )}

            {/* {componentType == "joystick" && (
              <MenuItem dense={true} onClick={()=>{toggleStyling('short')}}>
                <ListItemIcon><PiMouseBold /></ListItemIcon>
                <ListItemText>Simulate Mouse</ListItemText>
                <IconButton edge="end" size='large' sx={component.styling.includes('short')? {color: component.color, padding: '0px', marginRight: '3px'}: {padding: '0px', marginRight: '0px'}}>
                {component.styling.includes('short')? <BsToggleOn/>: <BsToggleOff/>}
                </IconButton>
              </MenuItem>
            )} */}

            <Divider/>
            <MenuItem dense={true} disableRipple sx={{"&:hover": {backgroundColor: "#ffffff" }}}>
              <ListItemIcon><LuBrush /></ListItemIcon>
              <ListItemText>Color</ListItemText>
              <MuiColorInput id='MuiColorInput' size='small' value={component.color} onChange={updateColor} format='hex' variant='outlined' sx={{marginLeft: '10px', width: '150px', display: 'flex', alignItems: 'flex-end', marginRight: '-5px'}} isAlphaHidden={true}/>
            </MenuItem>
            <MenuItem dense disableRipple sx={{"&:hover": {backgroundColor: "#ffffff" }}}>
              <IconButton sx={{color: colorsUsed[0]}} disabled={colorsUsed[0] === undefined} onClick={()=>updateColor(colorsUsed[0])}>
              <FaSquare/>
              </IconButton>
              <IconButton sx={{color: colorsUsed[1]}} disabled={colorsUsed[1] === undefined} onClick={()=>updateColor(colorsUsed[1])}>
              <FaSquare/>
              </IconButton>
              <IconButton sx={{color: colorsUsed[2]}} disabled={colorsUsed[2] === undefined} onClick={()=>updateColor(colorsUsed[2])}>
              <FaSquare/>
              </IconButton>
              <IconButton sx={{color: colorsUsed[3]}} disabled={colorsUsed[3] === undefined} onClick={()=>updateColor(colorsUsed[3])}>
              <FaSquare/>
              </IconButton>
              <IconButton sx={{color: colorsUsed[4]}} disabled={colorsUsed[4] === undefined} onClick={()=>updateColor(colorsUsed[4])}>
              <FaSquare/>
              </IconButton>
              <IconButton sx={{color: colorsUsed[5]}} disabled={colorsUsed[5] === undefined} onClick={()=>updateColor(colorsUsed[5])}>
              <FaSquare/>
              </IconButton>
            </MenuItem>
          </Menu>
      </ThemeProvider>
      {componentType == "button"?
        <Dropdown 
          id={0}
          editing={editing} 
          updateMapping={updateMapping} 
          value={component.mapping[0]}
        />
      :''
      }
      {componentType == "joystick"? 
        <div
          className='joystickBase'
        >
          <div 
            className='joystickKnob' 
            style={{
              position: 'absolute', 
                left: `${touchPositions[0]?.knobX}px`, 
                top: `${touchPositions[0]?.knobY}px`,
                transform: 'translate(-50%, -50%)'
            }}
          >
            <div
              className='joystickKnobTop'
              style={{
                position: 'absolute', 
                  transform: `translate(${touchPositions[0]?.x * 20}%, ${touchPositions[0]?.y * -20 - 10}%)`
              }}
            ></div>
          </div>
          <div className='joystickText'>
              {/* joystick text on the play mode for users to see what the mapping is even without getting into the editor */}
          </div>
          <Dropdown 
            id={0}
            editing={editing} 
            updateMapping={updateMapping} 
            value={component.mapping[0]}
          />
          <Dropdown 
            id={1}
            editing={editing} 
            updateMapping={updateMapping} 
            value={component.mapping[1]}
          />
          <Dropdown 
            id={2}
            editing={editing} 
            updateMapping={updateMapping} 
            value={component.mapping[2]}
          />
          <Dropdown
            id={3} 
            editing={editing} 
            updateMapping={updateMapping} 
            value={component.mapping[3]}
          />
        </div>
      :''
      }


      </button>
    </Draggable>
  )
}

