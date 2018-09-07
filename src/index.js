import JukeGen from 'jukegen';
import Gamepad  from './lib/gamepad';
import Shader from './lib/shader';

//const jg = new JukeGen();
//jg.start();

const gamep = new Gamepad();

const shader = new Shader();

function draw(dt) {
  //console.log(jg.getFft);


  if (gamep.getPad && gamep.getDpad() !== false) console.log(gamep.getDpad())
  if (gamep.getPad && gamep.getBtnPressed('A')) console.log('A')
  if (gamep.getPad && gamep.getBtnPressed('B')) console.log('B')
  if (gamep.getPad && gamep.getBtnPressed('X')) console.log('X')
  if (gamep.getPad && gamep.getBtnPressed('Y')) console.log('Y')

  requestAnimationFrame(draw);
}

draw();
