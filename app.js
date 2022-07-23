// Create the canvas
const canvas = document.createElement(`canvas`);
canvas.id = `game`;
const ctx = canvas.getContext("2d");
canvas.setAttribute("height", getComputedStyle(canvas)["height"]);
canvas.setAttribute("width", getComputedStyle(canvas)["width"]);
document.querySelector(`main`).appendChild(canvas);

// let highScore = document.querySelector("#high-score");
// let score = document.querySelector('#score');
// let gameStatus = document.querySelector('#status');
// let restartButton = document.querySelector('#restart');
// let high = highScore.textContent;
let keys = []; //tutorial

const corgi = { //from tutorial lines 18-
  x: 0,
  y: 0,
  width: 66,
  height: 72,
  frameX: 0,
  frameY: 0,
  speed: 11,
  moving: false
};

// const squirrel = {
//   x: 0,
//   y: 0,
//   width: 32,
//   height: 32,
//   frameX: 0,
//   frameY: 1,
//   speed: 6,
//   moving: false
// }
//Need more squirrels, created class called Character to generate multiple randomized squirrels


const corgiSprite = new Image();
corgiSprite.src = "corgi (2).png";
const background = new Image();
background.src = "background.png";
const images = {};
images.squirrel = new Image();
images.squirrel.src = "squirrel.png";
const squirrelActions = [`up`, `right`, `left`, `down`]
const numberOfSquirrels = 10;
const squirrels = [];


class Squirrel {
  constructor() {
    this.width = 32;
    this.height = 32;
    this.frameX = 0;
    this.x = 0;
    this.y = 0;
    this.speed = (Math.random() * 1.5) + 3.5;
    this.action = squirrelActions[Math.floor(Math.random() * squirrelActions.length)];
    if (this.action === `up`) {
      this.frameY = 0;
    } else if(this.action === `right`) {
      this.frameY = 1;
    }
  }
  draw() {
    drawSprite(images.squirrel, this.width * this.frameX, this.height * this.frameY, this.width, this.height, this.x, this.y, this.width, this.height);
   
    if (this.frameX < 3) this.frameX++;
    else this.frameX = 0;
  }
  update() {
    if (this.action === `right`) {
      if (this.x < (canvas.width + this.width)) { //reset check
        this.x = 0 - this.width;
        this.y = Math.random() * (canvas.height - this.height);
      } else {
        this.x += this.speed; //move animation
      } 
    }
    if (this.action === `up`) {
        if (this.y < (0 - this.height)) {
          this.y = canvas.height + this.height;
          this.x = Math.random() * canvas.height;
        } else {
          this.y -= this.speed;
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

window.addEventListener(`resize`, function(){
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
})

window.addEventListener("keydown", function(e) {
  keys[e.key] = true;
  console.log(keys);
  console.log(e.key);
  // moveCorgi();
  corgi.moving = true;

});
window.addEventListener("keyup", function(e) {
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
  } else {corgi.frameX = 0}
}

// function handleSquirrelFrame() {
//   if (squirrel.frameX < 3) { 
//     squirrel.frameX++
//   } else {squirrel.frameX = 0}
// }
// function squirrelMovements() {
//   if (squirrel.x < canvas.width +squirrel.width) {
//     squirrel.x += squirrel.speed;
//   } else {squirrel.x = 0 - squirrel.width}
// }
// function animate() {
//   ctx.clearRect(0, 0, canvas.width, canvas.height);
//   ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
//   drawSprite(corgiSprite, corgi.width * corgi.frameX, corgi.height * corgi.frameY, corgi.width, corgi.height, corgi.x, corgi.y, corgi.width, corgi.height);
  
//   handleCorgiFrame();
//   requestAnimationFrame(animate);
// }
// animate();

let fps, fpsInterval, startTime, now, then, elapsed;

function startAnimating(fps) {
  fpsInterval = 1000/fps;
  then = Date.now();
  startTime = then;
  animate();
}
function animate() {
  requestAnimationFrame(animate);
  now = Date.now();
  elapsed = now - then;
  if (elapsed > fpsInterval){
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
      

      // drawSprite(squirrelSprite, squirrel.width * squirrel.frameX, squirrel.height * squirrel.frameY, squirrel.width, squirrel.height, squirrel.x, squirrel.y, squirrel.width, squirrel.height);
      // handleSquirrelFrame();
      // squirrelMovements();
      requestAnimationFrame(animate);
      

  }
}
startAnimating(12);





// class TempPlayers {
//   constructor(x, y, color, width, height) {
//     this.x = x;
//     this.y = y;
//     this.color = color;
//     this.height = height;
//     this.width = width;
//     this.alive = true;

//     this.render = function () {
//       ctx.fillStyle = this.color; // change the color of the context (ctx)
//       ctx.fillRect(this.x, this.y, this.width, this.height);
//     };
//   }
// }

// window.addEventListener(`DOMContentLoaded`, function(event) {
//   corgi = new TempPlayers(10, 10, `red`, 25, 25);
//   squirrel = new TempPlayers(50, 50, `grey`, 10, 10);
  
//   const runGame = setInterval(gameLoop, 60);
// });
// canvas.addEventListener(`click`, function(e) {
//   ctx.clearRect(0, 0, canvas.width, canvas.height);
//   corgi.x = e.offsetX;
//   corgi.y = e.offsetY;
//   corgi.render();
//   squirrel.x = Math.random() * canvas.width;
//   squirrel.y = Math.random() * canvas.height;
//   squirrel.render();
// });

// document.addEventListener("keydown", movementHandler);

// restartButton.addEventListener('click', function() {
//   score.textContent = 0;
//   addNewSquirrel();
// });

// function movementHandler(e) {
//   console.log("movement", e.key);
//   //confine to visible screen
//   switch (e.key) {
//     case "w":
//       // move corgi up
//       corgi.y - 10 >= 0 ? (corgi.y -= 10) : null;
//       break;
//     case "a":
//       // move the corgi left
//       corgi.x - 10 >= 0 ? (corgi.x -= 10) : null;
//       break;
//     case "d":
//       // move corgi to the right
//       corgi.x + 10 <= canvas.width ? (corgi.x += 10) : null; // ternary operator
//       break;
//     case "s":
//       // move corgi down
//       corgi.y + 10 <= canvas.height ? (corgi.y += 10) : null;
//       break;
//     case "ArrowUp":
//       // move corgi up
//       corgi.y - 10 >= 0 ? (corgi.y -= 10) : null;
//       break;
//     case "ArrowLeft":
//       // move the corgi left
//       corgi.x - 10 >= 0 ? (corgi.x -= 10) : null;
//       break;
//     case "ArrowRight":
//       // move corgi to the right
//       corgi.x + 10 <= canvas.width ? (corgi.x += 10) : null; // ternary operator
//       break;
//     case "ArrowDown":
//       // move corgi down
//       corgi.y + 10 <= canvas.height ? (corgi.y += 10) : null;
//       break;
//   }
// }

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
// function addNewSquirrel() {
//   squirrel.alive = false;
//   setTimeout(function () {
//     let x = Math.floor(Math.random() * canvas.width);
//     let y = Math.floor(Math.random() * canvas.height);
//     squirrel = new TempPlayers(x, y, `grey`, 10, 10);
//     gameStatus.textContent = 'keep playing'
//     if (score.textContent === '0') {
//       gameStatus.textContent = `Squirrel! Chase it out of your yard!`;
//     } else {
//       gameStatus.textContent = 'keep playing';
//     }
    
//   }, 1000);
//   return true;
// }

// function detectHit(corgi, squirrel) {
//   let hitTest =
//     corgi.y + corgi.height > squirrel.y &&
//     corgi.y < squirrel.y + squirrel.height &&
//     corgi.x + corgi.width > squirrel.x &&
//     corgi.x < squirrel.x + squirrel.width; // {boolean} : if all are true -> hit

//   if (hitTest) {
//     let newScore = Number(score.textContent) + 1;
//     score.textContent = newScore;
//     gameStatus.textContent = 'Good Dog! You caught the squirrel';
//     if (newScore > Number(highScore.textContent)) {
//       highScore.textContent = newScore;
//     }
//     return addNewSquirrel();
//   } else {
//     return false;
//   }
// }