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
    if(deltaX > 0 && deltaY > 0){
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
        // Check if the component is entirely within the specified area
        if (componentX >= x && componentY >= y && componentX + componentW <= x + w && componentY + componentH <= y + h) {
            ComponentsSelected.push(component);
        }
    }

    return ComponentsSelected;
}