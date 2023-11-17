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
        var x = 0;
        var y = 0;
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
    return {x, y, w, h}
    }) 
}