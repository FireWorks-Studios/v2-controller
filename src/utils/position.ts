import { ComponentRepresentation } from "../components/ControllerContainer/ControllerContainer";

export function findClosestEmptySpot(
{
  x, y, index, containerWidth, containerHeight, componentRepresentations
} : {
  x: number, 
  y: number, 
  index: number, 
  containerWidth: number, 
  containerHeight: number,
  componentRepresentations: ComponentRepresentation[]
} 
): { x: number, y: number } {
  let minDistance = Number.MAX_VALUE;
  let closestX = x;
  let closestY = y;

  // Iterate through all the possible empty spots within the container
  for (let xPos = 0; xPos <= containerWidth; xPos++) {
    for (let yPos = 0; yPos <= containerHeight; yPos++) {
      let isVacant = true;

      // Check if the current spot overlaps with any of the existing components
      for (let i = 0; i < componentRepresentations.length; i++) {
        if (i !== index) {
          const currentComponent = componentRepresentations[i];

          // Calculate the left, right, top, and bottom coordinates of the current component
          const currentLeft = currentComponent.x - currentComponent.w / 2;
          const currentRight = currentComponent.x + currentComponent.w / 2;
          const currentTop = currentComponent.y - currentComponent.h / 2;
          const currentBottom = currentComponent.y + currentComponent.h / 2;

          // Check for overlap
          if (
            xPos > currentLeft &&
            xPos < currentRight &&
            yPos > currentTop &&
            yPos < currentBottom
          ) {
            isVacant = false;
            break;
          }
        }
      }

      // If the spot is vacant, calculate the distance between the centers of the dropped component and the current spot
      if (isVacant) {
        const distance = Math.sqrt(
          Math.pow(x - xPos, 2) + Math.pow(y - yPos, 2)
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
  const left = x - droppedComponent.w / 2;
  const right = x + droppedComponent.w / 2;
  const top = y - droppedComponent.h / 2;
  const bottom = y + droppedComponent.h / 2;

  // Check if the dropped component overlaps with any other components
  for (let i = 0; i < componentRepresentations.length; i++) {
    if (i !== index) {
      const currentComponent = componentRepresentations[i];

      // Calculate the left, right, top, and bottom coordinates of the current component
      const currentLeft = currentComponent.x - currentComponent.w / 2;
      const currentRight = currentComponent.x + currentComponent.w / 2;
      const currentTop = currentComponent.y - currentComponent.h / 2;
      const currentBottom = currentComponent.y + currentComponent.h / 2;

      // Check for overlap
      if (
        left < currentRight &&
        right > currentLeft &&
        top < currentBottom &&
        bottom > currentTop
      ) {
        // Overlap detected, return false
        return false;
      }
    }
  }

  // No overlap detected, return true
  return true;
}