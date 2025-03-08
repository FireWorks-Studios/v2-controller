export class UserInteraction {
  static identifyPressFromPointerEvents(
    pointerEvents: React.PointerEvent<HTMLDivElement>,
    buttonBoundingRect: DOMRect,
  ): [boolean, {x: number, y: number, knobX: number, knobY: number}[]] {
    const width = buttonBoundingRect.width;
    const height = buttonBoundingRect.height;

    if (pointerEvents.pointerType === "mouse") {
      const mouseX = pointerEvents.clientX;
      const mouseY = pointerEvents.clientY;

      const isPressed = (
        mouseX >= buttonBoundingRect.left &&
        mouseX <= buttonBoundingRect.right &&
        mouseY >= buttonBoundingRect.top &&
        mouseY <= buttonBoundingRect.bottom &&
        pointerEvents.pressure !== 0
      );

      if (isPressed) {
        const capturedPointer = [{
          x: ((mouseX - buttonBoundingRect.left) - width / 2) / (width / 2),
          y: (-(mouseY - buttonBoundingRect.top) + height / 2) / (height / 2),
          knobX: (mouseX - buttonBoundingRect.left),
          knobY: (mouseY - buttonBoundingRect.top)
        }];
        return [true, capturedPointer];
      }
    }

    return [false, [
      {
        x: 0,
        y: 0,
        knobX: width/2,
        knobY: height/2
      }
    ]];
  }

  static identifyPressFromTouchEvents(
    touchEvents: React.TouchEvent<HTMLDivElement>,
    buttonBoundingRect: DOMRect,
  ): [boolean, {x: number, y: number, knobX: number, knobY: number}[]] {
    const width = buttonBoundingRect.width;
    const height = buttonBoundingRect.height;
    if (touchEvents.touches.length === 0) {
      return [false, [
        {
          x: 0,
          y: 0,
          knobX: width/2,
          knobY: height/2
        }
      ]];
    } else {
      const touches = Array.from(touchEvents.touches); // Convert TouchList to an array
      const capturedTouches = touches.filter((touch) => {
        const touchX = touch.clientX;
        const touchY = touch.clientY;
        return (
          touchX >= buttonBoundingRect.left &&
          touchX <= buttonBoundingRect.right &&
          touchY >= buttonBoundingRect.top &&
          touchY <= buttonBoundingRect.bottom
        );
      }).map(touch => ({
        x: ((touch.clientX - buttonBoundingRect.left) - width / 2) / (width / 2),
        y: (-(touch.clientY - buttonBoundingRect.top) + height / 2) / (height / 2),
        knobX: (touch.clientX - buttonBoundingRect.left),
        knobY: (touch.clientY - buttonBoundingRect.top)
      }));
      if(capturedTouches.length > 0){
        return [true, capturedTouches];
      }else{
        return [false, [
          {
            x: 0,
            y: 0,
            knobX: width/2,
            knobY: height/2
          }
        ]];
      }
      
    }
  }
}