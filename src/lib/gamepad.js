/**
** Hacky gamepad interface
**
** let gamepad = new Gamepad();
** ^ this will query navigator.getGamepads() and start internal update loop
**
** query for buttons with
** pagepad.getBtnPressed('btnlabel')
** -> true | false
**
** query dpad with
** gamepad.getDpad()
** -> 'up' | 'down' | 'left' | 'right'
** ^ this will not be able to detect 'up and right' or similar
** but it's ok for my use case
**
**/

export default class Gamepad {
  constructor() {
    this.index = 0;
    this.pressed = [];
    this.pad = false;
    this.buttonMap = [
      'A',
      'B',
      'X',
      'Y',
      'l',
      'r',
      'select',
      'start'
    ];

    let self = this;
    window.addEventListener("gamepadconnected", function(e) {
      self.index = e.gamepad.index;
      self.pad = navigator.getGamepads()[self.index];
      console.log("pad connected");
      self.update();
    });
  }

  get getPad() {
    return this.pad;
  }

  update() {
    const gamepads = navigator.getGamepads();
    if (gamepads) {
      this.pad = gamepads[0];
      for (var b = 0; b < this.pad.buttons.length; b++) {
        let indexInMap = this.pressed.indexOf(this.buttonMap[b]);
        if (this.pad.buttons[b].pressed) {
          if (indexInMap === -1) {
            this.pressed.push(this.buttonMap[b]);
            //console.log(this.pressed);
          }
        } else {
          if (indexInMap !== -1) {
            this.pressed.splice(indexInMap, 1);
          }
        }
      }
    } else {
      console.log('no pads found');
    }
    //requestAnimationFrame(this.update.bind(this));
  }

  getDpad() {
    if (this.pad.axes[0] === 1) {
      return 'right';
    } else if (this.pad.axes[0] === -1) {
      return 'left';
    }
    if (this.pad.axes[1] === 1) {
      return 'down';
    } else if (this.pad.axes[1] === -1) {
      return 'up';
    }
    return false;
  }

  getBtnPressed(btnLabel) {
    this.update();
    return this.pressed.indexOf(btnLabel) !== -1;
  }
}
