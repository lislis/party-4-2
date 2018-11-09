import JukeGen from 'jukegen';
import Gamepad  from './lib/gamepad';
import Shader from './lib/shader';
import './sass/main.scss';

const colorMaps = ['red', 'blue', 'green', 'yellow'];
const typeMaps = ['dots', 'x', 'y', 'cross'];

export default class Party42 {
  constructor() {
    this.jukebox = new JukeGen();
    this.pad = new Gamepad();
    this.shader = new Shader();
    this.musicMode = true;

    let docBody = document.getElementsByTagName('body')[0];
    let title = document.createElement('h1');
    title.classList.add('title');
    title.innerHTML = 'Party:4:2';
    docBody.appendChild(title);

    let mode = document.createElement('p');
    mode.classList.add('mode');
    mode.innerHTML = 'musicMode';
    docBody.appendChild(mode);

    let lastAction = document.createElement('p');
    lastAction.classList.add('action');
    lastAction.innerHTML = '';
    docBody.appendChild(lastAction);
  }

  party() {
    this.jukebox.start();
    this.update();
  }

  update(dt) {
    this.shader.setFft(this.jukebox.getFft);
    //this.shader.render(dt);

    if (this.pad.getPad) {

      if (this.pad.getBtnPressed('select')) {
        this.musicMode = true;
        document.querySelector('.mode').innerHTML = 'musicMode';
      }
      if (this.pad.getBtnPressed('start')) {
        this.musicMode = false;
        document.querySelector('.mode').innerHTML = 'visualsMode';
      }

      if (this.musicMode) {
        if (this.pad.getBtnPressed('l')) {
          this.jukebox.setVolume(this.jukebox.getVolume - 1);
          document.querySelector('.action').innerHTML = '<span class="item">&ultri;</span>'
        } else if (this.pad.getBtnPressed('r')) {
          this.jukebox.setVolume(this.jukebox.getVolume + 1);
          document.querySelector('.action').innerHTML = '<span class="item">&urtri;</span>'
        }

        if (this.pad.getBtnPressed('X')) {
          this.jukebox.setDistortion(this.jukebox.getDistortion + 0.1);
          document.querySelector('.action').innerHTML = '<span class="btn blue item">&ocir;</span>';
        } else if (this.pad.getBtnPressed('Y')) {
          this.jukebox.setDistortion(this.jukebox.getDistortion - 0.1);
          document.querySelector('.action').innerHTML = '<span class="btn green item">&ocir;</span>';
        }

        if (this.pad.getBtnPressed('A')) {
          this.jukebox.setChorus(this.jukebox.getChorus + 0.1);
          document.querySelector('.action').innerHTML = '<span class="btn red item">&ocir;</span>';
        } else if (this.pad.getBtnPressed('B')) {
          this.jukebox.setChorus(this.jukebox.getChorus - 0.1);
          document.querySelector('.action').innerHTML = '<span class="btn yellow item">&ocir;</span>';
        }

        if (this.pad.getDpad() === 'up') {
          this.jukebox.setBpm(this.jukebox.getBpm + 10);
          document.querySelector('.action').innerHTML = '<span class="item">&utri;</span>';
        } else if (this.pad.getDpad() === 'down') {
          this.jukebox.setBpm(this.jukebox.getBpm - 10);
          document.querySelector('.action').innerHTML = '<span class="item">&dtri;</span>';
        }

        if (this.pad.getDpad() === 'right') {
          this.jukebox.setTension(this.jukebox.getTension + 1);
          document.querySelector('.action').innerHTML = '<span class="item">&rtri;</span>';
        } else if (this.pad.getDpad() === 'left') {
          this.jukebox.setTension(this.jukebox.getTensoinn - 1);
          document.querySelector('.action').innerHTML = '<span class="item">&ltri;</span>';
        }

      } else {
        if (this.pad.getBtnPressed('A')) {
          this.shader.setRgb(colorMaps.indexOf('red'));
          document.querySelector('.action').innerHTML = '<span class="btn red item">&ocir;</span>';
        } else if (this.pad.getBtnPressed('B')) {
          this.shader.setRgb(colorMaps.indexOf('yellow'));
          document.querySelector('.action').innerHTML = '<span class="btn yellow item">&ocir;</span>';
        } else if (this.pad.getBtnPressed('X')) {
          this.shader.setRgb(colorMaps.indexOf('blue'));
          document.querySelector('.action').innerHTML = '<span class="btn blue item">&ocir;</span>';
        } else if (this.pad.getBtnPressed('Y')) {
          this.shader.setRgb(colorMaps.indexOf('green'));
          document.querySelector('.action').innerHTML = '<span class="btn green item">&ocir;</span>';
        }

        if (this.pad.getBtnPressed('l')) {
          this.shader.setNoiseDetail(this.shader.getNoiseDetail - 10);
          document.querySelector('.action').innerHTML = '<span class="item">&ultri;</span>';
        } else if (this.pad.getBtnPressed('r')) {
          this.shader.setNoiseDetail(this.shader.getNoiseDetail + 10);
          document.querySelector('.action').innerHTML = '<span class="item">&urtri;</span>';
        }

        if (this.pad.getDpad() === 'up') {
          this.shader.setType(typeMaps.indexOf('dots'));
          document.querySelector('.action').innerHTML = '<span class="item">&utri;</span>';
        } else if (this.pad.getDpad() === 'right') {
          this.shader.setType(typeMaps.indexOf('x'));
          document.querySelector('.action').innerHTML = '<span class="item">&rtri;</span>';
        } else if (this.pad.getDpad() === 'down') {
          this.shader.setType(typeMaps.indexOf('y'));
          document.querySelector('.action').innerHTML = '<span class="item">&dtri;</span>';
        } else if (this.pad.getDpad() === 'left') {
          this.shader.setType(typeMaps.indexOf('cross'));
          document.querySelector('.action').innerHTML = '<span class="item">&ltri;</span>';
        }
      }
    }
    //this.log();
    requestAnimationFrame(this.update.bind(this));
  }

  log() {
    console.log('shader: '+ this.shader.type, 'rgb: '+ this.shader.rgb,
                'noise: ' + this.shader.getNoiseDetail,
                'distortion: ' + this.jukebox.getDistortion,
                'chorus: '+ this.jukebox.getChorus,
                'bpm: '+ this.jukebox.getBpm, 'vol: '+ this.jukebox.getVolume,
                'tension'+ this.jukebox.getTension);
  }
}

document.addEventListener("DOMContentLoaded", function(event) {
  let btn = document.createElement('button');
  btn.innerHTML = "Ready!";
  btn.classList.add('start-btn');
  btn.type = 'button';
  btn.addEventListener('click', ev => {
    ev.target.remove();
    let party = new Party42();
    party.party();
  });
  document.getElementsByTagName('body')[0].appendChild(btn);

});
