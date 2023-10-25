import React, { useState } from 'react';
import './ControllerContainer.css';
import {Button} from '../Button/Button';

interface Props{

}

export const ControllerContainer: React.FC<Props> = () => {
  const [touchEvents, setTouchEvents] = useState<React.TouchEvent<HTMLDivElement> | null>(null)
  return (
    <div className="controller-container noscroll prevent-select" 
    onTouchStart={(e) => setTouchEvents(e)}
    onTouchMove={(e)=> setTouchEvents(e)}
    onTouchEnd={(e)=> setTouchEvents(e)}>  
      <Button touchEvents={touchEvents} mapping='ArrowUp' container='center' x={0} y={0}/>
    </div>
  );
}
