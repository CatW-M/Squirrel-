const canvas = document.createElement(`canvas`);
canvas.id = `game`;
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;
document.querySelector(`main`).appendChild(canvas);
let gutter = 5;
let corgiImage = new Image();
corgiImage.src = "corgi (2).png";
let keys = [];
let fps, fpsInterval, startTime, now, then, elapsed;

class Corgi {
  constructor() {
    this.x = 75,
    this.y = 75,
    this.width = 66,
    this.height = 72,
    this.frameX = 0,
    this.frameY = 0,
    this.speed = 11,
    this.moving = false
  }
  draw() {
    ctx.drawImage(corgiImage, this.width * this.frameX, this.height * this.frameY, this.width, this.height, this.x, this.y, this.width, this.height)
  }
  move() {
    window.addEventListener("keydown", function (e) {
      keys[e.key] = true;
      
      // moveCorgi();
      this.moving = true;
    });
    
    window.addEventListener("keyup", function (e) {
      delete keys[e.key];
      this.moving = false;
    });
      if (keys[`ArrowUp`] || keys[`w`])  { //38 is up arrow
        this.y -= this.speed;
        this.frameY = 3;
        this.moving = true;
      }
      if (keys[`ArrowDown`] || keys[`s`]) {
        this.y += this.speed;
        this.frameY = 0;
        this.moving = true;
      }
      if (keys[`ArrowLeft`] || keys[`a`]) { //37 is left arrow
        this.x -= this.speed;
        this.frameY = 1;
        this.moving = true;
      }
      if (keys[`ArrowRight`] || keys[`d`]) { //37 is left arrow
        this.x += this.speed;
        this.frameY = 2;
        this.moving = true;
      }
    } 
  


  handleFrame() {
    if (this.frameX < 3 && this.moving) {
      this.frameX++
    } else {this.frameX = 0 }
  }
}

const corgi = new Corgi();


class Boundary {
  static width = 75
  static height = 75
  constructor({position}) {
    this.position = position;
    this.width = 75
    this.height = 75
  }
  draw() {
    ctx.fillStyle = `darkgreen`;
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
  }
}
const map = [
  ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
  ['-', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '-'],
  ['-', ' ', '-', '-', '-', ' ', '-', '-', '-', '-', ' ', '-'],
  ['-', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '-'],
  ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-']
]
const boundaries = [];

map.forEach((row, i) => {
  row.forEach((symbol, j) => {
    switch (symbol) {
      case '-':
        boundaries.push(
          new Boundary({
          position: {
            x: Boundary.width * j,
            y: Boundary.height * i
          }
        })
        )
        break
    }
  })
})


window.addEventListener(`resize`, function () {
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
})
// function detectBoundary(player1, array) {
//   for (let i = 0; i < array.length; i++) {
//     let hitTest =
//       player1.y + player1.height > array[i].y &&
//       player1.y < array[i].y + array[i].height &&
//       player1.x + player1.width > array[i].x &&
//       player1.x < array[i].x + array[i].width;

//     if (hitTest) {
//       let newScore = Number(score.textContent) + 1; 
//       score.textContent = newScore;
//       gameStatus.textContent = 'Good Dog! You caught the squirrel!!';
//       return renderSquirrels();
//     } else {
//       return false;
//     }
//   }
// }

 


  
 
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
    // ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    boundaries.forEach((boundary) => {
        boundary.draw();
    });
      corgi.draw();
      corgi.move();
      corgi.handleFrame();
    //   boundaries.forEach((boundary) => {
    // if (corgi.y < (boundary.position.y + Boundary.height)) {
    //       corgi.y = (boundary.position.y + Boundary.height)
    //     } else if(corgi.x + corgi.width > boundary.position.x) {
    //       corgi.x = boundary.position.x - corgi.width
    //     } else if(corgi.y + corgi.height > boundary.position.y) {
    //       corgi.y = boundary.position.y - corgi.height
    //     } else if(corgi.x < boundary.position.x + Boundary.width) {
    //       corgi.x = Boundary.width;
    //     }
    //   });
    requestAnimationFrame(animate);
  }
}
startAnimating(12);

//====================== COLLISION DETECTION ======================= //
// function detectBoundary(player1, array) {
//   for (let i = 0; i < array.length; i++) {
//     for (map[i] === `-`) {
//       let touchTest =
//       player1.y + player1.height > array[i].y &&
//       player1.y < array[i].y + array[i].height &&
//       player1.x + player1.width > array[i].x &&
//       player1.x < array[i].x + array[i].width;

//     if (touchTest) {
//       player1.speed = 0
//     }
//   }
// }
// }

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


// class Squirrel {
  //   constructor() {
  //     this.width = 32;
  //     this.height = 32;
  //     this.frameX = 0;
  //     this.alive = true;
  //     this.x = Math.random() * canvas.width;
  //     this.y = Math.random() * canvas.height;
  //     this.speed = (Math.random() * 1.5) + 3.5;
  //     this.action = squirrelActions[Math.floor(Math.random() * 4)];
  //     if (this.action === `up`) {
  //       this.frameY = 0;
  //     } else if (this.action === `right`) {
  //       this.frameY = 1;
  //     } else if (this.action === `left`) {
  //       this.frameY = 2;
  //     } else if (this.action === `down`) {
  //       this.frameY = 3;
  //     }
  //   }
  //   draw() {
  //     drawSprite(images.squirrel, this.width * this.frameX, this.height * this.frameY, this.width, this.height, this.x, this.y, this.width, this.height);
  //     if (this.frameX < 3) this.frameX++;
  //     else this.frameX = 0;
  //   }
  //   update() {
  //     if (this.action === `right`) {
  //       if (this.x > (canvas.width + this.width)) { //reset check
  //         this.x = 0 - this.width;
  //         this.y = Math.random() * (canvas.height - this.height);
  //       } else {
  //         this.x += this.speed; //move animation
  //       }
  //     } else if (this.action === `up`) {
  //       if (this.y < (0 - this.height)) {
  //         this.y = (canvas.height + this.height);
  //         this.x = Math.random() * canvas.width;
  //       } else {
  //         this.y += this.speed; //move animation
  //       }
  //     } else if (this.action === `down`) {
  //       if (this.y > (canvas.height + this.height)) {
  //         this.y = (0 - this.height);
  //         this.x = Math.random() * canvas.width;
  //       } else {
  //         this.y += this.speed; //move animation        
  //       }
  //     } else if (this.action === `left`) {
  //       if (this.x < (0 - this.width)) {
  //         this.x = canvas.width + this.width;
  //         this.y = Math.random() * canvas.width;
  //       } else {
  //         this.x += this.speed; //move animation
  //       }
  //     }
  //   }
  // }
  // for (let i = 0; i < numberOfSquirrels; i++) {
  //   squirrels.push(new Squirrel());
  // }
  // const background = new Image();
// background.src = "background.png";

// const images = {};
// images.squirrel = new Image();
// images.squirrel.src = "squirrel.png";
// const squirrelActions = [`up`, `right`, `left`, `down`]
// const numberOfSquirrels = 8;
// const squirrels = [];
// drawSprite(corgiSprite, this.width * this.frameX, this.height * this.frameY, this.width, this.height, this.x, this.y, this.width, this.height);
// function drawSprite(img, sX, sY, sW, sH, dX, dY, dW, dH) {
//   ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH)
// }
// const grid_y = Math.round(corgi.y / Boundary.height);
//     const grid_x = Math.round(corgi.x / Boundary.width);

//       if ((keys[`ArrowUp`] || keys[`w`]) && map[grid_y][grid_x] !== `-`) { //38 is up arrow
//         this.y -= this.speed;
//         this.frameY = 3;
//         this.moving = true;
//       }
//       if ((keys[`ArrowDown`] || keys[`s`]) && map[Math.floor(corgi.y / Boundary.height) + 1][grid_x] !== `-`) { //40 is down arrow
//         this.y += this.speed;
//         this.frameY = 0;
//         this.moving = true;
//       }
//       console.log(` => ` + corgi.y % Boundary.height);
//       if ((keys[`ArrowLeft`] || keys[`a`]) && ((
//           corgi.y % Boundary.height < 33 &&
//           map[Math.ceil(corgi.y / Boundary.height)][Math.floor(corgi.x / Boundary.width) - 1] !== `-`
//         ) || (
//           corgi.y % Boundary.height >= 33 &&
//           map[Math.floor(corgi.y / Boundary.height)][Math.ceil(corgi.x / Boundary.width) - 1] !== `-`
//         ))
//       ) { //37 is left arrow
//         this.x -= this.speed;
//         this.frameY = 1;
//         this.moving = true;
//       }
//       if ((keys[`ArrowRight`] || keys[`d`]) && map[Math.ceil(corgi.y / Boundary.height)][Math.floor(corgi.x / Boundary.width) + 1] !== `-`) { //37 is left arrow
//         this.x += this.speed;
//         this.frameY = 2;
//         this.moving = true;
//       }
//     } 