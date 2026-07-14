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
let currentPowerUp = "none";
const powerUps = ["SlowMo", "NoGravity"];
let isPowerUpActive = false;
let highScore = localStorage.getItem("cursedFlappyHighScore") || 0;
let currentActiveScreen = "start";
let noGravityActive = false;
let noGravityHoleTop = 0;
let currentRotation = 0;
let isRotatedDown = true;
let isRotatedUp = false;


function getCenteredHoleTop() {
    const characterTop = parseInt(window.getComputedStyle(character).top) || 0;
    const characterHeight = character.offsetHeight;
    const holeHeight = hole.offsetHeight;
    return characterTop + (characterHeight / 2) - (holeHeight / 2);
}

function setPipeSpeedMultiplier(multiplier) {
    const anim = obstacleContainer.getAnimations()[0];
    if (anim) anim.playbackRate = multiplier;
}

function baseSpeedMultiplierFromScore(s) {
    constEffectiveDuration = Math.max(0.6, 2 - (s * 0.05));
}

function rotateImage(rotateAmount) {
    currentRotation += rotateAmount;

    const img = document.getElementById("character");

    img.style.transform = `rotate(${currentRotation}deg)`;
}

obstacleContainer.addEventListener('animationiteration', () => {
    if (!isGameOver) {

        // set hole in random position
        var random = -(Math.random()*350);
        hole.style.top = random + "px";

        // score stuff
        score ++;
        textDisplay.innerHTML = "Score: " + score;

        // trigger random powerup every 5
        if ((score % 5) === 0 && !isPowerUpActive) {
            currentPowerUp = powerUps[Math.floor(Math.random() * powerUps.length)];
            textDisplay2.innerHTML = "PowerUp: " + currentPowerUp;

            if (currentPowerUp === "SlowMo") {
                isPowerUpActive = true;
                setPipeSpeedMultiplier(0.4);
                setTimeout(() => {
                    isPowerUpActive = false;
                    currentPowerUp = "none";
                    textDisplay2.innerHTML = "PowerUp: None";
                    setPipeSpeedMultiplier(baseSpeedMultiplierFromScore(score));
                }, 4000);
            } else if (currentPowerUp === "NoGravity") {
                isPowerUpActive = true;
                noGravityActive = true;
                noGravityHoleTop = getCenteredHoleTop();
                hole.style.top = noGravityHoleTop + "px";

                setTimeout(() => {
                    isPowerUpActive = false;
                    noGravityActive = false;
                    currentPowerUp = "none";
                    textDisplay2.innerHTML = "PowerUp: None";
                }, 4000);
            }
        }

        // increase speed
        if (!isPowerUpActive) {
            setPipeSpeedMultiplier(baseSpeedMultiplierFromScore(score));
        }

        // increase gravity slightly
        gravity = Math.min(8, gravity + 0.07);
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
    const img = document.getElementById("character"); 
    currentRotation = 0;
    img.style.transform = 'rotate(0deg)';
    score = 0;
    textDisplay.innerHTML = "Score: " + score;
    isPowerUpActive = false;
    currentPowerUp = "none";
    textDisplay2.innerHTML = "PowerUp: None";
    speed = 2;
    gravity = 4;
    isGameOver = false;
    hole.style.top = "150px";
    obstacleContainer.style.animation = 'none';
    obstacleContainer.offsetHeight;
    obstacleContainer.style.animation = 'moveObstacle 2s infinite linear';
    setPipeSpeedMultiplier(1);
}

setInterval(function(){
    if (!isGameOver) {
        var characterTop = parseInt(window.getComputedStyle(character).getPropertyValue("top"));
        var holeTop = parseInt(window.getComputedStyle(hole).getPropertyValue("top"));
        var blockLeft = parseInt(window.getComputedStyle(obstacleContainer).getPropertyValue("left"));

        if (noGravityActive) {
            hole.style.top = noGravityHoleTop + "px";
        } else if (jumping === 0) {
            if (holeTop < 350) {
                hole.style.top = (holeTop+gravity)+"px";
                if (!isRotatedDown) {
                    isRotatedDown = true;
                    isRotatedUp = false;
                    rotateImage(90);
                }
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
    if (noGravityActive) return;
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
            if (!isRotatedUp) {
                isRotatedDown = false;
                isRotatedUp = true;
                rotateImage(-90);
            }
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

