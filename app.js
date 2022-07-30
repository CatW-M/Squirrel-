//prepare canvas
  const canvas = document.getElementById(`game`);
  const ctx = canvas.getContext("2d");
  canvas.width = innerWidth;
  canvas.height = innerHeight;

//game elements
const scoreDisplay = document.getElementById(`score`)
let score = 0;

//game images
let scaredImage = new Image();
scaredImage.src = "scared.png"

//game arrays
const boundaries = [];
const powerSquirrel = [];
const map = [
  ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-','-', '-', '-', '-', '-', '-', '-', '-'],
  ['-', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', 'p', '-'],
  ['-', '.', '.', '.', '-', '-', '-', '.', '-', '-', '.', '-', '-', '-', '.', '-', '.', '-'],
  ['-', '.', '.', '.', '.', '-', '.', '.', '.', '.', '.', '.', '-', '.', '.', '.', '.', '-'],
  ['-', '.', '.', '-', '.', '.', '.', '-', '-', '-', '-', '.', '.', '.', '-', '-', '.', '-'],
  ['-', '.', '.', '.', '.', '-', '.', '.', '.', '.', '.', '.', '-', '.', '.', '.', '.', '-'],
  ['-', '.', '.', '.', '-', '-', '-', '.', '-', '-', '.', '-', '-', '-', '.', '-', '.', '-'],
  ['-', '.', '.', '.', '.', '-', '.', '.', '.', '.', '.', '.', '-', '.', '.', '-', '.', '-'],
  ['-', 'p', '.', '.', '.', '.', '.', '.', '-', '-', '.', '.', '.', '.', '.', '.', 'p', '-'],
  ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-','-', '-', '-', '-', '-', '-', '-', '-']
]
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

//js Classes
class Pellets {
  constructor({position}) {
    this.position = position
    this.radius = 5
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
    static width = 32
    static height = 32
    constructor({position, image}) {
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
  static width = 75
  static height = 75
  constructor({position, image}) {
    this.position = position;
    this.width = 75
    this.height = 75
    this.image = image
  }
  draw() {
    ctx.drawImage(this.image, this.position.x, this.position.y);
  }
}
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
class Villain {
  static speed = 2
  constructor({position, velocity, image}) {
    this.position = position,
    this.velocity = velocity,
    this.width = 72,
    this.height = 72,
    this.frameX = 0,
    this.frameY = 0,
    this.moving = false,
    this.image = image,
    this.prevCollisions = [],
    this.speed = 2,
    this.scared = false
  }
  draw() {
    if (this.scared) {
      ctx.drawImage(scaredImage, this.width * this.frameX, this.height * this.frameY, this.width, this.height, this.position.x, this.position.y, this.width, this.height);}
      else {ctx.drawImage(this.image, this.width * this.frameX, this.height * this.frameY, this.width, this.height, this.position.x, this.position.y, this.width, this.height);}
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
  image: createImage("corgi (2).png")
});

const villains = [
  new Villain({
    position: {
      x: Boundary.width * 5 + 2,
      y: Boundary.height + 2
    },
    velocity: {
      x: Villain.speed,
      y: 0
    },
    image: createImage("villain.png")
  }),
  new Villain({
    position: {
      x: Boundary.width + 2,
      y: Boundary.height * 5 + 2
    },
    velocity: {
      x: Villain.speed,
      y: 0
    },
    image: createImage("villain.png")
  })
]

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
      case 'p':
          powerSquirrel.push(
                new PowerSquirrel({
                position: {
                  x: j * Boundary.width + 15,
                  y: i * Boundary.height + 15
                },
                image: createImage("squirrel.png")
              })
              )
              break
    }
  })
})

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

function rectangleCollidesWithSquare({ rectangle, square }) {
  const padding = 0
  return (
    rectangle.position.y + rectangle.velocity.y <= square.position.y + square.height + padding &&
    rectangle.position.y + rectangle.height + rectangle.velocity.y >= square.position.y - padding &&
    rectangle.position.x + rectangle.width + rectangle.velocity.x >= square.position.x - padding &&
    rectangle.position.x + rectangle.velocity.x <= square.position.x + square.width + padding
  );
}

//gameloop

function animate() {

 animationId = requestAnimationFrame(animate);
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
  for (let i = villains.length - 1; 0 <= i; i--) {
    const villain = villains[i];
  
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
    ) if (villain.scared) {
    villains.splice(i, 1);
    let regenerate = new Villain(
      {position: {
          x: Boundary.width * 5 + 2,
          y: Boundary.height + 2
        },
        velocity: {
          x: Villain.speed,
          y: 0
        },
        image: createImage("villain.png")
      });
      setTimeout(() => {
        villains.push(regenerate)
      }, 8000)
    //set interval and create new instance of villain/push into villains array
  } else {
    cancelAnimationFrame(animationId)
    alert("The stranger got you! You lose.")
  }
 }
 //win condition 
 if (pellets.length === 0) {
  alert("You win!")
// let winscreen = document.createElement("div");
// winscreen.style.width = "100px";
// winscreen.style.height = "100px";
// winscreen.style.background = "red";
// winscreen.style.color = "white";
// winscreen.innerHTML = "You Win!";

// document.getElementById("main").appendChild(winscreen);
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
        villain.scared = true

        setTimeout(() => {
          villain.scared = false
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

  villains.forEach((villain) => {
    villain.update()

 
    const collisions = []; 
    boundaries.forEach(boundary => {

      // right collision
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
     

      if (!collisions.includes(`right`) && right_collision) {
        collisions.push(`right`);
      } 

      // left collision
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
//pushing down here not sure why
      if (!collisions.includes(`down`) && down_collision) {
        collisions.push(`down`);
      }
    });

    if (collisions.length > villain.prevCollisions.length) {

      villain.prevCollisions = collisions
      console.log(villain.prevCollisions)
      console.log(collisions)
    }

    if (JSON.stringify(collisions) !== JSON.stringify(villain.prevCollisions)) {
      console.log(`goooooooooo`)
      
      if (villain.velocity.x > 0) { villain.prevCollisions.push(`right`) }
      else if (villain.velocity.x < 0) { villain.prevCollisions.push(`left`)}
      else if (villain.velocity.y < 0) { villain.prevCollisions.push(`up`)}
      else if (villain.velocity.y > 0) {villain.prevCollisions.push(`down`)}
        
      const pathways = villain.prevCollisions.filter((collision) => {
        return !collisions.includes(collision)
      })
  
      console.log({pathways});
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
      }
      villain.prevCollisions = [];
    }

  });
}
// startAnimating(7); 


//event listeners
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

addEventListener(`resize`, function () {
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
})  
let main = document.getElementById('main');
let splash = document.getElementById(`splash-screen`);
let btn = document.getElementById(`start`);

btn.addEventListener(`click`, function() {
  startAnimating(7); 
  if (splash.style.display === `none`) {
    splash.style.display = `block`;
   
  } else {
    splash.style.display = `none`;
    main.style.display = `visible`;
  }
});

const music = document.querySelector("#music");
const icon = document.querySelector("#music > i");
const audio = document.querySelector("audio");

music.addEventListener("click", () => {
  if (audio.paused) {
    audio.volume = 0.2;
    audio.play();
    icon.classList.remove('volume-up');
    icon.classList.add('volume-mute');
    
  } else {
    audio.pause();
    icon.classList.remove('volume-mute');
    icon.classList.add('volume-up');
  }
  music.classList.add("fade");
});



