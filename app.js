// ===========================
//      Global variables
// ===========================

//Cars
const redCar = document.querySelector("#red-car");
const greenCar = document.querySelector("#green-car");
const blueCar = document.querySelector("#blue-car");

/**
 * Image representing player.
 */
const riderImg = document.querySelector("#rider");
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
/**
 * HTML element for displaying game failure .
 */
const failOrWin = document.querySelector("#failOrWin");
const failMsg = document.querySelector("#failMsg");
const winMsg = document.querySelector("#winMsg");
/**
 * HTML element for displaying score.
 */
let scoreDisplay = document.querySelector("#score");
let score = 0;
/**
 * Timer in ms for popping objects from car array.
 */
let popTimer = 700;
let carSpeed = 5;
const maxCars = 100;

/**Car Height */
const cH = 50;
/**Car Width */
const cW = 50;
/**Available car colors */
const colors = {
  1: redCar,
  2: greenCar,
  3: blueCar,
};

/**
 * Player object.
 * @property `w`: Width
 * @property `h`: height
 * @property `speed`: Speed
 * @property `x`: x-axis point
 */
const rider = {
  w: 50,
  h: 80,
  speed: 10,
  x: canvas.width / 2 - 25,
};
/**
 * Initial cars container filled by `setCars` function
 */
const initCars = [];
/**
 * Popped cars from `initCars`
 */
let poppedCars = [];

// ========================
//    Global functions
// ========================

// Game speeds
//After 10 seconds
let slowSpeed = function () {
  setTimeout(() => {
    popTimer = 650;
    carSpeed = 7;
  }, 10000);
  rider.speed = 12;
};
//After 20 seconds
let mediumSpeed = function () {
  setTimeout(() => {
    popTimer = 550;
    carSpeed = 8;
    rider.speed = 15;
  }, 20000);
};
//After 40 seconds
let fastSpeed = function () {
  setTimeout(() => {
    popTimer = 400;
    carSpeed = 10;
    rider.speed = 25;
  }, 40000);
};

/**
 * Generates cars and fill them to `initCars`.
 */
function setCars() {
  for (let index = 0; index < maxCars; index++) {
    initCars.push({
      passed: false,
      color: Math.floor(Math.random() * Object.keys(colors).length) + 1,
      y: 0,
      x: Math.ceil(Math.random() * canvas.width),
    });
  }
}
/**
 * Infinitely call `setCars` to regenerate cars near depletion.
 */
function refillCars() {
  setInterval(() => {
    poppedCars.push(initCars.pop());
    if (initCars.length < 10) {
      setCars();
    }
  }, popTimer);
}
refillCars();
setCars();

function hasWon() {
  if (poppedCars.length > maxCars - 1) {
    failOrWin.style.display = "flex";
    winMsg.style.display = "flex";
    return true;
  } else {
    return false;
  }
}

/**
 *  Draw player
 */
function drawRider() {
  context.drawImage(
    riderImg,
    rider.x,
    canvas.height - rider.h,
    rider.w,
    rider.h
  );
}
/**
 * Draw cars to the canvas
 */
function drawCars() {
  poppedCars.forEach((car) => {
    //for right
    if (car.x > canvas.width - 50) {
      car.x = canvas.width - 50;
    }

    if (!car.passed) {
      context.drawImage(colors[car.color], car.x, car.y, cW, cH);
      car.y += carSpeed;
    }
  });
}
/**Move player to the right */
function moveRight() {
  rider.x += rider.speed;
}
/**Move player to the left */
function moveLeft() {
  rider.x -= rider.speed;
}
/**
 * Checks Arrow keys event.
 * @param e Event Listener
 */
function keyDown(e) {
  if (e.key === "ArrowRight" || e.key === "Right") {
    moveRight();
  } else if (e.key === "ArrowLeft" || e.key === "Left") {
    moveLeft();
  }
}
/**
 * Detect if player crosses beyond canvas width.
 */
function detectBoundary() {
  // Right wall
  if (rider.x + rider.w > canvas.width) {
    rider.x = canvas.width - rider.w;
  }
  // Left wall
  if (rider.x < 0) {
    rider.x = 0;
  }
}
/**
 * Detect if player crashes with a car in motion.
 * @returns `Boolean`
 */
function isCrashed() {
  let collide = false;

  for (let i = 0; i < poppedCars.length; i++) {
    if (rider.h + poppedCars[i].y > canvas.height) {
      if (Math.abs(rider.x - poppedCars[i].x) <= 45 && !hasWon()) {
        collide = true;
        failOrWin.style.display = "flex";
        failMsg.style.display = "flex";
      }
    }
  }
  return collide;
}
/**
 * Updates the `score` variable and displays inside `scoreDisplay`
 */
function scoreUpdate() {
  score++;
  scoreDisplay.innerHTML = `Your score: ${score}`;
}
/**
 * Clears cars that crosses beyond canvas height and calls `scoreUpdate`
 */
function clearCar() {
  poppedCars.forEach((car) => {
    if (car.y + 50 > canvas.height) {
      car.passed = true;
      car.y = 0;
      scoreUpdate();
    }
  });
}

function updateGame() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  drawCars();
  drawRider();

  clearCar();

  detectBoundary();

  if (!isCrashed() && !hasWon()) {
    requestAnimationFrame(updateGame);
  }
}
updateGame();
slowSpeed();
mediumSpeed();
fastSpeed();

/**
 * Restart game
 */
function restart() {
  poppedCars = [];
  score = 0;
  popTimer = 700;
  carSpeed = 5;
  rider.speed = 10;
  (rider.x = canvas.width / 2 - 25), //Center = Half of canvas - half of player width
    (scoreDisplay.innerHTML = `Your score: ${score}`);
  poppedCars.push(initCars.pop());

  clearTimeout(slowSpeed);
  clearTimeout(mediumSpeed);
  clearTimeout(fastSpeed);

  slowSpeed();
  mediumSpeed();
  fastSpeed();

  failOrWin.style.display = "none";
  winMsg.style.display = "none";
  failMsg.style.display = "none";
  updateGame();
}
document.addEventListener("keydown", keyDown);
failOrWin.addEventListener("click", restart);
