// Board Constants
const gridWidth = 16;
const gridHeight = 12;

// Game Variables
let fuel = 100;
let distanceTraveled = 0;
let currentLevel = 0;
let gameOver = true;
let speedBoost = false;
let replenishFuel = false;
const fuelLossPerSecond = 5;
const fuelReplenishPerSecond = 50;
const distanceToMars = 100;
const distancePerSecond = 50;

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

class Level {
  constructor(minDebrisSpeed, maxDebrisSpeed, maxDebrisFrequency, minFuelSpeed, maxFuelSpeed, fuelFrequency) {
    this.minDebrisSpeed = minDebrisSpeed;
    this.maxDebrisSpeed = maxDebrisSpeed;
    this.maxDebrisFrequency = maxDebrisFrequency;
    this.minFuelSpeed = minFuelSpeed;
    this.maxFuelSpeed = maxFuelSpeed;
    this.fuelFrequency = fuelFrequency;
  }
}

const levels = [
  new Level(6, 10, 3000, 3, 6, 8000),
  new Level(10, 12, 1500, 4, 7, 8000),
  new Level(13, 15, 0, 5, 8, 9000),
]; 

// Game Logic
const ship = new SpaceObject(0,5,2,2);
let activeObjects = [];

function listenForStartButton() {
  let $startButton = document.querySelector('.start-button');
  $startButton.addEventListener('click', handleGameStart);
}

function listenForKeyDown() {
  document.body.addEventListener('keydown', handleKeyDown);
}

function listenForMobileEvents() {
  $mobileArrows.addEventListener('click', handleMobileArrows);
  $speedStatus.addEventListener('click', handleS);
}

function handleKeyDown(event) {
  if (event.key === 'l') {landShip();}
  const key = event.key;
  if (gameOver && key === 'Enter') { handleGameStart(); }
  if (gameOver) { return; }
  const acceptableKeys = ['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown', 's']
  if (!acceptableKeys.includes(event.key)) { return; }
  event.preventDefault();
  if (key === 's') {
    handleS();
    return;
  }
  handleArrows(key);
}

function handleS() {
  speedBoost = !speedBoost;
  showSpeedStatus();
}

function handleArrows(key) {
  switch (key) {
    case 'ArrowLeft': move('left');
      break;
    case 'ArrowUp': move('up');
      break;
    case 'ArrowRight': move('right');
      break;
    case 'ArrowDown': move('down');
      break;
  }
}

function handleMobileArrows(event) { 
  const x = event.offsetX;
  const y = event.offsetY;
  if (x >= 100 && y < 100) { 
    move('up');
  } else if (x >= 100 && y >= 100) {
    move('right');
  } else if (x < 100 && y < 100) {
    move('left');
  } else {
    move('down');
  }
}

/*
  New SpaceObjects are created off screen right, at a random y
  debris can be 1x1 or 2x2
  fuel source is always 1x1 
  rate is how far they will travel per second
*/
function addObject(className) {
  if (gameOver) { return; };
  const level = levels[currentLevel];
  const x = gridWidth;
  const y = Math.floor(Math.random() * gridHeight);
  const w = className === 'debris' ? Math.floor(Math.random() * 2) + 1 : 1;
  const object = new SpaceObject(x, y, w, w);
  const minRate = className === 'debris' ? level.minDebrisSpeed : level.minFuelSpeed;
  const maxRate = className === 'debris' ? level.maxDebrisSpeed : level.maxFuelSpeed;
  const rate = randomRate(minRate, maxRate);
  object.rate = rate;
  object.x += rate;
  object.class = className;
  activeObjects.push(object);
  addObjectToDom(object);
  // debris creation is called recursively by a random timeout (1-4 sec)
  if (className === 'debris') {
    const randomDelay = Math.floor(Math.random() * level.maxDebrisFrequency) + 1000;
    addObjectTimeout = setTimeout(() => { addObject('debris') }, randomDelay);
  }
}

function randomRate(minPerSec, maxPerSec) {
  return Math.floor(Math.random() * (maxPerSec - minPerSec)) + minPerSec;
}

function move(direction) {
  const distance = speedBoost ? 2 : 1;
  let x = ship.x;
  let y = ship.y;
  switch (direction) {
    case 'up':
      y -= distance;
      break;
    case 'right':
      x += distance;
      break;
    case 'down':
      y += distance;
      break;
    default: 
      x -= distance;
  }
  if (x < 0) { x = 0; } // Keep in horizontal bounds
  if (x + ship.size.w > gridWidth) { x = gridWidth - ship.size.w; }
  if (y < 0) { y = 0; } // Keep in vertical bounds
  if (y + ship.size.h > gridHeight) { y = gridHeight - ship.size.h; }
  ship.x = x;
  ship.y = y;
  move$ship(direction);
}

function reduceFuel() {
  if (gameOver) { return; }
  if (replenishFuel) {
    fuel += fuelReplenishPerSecond/60;
    if (fuel >= 100) {
      replenishFuel = false;
    }
  } else {
    fuel -= speedBoost ? 2 * fuelLossPerSecond/60 : fuelLossPerSecond/60;
    if (fuel <= 0) {
      handleGameOver();
      return;
    }    
  }
  showFuelStatus()
}

function increaseDistance() {
  if (gameOver) { return; }
  const intervalRate = distancePerSecond/60;
  distanceTraveled += speedBoost ? intervalRate * 1.5 : intervalRate;
  showTripProgress();
  if (distanceTraveled >= distanceToMars) {
    handleGameOver(true);
    return;
  }
}

function moveSpaceObjects() {
  if (gameOver) { return; }
  activeObjects.forEach(obj => {
    obj.x -= obj.rate/60;
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
  if (gameOver) { return; }
  activeObjects.forEach(object => {
    condition1 = object.x < ship.x + ship.size.w;
    condition2 = object.x + object.size.w > ship.x;
    condition3 = object.y < ship.y + ship.size.h;
    condition4 = object.y + object.size.h > ship.y;
    if (condition1 && condition2 && condition3 && condition4) {
      if (object.class === 'fuelSource') {
        replenishFuel = true;
        removeSpaceObject(object);
      } else {
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
const $ship = document.querySelector('.ship');
const $fuel = document.querySelector('.console__measurement--fuel');
const $distance = document.querySelector('.console__measurement--distance');
const $speedStatus = document.querySelector('.console__speed');
const $mobileArrows = document.querySelector('.console__arrows');
const cssModifiers = {
  debris: 'space__object--debris',
  fuelSource: 'space__object--fuel',
  smallDebris: 'debris--small',
  largeDebris: 'debris--large',
}

function move$ship(direction) {
  if ($ship.classList.contains('ship--landing')) { return; }
  const top = getPercentage(ship.y, gridHeight);
  const left = getPercentage(ship.x, gridWidth);
  $ship.style.top = cssString(top, '%');
  $ship.style.left = cssString(left, '%');
  switch (direction) {
    case 'up': 
      $ship.classList.add('ship--up');
      $ship.classList.remove('ship--down');
      break;
    case 'down':
      $ship.classList.add('ship--down');
      $ship.classList.remove('ship--up');
      break;
    default:
      $ship.classList.remove('ship--up', 'ship--down');
  }
  turnShipFront();
}

let turnFrontTimeout = null;
function turnShipFront() {
  // I always want to clear this to wait until after the last key press
  clearTimeout(turnFrontTimeout);
  turnFrontTimeout = setTimeout(() => {
    $ship.classList.remove('ship--up', 'ship--down');
  }, 300);
}

function addObjectToDom(object) {
  const $object = document.createElement('div');
  $object.className = 'space__object';
  $object.classList.add(cssModifiers[object.class]);
  if (object.class === 'debris') {
    $object.classList.add(object.size.w === 1 ? cssModifiers['smallDebris'] : cssModifiers['largeDebris']);
  }
  const top = getPercentage(object.y, gridHeight);
  const left = getPercentage(object.x, gridWidth);
  $object.style.top = cssString(top, '%');
  $object.style.left = cssString(left, '%');
  $space.append($object);
  object.$el = $object;
}

function positionDomObjects() {
  activeObjects.forEach(object => {
    const left = getPercentage(object.x, gridWidth);
    object.$el.style.left = cssString(left, '%');
  })
}

function showFuelStatus() {
  $fuel.style.width = cssString(fuel, '%');
  if (fuel <= 20) {
    $fuel.classList.add('console__measurement--blink');
    $ship.classList.add('ship--sputter');
  } else {
    $fuel.classList.remove('console__measurement--blink');
    $ship.classList.remove('ship--sputter');
  }
}

function showSpeedStatus() {
  if (speedBoost) {
    $speedStatus.classList.add('console__speed--active');
  } else {
    $speedStatus.classList.remove('console__speed--active');
  }
}

function showTripProgress() {
  $distance.style.width = cssString(distanceTraveled, '%');
  if (distanceTraveled >= 85) {
    $distance.classList.add('console__measurement--blink');
  } else {
    $distance.classList.remove('console__measurement--blink');
  }

}

function displayCrash() {
  $ship.classList.add('ship--crash');
  $ship.classList.remove('ship--sputter');
  setTimeout(() => {
    $ship.classList.add('ship--invisible');
  }, 500);
}

function landShip() {
  const $mars = document.createElement('div');
  $mars.className = 'space__mars';
  let $astronaut = document.createElement('div');
  $astronaut.className = 'space__mars__astronaut';
  $mars.append($astronaut);
  $space.append($mars);
  $ship.classList.add('ship--landing');
  setTimeout(() => {
    $ship.removeAttribute('style');
    $ship.classList.add('ship--landed');
  }, 6000);
}

function displayGameOverCover(win) {
  let $cover = document.createElement('div');
  $cover.classList.add('cover', 'cover--translucent');
  let $section1 = document.createElement('div');
  $section1.classList.add('cover__section', 'cover__section--game-over');
  if (win) {
    let message = currentLevel < levels.length - 1 ? "Checkpoint Cleared" : "Mission Accomplished";
    $section1.innerHTML += `<h1 class="cover__heading">${message}!</h1>`;
  } else {
    $section1.innerHTML += "<h1 class=\"cover__heading cover__heading--failure\">Mission Failure!</h1>";
  }
  $cover.append($section1);
  let buttonMessage = currentLevel < levels.length - 1 && win ? "Continue?" : "Play Again?"
  $cover.innerHTML += `<div class="cover__section cover__section--buttons"><button class="start-button">${buttonMessage}</button></div>`;
  $gameBoard.append($cover); 
}

function removeMars() {
  const $mars = document.querySelector('.space__mars');
  if ($mars) { removeFromDom($mars); }
}

function removeFromDom($element) {
  $element.remove();
}

// Game Initialization
let animationRequest = null;
let fuelSourceInterval = null;
let addObjectTimeout = null;

function handleGameStart() {
  resetGame();

  let $cover = document.querySelector('.cover');
  $cover.classList.add('cover--hidden');
  setTimeout(() => {$cover.remove();}, 500);
  //wait for cover to be gone
  setTimeout(() => {
    countdownToRun(3);
    displayLevelInfo();
  }, 500);
  // wait for countdown to finish
  setTimeout(() => {
    gameOver = false;
    run();
  }, 4500);
}

function resetGame() {
  fuel = 100;
  distanceTraveled = 0;
  speedBoost = false;
  replenishFuel = false;
  resetShip();
  removeMars();
  showFuelStatus();
  showTripProgress();
  showSpeedStatus();
  $mobileArrows.removeEventListener('click', handleMobileArrows);
  $speedStatus.removeEventListener('click', handleS);
}

function resetShip() {
  $ship.classList.remove('ship--crash', 'ship--invisible', 'ship--empty', 'ship--sputter', 'ship--landing', 'ship--landed');
  ship.x = 0;
  ship.y = 5;
  move$ship();
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
  $space.append($countdown);
  setTimeout(() => {$countdown.remove();}, 1000);
}

function displayLevelInfo() {
  let $level = document.createElement('div');
  $level.className = 'game-board__level';
  $level.textContent = `Level ${(currentLevel + 1).toString()}`;
  $space.append($level);
  setTimeout(() => {$level.remove();}, 4000);
}

function handleGameOver(win) {
  gameOver = true;
  let delay = 0;
  stop();
  if (currentLevel === levels.length - 1) {
    landShip();
    delay = 7000;
  }
  setTimeout(() => {
    displayGameOverCover(win);
    if (fuel <= 0) {
      $ship.classList.add('ship--empty');
      $ship.classList.remove('ship--sputter');
    }
    currentLevel = incrementLevel(currentLevel, win);
    listenForStartButton();
  }, delay);
}

function incrementLevel(level, win) {
  if (win) {
    return level < levels.length - 1 ? level + 1 : 0;
  } else {
    return level;
  }
}

function requestAnimation() {
  if (gameOver) { return; }
  moveSpaceObjects();
  reduceFuel();
  increaseDistance();
  animationRequest = requestAnimationFrame(requestAnimation);
}

function stop() {
  cancelAnimationFrame(animationRequest);
  clearInterval(fuelSourceInterval);
  clearTimeout(addObjectTimeout);
  $distance.classList.remove('console__measurement--blink');
  $fuel.classList.remove('console__measurement--blink');
  removeAllSpaceObjects();
  if (fuel <= 0) {
    $fuel.style.width = 0;
  }
}

function run() {
  listenForMobileEvents();
  fuelSourceInterval = setInterval(() => {
    addObject('fuelSource');
  }, 8000);
  animationRequest = requestAnimationFrame(requestAnimation);
  const randomDelay = Math.floor(Math.random() * 2000) + 1000;
  setTimeout(addObject('debris'), randomDelay);
};


window.onload = () => {
  listenForStartButton();
  listenForKeyDown();
}

// Utility Functions
function cssString(value, unit) {
  return value.toString() + unit.toString();
}
function getPercentage(amount, ofTotal) {
  return 100*amount/ofTotal;
}