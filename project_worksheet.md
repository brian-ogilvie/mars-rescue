# Project Overview

## Project Schedule

This schedule will be used to keep track of your progress throughout the week and align with our expectations.  

You are **responsible** for scheduling time with your squad to seek approval for each deliverable by the end of the corresponding day, excluding `Saturday` and `Sunday`.

|  Day | Deliverable | Status
|---|---| ---|
|Dec 17th| Project Description | Complete
|Dec 17th| Wireframes / Priority Matrix / Functional Components | Complete
|Dec 17th| Core Application Structure (HTML, CSS, etc.) | Complete
|Dec 17th| Keydown Event Listeners | Complete
|Dec 18th| Pseudo Code/ actual code for collision detection  | Complete
|Dec 19th| MVP/ Begin Post MVP | Incomplete
|Dec 20th| More Post MVP | Incomplete
|Dec 21st| Present | Incomplete


## Project Description

Following an equipment failure, humanity's top astrobiologist is stranded on Mars. NASA needs you to pilot the rescue mission. You will have to navigate a treacherous journey, littered with space debris. You will also need to collect fuel floating in space along the way. If you run out of fuel or collide with debris, your mission is a failure. Humanity is counting on you!

## Wireframes

[Game In Progress](https://res.cloudinary.com/brian-ogilvie/image/upload/v1545078425/Project%201%20Wireframes/Game%20In%20Progress.jpg)

[Basic Game Play](https://res.cloudinary.com/brian-ogilvie/image/upload/v1545078426/Project%201%20Wireframes/Basic%20Game%20Play%20%28english%29.jpg)

[Landing Screen](https://res.cloudinary.com/brian-ogilvie/image/upload/v1545078427/Project%201%20Wireframes/Welcome%20Screen.jpg)

[Game Start](https://res.cloudinary.com/brian-ogilvie/image/upload/v1545078426/Project%201%20Wireframes/Game%20Start.jpg)

[Game Lose](https://res.cloudinary.com/brian-ogilvie/image/upload/v1545078426/Project%201%20Wireframes/Game%20Lose.jpg)

[Game Win](https://res.cloudinary.com/brian-ogilvie/image/upload/v1545078426/Project%201%20Wireframes/Game%20Win.jpg)

[Full Browser Window](https://res.cloudinary.com/brian-ogilvie/image/upload/v1545078427/Project%201%20Wireframes/Browser%20Window.jpg)

## Priority Matrix

[Priority Matrix](https://res.cloudinary.com/brian-ogilvie/image/upload/v1545078451/Project%201%20Wireframes/Priority%20Matrix.jpg)  

### MVP/PostMVP - 5min  

#### MVP 

- Control ship with arrow keys
- Generate objects and move them accross screen
- Detect collision with one object
- Display fuel and trip status

#### PostMVP 

- Detect Multiple Collisions
- End Game (landing on Mars or exploding)
- Reset/Replay
- Welcome/Instructions screen
- Speed boost
- Animated PNG images for ship, debris, and fuel source
- More user feedback (fuel in danger zone, trip almost complete, speed boost active)
- Difficulty selection (add more/less, faster/slower space objects)

## Functional Components

- class SpaceObject to set x,y,w,h for every object on screen
- addObject()
    - create new SpaceObject, x (offscreen right), y (random), w/h (random in range), type (debris/fuelSource), rate (random in range)
    - push to objects array
    - append to DOM
    
- addObjectToDOM(object)
    - create new div element
    - assign className based on class of object
    - assign top/left based on x/y of object
    - assign width/height based on w/h of object
    - set $el property of object equal to this div
    - append to play-space
    
- moveObjects()
    - loop through objects array
        - decrement x by rate
        - remove object from array if x < 0
            - and remove it from DOM
    - update DOM to show new locations
    
- displayObjects()
    - loop though objects array
        - set each object's $el.style.left property to object's x
  
- detectCollisions()
    - loop through objects array
        - condition 1: obj.x < ship.x + ship.w
        - condition 2: obj.y + obj.h > ship.y
        - condition 3: obj.x + obj.w > ship.x
        - condition 4: obj.y < ship.y + ship.h
    - if any collision detected
        - object type debris
            - explode, game over
        - object type fuel source
            - increase fuel
      
#### Intervals
- decrease fuel
- increase distance traveled
- move objects
- add fuel sources

#### Timeouts
- add debris objects (recusrively call function again with a random timeout)

### Landing Page

- User is given the basic story and goal of the game. Brief explanation of controls and different types of floating objects to seek or avoid. 
- User may click "Play Now."

### Game Initialization

- The screen is initialized with ship by itself in empty play space. 
- There is a 3-sec countdown.
- Game begins.

### Playing The Game 

- arrow keys to move ship
- "s" key to activate speed boost
- debris appears at random intervals (and random sizes) at random y coordinate off screen right
- fuel sources appear at regular intervals at random y coordinate off screen right
- debris and fuel sources move at their own rates across the screen to the left.

### Winning The Game

- You win if you survive long enough without colliding with debris or running out of fuel. 
- Game is over when the trip progress is 100%.

### Resetting The Game

- After Win/Lose, user controls are disabled
- Objects cease appearing
- A button appears to "Play Again"
- Clicking button returns to Game Initialization state

Time frames are also key in the development cycle.  You have limited time to code all phases of the game.  Your estimates can then be used to evalute game possibilities based on time needed and the actual time you have before game must be submitted. It's always best to pad the time by a few hours so that you account for the unknown so add and additional hour or two to each component to play it safe.

| Component | Priority | Estimated Time | Time Invetsted | Actual Time |
| --- | :---: |  :---: | :---: | :---: |
| HTML Layout | H | 1hr | .25hr | .25hr |
| Basic CSS | H | 2hrs| 1hr | 1hr |
| JS Game Logic | H | 3hrs | 4hrs | 4hrs |
| JS DOM Manip | H | 2hrs | 1hr | 1hr |
| JS Intervals | H | 1hr | .5hr | .5hr |
| Start Screen | M | 2hr | 1hr | 1hr |
| End Game (basic) | M | 1hr | 1.25hrs | 1.25hrs |
| Countdown Start | M | 1hr | 1hr | 1hr |
| Speed Boost | L | 2hrs | .5hr | .5hr |
| Background Images | L | 3hrs | 1hr | 1hrs |
| Update Instructions | H | 1hr | .5hr | .5hr |
| Turn Ship | L | 1hr | .25hr | .25hr |
| event.key | H | 1hr | .25hr | .25hr |
| Extra Gameplay feedback | L | 3hrs | 2.25hrs | 2.25hrs |
| Responsive Design | H | 2hrs | 4hrs | 4hrs |
| Responsive Redesign | M | 2hrs | 2hrs | 2hrs |
| Mobile Device Interaction | H | 2hrs | 2hrs | 2hrs |
| Better animation | L | 2hrs | 2hrs | 2hrs |
| Progressing Levels | L | 1hr | 1hr | 1hr |
| End Game (animation) | L | 3hr |  |  |
| Different Types of debris | L | 1hr |  |  |
| Retract Dashboard | L | 1hr |  |  |
| Difficulty Selection | L | 2hrs |  |  |
| Total |  | 40hrs| 33hrs | 33hrs |

## Helper Functions

| Function | Description | 
| --- | :---: |  
| cssString(value, unit) | This takes a value and unit and returns a formatted CSS string | 

## Additional Libraries
None

## Code Snippet

Collision detection on a board full of moving objects! In order for an object to have collided with the ship, I figured out four conditions that had to be met. If all four were true, there was a collision. Then I had to decide whether the object was debris (game over scenario) or a fuel source (replenish fuel supply).   

```
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
        stop();
      }
      return;
    }
  })
}
```

## Change Log
 Use this section to document what changes were made and the reasoning behind those changes.  

## Issues and Resolutions
Establishing conditions for a collision was difficult. First, I tried mapping the objects array to create a list of occupied grid spaces then checking that list against the grid spaces occupied by the ship. This involved calling a class method on every object (including the ship) which returned its x/y/w/h as an array of coordinate spaces. This was verbose, ugly, and caused my program not to run smoothly. 

Eventually I settled on the soludion above, which checked each object on it's own for a set of conditions and returns as soon as a collision is detected rather than extracting all the data for the whole board before comparing with the ship. 

The second problem was exactly when to do the collision checking: when the ship moved, when the SpaceObjects moved, or both. I decided just to call this function every time the SpaceObjects moved for two reasons: 1) They might collide with the ship without any input from the user, and 2) The SpaceObjects are moved five times per second, which seemed plenty often enough without also having to run the check every time the user pressed a key.

#### SAMPLE.....
**ERROR**: Uncaught SyntaxError: missing ) after argument list                                
**RESOLUTION**: This project is filled with roughly a gajillion timeouts and intervals, all firing at different rates (some of them randomly generated). Many of them had to be cleared out and reset based on certain events in the game. The syntax kept getting the better of me, causing errors and odd behavior. Usually it was one of the following 3 problems: a missing comma before the ms parameter, writing said parameter in seconds rather than ms, or forgetting to pass that parameter at all after writing a complicated function as the first agrument.
