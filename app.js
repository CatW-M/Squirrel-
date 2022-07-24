const canvas = document.createElement(`canvas`);
canvas.id = `game`;
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;
// canvas.setAttribute("height", getComputedStyle(canvas)["height"]);
// canvas.setAttribute("width", getComputedStyle(canvas)["width"]);
document.querySelector(`main`).appendChild(canvas);
// let highScore = document.querySelector("#high-score");
// let score = document.querySelector('#score');
// let gameStatus = document.querySelector('#status');
// let restartButton = document.querySelector('#restart');
// let high = highScore.textContent;
let keys = [];
let fps, fpsInterval, startTime, now, then, elapsed;

const corgi = {
  x: 0,
  y: 0,
  width: 66,
  height: 72,
  frameX: 0,
  frameY: 0,
  speed: 11,
  moving: false
};

const corgiSprite = new Image();
corgiSprite.src = "corgi (2).png";
const background = new Image();
background.src = "background.png";
const images = {};
images.squirrel = new Image();
images.squirrel.src = "squirrel.png";
const squirrelActions = [`up`, `right`, `left`, `down`]
const numberOfSquirrels = 8;
const squirrels = [];

class Squirrel {
  constructor() {
    this.width = 32;
    this.height = 32;
    this.frameX = 0;
    this.alive = true;
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.speed = (Math.random() * 1.5) + 3.5;
    this.action = squirrelActions[Math.floor(Math.random() * 4)];
    if (this.action === `up`) {
      this.frameY = 0;
    } else if (this.action === `right`) {
      this.frameY = 1;
    } else if (this.action === `left`) {
      this.frameY = 2;
    } else if (this.action === `down`) {
      this.frameY = 3;
    }
  }
  draw() {
    drawSprite(images.squirrel, this.width * this.frameX, this.height * this.frameY, this.width, this.height, this.x, this.y, this.width, this.height);
    if (this.frameX < 3) this.frameX++;
    else this.frameX = 0;
  }
  update() {
    if (this.action === `right`) {
      if (this.x > (canvas.width + this.width)) { //reset check
        this.x = 0 - this.width;
        this.y = Math.random() * (canvas.height - this.height);
      } else {
        this.x += this.speed; //move animation
      }
    } else if (this.action === `up`) {
      if (this.y < (0 - this.height)) {
        this.y = (canvas.height + this.height);
        this.x = Math.random() * canvas.width;
      } else {
        this.y += this.speed; //move animation
      }
    } else if (this.action === `down`) {
      if (this.y > (canvas.height + this.height)) {
        this.y = (0 - this.height);
        this.x = Math.random() * canvas.width;
      } else {
        this.y += this.speed; //move animation        
      }
    } else if (this.action === `left`) {
      if (this.x < (0 - this.width)) {
        this.x = canvas.width + this.width;
        this.y = Math.random() * canvas.width;
      } else {
        this.x += this.speed; //move animation
      }
    }
  }
}
for (let i = 0; i < numberOfSquirrels; i++) {
  squirrels.push(new Squirrel());
}

function drawSprite(img, sX, sY, sW, sH, dX, dY, dW, dH) {
  ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH)
}

window.addEventListener(`resize`, function () {
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
})

window.addEventListener("keydown", function (e) {
  keys[e.key] = true;
  console.log(keys);
  console.log(e.key);
  // moveCorgi();
  corgi.moving = true;
});

window.addEventListener("keyup", function (e) {
  delete keys[e.key];
  corgi.moving = false;
});

function moveCorgi() {
  if ((keys[`ArrowUp`] || keys[`w`]) && corgi.y > 0) { //38 is up arrow
    corgi.y -= corgi.speed;
    corgi.frameY = 3;
    corgi.moving = true;
  }
  if ((keys[`ArrowDown`] || keys[`s`]) && corgi.y < canvas.height - corgi.height) { //40 is down arrow
    corgi.y += corgi.speed;
    corgi.frameY = 0;
    corgi.moving = true;
  }
  if ((keys[`ArrowLeft`] || keys[`a`]) && corgi.x > 0) { //37 is left arrow
    corgi.x -= corgi.speed;
    corgi.frameY = 1;
    corgi.moving = true;
  }
  if ((keys[`ArrowRight`] || keys[`d`]) && corgi.x < canvas.width - corgi.width) { //37 is left arrow
    corgi.x += corgi.speed;
    corgi.frameY = 2;
    corgi.moving = true;
  }
}

function handleCorgiFrame() {
  if (corgi.frameX < 3 && corgi.moving) {
    corgi.frameX++
  } else { corgi.frameX = 0 }
}

function startAnimating(fps) {
  fpsInterval = 1000 / fps;
  then = Date.now();
  startTime = then;
  animate();
}

function animate() {
  requestAnimationFrame(animate);
  now = Date.now();
  elapsed = now - then;
  if (elapsed > fpsInterval) {
    then = now - (elapsed % fpsInterval);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    drawSprite(corgiSprite, corgi.width * corgi.frameX, corgi.height * corgi.frameY, corgi.width, corgi.height, corgi.x, corgi.y, corgi.width, corgi.height);
    moveCorgi();
    handleCorgiFrame();
    for (let i = 0; i < squirrels.length; i++) {
      squirrels[i].draw();
      squirrels[i].update();
    }
    // To Do detectHit(corgi, squirrels[i]);
    requestAnimationFrame(animate);
  }
}
startAnimating(12);

//====================== COLLISION DETECTION ======================= //
function detectHit(player1, array) {
  for (let i = 0; i < array.length; i++) {
    let hitTest =
      player1.y + player1.height > array[i].y &&
      player1.y < array[i].y + array[i].height &&
      player1.x + player1.width > array[i].x &&
      player1.x < array[i].x + array[i].width;

    if (hitTest) {
      let newScore = Number(score.textContent) + 1; 
      score.textContent = newScore;
      gameStatus.textContent = 'Good Dog! You caught the squirrel!!';
      return renderSquirrels();
    } else {
      return false;
    }
  }
}

// restartButton.addEventListener('click', function() {
//   score.textContent = 0;
// });



// function gameLoop() {
//   // clear the canvas
//   ctx.clearRect(0, 0, canvas.width, canvas.height);
//   // @todo - add score
//   // check to see if squirrel is alive
//   if (squirrel.alive) {
//     // render squirrel
//     squirrel.render();
//     // @todo - check collision (detectHit -> f)
//     let hit = detectHit(corgi, squirrel);
//   }
//   // render corgi
//   corgi.render();
// }


