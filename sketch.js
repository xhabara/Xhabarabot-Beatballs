let sound1, sound2, sound3, sound4, sound5;
let dots = [];
let isLooping = false;
let loopButton;
let resetButton;
let autonomousButton;
let isAutonomousOn = false;

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

  autonomousButton = createButton("XHABARABOT TAKEOVER");
  autonomousButton.position(140, height-60);
  autonomousButton.mouseClicked(() => {
    isAutonomousOn = !isAutonomousOn;
    if (isAutonomousOn) {
      autonomousButton.html("STOP XHABARABOT MODE");
      for (let i = 0; i < dots.length; i++) {
        dots[i].setRandomVelocity();
      }
    } else {
      autonomousButton.html("XHABARABOT TAKEOVER");
      for (let i = 0; i < dots.length; i++) {
        dots[i].stop();
      }
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
 for (let i = 0; i < dots.length; i++) {
    dots[i].setRandomVelocity();
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

 for (let i = 0; i < dots.length; i++) {
    dots[i].checkForChange();
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

 for (let i = 0; i < dots.length; i++) {
    dots[i].checkForChange();
    dots[i].update();
    dots[i].display();
  }

class Dot {
  constructor(x, y, sound) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(random(2, 5));
    this.acc = createVector(); 
    this.sound = sound;
    this.sound.setVolume(5);
    this.isDragging = false;
    this.dragOffsetX = 0;
    this.dragOffsetY = 0;
    this.isLooping = false;
    this.isPlaying = false;
    this.shouldChange = true;
    this.history = []; 
  }

  update() {
    
    this.history.push(this.pos.copy());

   
    if (this.history.length > 100) {
      this.history.shift();
    }

    if (isAutonomousOn) {
      if (this.shouldChange) {
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.mult(0);
        if (this.pos.x < 0 || this.pos.x > width || this.pos.y < 0 || this.pos.y > height) {
          this.pos = createVector(random(width), random(height));
          this.vel = p5.Vector.random2D().mult(random(2, 5));
          this.loop();
        }
      }
    } else if (this.isDragging) {
      this.pos.x = mouseX - this.dragOffsetX;
      this.pos.y = mouseY - this.dragOffsetY;
    }

    this.display();
  }

  display() {
  // Draw trail
  stroke(155);
  strokeWeight(4); 
  noFill();
  beginShape();
  for (let i = 0; i < this.history.length; i++) {
    let pos = this.history[i];
    curveVertex(pos.x, pos.y); // curveVertex for smoother lines
  }
  endShape();

  // Draw Dot
  noStroke();
  fill(155);
  ellipse(this.pos.x, this.pos.y, 50, 50);
}


  contains(x, y) {
    let d = dist(x, y, this.pos.x, this.pos.y);
    return d < 20;
  }

  play() {
    if (!this.isPlaying) {
      this.isPlaying = true;
      this.sound.play();
    }
  }

  stop() {
    this.isPlaying = false;
    this.sound.stop();
  }

  loop() {
    if (this.isLooping) {
      this.sound.stop(); 
    }
    this.isLooping = true;
    this.sound.loop();
  }

  checkForChange() {
    
    this.shouldChange = random(100) < 5;
  }

  setRandomVelocity() {
    this.vel = p5.Vector.random2D().mult(random(2, 5));
  }
}
