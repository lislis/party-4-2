import JukeGen from 'jukegen';
import Gamepad  from './lib/gamepad';
import Shader from './lib/shader';
import './sass/main.scss';

class Party {
  constructor() {
    this.jukebox = new JukeGen();
    //jg.start();
    this.pad = new Gamepad();
    this.shader = new Shader();
  }

  party() {
    //this.jukebox.start();
    this.update();
  }

  update() {
    //console.log(jg.getFft);

    if (this.pad.getPad && this.pad.getDpad() !== false) console.log(this.pad.getDpad())
    if (this.pad.getPad && this.pad.getBtnPressed('A')) console.log('A')
    if (this.pad.getPad && this.pad.getBtnPressed('B')) console.log('B')
    if (this.pad.getPad && this.pad.getBtnPressed('X')) console.log('X')
    if (this.pad.getPad && this.pad.getBtnPressed('Y')) console.log('Y')


    requestAnimationFrame(this.update.bind(this));
  }
}

const party = new Party();
party.party();
