import JukeGen from 'jukegen';
//import Gamepad from './gamepad';


//const jg = new JukeGen();
//jg.start();

//const pad = new Gamepad(window, navigator);
let gp, raf;

let pressed = [];
var button = {
  0: 'red',
  1: 'yellow',
  2: 'blue',
  3: 'green',
  4: 'l1',
  5: 'r1',
  6: 'select',
  7: 'start'
}

function getDpad(pad) {
  if (pad.axes[0] === 1) {
    return 'right';
  } else if (pad.axes[0] === -1) {
    return 'left';
  }
  if (pad.axes[1] === 1) {
    return 'down';
  } else if (pad.axes[1] === -1) {
    return 'up';
  }
  return false;
}

function btnPressed(label, pressed) {
  return (pressed.indexOf(label) !== -1);
}

window.addEventListener("gamepadconnected", function(e) {
  gp = navigator.getGamepads()[e.gamepad.index];
  console.log("Gamepad connected at index " + gp.index + ": " + gp.id + ". It has " + gp.buttons.length + " buttons and " + gp.axes.length + " axes.");
  updateGamepad();
});


function updateGamepad() {
  var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
  if (!gamepads)
    return;
  gp = gamepads[0];

  for (var b = 0; b < gp.buttons.length; b++) {
    if (gp.buttons[b].pressed) {
      if (pressed.indexOf(button[b]) === -1) {
        pressed.push(button[b]);
        console.log('Pressed ', button[b], pressed);
      }
    } else {
      if (pressed.indexOf(button[b]) !== -1) {
        pressed.splice(pressed.indexOf(button[b], 1));
      }
    }
  }

  raf = requestAnimationFrame(updateGamepad);
};




function draw() {
  //console.log(jg.getFft);


  if (gp) console.log(getDpad(gp))

  //console.log(pad.gamepad);
  requestAnimationFrame(draw);
}

draw();
