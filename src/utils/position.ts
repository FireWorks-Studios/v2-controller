import { ComponentRepresentation } from "../components/ControllerContainer/ControllerContainer";

export function findClosestEmptySpot(
{
  actualX, actualY, unitWidth, index, containerWidth, containerHeight, componentRepresentation, componentRepresentations,
} : {
  actualX: number, 
  actualY: number, 
  unitWidth: number,
  index: number, 
  containerWidth: number, 
  containerHeight: number,
  componentRepresentation: ComponentRepresentation
  componentRepresentations: ComponentRepresentation[]
} 
): { x: number, y: number } {
  let minDistance = Number.MAX_VALUE;
  let x = Math.round(actualX/unitWidth);
  let y = Math.round(actualY/unitWidth);
  console.log(x, y, actualX/unitWidth, actualY/unitWidth)
  let closestX = x;
  let closestY = y;
  let isVacant = false;

  // Iterate through all the possible empty spots within the container
  for (let xPos = 0; xPos + componentRepresentation.w -1 < containerWidth; xPos++) {
    for (let yPos = 0; yPos  + componentRepresentation.h -1  < containerHeight; yPos++) {
      isVacant = true;
      console.log("iterated through: " + xPos + " " + yPos)
      // Check if the current spot overlaps with any of the existing components
      for (let i = 0; i < componentRepresentations.length; i++) {
        if (i !== index) {
          const currentComponent = componentRepresentations[i];

          // Calculate the left, right, top, and bottom coordinates of the current component
          const currentLeft = currentComponent.x;
          const currentRight = currentComponent.x + currentComponent.w - 1;
          const currentTop = currentComponent.y;
          const currentBottom = currentComponent.y + currentComponent.h - 1;

          // Check for overlap
          if (
            xPos + componentRepresentation.w -1 >= currentLeft &&
            xPos <= currentRight &&
            yPos + componentRepresentation.h -1 >= currentTop &&
            yPos <= currentBottom
          ) {
            isVacant = false;
            break;
          }
        }
      }

      // If the spot is vacant, calculate the distance between the centers of the dropped component and the current spot
      if (isVacant) {
        console.log(actualX/unitWidth)
        const distance = Math.sqrt(
          Math.pow((actualX/unitWidth) - (xPos), 2) + Math.pow((actualY/unitWidth) - (yPos), 2)
        );
        console.log("vacant spot with distance: " + distance)
        // Update the closest vacant spot if the current spot is closer
        if (distance < minDistance) {
          minDistance = distance;
          closestX = xPos;
          closestY = yPos;
        }
      }
    }
  }
  console.log("found closest spot: " + closestX + " " + closestY + " " + minDistance)
  // Return the closest vacant spot
  return { x: closestX, y: closestY };
}

export function checkValidAppend({x, y, component, componentRepresentations}:{x: number, y: number, component: ComponentRepresentation, componentRepresentations: ComponentRepresentation[]}):boolean {
  const left = x;
  const right = x + component.w - 1;
  const top = y;
  const bottom = y + component.h - 1;
  for (let i = 0; i < componentRepresentations.length; i++) {
    const currentComponent = componentRepresentations[i];

    // Calculate the left, right, top, and bottom coordinates of the current component
    const currentLeft = currentComponent.x;
    const currentRight = currentComponent.x + currentComponent.w - 1;
    const currentTop = currentComponent.y;
    const currentBottom = currentComponent.y + currentComponent.h - 1;

    // Check for overlap
    if (
      left <= currentRight &&
      right >= currentLeft &&
      top <= currentBottom &&
      bottom >= currentTop
    ) {
      // Overlap detected, return false
      return false;
    }
  }

  // No overlap detected, return true
  return true;
}

export function checkValidDropPos({
  x, y, index, componentRepresentations
}: {
  x: number, y: number, index: number, componentRepresentations: ComponentRepresentation[]
}): boolean {
  const droppedComponent = componentRepresentations[index];

// Calculate the left, right, top, and bottom coordinates of the dropped component
  console.log(componentRepresentations[index]);
  const left = x;
  const right = x + droppedComponent.w - 1;
  const top = y;
  const bottom = y + droppedComponent.h - 1;

  // Check if the dropped component overlaps with any other components
  for (let i = 0; i < componentRepresentations.length; i++) {
    if (i !== index) {
      const currentComponent = componentRepresentations[i];

      // Calculate the left, right, top, and bottom coordinates of the current component
      const currentLeft = currentComponent.x;
      const currentRight = currentComponent.x + currentComponent.w - 1;
      const currentTop = currentComponent.y;
      const currentBottom = currentComponent.y + currentComponent.h - 1;

      // Check for overlap
      if (
        left <= currentRight &&
        right >= currentLeft &&
        top <= currentBottom &&
        bottom >= currentTop
      ) {
        // Overlap detected, return false
        return false;
      }
    }
  }

  // Check if dropped component is out of bounds
  if(droppedComponent.container === 'center'){
    if(x < 0 || x + droppedComponent.w > 6 || y + droppedComponent.h > 3){
      return false;
    }
  }else if(droppedComponent.container === 'left'){
    if(x < 0 || y < 0 || y + droppedComponent.h > 6){
      return false;
    }
  }else if(droppedComponent.container === 'right'){
    if(y < 0 || x + droppedComponent.w > 3 || y + droppedComponent.h > 6){
      return false;
    }
  }

  // No overlap detected, return true
  return true;
}

export function checkOutOfBounds({
  x, y, droppedComponent 
}: {
  x: number, y: number, droppedComponent: ComponentRepresentation
}): string{
  const containerWidth = droppedComponent.container === 'center' ? 6 : 3;
  const containerHeight = droppedComponent.container === 'center' ? 3 : 6;
  const left = x;
  const right = x + droppedComponent.w - 1;
  const top = y;
  const bottom = y + droppedComponent.h - 1;
  if(right < containerWidth && left >= 0 && bottom < containerHeight && top >=0){
    return 'inBounds'
  }else{
    if(top < 0 && right < containerWidth && left >= 0){
      return 'topOutOfBounds'
    }else if(bottom < containerHeight && top >=0 && left<0){
      return 'leftOutOfBounds'
    }else if(bottom < containerHeight && top >=0 && right>=containerWidth){
      return 'rightOutOfBounds'
    }else{
      return 'invalidOutOfBounds'
    }
  }
}

export function getControllerContainerDimensions(type: ComponentRepresentation['container']): { w: number, h: number } {
  switch (type) {
    case 'center':
      return { w: 6, h: 3 };
    case 'left':
      return { w: 3, h: 6 };
    case 'right':
      return { w: 3, h: 6 };
    default:
      throw new Error(`Invalid type: ${type}`);
  }
}