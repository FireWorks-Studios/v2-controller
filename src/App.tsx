import { ControllerContainer } from './components/ControllerContainer/ControllerContainer';
import "./App.css";

function App() {

  return (
    <div className="App noscroll prevent-select">  
      <ControllerContainer position={"center"} unitWidth={60} defaultConfig={
        [
          {
              type: "button",
              mapping: "UpArrow",
              container: "center",
              x: 1,
              y: 0 
          },
          {
              type: "button",
              mapping: "UpArrow",
              container: "center",
              x: 0,
              y: 1 
          },
          {
              type: "button",
              mapping: "UpArrow",
              container: "center",
              x: 1,
              y: 2 
          },
          {
              type: "button",
              mapping: "UpArrow",
              container: "center",
              x: 2,
              y: 1 
          },
          {
              type: "button",
              mapping: "UpArrow",
              container: "center",
              x: 5,
              y: 1 
          },
          {
              type: "button",
              mapping: "UpArrow",
              container: "center",
              x: 4,
              y: 2 
          }
        ]
      }
      editing={true}
      ></ControllerContainer>
    </div>
  );
}

export default App;
