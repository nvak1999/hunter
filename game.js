/*
  Code modified from:
  http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
  using graphics purchased from vectorstock.com
*/

/* Initialization.
Here, we create and add our "canvas" to the page.
We also load all of our images.
*/
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 510;
canvas.height = 480;
document.getElementById("canvas").appendChild(canvas);
let bg = {};
let name = document.getElementById("field2").value;

function myFunction() {
  document.getElementById("field2").innerHTML = document.getElementById(
    "field1"
  ).value;
}

let highscore = 0;
let scoreboard = [];
let iscore = 0;
/**
 * Setting up our characters.
 *
 * Note that hero.x represents the X position of our hero.
 * hero.y represents the Y position.
 * We'll need these values to know where to "draw" the hero.
 * The same goes for the monsters
 */

let hero = { x: canvas.width / 2, y: canvas.height / 2 };
let monsters = [
  { x: 100, y: 100 },
  { x: 200, y: 200 },
  { x: 300, y: 300 },
];

let startTime = Date.now();
let SECONDS_PER_ROUND = 15;
let elapsedTime = 0;

function myFunction2() {
  hero.x = canvas.width / 2;
  hero.y = canvas.height / 2;
  elapsedTime = 0;
  startTime = Date.now();
  gameover = false;

  if (keysPressed["ArrowUp"]) {
    keysPressed["ArrowUp"] = false;
  }
  if (keysPressed["ArrowDown"]) {
    keysPressed["ArrowDown"] = false;
  }
  if (keysPressed["ArrowLeft"]) {
    keysPressed["ArrowLeft"] = false;
  }
  if (keysPressed["ArrowRight"]) {
    keysPressed["ArrowRight"] = false;
  }
}

function loadImages() {
  bg.image = new Image();

  bg.image.onload = function () {
    // show the background image
    bg.ready = true;
  };
  bg.image.src = "images/background.png";
  hero.image = new Image();
  hero.image.onload = function () {
    // show the hero image
    hero.ready = true;
  };
  hero.image.src = "images/hero.png";

  monsters.forEach((monster, i) => {
    monster.image = new Image();
    monster.image.onload = function () {
      // show the monster image
      monster.ready = true;
    };
    monster.image.src = `images/monster_${i + 1}.png`;
  });
}

/**
 * Keyboard Listeners
 * You can safely ignore this part, for now.
 *
 * This is just to let JavaScript know when the user has pressed a key.
 */
let keysPressed = {};
function setupKeyboardListeners() {
  // Check for keys pressed where key represents the keycode captured
  // For now, do not worry too much about what's happening here.
  document.addEventListener(
    "keydown",
    function (e) {
      keysPressed[e.key] = true;
    },
    false
  );

  document.addEventListener(
    "keyup",
    function (e) {
      keysPressed[e.key] = false;
    },
    false
  );
}

/**
 *  Update game objects - change player position based on key pressed
 *  and check to see if the monster has been caught!
 *
 *  If you change the value of 5, the player will move at a different rate.
 */
//  let startTime = Date.now();
//  const SECONDS_PER_ROUND = 15;
//  let elapsedTime = 0;
let gameover = false;
let update = function () {
  // Update the time.
  if (gameover) {
    return;
  }

  if (elapsedTime >= 15) {
    elapsedTime = 0;
    gameover = true;
    score = 0;
    return;
  }

  elapsedTime = Math.floor((Date.now() - startTime) / 1000);

  if (keysPressed["ArrowUp"]) {
    hero.y -= 5;
  }
  if (keysPressed["ArrowDown"]) {
    hero.y += 5;
  }
  if (keysPressed["ArrowLeft"]) {
    hero.x -= 5;
  }
  if (keysPressed["ArrowRight"]) {
    hero.x += 5;
  }

  if (hero.y == 0) {
    hero.y = canvas.height;
  } else if (hero.y == canvas.height) {
    hero.y = 0;
  }
  if (hero.x == 0) {
    hero.x = canvas.width;
  } else if (hero.x == canvas.width) {
    hero.x = 0;
  }
  // Check if player and monster collided. Our images
  // are 32 pixels big.

  monsters.forEach((monster) => {
    if (
      hero.x <= monster.x + 32 &&
      monster.x <= hero.x + 32 &&
      hero.y <= monster.y + 32 &&
      monster.y <= hero.y + 32
    ) {
      // Pick a new location for the monster.
      // Note: Change this to place the monster at a new, random location.
      monster.x = Math.floor(Math.random() * 450);
      monster.y = Math.floor(Math.random() * 450);
      score = score + 1;
      scoreboard[iscore] = score;
      iscore++;
      if (score >= highscore) {
        highscore = score;
      }
    }
  });
};
let score = 0;
/**
 * This function, render, runs as often as possible.
 */
function render() {
  if (bg.ready) {
    ctx.drawImage(bg.image, 0, 0);
    document.getElementById("score").innerHTML = `Score: ${score}`;
  }
  if (hero.ready) {
    ctx.drawImage(hero.image, hero.x, hero.y);
  }
  monsters.forEach((monster) => {
    if (monster.ready) {
      ctx.drawImage(monster.image, monster.x, monster.y);
    }
  });
  ctx.fillText(
    `Seconds Rem aining: ${SECONDS_PER_ROUND - elapsedTime}`,
    20,
    20
  );
  document.getElementById("score").innerHTML = `Score: ${score}`;
  document.getElementById("high").innerHTML = `High score:  ${highscore}`;
}

/**
 * The main game loop. Most every game will have two distinct parts:
 * update (updates the state of the game, in this case our hero and monster)
 * render (based on the state of our game, draw the right things)
 */
function main() {
  update();

  render();
  // Request to do this again ASAP. This is a special method
  // for web browsers.
  requestAnimationFrame(main);
}

// Cross-browser support for requestAnimationFrame.
// Safely ignore this line. It's mostly here for people with old web browsers.
var w = window;
requestAnimationFrame =
  w.requestAnimationFrame ||
  w.webkitRequestAnimationFrame ||
  w.msRequestAnimationFrame ||
  w.mozRequestAnimationFrame;

// Let's play this game!
loadImages();
setupKeyboardListeners();
main();
