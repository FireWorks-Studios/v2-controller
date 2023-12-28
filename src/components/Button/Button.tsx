import React, { useEffect, useState, useRef, useCallback, useImperativeHandle } from 'react'
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
import { FaRegTrashAlt } from "react-icons/fa";
import { MdOutlineMoreVert } from "react-icons/md";
import { VscSparkle } from "react-icons/vsc";
import { HiSparkles } from "react-icons/hi2";
import { PiSparkleBold } from "react-icons/pi";
import { LuRectangleHorizontal } from "react-icons/lu";
import { FaRegCircle } from "react-icons/fa";
import { TbBrush } from "react-icons/tb";
import { LuBrush } from "react-icons/lu";
import { FaSquare } from "react-icons/fa";



import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Checkbox, ListItemIcon, ListItemText, Switch, Typography } from '@material-ui/core';
import { FavoriteBorder, Favorite, Margin } from '@mui/icons-material';


import { MuiColorInput } from 'mui-color-input'
import { Color, Divider, IconButton, ListItem, ListItemSecondaryAction } from '@mui/material';

import { BsToggleOff } from "react-icons/bs";
import { BsToggleOn } from "react-icons/bs";

import { lighten } from '../../utils/colorModifier';


interface Props{
  dragResizing: boolean;
  cornerDragged: string|undefined;
  colorsUsed:string[];
  customizationMenuOpen: boolean;
    singleSelected: boolean;
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
    setCustomizationMenuOpen(value: boolean): void;
}

export const Button: React.FC<Props> = ({
  dragResizing,
  cornerDragged,
  colorsUsed,
  customizationMenuOpen,
  singleSelected,
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
  setCustomizationMenuOpen,
}: Props) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [pressed, setPressed] = useState(false)

  useEffect(()=>{
    if(!singleSelected){
      setCustomizationMenuOpen(false)
    }
  },[singleSelected])

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

  const updateMapping = useCallback((mapping: DropdownOption['value']) => {
    // if(['Green Flag', 'Pause', 'Stop', 'Remap'].includes(mapping)){
    //   component.styling.push("short", "round")
    // }else{
    //   component.styling = []
    // }
    updateCurrentConfig(index, {
      ...component,
      mapping
    })
  }, [component, index, updateCurrentConfig])

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
      bounds={"parent"}
      scale={1}
      position={componentPosition()}
      allowAnyClick={true}
      disabled={!editing}
      onStop={handleStop}
    >
      <button id={index.toString()} className={
        classNames(
          'button',
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
            value={component.mapping}
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
          <PiSparkleBold id={'customizationMenuBtn'+index} className='moreOptions' onClick={() => setCustomizationMenuOpen(!customizationMenuOpen)}/>
          <FaRegTrashAlt className='delete' onClick={() => deleteComponentRepresentation(index)}/> 
        </div>

        <Menu
          anchorEl={document.getElementById('customizationMenuBtn'+index)}
          open={customizationMenuOpen && document.getElementById('customizationMenuBtn'+index)!= null && singleSelected}
        >
        <MenuItem dense={true} onClick={()=>{toggleStyling('round')}}>
          <ListItemIcon><FaRegCircle /></ListItemIcon>
          <ListItemText>Round</ListItemText>
          <IconButton edge="end" size='large' sx={component.styling.includes('round')? {color: component.color}: {}}>
          {component.styling.includes('round')? <BsToggleOn/>: <BsToggleOff/>}
          </IconButton>
        </MenuItem>
        <MenuItem dense={true} onClick={()=>{toggleStyling('short')}}>
          <ListItemIcon><LuRectangleHorizontal /></ListItemIcon>
          <ListItemText>Short</ListItemText>
          <IconButton edge="end" size='large' sx={component.styling.includes('short')? {color: component.color}: {}}>
          {component.styling.includes('short')? <BsToggleOn/>: <BsToggleOff/>}
          </IconButton>
        </MenuItem>
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

        <Dropdown 
          editing={editing} 
          updateMapping={updateMapping} 
          value={component.mapping}
        />
      </button>
    </Draggable>
  )
}

