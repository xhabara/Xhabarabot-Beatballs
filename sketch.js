let sound1, sound2, sound3, sound4, sound5;
let dots = [];
let isLooping = false;
let loopButton;
let resetButton;

function preload() {
  soundFormats('mp3', 'wav');
  sound1 = loadSound('RullyShabaraSampleR03.wav', "RullyShabaraSampleR01.wav");
  sound2 = loadSound('RullyShabaraSampleR03.wav');
  sound3 = loadSound('RullyShabaraSampleR03.wav');
  sound4 = loadSound('RullyShabaraSampleR03.wav', "RullyShabaraSampleR20.wav");
  sound5 = loadSound('RullyShabaraSampleR03.wav', "RullyShabaraSampleR01.wav");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
 dots.push(new Dot(width/4, height/2, sound1));
  dots.push(new Dot(width/3, height/2, sound2));
  dots.push(new Dot(width/2, height/2, sound3));
  dots.push(new Dot(2*width/3, height/2, sound4));
  dots.push(new Dot(3*width/4, height/2, sound5));
  
 


  
  // Create loop button
  loopButton = createButton("START");
  loopButton.position(10, height-60);
  loopButton.mouseClicked(() => {
    isLooping = !isLooping;
    for (let i = 0; i < dots.length; i++) {
      dots[i].loop(isLooping);
    }
    if (isLooping) {
      loopButton.html("Stop");
    } else {
      loopButton.html("Loop");
    }
  });

  
  // Create tempo buttons
  let tempoIncButton = createButton("+");
  tempoIncButton.position(70, height-60);
  tempoIncButton.mouseClicked(() => {
    for (let i = 0; i < dots.length; i++) {
      dots[i].sound.rate(dots[i].sound.rate() + 0.1);
    }
  });

  let tempoDecButton = createButton("-");
  tempoDecButton.position(100, height-60);
  tempoDecButton.mouseClicked(() => {
    for (let i = 0; i < dots.length; i++) {
      dots[i].sound.rate(dots[i].sound.rate() - 0.1);
    }
  });
}


function draw() {
  background(20);
  

// diagonal grids
  stroke(75);
  for (let i = 0; i < width + height; i += 30) {
    line(i, 0, 0, i);
    line(i, height, width, i);
  }
 
  
  for (let i = 0; i < dots.length; i++) {
    dots[i].update();
    dots[i].display();
  }



}

function mouseClicked() {
  for (let i = 0; i < dots.length; i++) {
    if (dots[i].contains(mouseX, mouseY)) {
      dots[i].play();
    }
  }
}

function mousePressed() {
  for (let i = 0; i < dots.length; i++) {
    if (dots[i].contains(mouseX, mouseY)) {
      dots[i].isDragging = true;
      dots[i].dragOffsetX = mouseX - dots[i].pos.x;
      dots[i].dragOffsetY = mouseY - dots[i].pos.y;
    }
  }
}

function mouseReleased() {
  for (let i = 0; i < dots.length; i++) {
    if (dots[i].isDragging) {
      dots[i].isDragging = false;
      dots[i].stop();
    }
  }
}

function mouseMoved() {
  for (let i = 0; i < dots.length; i++) {
    if (!dots[i].isDragging && dots[i].contains(mouseX, mouseY)) {
      dots[i].play();
    }
  }
}

class Dot {
  constructor(x, y, sound) {
    this.pos = createVector(x, y);
    this.vel = createVector();
    this.acc = createVector();
    this.sound = sound;
    this.sound.setVolume(5);
    this.trail = [];
    this.isDragging = false;
    this.dragOffsetX = 0;
    this.dragOffsetY = 0;
    this.isLooping = false;
    this.isPlaying = false; // add new property
  }

  update() {
    if (this.isDragging) {
      this.pos.x = mouseX - this.dragOffsetX;
      this.pos.y = mouseY - this.dragOffsetY;
    } else {
      this.vel.add(this.acc);
      this.pos.add(this.vel);
      this.acc.mult(0);
    }
    this.trail.push(createVector(this.pos.x, this.pos.y));
    if (this.trail.length > 50) {
      this.trail.splice(0, 1);
    }
  }

  display() {
    noStroke();
    fill(155);
  
    ellipse(this.pos.x, this.pos.y, 50, 50);
    fill(400);
    for (let i = 0; i < this.trail.length; i++) {
      let p = this.trail[i];
      ellipse(p.x, p.y, 10, 10);
    }
  }



  contains(x, y) {
    let d = dist(x, y, this.pos.x, this.pos.y);
    if (d < 20) {
      return true;
    } else {
      return false;
    }
  }

  play() {
    if (!this.isPlaying) { // check if sound is not already playing
      this.isPlaying = true; // set playing state to true
      this.sound.play();
    }
  }

  stop() {
    this.isPlaying = false; // set playing state to false
    this.sound.stop();
  }

  loop(isLooping) {
    this.isLooping = isLooping;
    if (this.isLooping) {
      this.sound.loop();
    } else {
      this.sound.stop();
    }
  }
}


