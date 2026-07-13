var block = document.getElementById("block");
var hole = document.getElementById("hole");
var character = document.getElementById("character");
var textDisplay = document.getElementById("textDisplay");
var jumping = 0;
let isGameOver = false;
let score = 0;

hole.addEventListener('animationiteration', () => {
    if (!isGameOver) {
        var random = -((Math.random()*300) + 150);
        hole.style.top = random + "px";
        score ++;
    }
});

setInterval(function(){
    if (!isGameOver) {
        var characterTop = parseInt(window.getComputedStyle(character).getPropertyValue("top"));
        if (jumping === 0) {
            character.style.top = (characterTop+3)+"px";
        }
        var blockLeft = parseInt(window.getComputedStyle(block).getPropertyValue("left"));
        var holeTop = parseInt(window.getComputedStyle(hole).getPropertyValue("top"));
        var cTop = -(500-characterTop);
        if((characterTop>480) || ((blockLeft < 20) && (blockLeft > -50) && ((cTop < holeTop) || (cTop > holeTop+130)))) {
            isGameOver = true;
            textDisplay.innerHTML = "GAME OVER - Final Score: " + score;
            character.style.top = 150 + "px"
            score = 0;
        }
    }
}, 10);

function jump() {
    jumping = 1;
    let jumpCount = 0;
    var jumpInterval = setInterval(() => {
        var characterTop = parseInt(window.getComputedStyle(character).getPropertyValue("top"));
        if ((characterTop > 6) && (jumpCount < 15)) {
            character.style.top = (characterTop-5)+"px";
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
        if (!isGameOver) {
            jump();
        } else {
            textDisplay.innerHTML = "";
            isGameOver = false;
        }
    }
});

