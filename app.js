//prepare canvas
const canvas = document.getElementById(`game`);
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;

//game elements
const scoreDisplay = document.getElementById(`score`)
let score = 0;
const winner = document.getElementById(`win`);
let main = document.getElementById('main');
let splash = document.getElementById(`splash-screen`);
let startBtn = document.getElementById(`start`);
let menu = document.getElementById(`menu`);
const music = document.querySelector("#music");
const audio = document.querySelector("audio");
const pause = document.querySelector("#pause");
const restart = document.querySelector(`#reset`);

//game images
let scaredImage = new Image();
scaredImage.src = "mediafiles/scared.png"

//game arrays
const boundaries = [];
const fences = [];
const powerSquirrel = [];
const map = [
  ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-','-', '-', '-', '-', '-', '-', '-', '-', '-'],
  ['-', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', 'p', '-'],
  ['-', '.', '-', '.', '-', '-', '-', '-', '.', '.', '-', '-', '-', '-', '.', '-', '.', '.', '-'],
  ['-', '.', '.', '.', '-', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '-', '.', '.', '-'],
  ['-', '.', '.', '-', '-', '.', '.', '-', 'f', 'f', '-', '.', '.', '.', '-', '-', '.', '.', '-'],
  ['-', '.', '.', '.', '.', '.', '.', '-', ' ', ' ', '-', '.', '-', '.', '.', '.', '.', '.', '-'],
  ['-', '.', '-', '-', '-', '-', '.', '-', '-', '-', '-', '.', '-', '-', '-', '-', '.', '.', '-'],
  ['-', '.', '.', '-', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '-', '.', '.', '-'],
  ['-', 'p', '.', '.', '.', '-', '-', '-', '-', '-', '-', '-', '-', '-', '.', '.', '.', 'p', '-'],
  ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-','-', '-', '-', '-', '-', '-', '-', '-', '-']
];
const pellets = [];


//game objects
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


//animation timing variables
let fps, fpsInterval, startTime, now, then, elapsed;
let animationId;
let gameActive = false;


//js Classes
class Pellets {
  constructor({ position }) {
    this.position = position;
    this.radius = 5;
  }
  draw() {
    ctx.beginPath()
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
    ctx.fillStyle = '#D27D2D'
    ctx.fill()
    ctx.closePath()
  }
}
class PowerSquirrel {
  static width = 32;
  static height = 32;
  constructor({ position, image }) {
    this.position = position;
    this.frameX = 0;
    this.frameY = 0;
    this.width = 32;
    this.height = 32;
    this.image = image;
    this.moving = true;
  }
  draw() {
    ctx.drawImage(this.image, this.width * this.frameX, this.height * this.frameY, this.width, this.height, this.position.x, this.position.y, this.width, this.height);
  }
  update() {
    this.draw()
    if (this.frameX < 7 && this.moving) {
      this.frameX++
    }
  }
}
class Boundary {
  static width = 75;
  static height = 75;
  constructor({ position, image }) {
    this.position = position;
    this.width = 75;
    this.height = 75;
    this.image = image;
  }
  draw() {
    ctx.drawImage(this.image, this.position.x, this.position.y);
  }
}
class Fence {
  constructor({ position, image }) {
    this.position = position;
    this.width = 75;
    this.height = 75;
    this.image = image;
  }
  draw() {
    ctx.drawImage(this.image, this.position.x, this.position.y);
  }
}
class Player {
  constructor({ position, velocity, image }) {
    this.position = position;
    this.velocity = velocity;
    this.width = 66;
    this.height = 72;
    this.frameX = 0;
    this.frameY = 0;
    this.moving = false;
    this.image = image;
  }
  draw() {
    ctx.drawImage(this.image, this.width * this.frameX, this.height * this.frameY, this.width, this.height, this.position.x, this.position.y, this.width, this.height);
  }
  update() {
    this.draw()
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if (this.frameX < 3 && this.moving) {
      this.frameX++;
    } else { this.frameX = 0 }
  }
}
class Villain {
  static speed = 3;
  constructor({ position, velocity, image }) {
    this.position = position;
      this.velocity = velocity;
      this.width = 72;
      this.height = 72;
      this.frameX = 0;
      this.frameY = 0;
      this.moving = false;
      this.image = image;
      this.prevCollisions = [];
      this.speed = 3;
      this.scared = false;
  }
  draw() {
    if (this.scared) {
      ctx.drawImage(scaredImage, this.width * this.frameX, this.height * this.frameY, this.width, this.height, this.position.x, this.position.y, this.width, this.height);
    }
    else { ctx.drawImage(this.image, this.width * this.frameX, this.height * this.frameY, this.width, this.height, this.position.x, this.position.y, this.width, this.height); }
  }
  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if (this.frameX < 3 && this.moving) {
      this.frameX++;
    } else { this.frameX = 0; }
  }
}

//instances of Class objects
let corgi = new Player({
  position: {
    x: Boundary.width + 2,
    y: Boundary.height + 2
  },
  velocity: {
    x: 0,
    y: 0
  },
  image: createImage("mediafiles/corgi.png")
});

const villains = [
  new Villain({
    position: {
      x: Boundary.width * 8 + 2,
      y: Boundary.height * 5 + 2
    },
    velocity: {
      x: 0,
      y: -Villain.speed
    },
    image: createImage("mediafiles/villain.png")
  }),
  new Villain({
    position: {
      x: Boundary.width * 8 + 2,
      y: Boundary.height * 5 + 2
    },
    velocity: {
      x: 0,
      y: -Villain.speed
    },
    image: createImage("mediafiles/villain.png")
  }),
  new Villain({
    position: {
      x: Boundary.width * 9 + 2,
      y: Boundary.height * 5 + 2
    },
    velocity: {
      x: 0,
      y: -Villain.speed
    },
    image: createImage("mediafiles/villain.png")
  }),
  new Villain({
    position: {
      x: Boundary.width * 9 + 2,
      y: Boundary.height * 5 + 2
    },
    velocity: {
      x: 0,
      y: -Villain.speed
    },
    image: createImage("mediafiles/villain.png")
  })
]

const regenerate = () => {
  return new Villain(
  {
    position: {
      x: Boundary.width * 8 + 2,
      y: Boundary.height * 5 + 2
    },
    velocity: {
      x: 0,
      y: -Villain.speed
    },
    image: createImage("mediafiles/villain.png")
  });
};

//helper functions
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
        image: createImage("mediafiles/bushboundary.png")
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
      case 'f':
        fences.push(
          new Fence({
          position: {
            x: j * Boundary.width,
            y: i * Boundary.height
          },
          image: createImage(`mediafiles/whitefencexaxis.png`)
          })
        )
        break
      case 'p':
      powerSquirrel.push(
        new PowerSquirrel({
        position: {
          x: j * Boundary.width + Boundary.width / 2,
          y: i * Boundary.height + Boundary.height / 2
        },
        image: createImage("mediafiles/squirrel.png")
        })
      )
      break
     
    }
  })
})


function createImage(src) {
  const image = new Image();
  image.src = src;
  return image;
}

function startAnimating(fps) {
  fpsInterval = 1000 / fps;
  then = Date.now();
  startTime = then;
  animate();
}

function rectangleCircleColliding({
  circle,
  rectangle }) {
  let distX = Math.abs(circle.position.x - rectangle.position.x - rectangle.width / 2);
  let distY = Math.abs(circle.position.y - rectangle.position.y - rectangle.height / 2);

  if (distX > (rectangle.width / 2 + circle.radius)) { return false; }
  if (distY > (rectangle.height / 2 + circle.radius)) { return false; }

  if (distX <= (rectangle.width / 2)) { return true; }
  if (distY <= (rectangle.height / 2)) { return true; }

  let dx = distX - rectangle.width / 2;
  let dy = distY - rectangle.height / 2;
  return (dx * dx + dy * dy <= (circle.radius * circle.radius));
}

function rectangleCollidesWithSquare({ rectangle, square }) {
  const padding = 0;
  return (
    (rectangle.position.y + rectangle.velocity.y) <= (square.position.y + square.height + padding) &&
    (rectangle.position.y + rectangle.height + rectangle.velocity.y) >= (square.position.y - padding) &&
    (rectangle.position.x + rectangle.width + rectangle.velocity.x) >= (square.position.x - padding) &&
    (rectangle.position.x + rectangle.velocity.x) <= (square.position.x + square.width + padding)
  );
}
function resizeCanvasToDisplaySize(canvas) {
  const displayWidth = canvas.clientWidth;
  const displayHeight = canvas.clientHeight;

  const NeedResize = canvas.width !== displayWidth || canvas.height !== displayHeight;
  if (NeedResize) {
    canvas.width = displayWidth;
    canvas.height = displayHeight;
  }
}



//gameloop


function animate() {
  //variable to store current frame for pause/restart
  animationId = requestAnimationFrame(animate);
  now = Date.now();
  elapsed = now - then;

  if (elapsed > fpsInterval) {
    then = now - (elapsed % fpsInterval);
  }
  //clear canvas for each frame
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  //resize canvas if needed
  resizeCanvasToDisplaySize(canvas)
  
  // corgi movements within boundaries
 
  if (keys.w.pressed && lastKey === `w`) {
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
  } else if (keys.a.pressed && lastKey === `a`) {

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
 
  for (let i = villains.length - 1; 0 <= i; i--) {
    const villain = villains[i];
    // if (villain.position.x < -10 ||
    //   villain.position.y > canvas.height + 10 ||
    //   villain.position.x > canvas.width + 10 ||
    //   villain.position.y < -10) {
    //   villains.splice(i, 1);
    //   setTimeout(() => {
    //     villains.push(regenerate())
    //   }, 3000);
    
    // }


    if (rectangleCollidesWithSquare({
      rectangle: {
        ...corgi,
        velocity: {
          x: corgi.velocity.x,
          y: corgi.velocity.y
        }
      },
      square: villain
    })
      //handling collisions in scared state vs normal mode
    ) if (villain.scared) {
      villains.splice(i, 1);

      setTimeout(() => {
        villains.push(regenerate())
      }, 8000)
      //set interval and create new instance of villain/push into villains array
    } else {
        cancelAnimationFrame(animationId)
        alert("The stranger got you! You lose.")
      }
  }
  //win condition 
  if (pellets.length === 0 && gameActive) {
    gameActive = false;
    winner.style.display = 'inline-block';
    restart.innerHTML = `play again`;
    let winscreen = document.createElement("div");
    winscreen.style.color = "white";
    winscreen.style.padding = '20px';
    winscreen.style.fontSize = `35px`;
    winscreen.style.margin = `33%`;
    winscreen.style.marginBottom = `75%`;
    winscreen.innerHTML = "Good Dog, Gumbo! You Win! (Stay Tuned for More Levels)";

    document.getElementById("win").appendChild(winscreen);
    cancelAnimationFrame(animationId)
    //future = add next level stuff here
  }

  for (let i = powerSquirrel.length - 1; 0 <= i; i--) {
    const powerUp = powerSquirrel[i];
    powerUp.update();
    if (rectangleCollidesWithSquare({
      rectangle: {
        ...corgi,
        velocity: {
          x: corgi.velocity.x,
          y: corgi.velocity.y
        }
      },
      square: powerUp
    })
    ) {
      powerSquirrel.splice(i, 1)
      //make strangers scared

      villains.forEach((villain) => {
        villain.scared = true;

        setTimeout(() => {
          villain.scared = false;
        }, 5000)
      })
    }
  }


  for (let i = pellets.length - 1; 0 <= i; i--) {
    const pellet = pellets[i]
    pellet.draw();
    if (rectangleCircleColliding({
      circle: pellet,
      rectangle: corgi
    })
    ) {
      pellets.splice(i, 1)
      score += 10
      scoreDisplay.innerHTML = score
    }
  }
  fences.forEach((fence) => {
    fence.draw();
    if (
      rectangleCollidesWithSquare({
        rectangle: corgi,
        square: fence
      })
    ) {
      corgi.velocity.y = 0
      corgi.velocity.x = 0
    }
  });
  
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
  });
  
  corgi.update();


  //stranger movement logic
  villains.forEach((villain) => {
  //drawing villains
    villain.update();
    //array to keep track of current collisions
    const collisions = [];
    //test whether villain is colliding with boundaries
    boundaries.forEach(boundary => {

      // test for collision if villain were to move right
      const right_collision = rectangleCollidesWithSquare({
        rectangle: {
          ...villain,
          velocity: {
            x: villain.speed,
            y: 0
          }
        },
        square: boundary
      });
      //if a collision were to occur and this direction is not already in our array,
      // push right into collisions array
      if (!collisions.includes(`right`) && right_collision) {
        collisions.push(`right`);
      }

      // test for collision if villain were to move left 
      const left_collision = rectangleCollidesWithSquare({
        rectangle: {
          ...villain,
          velocity: {
            x: -villain.speed,
            y: 0
          }
        },
        square: boundary
      });

      if (!collisions.includes(`left`) && left_collision) {
        collisions.push(`left`)
      }

      // up collision
      const up_collision = rectangleCollidesWithSquare({
        rectangle: {
          ...villain,
          velocity: {
            x: 0,
            y: -villain.speed
          }
        },
        square: boundary
      });

      if (!collisions.includes(`up`) && up_collision) {
        collisions.push(`up`);
      }

      // down collision
      const down_collision = rectangleCollidesWithSquare({
        rectangle: {
          ...villain,
          velocity: {
            x: 0,
            y: villain.speed
          }
        },
        square: boundary
      });
     
      if (!collisions.includes(`down`) && down_collision) {
        collisions.push(`down`);
      }
    });

    if (JSON.stringify(collisions) !== JSON.stringify(villain.prevCollisions)) {

      if (villain.velocity.x > 0) { villain.prevCollisions.push(`right`) }
      else if (villain.velocity.x < 0) { villain.prevCollisions.push(`left`) }
      else if (villain.velocity.y < 0) { villain.prevCollisions.push(`up`) }
      else if (villain.velocity.y > 0) { villain.prevCollisions.push(`down`) }
      
      const pathways = villain.prevCollisions.filter((collision) => {
        return !collisions.includes(collision)
      })
      if (pathways.length > 0) {
        const direction = pathways[Math.floor(Math.random() * pathways.length)]
        switch (direction) {
          case `down`:
            villain.velocity.x = 0
            villain.velocity.y = villain.speed
            break
          case `up`:
            villain.velocity.x = 0
            villain.velocity.y = -villain.speed
            break
          case `right`:
            villain.velocity.x = villain.speed
            villain.velocity.y = 0
            break
          case `left`:
            villain.velocity.x = -villain.speed
            villain.velocity.y = 0
            break
          // default:
          //   villain.velocity.x = -1 * villain.velocity.x
          //   villain.velocity.y = -1 * villain.velocity.y
          //   break
        }
      
    } else {
      villain.velocity.x = -1 * villain.velocity.x
      villain.velocity.y = -1 * villain.velocity.y
    }
    //make current collision values previous collision values to evaluate change
    villain.prevCollisions = collisions;
  
}
  });
}


//event listeners
addEventListener("keydown", ({ key }) => {
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

addEventListener("keyup", ({ key }) => {
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

startBtn.addEventListener(`click`, function () {
  startAnimating(5);
  if (splash.style.display === `none`) {
    splash.style.display = `block`;
    gameActive = false;

  } else {
    gameActive = true;
    splash.style.display = `none`;
    main.style.display = `visible`;
    menu.style.display = `block`;

  }
});

music.addEventListener("click", () => {
  if (audio.paused) {
    audio.volume = 0.2;
    audio.play();
    music.innerHTML = `music off`;

  } else {
    audio.pause();
    music.innerHTML = `music on`;
  }
  music.classList.add("fade");
});

pause.addEventListener("click", () => {
  if (gameActive) {
    gameActive = false;
    cancelAnimationFrame(animationId)
    pause.innerHTML = `resume play`;

  } else {
    gameActive = true;
    startAnimating(22);
    pause.innerHTML = `pause`;
  }
});

restart.addEventListener("click", () => {
  window.location.reload();
});



