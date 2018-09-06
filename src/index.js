import JukeGen from 'jukegen';


let jg = new JukeGen();
//jg.start();


function draw() {
  console.log(jg.getFft);
  requestAnimationFrame(draw);
}
