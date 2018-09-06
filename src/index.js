import JukeGen from 'jukegen';
//import Gamepad from './gamepad';
/*
import { Keyboard, Gamepad, or, and } from 'contro';

const keyboard = new Keyboard();
const gamepad = new Gamepad();

const controls = {
  red: or(gamepad.button(0).trigger, keyboard.key('k')),
  yellow: or(gamepad.button(1).trigger, keyboard.key('m')),
  blue: or(gamepad.button(2).trigger, keyboard.key('i')),
  green: or(gamepad.button(3).trigger, keyboard.key('j')),
  left: or(gamepad.button(4).trigger, keyboard.key('t')),
  right: or(gamepad.button(5).trigger, keyboard.key('y')),
  select: or(gamepad.button(6).trigger, keyboard.key('g')),
  start: or(gamepad.button(7).trigger, keyboard.key('h'))
}
*/


//const jg = new JukeGen();
//jg.start();

//const pad = new Gamepad(window, navigator);
let gp, raf;

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

window.addEventListener("gamepadconnected", function(e) {
  gp = navigator.getGamepads()[e.gamepad.index];
  console.log("Gamepad connected at index " + gp.index + ": " + gp.id + ". It has " + gp.buttons.length + " buttons and " + gp.axes.length + " axes.");
  gameLoop();
});

let pressed = [];


function gameLoop() {
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

  if (gp.axes[0] > 0.5) {
    console.log('right');
  } else if (gp.axes[0] < -0.5) {
    console.log('left');
  }

  if (gp.axes[1] > 0.5) {
    console.log('down');
  } else if (gp.axes[1] < -0.5) {
    console.log('up');
  }

  raf = requestAnimationFrame(gameLoop);
};




function draw() {
  //console.log(jg.getFft);

  //console.log(gamepad);
  /*
  if (controls.red.query()) console.log('red pressed')
  if (controls.yellow.query()) console.log('yellow pressed')
  if (controls.blue.query()) console.log('blue pressed')
  if (controls.green.query()) console.log('green pressed')
  if (controls.left.query()) console.log('left pressed')
  if (controls.right.query()) console.log('right pressed')
  if (controls.start.query()) console.log('start pressed')
  if (controls.select.query()) console.log('select pressed')
  */

  //console.log(pad.gamepad);
  requestAnimationFrame(draw);
}

//draw();
