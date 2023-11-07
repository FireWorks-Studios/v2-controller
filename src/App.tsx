import { ControllerContainer } from './components/ControllerContainer/ControllerContainer';
import "./App.css";
import React, { useState } from 'react';

function App() {
  const [editing, setEditing] = useState(false)
  return (
    <div className="App noscroll prevent-select">  
    <button onClick={() => setEditing(!editing)}>
      {editing}
    </button>
      <ControllerContainer position={"center"} unitWidth={60} 
      defaultConfig={
        [
          {
            type: "button",
            mapping: '<span class="arrow up">▲</span>',
            container: "center",
            x: 1,
            y: 0 
        },
        {
            type: "button",
            mapping: '<span class="arrow left">▲</span>',
            container: "center",
            x: 0,
            y: 1 
        },
        {
            type: "button",
            mapping: '<span class="arrow down">▲</span>',
            container: "center",
            x: 1,
            y: 2 
        },
        {
            type: "button",
            mapping: '<span class="arrow right">▲</span>',
            container: "center",
            x: 2,
            y: 1 
        },
        {
            type: "button",
            mapping: 'a',
            container: "center",
            x: 5,
            y: 1 
        },
        {
          type: "button",
          mapping: 'b',
          container: "center",
          x: 4,
          y: 2 
        },
        ]
      }
      editing={editing}
      ></ControllerContainer>
    </div>
  );
}

export default App;
