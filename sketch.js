/*

The Game Project

Week 1 - part b

Use p5 drawing functions such as rect, ellipse, line, triangle and point to draw the scenery as set out in the comments below. The items should appear next to the text titles.

Each bit of scenery is worth two marks:

0 marks = not a reasonable attempt
1 mark = attempted but it's messy or lacks detail
2 marks = You've used lots of shape functions to create the scenery

I've given titles and chosen some base colours, but feel free to imaginatively modify these and interpret the scenery titles loosely to match your game theme.


*/

var scrollPos;
var e;
var tounge, police;
var mount, tree, cloud;
var realPos;
let numClouds = 15;
let clouds = [];
var baby;

var isLeft = false;
var isRight = false;
var isJumping = false;
var isFalling = false;
var right_direction = false;

var charSpeed = 0;
var charAccel = 0;
var dx = 0;
var dy = 0;
var charHorSped = 0;
var charHorAccel = 0;

var score;
var scorer = "";
var sc;
var isWon;
var lives;
var isLost;

var floor_PosY = 525;
var rNum1 = [];
var rNum2 = [];
var r = 0;
var start;
var jump = 0;
var stretch = 0;
var inc = 0;
var enemies;
var w1;
var w2;
var platforms;
var isOnPlatform = false;
var isStand = false;

function preload() {
  baby = loadImage("sprite_babay.png");
  tounge = loadImage("tounge.png");
  sun_smiley = loadImage("sun.png");
  police = loadImage("police_chap.png");
}
//
function setup() {
  createCanvas(innerWidth - 20, innerHeight - 20);
  realPos = 0;
  scrollPos = 0;
  lives = 3;
  isWon = false;
  isLost = false;
  score = 0;
  w1 = 0;
  w2 = 0;
  scorer = "";
  sc = [];

  startGame();
  tounge_objs = [{
    x: 100,
    y: floor_PosY - 200,
    isFound: false,
    int_x: 0,
    int_y: 0
  }]
  for (var i = 0; i < 20; i++) {
    var o = {
      x: random(500, 8000),
      y: random(100, 400),
      isFound: false,
      int_x: 0,
      int_y: 0
    };
    tounge_objs.push(o);
  }
  for (var i = 0; i < tounge_objs.length; i++) {
    sc[i] = " -";
  }


}
//
function draw() {
  //drawBackground(); //fill the sky pink
  background(344, 57, 91);
  noStroke();
  //// smileys ////
  for (var i = 0; i < 20; i++) {
    push();
    translate(sun_smiles[i].x, sun_smiles[i].y);
    smiles(sun_smiles[i].s);
    pop();
  }
  drawFloor();
  // a sun in the sky
  //... add your code here
  push();
  translate(scrollPos * 0.05, 0);
  sun(sun0.x, sun0.y, sun0.s);
  pop();
  //clouds
  push();
  translate(scrollPos * 0.1, 0);
  for (let i = 0; i < numClouds; i++) {
    clouds[i].display();
  }
  pop();

  //2. a mountains in the distance
  push();
  translate(scrollPos * 0.1, 0);
  mountainRange();
  pop();

  push();
  translate(scrollPos * 0.2, 0);
  for (var i = 0; i < mountainS.length; i++) {
    fill(20);
    mountain(mountainS[i].x, mountainS[i].y, mountainS[i].h);
  }
  pop();

  //3. a trees
  push();
  translate(scrollPos * 0.9, 0);
  beginShape();

  vertex(-700, floor_PosY);
  for (var i = 0; i < trees.length; i++) {
    tree(trees[i].x, trees[i].y, trees[i].s);
    stroke(255, 170, 190);
    noFill();
    vertex(trees[i].x + 10*trees[i].s, trees[i].y - 100*trees[i].s);

  }
  endShape();

  pop();

  //4. a house ................................................
  push();
  translate(scrollPos, 0);
  for (var i = 0; i < hous.length; i++) {
    house(hous[i].x, hous[i].y, hous[i].s);
  }
  pop();
  // canyon .................................
  for (var i = 0; i < canyonPos.length; i++) {
    canyon(canyonPos[i].x, canyonPos[i].width);
  }
  //platforms//platforms//platforms//platforms//
  push();
    translate(scrollPos, 0);
    for (var i = 0; i < platforms.length; i++) {
      platforms[i].display();
      platforms[i].checkCharOn();
    }
  pop();

  // character(d);
  push();
  //imageMode(CORNER);

  translate(gameChar.x, gameChar.y);
  rotate(map(sin(realPos / 30), -1, 1, -PI / 8, PI / 8));
  image(baby, 0, 0, 75, 80 , dx, dy, 75, 80);
  // ellipse(0, 20, 20, 20);
  pop();
  //////////////////////////////
  if (isWon) {
    if (w1 < 2) {
      iswontext();
    }
    display_state();
    w1 = 10;
  }
  if (isLost) {
    if (w2 < 2) {
      islosttext();
    }
    display_state();

    w2 = 10;
  }
  // object
  //rotate(rot * 2);
  for (var i = 0; i < tounge_objs.length; i++) {
    push();
    translate(tounge_objs[i].x, tounge_objs[i].y);
    tounge_();
    pop();
  }

  textSize(map(innerWidth, 0, 2000, 20, 40));
  fill(255);
  text(scorer, 30, 50);

  push();
  for (var i = 0; i < lives; i++) {

      text("</3", innerWidth - 300 + 70 * i, 50);

  }
  pop();

  // DRAW enemies
  push();
  translate(scrollPos, 0);
  for (let i = 0; i < enemies.length; i++) {
    enemies[i].display();
    enemies[i].move();
    enemies[i].checkCharCollision();
  }
  pop();


  ////////////////
  charPhysics();
  object_find();
  // if (isLost == false) {
  //   score_totter();
  // }
  checkPlayerDie();
  checkPlayerWon();


  var message = join(sc, "");
  scorer = "[ " + message + " ]";

  gameChar.y += charSpeed;
  charSpeed += charAccel;
  realPos = gameChar.x - scrollPos;
  r += 0.001;
}
//
function startGame() {
  r = 0;
  platforms = [];
  scrollPos = 0;
  enemies = [];
  imageMode(CENTER);

  for (var i = 0; i < 50; i++) {
    rNum1[i] = random(-50, 50);
    rNum2[i] = random(-50, 50); // random number array for clouds.
  }
  for (let i = 0; i < numClouds; i++) {
    clouds[i] = new Cloud(random(2 * innerWidth), random(100, 250), random(0.2, 1)); // create cloud objects //
  }

  mountainS = [{
      x: 2000,
      y: floor_PosY,
      h: 100
    }
  ]
  for (var i = 0; i < 15; i++) {
    var m = {
      x: i*500,//random(0, 4000),
      y: floor_PosY,
      h: random(100, 330)
    };
    mountainS.push(m);
  }
  hous = [{
    x: random(100, 1000),
    y: floor_PosY - 50,
    s: 1
  }]
  for (var i = 0; i < 21; i++) {
    var h = {
      x: i * random(100, 800),
      y: floor_PosY - 50,
      s: random(0.9, 2)
    };
    hous.push(h);
  }
  trees = [];
  for (var i = 0; i < 20; i++) {
    var t = {
      x: i * 600,
      y: floor_PosY,
      s: random(0.8, 2.8)
    };
    trees.push(t);

  }
  sun0 = {
    x: innerWidth / 2,
    y: 180,
    s: 90
  }
  gameChar = {
    x: 600,
    y: floor_PosY - 100
  }

  canyonPos = [{
    x: 1400,
    y: floor_PosY,
    width: 200
  }];
  for (var i = 3; i < 23; i++) {
    var c = {
      x: 400 * i,
      y: floor_PosY,
      width: random(150, 350)
    };
    canyonPos.push(c);
  }

  sun_smiles = [];
  for (var i = 0; i < 20; i++) {
    var s = {
      x: random(3000),
      y: random(420),
      s: random(300)
    };
    sun_smiles.push(s);
  }

  // e = new Enemy(10, 350, 0, 200);
  // e1 = new Enemy(1000, 350, 1000, 1350);

  for (var i = 0; i < 5; i++) {
    var j = i + 1;
    enemies[i] = new Enemy(900 * j, random(200, 350), 900 * j, 900 * j + random(200, 300));
  }

  for (var i = 0; i < 10; i++) {
    platforms[i] = new Platform(1000 * i, random(200, 390), random(100, 300), 30);
  }

}
//////////
function charPhysics() {

  //jumping//jumping//jumping//jumping//jumping//jumping//
  if (keyIsDown(UP_ARROW) && gameChar.y <= 485) {
    charSpeed = -25;
    charAccel += 0.2; //(gravity)
    isJumping = true;

  } else if (gameChar.y >= 485 && isFalling == false) {
      charAccel = 0;
      charSpeed = 0;
      gameChar.y = 485;
      //isJumping = false;
  } else {
      gameChar.y += 20;
      //isJumping = false;
  }

  if (gameChar.y < 50) {
    gameChar.y = 50;
  }
  //walking//walking//walking//walking//walking//walking//
  if (isLeft == true) {
    gameChar.x -= 15;
    scrollPos += 15;
  } else if (isRight == true) {

    gameChar.x += 15;
    scrollPos -= 15;
  } else {
  }
  if(charSpeed < -20) {
    if(isRight) {
      dx = 0;
      dy = 80;
    } else if(isLeft) {
      dx = 75;
      dy = 80;
    } else if(isStand) {
      dx = 78;
      dy = 160;
    }
  } else {
    if(isRight) {
      dx = 0;
      dy = 0;
    } else if(isLeft) {
      dx = 75;
      dy = 0;
    } else if(isStand) {
      dx = 0;
      dy = 160;
    }

  }


  if (gameChar.x >= 900) {
    gameChar.x = 900;
  }
  if (gameChar.x <= 500) {
    gameChar.x = 500;
  }
  ///canyon fall//canyon fall/canyon fallcanyon fallcanyon fall
  for (var i = 0; i < canyonPos.length; i++) {
    if (realPos > canyonPos[i].x && realPos < canyonPos[i].x + canyonPos[i].width ) {
      if (gameChar.y >= 485) {
        isFalling = true;
        if (gameChar.y > innerHeight) {
          isFalling = false;
        }
      }
    }
  }
}
////////////
function object_find() {
  for (var i = 0; i < tounge_objs.length; i++) {
    var d = dist(realPos, gameChar.y, tounge_objs[i].x, tounge_objs[i].y);
    if (d < 40) {
      tounge_objs[i].isFound = true;
      score += 1;
      if (isLost == false) {
        score_totter();
      }
    }
    if (tounge_objs[i].isFound == true) {
      tounge_objs[i].y = -300;

    }
  }
}
///////////
function score_totter() {
  sc[score - 1] = "#";
}
///////////////////////
function mountain(x, y, h) {

  var s = 1;
  push();
  noFill();
  stroke(40);
  // var height = constrain(h, 100 ,y);  //
  // ellipse(x, y - height, 100, 10);
  // ellipse(x, y, 100, 10);
  pop();

  triangle(x, y - s * h, x + 30 * s, y, x - 30 * s, y);

  if (h > 20) {
    var tone = map(h, 20, 350, 200, 20);

    fill(tone / 2.2);
    //mountain(x + 20 * s, y, h - 25);
    fill(tone / 2.2);
    mountain(x - 20 * s, y, h - 25);
    fill(tone / 2.2)
  }
}
////////////////////////
function keyPressed() {
  if (isLost || isWon) {
    if (key == ' ') {
      nextLevel();
    }

    if(keyCode == 82) {
      setup();
    }

  }

  if (keyCode == LEFT_ARROW) {
    isLeft = true;
  } else {
    isStand = true;
  }
  if (keyCode == RIGHT_ARROW) {
    isRight = true;
  }
}
///////////////////////
function keyReleased() {
  if (keyCode == LEFT_ARROW) {
    isLeft = false;
  }
  if (keyCode == RIGHT_ARROW) {
    isRight = false;
  }


}
///////////////////////
function sun(x, y, size) {
  push();
  translate(x, y);
  colorMode(HSB);
  for (var i = 0; i < size; i++) {
    stroke(255 % i, 255, 255, 150);
    noFill();

    ellipse(0, 0, 1.3 * i, i + 8);
  }
  pop();

}
///////////////////////
function house(x, y, s) {
  push();
  fill(255);
  rect(x, y, 100 * s, 50);
  fill(10);
  triangle(x, y, x + 100 * s, y, x + 50 * s, y - 70 * s);
  rect(x + 100 * s / 2, y + 30, 10 * s * 2, 20);
  pop();
}
///////////////////////
function tree(x, y, s) {

  push();
  rectMode(CENTER);
  var scl = s;
  stroke(255, 170, 190);
  fill(174, 198, 207, 14);
  for (var i = 0; i < 100; i += 10 / scl) {
    rect(x + 10 * scl, y - 100 * scl, scl * i, scl * i);
    ellipse(x + 10 * scl, y - 100 * scl, 10, 10);

  }
  triangle(x, y, x + 20 * scl, y, x + 10 * scl, y - 100 * scl);

  pop();
}
//////////////////////
function tounge_() {
  push();
  translate(scrollPos, 0);
  imageMode(CENTER);
  noFill();
  stroke(0, 255, 0);
  strokeWeight(3);
  rotate(scrollPos / 40);
  ellipse(0, 0, 120, sin(100 * r) * 120);
  image(tounge, 0, 0, 60, 80);
  pop();
}
///////////////////////
function mountainRange() {
  for (var x = 0; x < 5 * innerWidth; x += 2) {
    noStroke();

    var peak = map(noise(x / 100), 0, 1, 0, 100);
    fill(255 % peak);

    triangle(x - 10, floor_PosY, x, floor_PosY - peak, x + 10, floor_PosY);


  }
}
///////////////////////
class Cloud {
  constructor(x, y, scale) {
    this.x = x;
    this.y = y;
    this.r = scale;
  }

  display() {
    push();

    stroke(255 % this.x / 2, 255, 255);
    translate(this.x, this.y)
    fill(200);

    for (var i = 50; i >= 0; i--) {
      var size = map(dist(0, 0, rNum1[i], rNum2[i]), -50, 50, 60, 10)
      ellipse(rNum1[i] * this.r, rNum2[i] * this.r, size * this.r, size * this.r);
      rotate(map(this.r, 0.2, 2, 0, TWO_PI));
      rotate(r * this.r);

    }
    pop();

  }
}
///////////////////////
function canyon(x, w) {
  fill(20);
  noStroke();
  push();
  translate(scrollPos, 0);
  rect(x, floor_PosY, w, 500);
  fill(160, 82, 45);
  rect(x - 30, 470, 20, 55);
  fill(255, 255, 0);
  stroke(0);
  strokeWeight(5);
  textSize(20);
  rect(x - 70, 425, 100, 50);
  text("DANGER", x - 63, 443);
  text("C h A s M", x - 63, 463);
  pop();

}
/////////////////////
function smiles(s) {
  push();
  tint(255, 150, 150);
  translate(scrollPos * 0.05, 0);
  rotate(map(gameChar.y, 485, 0, 0.1, 1)*r*s);
  image(sun_smiley, 0, 0, s, s);
  pop();
}
/////////
function drawFloor() {
  push();
  fill(100, 57, 91);
  rect(0, floor_PosY, innerWidth, innerHeight - floor_PosY); //draw some brown ground
  translate(scrollPos, 0);
  for (var i = -2000; i < 8000; i += 100) {
    if (i >= canyonPos.x - 100 && i <= canyonPos.width + 100) {} else {
      for( var j = 0; j < 5; j ++ ) {
        image(baby, i, 580 + 100*j, 75, 80, 0, 80, 75, 80);
      }
    }
  }
  pop();
}
////////////
function checkPlayerDie() {
  if (gameChar.y > innerHeight) {
    playerDied();
  }
}
/////////
function playerDied() {
  lives--;
  if (lives > 0) {
    // Restart game.
    startGame();
  } else {
    // Game over, player lost.
    isLost = true;
  }
}
///////////
function checkPlayerWon() {
  if (score == tounge_objs.length) {
    isWon = true;
  }
}
//////////
function nextLevel() {
  // DO NOT CHANGE THIS FUNCTION!
  console.log('next level');
  //setup();
}
//////////
class Enemy {
  constructor(x, y, x1, y1) {
    this.x_pos = x;
    this.y_pos = y;
    this.speed = 5;
    this.x1 = x1;
    this.x2 = y1;
    this.size = 30;
    this.dx = 0;
  }
  display() {
    // Draw enemy.
    image(police, this.x_pos, this.y_pos, 100, 120, this.dx, 0, 75, 120);

    if (Math.sign(this.speed) > 0) {
      this.dx = 0;
    } else {
      this.dx = 68;
    }
  }
  move() {
    this.x_pos += this.speed;

    if (this.x_pos > this.x2 || this.x_pos < this.x1) {
      this.speed = this.speed * -1;
    }

  }
  checkCharCollision() {
    if (abs(realPos - this.x_pos) <= 14 && abs(gameChar.y - this.y_pos) <= 70) {
      playerDied();
    }
  }

}

function iswontext() {
  sc = ["y", "o", "u", "-", "w", "o", "n", "-", "p", "r", "e", "s", "-", "s", "p", "a", "c", "e", "-"];
}

function islosttext() {
  sc = ["y", "o", "u", "-", "l", "o", "s", "t", "-", "p", "r", "e", "s", "-", "s", "p", "a", "c", "e", "-"];
}

function display_state() {
  //if (sin(frameCount) > 0.5) {
  frameRate(14);
  var popped = sc.pop();
  sc.splice(0, 0, popped);
  //}
}

class Platform {
  constructor(x, y, width, height) {
    this.x_pos = x,
    this.y_pos = y,
    this.width = width,
    this.height = height
  }
  display() {
    // Draw platform.

    stroke(20);
    //rect(this.x_pos, this.y_pos, this.width, this.height);
    for( var i = this.x_pos; i <=  this.x_pos + this.width; i +=30) {

      var step = i;
      var y_p = this.y_pos;
      if(step <= realPos + 15 && step >= realPos - 15 ) {
        if( gameChar.y <= this.y_pos + 20 && gameChar.y >= this.y_pos - 30) {
          y_p += 5;
        }
      }
      fill(255, map(i, this.x_pos, this.x_pos + this.width, 0, 255), 0);
      ellipse(step, y_p + 20  , 30, 30);


    }

  }
  checkCharOn() {
    if (realPos <= this.x_pos + this.width &&
      realPos >= this.x_pos &&
      gameChar.y >= this.y_pos - this.height &&
      gameChar.y <= this.y_pos + this.height) {
      isOnPlatform = true;
      charHorAccel = 0;
      charSpeed = 0;
      gameChar.y = this.y_pos - 20;
    }else {
      isOnPlatform = false;
    }

  }
}
