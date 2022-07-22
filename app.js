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
let keys = {}; //tutorial

const corgi = { //from tutorial lines 18-
  x: 0,
  y: 0,
  width: 66,
  height: 72,
  frameX: 0,
  frameY: 0,
  speed:11,
  moving: false
};

const corgiSprite = new Image();
corgiSprite.src = "corgi (2).png";
const background = new Image();
background.src = "background.png";

function drawSprite(img, sX, sY, sW, sH, dX, dY, dW, dH) {
  ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH)
}


window.addEventListener("keydown", function(e) {
  keys[e.key] = true;
  // console.log(keys);
  console.log(e.key);
  moveCorgi();
  corgi.moving = true;

});
window.addEventListener("keyup", function(e) {
  delete keys[e.key];
  corgi.moving = false;
  
  
});

function moveCorgi() {
  if (keys[`ArrowUp`] && corgi.y > 0) { //38 is up arrow
    corgi.y -= corgi.speed;
    corgi.frameY = 3;
  }
  if (keys[`ArrowDown`] && corgi.y < canvas.height - corgi.height) { //40 is down arrow
    corgi.y += corgi.speed;
    corgi.frameY = 0;
  }
  if (keys[`ArrowLeft`] && corgi.x > 0) { //37 is left arrow
    corgi.x -= corgi.speed;
    corgi.frameY = 1;
  }
  if (keys[`ArrowRight`] && corgi.x < canvas.width - corgi.width) { //37 is left arrow
    corgi.x += corgi.speed;
    corgi.frameY = 2;
  }
}

function handleCorgiFrame() {
  if (corgi.frameX < 3 && corgi.moving) {
    corgi.frameX++
  }else{ corgi.frameX = 0}
}
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  drawSprite(corgiSprite, corgi.width * corgi.frameX, corgi.height * corgi.frameY, corgi.width, corgi.height, corgi.x, corgi.y, corgi.width, corgi.height);
  
  handleCorgiFrame();
  requestAnimationFrame(animate);
}
animate();





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