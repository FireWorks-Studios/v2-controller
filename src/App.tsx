import React, { useState } from 'react';
import './App.css';
import { DragDropContext } from 'react-beautiful-dnd';
import {Button} from './components/Button/Button';
import { ControllerContainer } from './components/ControllerContainer/ControllerContainer';

function App() {
  return (
    <div className="App">  
      <ControllerContainer></ControllerContainer>
    </div>
  );
}

export default App;
