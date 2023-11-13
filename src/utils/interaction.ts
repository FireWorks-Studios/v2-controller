export class UserInteraction {
  static identifyPressFromPointerEvents(
    pointerEvents: React.PointerEvent<HTMLDivElement>,
    buttonBoundingRect: DOMRect,
  ): boolean {
      if (pointerEvents.pointerType === "mouse") {
        const mouseX = pointerEvents.clientX;
        const mouseY = pointerEvents.clientY;
        
        return (
          mouseX >= buttonBoundingRect.left &&
          mouseX <= buttonBoundingRect.right &&
          mouseY >= buttonBoundingRect.top &&
          mouseY <= buttonBoundingRect.bottom &&
          pointerEvents.pressure !== 0
        )
      }

      return false
  }
  
  static identifyPressFromTouchEvents(
    touchEvents: React.TouchEvent<HTMLDivElement>,
    buttonBoundingRect: DOMRect,
  ): boolean {
    if (touchEvents.touches.length === 0){
      return false
    } else {
      const touches = Array.from(touchEvents.touches); // Convert TouchList to an array
      return touches.some((touch) => {
        const touchX = touch.clientX;
        const touchY = touch.clientY;
        
        return (
          touchX >= buttonBoundingRect.left &&
          touchX <= buttonBoundingRect.right &&
          touchY >= buttonBoundingRect.top &&
          touchY <= buttonBoundingRect.bottom
        )
      })
    }
  }
} 