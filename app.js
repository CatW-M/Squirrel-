const canvas = document.createElement(`canvas`);
canvas.id = `game`;
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;
document.querySelector(`main`).appendChild(canvas);
const boundaries = [];

const keys = {
  w: {
    pressed: false
  },
  s: {
    pressed: false
  },
  a: {
    pressed: false
  },
  d: {
    pressed: false
  }
}

let lastKey = ``;

const map = [
  ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
  ['-', '.', '.', '.', '.', '.', '.', '.', '.', '.', '-'],
  ['-', '.', '-', '.', '-', '-', '-', '.', '-', '.', '-'],
  ['-', '.', '.', '.', '.', '-', '.', '.', '.', '.', '-'],
  ['-', '.', '-', '-', '.', '.', '.', '-', '-', '.', '-'],
  ['-', '.', '.', '.', '.', '-', '.', '.', '.', '.', '-'],
  ['-', '.', '-', '.', '-', '-', '-', '.', '-', '.', '-'],
  ['-', '.', '.', '.', '.', '-', '.', '.', '.', '.', '-'],
  ['-', '.', '.', '.', '.', '.', '.', '-', '-', '.', '-'],
  ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-']
]

let fps, fpsInterval, startTime, now, then, elapsed;
const pellets = [];
addEventListener(`resize`, function () {
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
})  

class Pellets {
  constructor({position}) {
    this.position = position
    this.radius = 3
  }
  draw() {
    ctx.beginPath()
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
    ctx.fillStyle = '#D27D2D'
    ctx.fill()
    ctx.closePath()
  }
}

class Boundary {
  static width = 80
  static height = 80
  constructor({position, image}) {
    this.position = position;
    this.width = 80
    this.height = 80
    this.image = image
  }
  draw() {
    ctx.drawImage(this.image, this.position.x, this.position.y);
  }
}

map.forEach((row, i) => {
  row.forEach((symbol, j) => {
    switch (symbol) {
      case '-':
        boundaries.push(
          new Boundary({
          position: {
            x: j * Boundary.width,
            y: i * Boundary.height
          },
          image: createImage("bushboundary.png")
        })
        )
        break
      case '.':
            pellets.push(
              new Pellets({
              position: {
                x: j * Boundary.width + Boundary.width / 2,
                y: i * Boundary.height + Boundary.height / 2
              }
            })
            )
            break
    }
  })
})

class Player {
  constructor({position, velocity, image}) {
    this.position = position
    this.velocity = velocity
    this.width = 66,
    this.height = 72,
    this.frameX = 0,
    this.frameY = 0,
    this.moving = false
    this.image = image
  }
  draw() {
    ctx.drawImage(this.image, this.width * this.frameX, this.height * this.frameY, this.width, this.height, this.position.x, this.position.y, this.width, this.height);
  }
  update() {
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y;
    if (this.frameX < 3 && this.moving) {
      this.frameX++
    } else {this.frameX = 0 }   
  } 
}

let corgi = new Player({
  position: {
    x: Boundary.width + 2,
    y: Boundary.height + 2
  },
  velocity: {
    x: 0,
    y: 0
  },
  image: createImage("corgi (2).png")
});


addEventListener("keydown", ({key}) => {
  corgi.moving = true;
  switch (key) {
    case `ArrowUp`:
      keys.w.pressed = true
      lastKey = `w`
      corgi.frameY = 3;
      break
    case `w`:
      keys.w.pressed = true
      lastKey = `w`
      corgi.frameY = 3;
      break
    case `ArrowDown`:
      keys.s.pressed = true
      lastKey = `s`
      corgi.frameY = 0;
      break
    case `s`:
      keys.s.pressed = true
      lastKey = `s`
      corgi.frameY = 0;
      break
    case `ArrowLeft`: 
      keys.a.pressed = true
      lastKey = `a`
      corgi.frameY = 1;
      break
    case `a`: 
      keys.a.pressed = true
      lastKey = `a`
      corgi.frameY = 1;
      break
    case `ArrowRight`:
      keys.d.pressed = true
      lastKey = `d`
      corgi.frameY = 2;
      break
    case `d`:
      keys.d.pressed = true
      lastKey = `d`
      corgi.frameY = 2;
      break
  }
});

addEventListener("keyup", ({key}) => {
  corgi.moving = false;
  switch (key) {
    case `ArrowUp`:
      keys.w.pressed = false
      corgi.frameY = 3;
      break
    case `w`:
      keys.w.pressed = false
      corgi.frameY = 3;
      break
    case `ArrowDown`:
      keys.s.pressed = false
      corgi.frameY = 0;
      break
    case `s`:
      keys.s.pressed = false
      corgi.frameY = 0;
      break
    case `ArrowLeft`: 
      keys.a.pressed = false
      corgi.frameY = 1;
      console.log(`up!!!`)
      break
    case `a`: 
      keys.a.pressed = false
      corgi.frameY = 1;
      break
    case `ArrowRight`:
      keys.d.pressed = false
      corgi.frameY = 2;
      break
    case `d`:
      keys.d.pressed = false
      corgi.frameY = 2;
      break
  }
});

function createImage(src) {
  const image = new Image()
    image.src = src;
    return image
  
}

function startAnimating(fps) {
  fpsInterval = 1000 / fps;
  then = Date.now();
  startTime = then;
  animate();
}
function rectangleCircleColliding({
  circle,
  rectangle}){
  let distX = Math.abs(circle.position.x - rectangle.position.x - rectangle.width/2);
  let distY = Math.abs(circle.position.y - rectangle.position.y - rectangle.height/2);

  if (distX > (rectangle.width / 2 + circle.radius)) { return false; }
  if (distY > (rectangle.height / 2 + circle.radius)) { return false; }

  if (distX <= (rectangle.width / 2)) { return true; } 
  if (distY <= (rectangle.height / 2)) { return true; }

  let dx=distX-rectangle.width / 2;
  let dy=distY-rectangle.height / 2;
  return (dx*dx+dy*dy<=(circle.radius * circle.radius));
}

function rectangleCollidesWithSquare({
  rectangle,
  square
}) {
return (
  rectangle.position.y +rectangle.velocity.y <= 
    square.position.y + square.height && 
  rectangle.position.x + rectangle.width + rectangle.velocity.x >= 
    square.position.x &&
  rectangle.position.y + rectangle.height + rectangle.velocity.y >= 
    square.position.y && 
  rectangle.position.x + rectangle.velocity.x <= 
    square.position.x + square.width
    )
}

function animate() {
  requestAnimationFrame(animate);
  now = Date.now();
  elapsed = now - then;
  if (elapsed > fpsInterval) {
    then = now - (elapsed % fpsInterval);
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if(keys.w.pressed && lastKey === `w`) {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (rectangleCollidesWithSquare({
        rectangle: {
          ...corgi, velocity: {
            x: 0,
            y: -5
          }
        },
        square: boundary
      })
      ) {
        corgi.velocity.y = 0
        break
      } else {
        corgi.velocity.y = -5
      }
    }
  } else if(keys.a.pressed && lastKey === `a`) {

    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]
      if (rectangleCollidesWithSquare({
        rectangle: {
          ...corgi, velocity: {
            x: -5,
            y: 0
          }
        },
        square: boundary
      })
      ) {
        corgi.velocity.x = 0
        break
      } else {
        corgi.velocity.x = -5
      }
    }
  } else if (keys.s.pressed && lastKey === `s`) {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]
      if (
        rectangleCollidesWithSquare({
        rectangle: {
          ...corgi, velocity: {
            x: 0,
            y: 5
          }
        },
        square: boundary
        })
      ) {
        corgi.velocity.y = 0
        break
      } else {
        corgi.velocity.y = 5
      }
    }
  } else if (keys.d.pressed && lastKey === `d`) {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]
      if (rectangleCollidesWithSquare({
        rectangle: {
          ...corgi, velocity: {
            x: 5,
            y: 0
          }
        },
        square: boundary
      })
      ) {
        corgi.velocity.x = 0
        break
      } else {
        corgi.velocity.x = 5
      }
    }
  } else {
    corgi.velocity.y = 0;
    corgi.velocity.x = 0;
  }
  for (let i = pellets.length - 1; 0 < i; i--) {
      const pellet = pellets[i]
      pellet.draw();
      if (rectangleCircleColliding({
        circle: pellet,
        rectangle: corgi
      })
      ) {
        pellets.splice(i, 1)
      }
  }
  
   
  

  boundaries.forEach((boundary) => {
    boundary.draw();
    if (
      rectangleCollidesWithSquare({
        rectangle: corgi,
        square: boundary
      })
    ) {
      corgi.velocity.y = 0
      corgi.velocity.x = 0
    }
  })

  corgi.update();
}

startAnimating(7);


// render initial state
   
    
      
    //   boundaries.forEach((boundary) => {

    //       corgi.y = (boundary.position.y + Boundary.height)
    //     } else if(corgi.x + corgi.width > boundary.position.x) {
    //       corgi.x = boundary.position.x - corgi.width
    //     } else if(corgi.y + corgi.height > boundary.position.y) {
    //       corgi.y = boundary.position.y - corgi.height
    //     } else if(corgi.x < boundary.position.x + Boundary.width) {
    //       corgi.x = Boundary.width;
    //     }
    //   });
    // 
  
// }
// startAnimating(12);

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