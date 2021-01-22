const red = document.querySelector("#red-car");
const green = document.querySelector("#green-car");
const blue = document.querySelector("#blue-car");
const bikerImg = document.querySelector("#biker");
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

const fail = document.querySelector("#fail");

let scoreUpdater = document.querySelector("#score");
let score = 0;
let timer = 700;
let carSpeed = 5;
// Car Height
const cH = 50;
// Car Width
const cW = 50;
const colors = {
  1: red,
  2: green,
  3: blue,
};
const biker = {
  w: 50,
  h: 80,
  speed: 10,
  dx: 0,
};
const initCars = [];
let cars = [];

function setupCars() {
  for (let index = 0; index < 20; index++) {
    initCars.push({
      passed: false,
      color: Math.floor(Math.random() * 3) + 1,
      y: 0,
      x: Math.floor(Math.random() * canvas.width) + 25, //to start inside canvas
    });
  }
}

setInterval(() => {
  cars.push(initCars.pop());
  if (initCars.length < 10) {
    setupCars();
  }
}, timer);

setupCars();

function drawCars() {
  cars.forEach((car) => {
    if (car.x < 25) {
      car.x += 30;
    }
    if (car.x > canvas.width - 50) {
      car.x -= 50;
    }
    if (!car.passed) {
      context.drawImage(colors[car.color], car.x, car.y, cW, cH);
      car.y += carSpeed;
    }
  });
}

function moveRight() {
  biker.dx += biker.speed;
}
function moveLeft() {
  biker.dx -= biker.speed;
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
function detectWalls() {
  // Right wall
  if (biker.dx + biker.w > canvas.width) {
    biker.dx = canvas.width - biker.w;
  }
  // Left wall
  if (biker.dx < 0) {
    biker.dx = 0;
  }
}
function detectCrash() {
  let collide = false;

  for (let i = 0; i < cars.length; i++) {
    if (biker.h + cars[i].y > canvas.height) {
      if (Math.abs(biker.dx - cars[i].x) <= 40) {
        collide = true;
        fail.style.display = "flex";
      }
    }
  }
  return collide;
}
function clearCar() {
  cars.forEach((car) => {
    if (car.y + 50 > canvas.height) {
      car.passed = true;
      car.y = 0;
      score++;
      scoreUpdater.innerHTML = `Your score: ${score}`;
    }
  });
}

function update() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(
    bikerImg,
    biker.dx,
    canvas.height - biker.h,
    biker.w,
    biker.h
  );
  drawCars();

  clearCar();

  detectWalls();

  if (!detectCrash()) {
    requestAnimationFrame(update);
  }
}
update();

setTimeout(() => {
  timer = 650;
  carSpeed = 7;
}, 10000);
setTimeout(() => {
  timer = 550;
  carSpeed = 8;
}, 30000);
setTimeout(() => {
  timer = 400;
  carSpeed = 10;
  biker.speed = 15
}, 30000);

function restart() {
  cars = [];
  score = 0;
  timer = 700;
  carSpeed = 5;
  biker.speed = 10
  scoreUpdater.innerHTML = `Your score: ${score}`;
  cars.push(initCars.pop());
  fail.style.display = "none";
  update();
}
document.addEventListener("keydown", keyDown);
fail.addEventListener("click", restart);
