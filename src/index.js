import JukeGen from 'jukegen';
import Gamepad  from './lib/gamepad';
import Shader from './lib/shader';
import './sass/main.scss';

const colorMaps = ['red', 'blue', 'green', 'yellow'];
const typeMaps = ['dots', 'x', 'y', 'cross'];


class Party {
  constructor() {
    this.jukebox = new JukeGen();
    this.pad = new Gamepad();
    this.shader = new Shader();
    this.musicMode = true;

    window.jj = this.jukebox;
    window.sh = this.shader;
  }

  party() {
    this.jukebox.start();
    this.update();
  }

  update() {
    this.shader.setFft(this.jukebox.getFft);

    if (this.pad.getPad) {

      if (this.musicMode) {

        if (this.pad.getBtnPressed('l')) {
          this.jukebox.setVolume(this.jukebox.getVolume - 1);
        } else if (this.pad.getBtnPressed('r')) {
          this.jukebox.setVolume(this.jukebox.getVolume + 1);
        }

        if (this.pad.getBtnPressed('X')) {
          this.jukebox.setDistortion(this.jukebox.getDistortion + 0.1);
        } else if (this.pad.getBtnPressed('Y')) {
          this.jukebox.setDistortion(this.jukebox.getDistortion - 0.1);
        }

        if (this.pad.getBtnPressed('A')) {
          this.jukebox.setChorus(this.jukebox.getChorus + 0.1);
        } else if (this.pad.getBtnPressed('B')) {
          this.jukebox.setChorus(this.jukebox.getChorus - 0.1);
        }

        if (this.pad.getDpad() === 'up') {
          this.jukebox.setBpm(this.jukebox.getBpm + 10);
        } else if (this.pad.getDpad() === 'down') {
          this.jukebox.setBpm(this.jukebox.getBpm - 10);
        }

        if (this.pad.getDpad() === 'right') {
          this.jukebox.setTension(this.jukebox.getTension + 1);
        } else if (this.pad.getDpad() === 'left') {
          this.jukebox.setTension(this.jukebox.getTensoinn - 1);
        }

      } else {
        if (this.pad.getBtnPressed('A')) {
          this.shader.setRgb(colorMaps.indexOf('red'));
        } else if (this.pad.getBtnPressed('B')) {
          this.shader.setRgb(colorMaps.indexOf('yellow'));
        } else if (this.pad.getBtnPressed('X')) {
          this.shader.setRgb(colorMaps.indexOf('blue'));
        } else if (this.pad.getBtnPressed('Y')) {
          this.shader.setRgb(colorMaps.indexOf('green'));
        }

        if (this.pad.getBtnPressed('l')) {
          this.shader.setNoiseDetail(this.shader.getNoiseDetail - 10);
        } else if (this.pad.getBtnPressed('r')) {
          this.shader.setNoiseDetail(this.shader.getNoiseDetail + 10);
        }

        if (this.pad.getDpad() === 'up') {
          this.shader.setType(typeMaps.indexOf('dots'));
        } else if (this.pad.getDpad() === 'right') {
          this.shader.setType(typeMaps.indexOf('x'));
        } else if (this.pad.getDpad() === 'down') {
          this.shader.setType(typeMaps.indexOf('y'));
        } else if (this.pad.getDpad() === 'left') {
          this.shader.setType(typeMaps.indexOf('cross'));
        }
      }
    }

    requestAnimationFrame(this.update.bind(this));
  }
}

const party = new Party();
party.party();
