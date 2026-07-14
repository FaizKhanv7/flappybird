// screens
const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const gameoverScreen = document.getElementById("gameover-screen");
const screen = document.getElementById("game");

const finalScoreText = document.getElementById("final-score");
const highScoreText = document.getElementById("high-score");

var block = document.getElementById("block");
var obstacleContainer = document.getElementById("obstacle-container")
var hole = document.getElementById("hole");
var character = document.getElementById("character");
var textDisplay = document.getElementById("textDisplay");
var textDisplay2 = document.getElementById("textDisplay2");
var jumping = 0;
let isGameOver = false;
let score = 0;
let speed = 2;
let gravity = 4;
let highScore = localStorage.getItem("cursedFlappyHighScore") || 0;
let currentActiveScreen = "start";

obstacleContainer.addEventListener('animationiteration', () => {
    if (!isGameOver) {
        // set hole in random position
        var random = -(Math.random()*350);
        hole.style.top = random + "px";

        // score stuff
        score ++;
        textDisplay.innerHTML = "Score: " + score;

        // increase speed
        speed = Math.max(0.6, 2 - (score * 0.05));
        obstacleContainer.style.animationDuration = speed + "s";
        textDisplay2.innerHTML = "Speed: " + speed;

        // increase gravity slightly
        gravity = Math.min(gravity + 0.07);
    }
});

function changeScreen(screenName) {
    startScreen.classList.add("display-none");
    gameScreen.classList.add("display-none");
    gameoverScreen.classList.add("display-none");

    if (screenName === "start") {
        currentActiveScreen = "start";
        startScreen.classList.remove("display-none");
    } else if (screenName === "game") {
        currentActiveScreen = "game";
        gameScreen.classList.remove("display-none");
        resetGameValues();
    } else if (screenName === "gameover") {
        currentActiveScreen = "gameover";
        gameoverScreen.classList.remove("display-none");

        if (score > highScore) {
            highScore = score;
            localStorage.setItem("cursedFlappyHighScore", highScore);
        }

        finalScoreText.innerHTML = "Final Score: " + score;
        highScoreText.innerHTML = "High Score: " + highScore;
    }
}

function triggerShake() {
    screen.classList.add("shake-active");

    setTimeout(() => {
        screen.classList.remove("shake-active");
    }, 300);
}

function resetGameValues() { 
    score = 0;
    speed = 2;
    gravity = 4;
    isGameOver = false;
    hole.style.top = "150px";
    obstacleContainer.style.animation = 'none';
    obstacleContainer.offsetHeight;
    obstacleContainer.style.animation = 'moveObstacle 2s infinite linear';
}

setInterval(function(){
    if (!isGameOver) {
        var characterTop = parseInt(window.getComputedStyle(character).getPropertyValue("top"));
        var holeTop = parseInt(window.getComputedStyle(hole).getPropertyValue("top"));
        var blockLeft = parseInt(window.getComputedStyle(obstacleContainer).getPropertyValue("left"));

        if (jumping === 0) {
            if (holeTop < 350) {
                hole.style.top = (holeTop+gravity)+"px";
            }
        }

        var isHorizontallyOverlapping = (blockLeft < 80) && (blockLeft > 20);

        var isCharacterAboveHole = characterTop < holeTop;
        var isCharacterBelowHole = characterTop + 30 > holeTop + 150;
        
        if((characterTop>470) || (characterTop < 0) || (isHorizontallyOverlapping && (isCharacterAboveHole || isCharacterBelowHole))) {
            triggerShake();
            isGameOver = true;
            changeScreen("gameover");
        }
    }
}, 10);

function jump() {
    jumping = 1;
    let jumpCount = 0;
    var jumpInterval = setInterval(() => {
        var characterTop = parseInt(window.getComputedStyle(character).getPropertyValue("top"));
        var holeTop = parseInt(window.getComputedStyle(hole).getPropertyValue("top"));
        if ((holeTop > 6) && (jumpCount < 15)) {
            hole.style.top = (holeTop-5)+"px";
        }
        if (jumpCount > 20) {
            clearInterval(jumpInterval);
            jumping = 0;
            jumpCount = 0;
        }
        jumpCount ++;
    }, 10);
}

document.addEventListener('keydown', (event) => {
    if (event.key === ' ') {
        if (!isGameOver && currentActiveScreen !== "start") {
            jump();
        } else {
            if (currentActiveScreen === "start") {
                changeScreen("game");
            } else if (currentActiveScreen === "gameover") {
                isGameOver = false;
                changeScreen("start");
            }
        }
    }
});

