# Mars Rescue
Your Mission: Following an equipment failure, humanity's top astrobiologist is stranded on Mars. NASA needs you to pilot the rescue mission. You will have to navigate a treacherous journey, littered with space debris. You will also need to collect fuel floating in space along the way. If you run out of fuel or collide with debris, your mission is a failure. Humanity is counting on you!

## Deployed Game: 
[Click here to play Mars Rescue now!](https://pages.git.generalassemb.ly/brianogilvie/mars-rescue/)

## How To Play:
Your mission is a success when your trip progress meter reaches 100%. You'll have to dodge all the debris and collect sufficient fuel to last that long.

### Desktop:
Control your ship with your keyboard arrow keys. Toggle your speed boost with the "S" key.

### Mobile:
On mobile devices, a virtual set of arrows appears on the console. Control your ship by tapping those. Toggle your speed boost by tapping the "S" in the console. 

## Technologies Used:
This project is built using vanilla Javascript and DOM manipulation. All styling and layout is done with CSS. The animation is created by a combination of CSS transitions, CSS keyframe animation, and javascript intervals/timeouts/requestAnimationFrames.

## Wireframes:
[Game In Progress](https://res.cloudinary.com/brian-ogilvie/image/upload/v1545078425/Project%201%20Wireframes/Game%20In%20Progress.jpg)

[Landing Screen](https://res.cloudinary.com/brian-ogilvie/image/upload/v1545078427/Project%201%20Wireframes/Welcome%20Screen.jpg)

[Game Start](https://res.cloudinary.com/brian-ogilvie/image/upload/v1545078426/Project%201%20Wireframes/Game%20Start.jpg)

[Full Browser Window](https://res.cloudinary.com/brian-ogilvie/image/upload/v1545078427/Project%201%20Wireframes/Browser%20Window.jpg)

## Additional Information
### Design Approach
From the onset, I felt that the most challenging part of this project would be making the UI smooth and responsive. This meant that having a stable, reliable model was of the utmost importance early on. My collision detection evaluates four conditions for every space object every time they move: 
- The object's X coordinate is less than the ship's X coordinate + it's width

- Object's X + it's width is greater than the ship's X

- Object's Y + it's height is greater than the ship's Y

- Object's Y is less than the ship's Y + it's height
    
If all four of these conditions were true, there was a collision! Then I evaluate whether the colliding object was space debris or a fuel source and respond accordingly. Once this logic was running reliably, I was able to focus on animation and design. Getting the animation to run smoothly was a delecate dance between the timimg of JS intervals and the length of CSS transitions. 

### Mobile Responsiveness
Given the small screen and lack of physical keyboard on mobile devices, responsiveness requires a signifigant redesign. In order to maximize the play space, the game console is moved to the side, rather than on top. Also, a virtual set of arrows appears in the console to give the user the ability to control the ship. 

### The Future
The next version of this game will have a more dramatic ending, with the ship safely landing on Mars to rescue the stranded scientist. Also, I expect that converting my play space to a JS Canvas will have a marked impact on smoothness and performance. 
