import { ControllerContainer } from './components/ControllerContainer/ControllerContainer';
import "./App.css";
import React, { useState } from 'react';
import { ControllerToolkit } from './components/ControllerToolkit/ControllerToolkit';

function App() {
  const [editing, setEditing] = useState(false)
  return (
    <div className="App noscroll prevent-select">  
        <button onClick={() => setEditing(!editing)}>
      edit
    </button>
    <ControllerToolkit/>
      <ControllerContainer 
        position={"center"} 
        unitWidth={60} 
        defaultComponentRepresentations={
        [
          {
            type: "button",
            styling: [],
            mapping: 'ArrowUp',
            container: "center",
            x: 1,
            y: 0,
            w: 1,
            h: 1 
        },
        {
          type: "button",
          styling: ["round", "short"],
          mapping: 'Green Flag',
          container: "center",
          x: 2,
          y: 0,
          w: 1,
          h: 1  
      },
      {
          type: "button",
          styling: ["round", "short"],
          mapping: 'Pause',
          container: "center",
          x: 3,
          y: 0,
          w: 1,
          h: 1  
      },
      {
        type: "button",
        styling: ["round", "short"],
        mapping: 'Stop',
        container: "center",
        x: 4,
        y: 0,
        w: 1,
        h: 1  
    },
        {
            type: "button",
            styling: [],
            mapping: 'ArrowLeft',
            container: "center",
            x: 0,
            y: 1,
            w: 1,
            h: 1  
        },
        {
            type: "button",
            styling: [],
            mapping: 'ArrowDown',
            container: "center",
            x: 1,
            y: 2,
            w: 1,
            h: 1  
        },
        {
            type: "button",
            styling: [],
            mapping: 'ArrowRight',
            container: "center",
            x: 2,
            y: 1,
            w: 1,
            h: 1  
        },
        {
            type: "button",
            styling: [],
            mapping: 'a',
            container: "center",
            x: 5,
            y: 1,
            w: 1,
            h: 1  
        },
        {
          type: "button",
          styling: [],
          mapping: 'b',
          container: "center",
          x: 4,
          y: 2,
          w: 1,
          h: 1  
        },
        ]
      }
      editing={editing}
      />
    </div>
  );
}

export default App;
