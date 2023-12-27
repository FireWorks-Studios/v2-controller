import { ComponentRepresentation } from "../components/ControllerContainer/ControllerContainer";
export class SelectionInteraction{
    static startSelect = ((e: React.PointerEvent<HTMLDivElement>, containerRef: React.RefObject<HTMLDivElement>) => {
        e.preventDefault();
        if(!containerRef.current){
          return
        }
        const divRect = containerRef.current?.getBoundingClientRect();
        const { clientX, clientY } = e;
        const localX = clientX - divRect.left;
        const localY = clientY - divRect.top;
        //console.log(localX, localY)
        const startParam = {x: localX, y: localY, w: 1, h: 1}
        return startParam;
      });
    
    static dragSelect = ((e: React.PointerEvent<HTMLDivElement>, containerRef: React.RefObject<HTMLDivElement>, selectorStartPosition: {x: number, y: number}) =>{
        e.preventDefault();
        if(!containerRef.current){
          return
        }
        const divRect = containerRef.current?.getBoundingClientRect();
        const { clientX, clientY } = e;
        const localX = clientX - divRect.left;
        const localY = clientY - divRect.top;
        const deltaX = localX - selectorStartPosition.x;
        const deltaY = localY - selectorStartPosition.y;
        var x = selectorStartPosition.x;
        var y = selectorStartPosition.y;
        var w = 1;
        var h = 1;
    if(deltaX >= 0 && deltaY >= 0){
        x = selectorStartPosition.x
        y = selectorStartPosition.y
        w = deltaX
        h = deltaY
    }else if(deltaX > 0 && deltaY < 0){
        x = selectorStartPosition.x
        y = selectorStartPosition.y + deltaY
        w = deltaX
        h = -deltaY
    }else if(deltaX < 0 && deltaY < 0){
        x = selectorStartPosition.x + deltaX
        y = selectorStartPosition.y + deltaY
        w = -deltaX
        h = -deltaY
    }else if(deltaX < 0 && deltaY > 0){
        x = selectorStartPosition.x + deltaX
        y = selectorStartPosition.y
        w = -deltaX
        h = deltaY
    }
    //check which components are within this selected area
    return {x, y, w, h}
    }) 
}

export function GetSelectedComponents({
    x, y, w, h, componentRepresentations
}: {
    x: number,
    y: number,
    w: number,
    h: number,
    componentRepresentations: ComponentRepresentation[]
}): ComponentRepresentation[] {
    const ComponentsSelected: ComponentRepresentation[] = [];

    for (const component of componentRepresentations) {
        // console.log(component)
        const { x: componentX, y: componentY, w: componentW, h: componentH } = component;
        // console.log(componentX, componentY, componentW, componentH)
        // console.log(x, y, w, h)

        // Select if the component is entirely within the specified area
        if (componentX >= x && componentY >= y && componentX + componentW <= x + w && componentY + componentH <= y + h) {
            ComponentsSelected.push(component);
        }

        // Select if partial overlap
        // const isOverlapping = () => {
        //   const horizontalOverlap = component.x < x + w && component.x + component.w > x;
        //   const verticalOverlap = component.y < y+ h && component.y + component.h > y;
      
        //   return horizontalOverlap && verticalOverlap;
        // }
        // if(isOverlapping()){
        //   ComponentsSelected.push(component);
        // }

    }

    return ComponentsSelected;
}

export function checkValidSelectionDropPos({
    deltaX,
    deltaY,
    unitWidth,
    componentRepresentations,
    selectorSelectedComponents,
  }: {
    deltaX: number;
    deltaY: number;
    unitWidth: number;
    componentRepresentations: ComponentRepresentation[];
    selectorSelectedComponents: ComponentRepresentation[];
  }): boolean {
    // Convert deltaX and deltaY into local grid coords
    const localDX = Math.round(deltaX / unitWidth);
    const localDY = Math.round(deltaY / unitWidth);
  
    // Calculate the displaced positions of selected components
    const displacedComponents = selectorSelectedComponents.map((component) => ({
      ...component,
      x: component.x + localDX,
      y: component.y + localDY,
    }));
  
    // Filter out the selected components from the componentRepresentations
    const nonSelectedComponents = componentRepresentations.filter(
      (component) =>
        !selectorSelectedComponents.find(
          (selectedComponent) => selectedComponent === component
        )
    );
  
    // Check for overlaps
    for (const displacedComponent of displacedComponents) {
      for (const nonSelectedComponent of nonSelectedComponents) {
        if (
          checkOverlap(
            displacedComponent.x,
            displacedComponent.y,
            displacedComponent.w,
            displacedComponent.h,
            nonSelectedComponent.x,
            nonSelectedComponent.y,
            nonSelectedComponent.w,
            nonSelectedComponent.h
          )
        ) {
          return false;
        }
      }
    }
  
    // No overlaps found
    return true;
  }
  
  // Helper function to check for overlap between two rectangles
  export function checkOverlap(
    x1: number,
    y1: number,
    w1: number,
    h1: number,
    x2: number,
    y2: number,
    w2: number,
    h2: number
  ): boolean {
    return (
      x1 < x2 + w2 &&
      x1 + w1 > x2 &&
      y1 < y2 + h2 &&
      y1 + h1 > y2
    );
  }

  export function resizeSelectorToFitSelectedComponents(
    selectedComponents: ComponentRepresentation[]
  ):{
    x: number, 
    y: number, 
    w: number, 
    h: number
  }{
    var top = selectedComponents[0].y;
    var bottom = selectedComponents[0].y + selectedComponents[0].h;
    var left = selectedComponents[0].x;
    var right = selectedComponents[0].x + selectedComponents[0].w;
    for(const selectedComponent of selectedComponents){
      if(selectedComponent.y < top){
        top = selectedComponent.y;
      }
      if(selectedComponent.y + selectedComponent.h > bottom){
        bottom = selectedComponent.y + selectedComponent.h;
      }
      if(selectedComponent.x < left){
        left = selectedComponent.x
      }
      if(selectedComponent.x + selectedComponent.w > right){
        right = selectedComponent.x + selectedComponent.w;
      }
    }
    return {x: left, y: top, w: right - left, h: bottom - top}
  }