// Board Constants
const gridWidth = 16;
const gridHeight = 12;
const gridUnitPx = 50;

// Game Variables
let fuel = 100;
let distanceTraveled = 0;
let gameOver = false;
let speedBoost = false;
const fuelLossPerSecond = 5;
const distanceToMars = 1000;
const distancePerSecond = 25;

class SpaceObject {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.size = {
      'w': w,
      'h': h
    }
  }
}

// Game Logic
const ship = new SpaceObject(0,5,2,2);
let activeObjects = [];

function listenForButtonPress() {
  let $startButton = document.querySelector('.start-button');
  $startButton.addEventListener('click', handleGameStart);
}

function listenForKeyDown() {
  document.body.addEventListener('keydown', handleKeyDown);
}

function handleKeyDown(event) {
  if (gameOver) { return }
  const keyCode = event.keyCode;
  if (![37,38,39,40,83].includes(event.keyCode)) {return}
  event.preventDefault();
  if (keyCode === 83) {
    handleS();
    return;
  }
  handleArrows(keyCode);
}

function handleS() {
  speedBoost = !speedBoost;
  showSpeedStatus();
}

function handleArrows(keyCode) {
  const distance = speedBoost ? 2 : 1;
  switch (keyCode) {
    case 37: moveTo(ship.x - distance, ship.y);
      break;
    case 38: moveTo(ship.x, ship.y - distance);
      break;
    case 39: moveTo(ship.x + distance, ship.y);
      break;
    case 40: moveTo(ship.x, ship.y + distance);
      break;
  }
}

/*
  New SpaceObjects are created off screen right, at a random y
  debris can be 1x1 or 2x2
  fuel source is always 1x1 
  rate is how far they will travel per second
*/
function addObject(className) {
  if (gameOver) { return };
  const x = gridWidth;
  const y = Math.floor(Math.random() * gridHeight);
  const w = className === 'debris' ? Math.floor(Math.random() * 2) + 1 : 1;
  const object = new SpaceObject(x, y, w, w);
  const minRate = className === 'debris' ? 6 : 3;
  const maxRate = className === 'debris' ? 10 : 6;
  const rate = randomRate(minRate, maxRate);
  object.rate = rate;
  object.x += rate;
  object.class = className;
  activeObjects.push(object);
  addObjectToDom(object);
  // debris creation is called recursively by a random timeout (1-4 sec)
  if (className === 'debris') {
    const randomDelay = Math.floor(Math.random() * 3000) + 1000;
    addObjectTimeout = setTimeout(() => { addObject('debris') }, randomDelay);
  }
}

function randomRate(minPerSec, maxPerSec) {
  return Math.floor(Math.random() * (maxPerSec - minPerSec)) + minPerSec;
}

function moveTo(x,y) {
  if (x < 0) { x = 0; } // Keep in horizontal bounds
  if (x + ship.size.w > gridWidth) { x = gridWidth - ship.size.w; }
  if (y < 0) { y = 0; } // Keep in vertical bounds
  if (y + ship.size.h > gridHeight) { y = gridHeight - ship.size.h; }
  ship.x = x;
  ship.y = y;
  move$ship();
}

function reduceFuel() {
  fuel -= speedBoost ? fuelLossPerSecond * 2 : fuelLossPerSecond;
  showFuelStatus()
  if (fuel <= 0) {
    gameOver = true;
    handleGameOver();
  }
}

function replenishFuel() {
  fuel = 100;
  showFuelStatus();
}

function increaseDistance() {
  const intervalRate = distancePerSecond/5;
  distanceTraveled += speedBoost ? intervalRate * 1.5 : intervalRate;
  showTripProgress();
  if (distanceTraveled >= distanceToMars) {
    gameOver = true;
    handleGameOver(true);
  }
}

function moveSpaceObjects() {
  activeObjects.forEach(obj => {
    obj.x -= obj.rate/10;
    if (obj.x <= 0 - obj.rate) {
      removeSpaceObject(obj);
    }
    positionDomObjects();
    if (!gameOver) {
      checkForCollision();
    }
  })
}

function removeSpaceObject(obj) {
  const index = activeObjects.findIndex(object => object.$el === obj.$el);
  activeObjects.splice(index, 1);
  removeFromDom(obj.$el);
}

function removeAllSpaceObjects() {
  activeObjects = [];
  document.querySelectorAll('.space__object').forEach($object => {
    $object.classList.add('space__object--invisible');
    setTimeout(() => {removeFromDom($object)}, 600);
  })
}

function checkForCollision() {
  if (gameOver) { return }
  activeObjects.forEach(object => {
    condition1 = object.x < ship.x + ship.size.w;
    condition2 = object.x + object.size.w > ship.x;
    condition3 = object.y < ship.y + ship.size.h;
    condition4 = object.y + object.size.h > ship.y;
    if (condition1 && condition2 && condition3 && condition4) {
      if (object.class === 'fuelSource') {
        replenishFuel();
        removeSpaceObject(object);
      } else {
        gameOver = true;
        displayCrash();
        handleGameOver();
      }
      return;
    }
  })
}

// DOM Manipulation
const $gameBoard = document.querySelector('.game-board');
const $space = document.querySelector('.space');
const $ship = document.querySelector('.space__ship');
const $fuel = document.querySelector('.console__measurement--fuel');
const $distance = document.querySelector('.console__measurement--distance');
const $speedStatus = document.querySelector('.console__speed');
const cssModifiers = {
  debris: 'space__object--debris',
  fuelSource: 'space__object--fuel',
  smallDebris: 'debris--small',
  largeDebris: 'debris--large',
}

function move$ship() {
  $ship.style.top = cssString(ship.y * gridUnitPx, 'px');
  $ship.style.left = cssString(ship.x * gridUnitPx, 'px');
}

function addObjectToDom(object) {
  const $object = document.createElement('div');
  $object.className = 'space__object';
  $object.classList.add(cssModifiers[object.class]);
  if (object.class === 'debris') {
    $object.classList.add(object.size.w === 1 ? cssModifiers['smallDebris'] : cssModifiers['largeDebris']);
  }
  $object.style.top = cssString(object.y * gridUnitPx, 'px');
  $object.style.left = cssString(object.x * gridUnitPx, 'px');
  $object.style.width = cssString(object.size.w * gridUnitPx, 'px');
  $object.style.height = cssString(object.size.h * gridUnitPx, 'px');
  $space.append($object);
  object.$el = $object;
}

function positionDomObjects() {
  activeObjects.forEach(obj => {
    obj.$el.style.left = cssString(obj.x * gridUnitPx, 'px');
  })
}

function showFuelStatus() {
  $fuel.style.width = cssString(fuel, '%');
}

function showSpeedStatus() {
  if (speedBoost) {
    $speedStatus.classList.add('console__speed--active');
  } else {
    $speedStatus.classList.remove('console__speed--active');
  }
}

function showTripProgress() {
  const percent = Math.floor(100 * (distanceTraveled/distanceToMars));
  $distance.style.width = cssString(percent, '%');
}

function displayCrash() {
  $ship.classList.add('space__ship--crash');
  setTimeout(() => {
    $ship.classList.add('space__ship--invisible');
  }, 500);
}

function displayGameOverCover(win) {
  let $cover = document.createElement('div');
  $cover.classList.add('cover', 'cover--translucent');
  if (win) {
    $cover.innerHTML = "<h1 class=\"cover__heading\">Mission Accomplished!</h1>";
  } else {
    $cover.innerHTML = "<h1 class=\"cover__heading cover__heading--failure\">Mission Failure!</h1>";
  }
  $cover.innerHTML += "<button class=\"start-button\">Play Again?</button>";
  $gameBoard.append($cover); 
  listenForButtonPress();
}

function removeFromDom($element) {
  $element.remove();
}

// Game Initialization
let fuelInterval = null;
let distanceInterval = null;
let fuelSourceInterval = null;
let addObjectTimeout = null;
let moveObjectsInterval = null;

function handleGameStart() {
  resetGame();
  let $cover = document.querySelector('.cover');
  $cover.classList.add('cover--hidden');
  setTimeout(() => {$cover.remove();}, 500);
  //wait for cover to be gone
  setTimeout(() => {countdownToRun(3);}, 500);
  // wait for countdown to finish
  setTimeout(() => {run();}, 4500);
}

function resetGame() {
  fuel = 100;
  distanceTraveled = 0;
  gameOver = false;
  speedBoost = false;
  // activeObjects = [];
  resetShip();
  showFuelStatus();
  showTripProgress();
  showSpeedStatus();
  document.body.removeEventListener('keydown', handleKeyDown);
}

function resetShip() {
  ship.x = 0;
  ship.y = 5;
  move$ship();
  $ship.classList.remove('space__ship--crash', 'space__ship--invisible');
}

function countdownToRun(count) {
  displayCountdownInfo(count > 0 ? count : 'Go!');
  if (count > 0) {
    count--;
    setTimeout(() => {countdownToRun(count)}, 1000);
  }
}

function displayCountdownInfo(count) {
  let $countdown = document.createElement('div');
  $countdown.className = 'game-board__countdown';
  $countdown.textContent = count.toString();
  $gameBoard.append($countdown);
  setTimeout(() => {$countdown.remove();}, 1000);
}

function handleGameOver(win) {
  stop();
  displayGameOverCover(win);
}

function stop() {
  clearInterval(fuelInterval);
  clearInterval(distanceInterval);
  clearInterval(fuelSourceInterval);
  clearInterval(moveObjectsInterval);
  clearTimeout(addObjectTimeout);
  removeAllSpaceObjects();
  if (fuel <= 0) {
    $fuel.style.width = 0;
  }
}

function run() {
  listenForKeyDown();
  fuelInterval = setInterval(() => {
    reduceFuel();
  }, 1000);
  distanceInterval = setInterval(() => {
    increaseDistance();
  }, 200);
  fuelSourceInterval = setInterval(() => {
    addObject('fuelSource');
  }, 8000);
  moveObjectsInterval = setInterval(() => {
    moveSpaceObjects();
  }, 100);
  const randomDelay = Math.floor(Math.random() * 2000) + 1000;
  setTimeout(addObject('debris'), randomDelay);
};

listenForButtonPress();

// Utility Functions
function cssString(value, unit) {
  return value.toString() + unit.toString();
}