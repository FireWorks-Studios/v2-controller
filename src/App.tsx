import { ControllerContainer } from './components/ControllerContainer/ControllerContainer';
import "./App.css";

function App() {

  return (
    <div className="App noscroll prevent-select">  
      <ControllerContainer position={"center"} unitWidth={100} defaultConfig={
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
              y: 0 
          }
        ]
      }
      editing={false}
      ></ControllerContainer>
    </div>
  );
}

export default App;
