import React, { useEffect } from "react";

const GamepadMapping: React.FC = () => {
  useEffect(() => {
    let controllerIndex: number | null = null;
    window.addEventListener("gamepadconnected", (event: GamepadEvent) => {
      handleConnectDisconnect(event, true);
    });
    window.addEventListener("gamepaddisconnected", (event: GamepadEvent) => {
      handleConnectDisconnect(event, false);
    });
    function handleConnectDisconnect(event: GamepadEvent, connected: boolean) {
      const controllerAreaNotConnected = document.getElementById(
        "controller-not-connected-area"
      ) as HTMLElement;
      const controllerAreaConnected = document.getElementById(
        "controller-connected-area"
      ) as HTMLElement;
      const gamepad = event.gamepad;
      console.log(gamepad);
      if (connected) {
        controllerIndex = gamepad.index;
        controllerAreaNotConnected.style.display = "none";
        controllerAreaConnected.style.display = "block";
        createButtonLayout(gamepad.buttons);
        createAxesLayout(gamepad.axes);
      } else {
        controllerIndex = null;
        controllerAreaNotConnected.style.display = "block";
        controllerAreaConnected.style.display = "none";
      }
    }
    function createAxesLayout(axes: readonly number[]) {
      const buttonArea = document.getElementById("buttons") as HTMLElement;
      for (let i = 0; i < axes.length; i++) {
        buttonArea.innerHTML += `<div id=axis-${i} class='axis'>
                                   <div class='axis-name'>AXIS ${i}</div>
                                   <div class='axis-value'>${axes[i].toFixed(
                                     4
                                   )}</div>
                                </div> `;
      }
    }
    function createButtonLayout(buttons: readonly GamepadButton[]) {
      const buttonArea = document.getElementById("buttons") as HTMLElement;
      buttonArea.innerHTML = "";
      for (let i = 0; i <= buttons.length; i++) {
        buttonArea.innerHTML += createButtonHtml(i, 0);
      }
    }
    function createButtonHtml(index: number, value: number) {
      return `<div class="gamepadButton" id="button-${index}">
    <svg width="10px" height="50px">
        <rect width="10px" height="50px" fill="grey"></rect>
        <rect
            class="button-meter"
            width="10px"
            x="0"
            y="50"
            data-original-y-position="50"
            height="50px"
            fill="#ffab19"
        ></rect>
    </svg>
    <div class='button-text-area'>
        <div class="button-name">B${index}</div>
        <div class="button-value">${value.toFixed(2)}</div>
    </div>
</div>`;
    }
    function updateButtonOnGrid(index: number, value: number) {
      const buttonArea = document.getElementById(
        `button-${index}`
      ) as HTMLElement;
      const buttonValue = buttonArea.querySelector(
        ".button-value"
      ) as HTMLElement;
      buttonValue.innerHTML = value.toFixed(2);
      const buttonMeter = buttonArea.querySelector(
        ".button-meter"
      ) as HTMLElement;
      const meterHeight = Number(buttonMeter.dataset.originalYPosition);
      const meterPosition = meterHeight - (meterHeight / 100) * (value * 100);
      buttonMeter.setAttribute("y", meterPosition.toString());
    }
    function updateControllerButton(index: number, value: number) {
      const button = document.getElementById(`controller-b${index}`);
      const selectedButtonClass = "selected-button";
      if (button) {
        if (value > 0) {
          button.classList.add(selectedButtonClass);
          button.style.filter = `contrast(${value * 200}%)`;
        } else {
          button.classList.remove(selectedButtonClass);
          button.style.filter = `contrast(100%)`;
        }
      }
    }
    function handleButtons(buttons: readonly GamepadButton[]) {
      for (let i = 0; i < buttons.length; i++) {
        const buttonValue = buttons[i].value;
        updateButtonOnGrid(i, buttonValue);
        updateControllerButton(i, buttonValue);
      }
    }
    function handelSticks(axes: readonly number[]) {
      updateAxesGrid(axes);
      updateStick("controller-b10", axes[0], axes[1]);
      updateStick("controller-b11", axes[2], axes[3]);
    }
    function updateAxesGrid(axes: readonly number[]) {
      for (let i = 0; i < axes.length; i++) {
        const axis = document.querySelector(
          `#axis-${i} .axis-value`
        ) as HTMLElement;
        const value = axes[i];
        // if (value > 0.06 || value < -0.06) {
        axis.innerHTML = value.toFixed(4);
        // }
      }
    }

    function updateStick(
      elementId: string,
      leftRightAxis: number,
      upDownAxis: number
    ): void {
      const multiplier: number = 25;
      const stickLR: number = leftRightAxis * multiplier;
      const stickUD: number = upDownAxis * multiplier;
      const stick = document.getElementById(elementId);
      if (stick != null) {
        const x: number = Number(stick.dataset.originalXPosition);
        const y: number = Number(stick.dataset.originalYPosition);
        stick.setAttribute("cx", String(x + stickLR));
        stick.setAttribute("cy", String(y + stickUD));
      }
    }

    function gameLoop(): void {
      if (controllerIndex != null) {
        const gamepad = navigator.getGamepads()[controllerIndex];
        if (gamepad != null) {
          if(gamepad.buttons)
          handleButtons(gamepad.buttons);
        if(gamepad.axes)
          handelSticks(gamepad.axes);
        }
      }
      requestAnimationFrame(gameLoop);
    }

    gameLoop();
  }, []); // The empty dependency array ensures that the effect runs only once, after initial rendering

  return null; // Since this is not a visual component, returning null is sufficient
};

export default GamepadMapping;
