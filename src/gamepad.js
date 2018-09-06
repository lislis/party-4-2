export class Gamepad {
  constructor(win, nav) {
    this.window = win;
    this.navigator = nav;

    this.window.addEventListener("gamepadconnected", ({gamepad}) => {
      this.gamepadIndex = gamepad.index;

    });

    this.window.addEventListener('gamepaddisconnected', ({ gamepad }) => {
      if (this.gamepadIndex === gamepad.index) {
        this.gamepadIndex = undefined
      }
    });
  }

  get gamepad() {
    return this.navigator.getGamepads()[this.gamepadIndex];
  }

}
