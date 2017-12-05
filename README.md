# Alaska: Attack On Planet Glamtron
### Background and Overview

Alaska: Attack On Planet Glamtron is a twist on a classic sheep herding game utilizing sprite animation, pathfinding, and simple collision physics.

Users control an avatar, and attempt to herd AI components into a designated area within a specified time limit. AI components will 'repel' from the user avatar at a specified radius, allowing them to
be 'herded' throughout the game board.

Users will be able to:
- [ ] Move their avatars across the game board
- [ ] Interact with AI to move them across the game board
- [ ] Hear audio confirmations (e.g. sound effects) of actions such as properly herding an AI, losing the level, or completing the level
- [ ] Pause or Restart the game

In addition to the game screen itself, I plan to implement:
- [ ] A moving title screen
- [ ] A brief intro screen to game controls

With the except of Github and Linkedin link icons above the game screen, all other components will live inside the game screen (classic aracde 640 x 480 aspect ratio)
![alt text](http://res.cloudinary.com/nwilliams770/image/upload/v1512330533/title_screen_cbcn16.gif)

### MVPs
* Functional game written in Vanilla JS
* Adequate styling and bug-free UX
* Collision logic between player and game elements
* Audio effects implemented via `Web Audio API`

### Architecture and Technologies

This project will be implemented with the following technologies:
* Vanilla JavaScript for overall structure and game logic
* `HTML Canvas` for DOM manipulation and rendering
* `Web Audio API` for sound generation, processing, and control.
* Webpack to bundle and serve the various scripts.

I plan to use the following scripts in my project:
`world.js` : will handle logic for creating the game board
`avatar.js` : this script will house the physics logic for collisions as well as basic sprite animations for user avatar
`aliens.js`: this script will the handle the AI for the game pieces and logic for herding effect
`audio.js`: will handle logic for creation of `AudioEvent`s based on collisions or specific interactions on game board.

### Implementation Timeline

#### Weekend:
- [ ] Get `webpack` serving files
- [ ] Creation of game board
- [ ] User controls for avatar and sprite animation
- [ ] Basic collision logic to prevent user from going off-screen

#### Day 1:
- [ ] Create AI game pieces and their path patterns
- [ ] Start on collision interactions

#### Day 2:
- [ ] Finish collision interactions
- [ ] Set up main game logic e.g. timer and win/lose messages (styled as well)

#### Day 3: 
- [ ] Add pause/restart features
- [ ] Style game page outside of game screen (e.g. add LinkedIn/Github icon links as well as style background

#### Day 4:
- [ ] Learn `Web Audio API`
- [ ] Add sound assets

#### Bonus Features:
Pending the implementation timeline of the project there are a few features that could add to this project
- [ ] Multiple levels with increased difficulty (e.g. number of AIs to herd and more erratic paths)
- [ ] Enemy AIs that can 'destroy' alien AIs to be herded
- [ ] Lasergun to for player avatar to destroy Enemy AIs






