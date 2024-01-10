import { ComponentRepresentation } from "../components/ControllerContainer/ControllerContainer";

export function findClosestEmptySpot(
{
  actualX, actualY, unitWidth, index, containerWidth, containerHeight, componentRepresentations
} : {
  actualX: number, 
  actualY: number, 
  unitWidth: number,
  index: number, 
  containerWidth: number, 
  containerHeight: number,
  componentRepresentations: ComponentRepresentation[]
} 
): { x: number, y: number } {
  let minDistance = Number.MAX_VALUE;
  let x = Math.round(actualX/unitWidth);
  let y = Math.round(actualY/unitWidth);
  console.log(x, y, actualX/unitWidth, actualY/unitWidth)
  let closestX = x;
  let closestY = y;

  // Iterate through all the possible empty spots within the container
  for (let xPos = 0; xPos < containerWidth; xPos++) {
    for (let yPos = 0; yPos < containerHeight; yPos++) {
      let isVacant = true;

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
            xPos >= currentLeft &&
            xPos <= currentRight &&
            yPos >= currentTop &&
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

        // Update the closest vacant spot if the current spot is closer
        if (distance < minDistance) {
          minDistance = distance;
          closestX = xPos;
          closestY = yPos;
        }
      }
    }
  }

  // Return the closest vacant spot
  return { x: closestX, y: closestY };
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

  // No overlap detected, return true
  return true;
}

export function checkOutOfBounds({
  x, y, containerWidth, containerHeight, 
}: {
  x: number, y: number, containerWidth: number, containerHeight: number
}): string{
  if(x < containerWidth && x >= 0 && y < containerHeight && y >=0){
    return 'inBounds'
  }else{
    if(y < 0 && x < containerWidth && x >= 0){
      return 'topOutOfBounds'
    }else if(y < containerHeight && y >=0 && x<0){
      return 'leftOutOfBounds'
    }else if(y < containerHeight && y >=0 && x>=containerWidth){
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
      return { w: 3, h: 7 };
    case 'right':
      return { w: 3, h: 7 };
    default:
      throw new Error(`Invalid type: ${type}`);
  }
}