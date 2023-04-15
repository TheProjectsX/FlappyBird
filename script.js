/*
Flapp Bird Game usig Pure Html, Css and JavaScript

Code Explanations:

1. Checking if bird hits the bottom of top pool or goes inside of top pool:
if birdX (the position of bird in the X axis) is smaller then the end position of top pool, then bird is inside the pool thus, Game Over.
Or birdX and the end position of top pool is same, then bird hit the top pool thus, Game Over.
But the BirdY (the position of bird in the Y axis) needs to be same as the Y axis of top Pool

2. Checking if bird hits the top of bottom pool or goes inside of bottom pool:
if birdX (the position of bird in the X axis) is greater then the start position (+1: As, we cannot measer the bottom of bird seperately) of bottom pool, then bird is inside the pool thus, Game Over.
Or birdX and the start position (+1: As, we cannot measer the bottom of bird seperately) of bottom pool is same, then bird hit the bottom pool thus, Game Over
But the BirdY (the position of bird in the Y axis) needs to be same as the Y axis of bottom Pool


3. Checking if bird hits the body of top pool:
if birdX (the position of bird in the X axis) is smoller then the end of top pool, means, bird is in the Axis of Top Pool's Body. Now, if BirdY (the position of bird in the Y axis) is -1 then The position of Top pool in the Y axis, it means, the bird is Collided (Game Over), as, bird's right axis will (visually) hit the pool and if BirdY is +1 then the position of top pool, it means, the bird is Collided (Game Over), as, bird's left axis will (visually) hit the pool.

4. Checking if bird hits the body of bottom pool:
if birdX (the position of bird in the X axis) is greater then the start of bottom pool, means, bird is in the Axis of botom Pool's Body. Now, if BirdY (the position of bird in the Y axis) is -1 then The position of bottom pool in the Y axis, it means, the bird is Collided (Game Over), as, bird's right axis will (visually) hit the pool and if BirdY is +1 then the position of bottom pool, it means, the bird is Collided (Game Over), as, bird's left axis will (visually) hit the pool


5. Clearing interval 2 times
Clearing BirdMovementInterval first time for Stopping bird to move down, while we move it up. (birdMovmentInverval = null is for removing interval history)
In 2nd time, We are clearing the last BirdMovementInterval because, Everytime we touch screen or click Keyboard to move, a new interval starts. If we don't remove it, we will se  errors

*/


// Const Variabls
const howToPlay = document.getElementById("howToPlay");
const gameBoard = document.getElementById("gameBoard");
const score = document.getElementById("score");
const highScore = document.getElementById("highScore");
const bird = document.getElementById("bird");


// Sound Play
const wingAudio = new Audio("audio/wing.wav")
const pointAudio = new Audio("audio/point.wav")
const hitAudio = new Audio("audio/hit.wav")
const dieAudio = new Audio("audio/die.wav")

// SCript Helper Variables
let birdX, birdY, poolPositions, poolHeight, poolId, birdMovementInterval, gameInterval, birdAnimationInterval, currentScore, currentHighScore;

let screenWidth = window.screen.width;

// Setup Game
function setupGame() {
    clearInterval(birdMovementInterval);
    clearInterval(gameInterval);

    howToPlay.style.display = "block";

    document.querySelector(".wings").style.animation = "wingFly .5s infinite";
    bird.style.transform = "rotate(0deg)";

    birdX = 8;
    birdY = 4;

    poolPositions = [
        11,
        17,
        23
    ];

    poolHeight = [
        [[1, 6], [10, 15]],
        [[1, 6], [10, 15]],
        [[1, 6], [10, 15]]
    ];

    poolId = [
        [1, 2],
        [3, 4],
        [5, 6]
    ];

    currentScore = 0;
    currentHighScore = 0;

    birdMovementInterval = null;
    gameInterval = null;

    gameOver = false;

    if (screenWidth < 500) {
        birdSpeed = 250;
        gameSpeed = 300;
        birdFlyX = 1;
    }

    setScore(true);
    updatePoolPosition(true);
    checkAndSetPool(true);
    updateBirdPosition(true);

    setTimeout(() => {
        howToPlay.style.display = "none";
    }, 3000);

}

// Space to go through
let poolGap = 6; // Gap from one Pool to Another
let poolSpace = 4; // Space from top pool to bottom

let poolTopEndMin = 3;
let poolTopEndMax = 9;

// Game Speeds
let birdSpeed = 150;
let gameSpeed = 300;
let birdFlyX = 2;


// Game Over?
let gameOver = false;


// Score setting function
function setScore(check) {
    // Don't check for localstorage, just update the scores
    if (!(check)) {
        pointAudio.play();

        currentScore += 1;
        score.innerText = currentScore.toString().length < 2 ? "0" + currentScore : currentScore;

        if (currentScore > currentHighScore) {
            currentHighScore = currentScore;
            highScore.innerText = currentHighScore.toString().length < 2 ? "0" + currentHighScore : currentHighScore;

            localStorage.setItem("highScore", currentHighScore);
        }

    } else { // Check for localstorage to update the score
        score.innerText = currentScore.toString().length < 2 ? "0" + currentScore : currentScore;
        currentHighScore = localStorage.getItem("highScore");
        highScore.innerText = currentHighScore.toString().length < 2 ? "0" + currentHighScore : currentHighScore;
    }
}

// Game Play Event Listeners

// Play by keyboard
window.addEventListener("keydown", (e) => {
    if (gameOver) {
        return
    }

    if (e.code == "Space" || e.code == "ArrowUp") {
        if (gameInterval == null) {
            howToPlay.style.display = "none";
            gameInterval = setInterval(initGame, gameSpeed);
        }

        wingAudio.play();
        clearInterval(birdMovementInterval);
        birdMovementInterval = null; // Explanation: 5
        birdX -= birdFlyX;

        bird.style.gridArea = `${birdX} / ${birdY} / auto / auto`
        setTimeout(() => {
            clearInterval(birdMovementInterval);
            birdMovementInterval = null; // Explanation: 5

            birdMovementInterval = setInterval(updateBirdPosition, birdSpeed);
        }, birdSpeed);

    } else if (e.code == "KeyA") {
        clearInterval(birdMovementInterval);
        clearInterval(gameInterval);
    } else if (e.code == "KeyV") {
        gameInterval = setInterval(initGame, gameSpeed);
        setTimeout(() => {
            birdMovementInterval = setInterval(updateBirdPosition, birdSpeed);
        }, birdSpeed);
    }
});

// Play by Touch
document.addEventListener("touchend", () => {
    if (gameOver) {
        return
    }

    if (gameInterval == null) {
        howToPlay.style.display = "none";
        gameInterval = setInterval(initGame, gameSpeed);
    }

    wingAudio.play();
    clearInterval(birdMovementInterval);
    birdMovementInterval = null; // Explanation: 5
    birdX -= birdFlyX;

    bird.style.gridArea = `${birdX} / ${birdY} / auto / auto`
    setTimeout(() => {
        clearInterval(birdMovementInterval);
        birdMovementInterval = null; // Explanation: 5

        birdMovementInterval = setInterval(updateBirdPosition, birdSpeed);
    }, birdSpeed - 100);
})

// Update Pools
function updatePoolPosition(setup) {
    let change;

    if (setup) {
        change = 0;
    } else {
        change = 1;
    }

    for (let i = 0; i < poolId.length; i++) {
        let topPool = document.querySelector(`[data-poolId="${poolId[i][0]}"]`);
        let bottomPool = document.querySelector(`[data-poolId="${poolId[i][1]}"]`);

        let gridArea = `1 / ${poolPositions[i] - change} / auto / auto`;

        topPool.style.gridArea = gridArea;
        bottomPool.style.gridArea = gridArea;

        topPool.style.gridRow = `${poolHeight[i][0][0]} / ${poolHeight[i][0][1]}`;
        bottomPool.style.gridRow = `${poolHeight[i][1][0]} / ${poolHeight[i][1][1]}`;;

        poolPositions[i] -= change;

        // If pool crossed Bird, Add points
        if (poolPositions[i] + 1 == birdY) {
            setScore();
        }

    }
}

// Generate Ramdom pool height
function getRandomPoolHeight() {
    let topPoolEnd = Math.floor(Math.random() * (poolTopEndMax - poolTopEndMin + 1)) + poolTopEndMin;
    let bottomPoolStart = topPoolEnd + poolSpace;

    return [topPoolEnd, bottomPoolStart];
}

// Check if the pool coolides in the end. If does, add new Pool in the end
function checkAndSetPool(setup) {
    // If it's in setup, set random pool gap for the 2 and 3th Pool. And return
    if (setup) {
        // set the 2nd pool in random position
        let [topPoolEnd1, bottomPoolStart1] = getRandomPoolHeight();
        poolHeight[1][0] = [1, topPoolEnd1]
        poolHeight[1][1] = [bottomPoolStart1, 15]

        // set the 3rd pool in random position
        let [topPoolEnd2, bottomPoolStart2] = getRandomPoolHeight();

        poolHeight[2][0] = [1, topPoolEnd2]
        poolHeight[2][1] = [bottomPoolStart2, 15]

        return;
    }

    for (let i = 0; i < poolPositions.length; i++) {
        if (poolPositions[i] == 1) {

            // The heighest Number in the pool positions array is the last position of the three pools. So add the pool gap with it to Set the Last Pool 
            poolPositions[i] = Math.max(...poolPositions) + poolGap;
            let [topPoolEnd, bottomPoolStart] = getRandomPoolHeight();

            poolHeight[i][0] = [1, topPoolEnd]
            poolHeight[i][1] = [bottomPoolStart, 15]

        }
    }
}

// Update bird position - It will be executed differently, so that we can control the speed
function updateBirdPosition(setup) {
    if ((gameInterval == null && (setup != true) || gameOver)) {
        return;
    }
    if (!(setup)) {
        birdX += 1;
    }

    bird.style.gridArea = `${birdX} / ${birdY} / auto / auto`

    if (!(setup)) {
        checkGameOver();
    }
}


// Check if Bird Collides with Pool
function birdWithPool() {
    let collided = false;
    // Check if collides with bottom of top or top of bottom. Or body of any pool
    for (let i = 0; i < poolHeight.length; i++) {
        if ((poolHeight[i][0][1] >= birdX) && (poolPositions[i] == birdY)) {  // Top pool // Explanation: 1
            console.log("GameOver - By hitting top Pool's bottom")
            // clearInterval(birdMovementInterval)
            // clearInterval(gameInterval)
            gameOver = true;
            collided = true;
            break;
        } else if ((poolHeight[i][1][0] <= birdX) && (poolPositions[i] == birdY)) { // Bottom pool // Explanation: 2
            console.log("GameOver - By hitting bottom Pool's top")
            gameOver = true;
            collided = true;
            break;
        } else if (((poolPositions[i] - 1 == birdY)) && (poolHeight[i][0][1] - 1 > birdX)) { // Top pool // Explanation: 3
            console.log("GameOver - By hitting top Pool's body")
            gameOver = true;
            collided = true;
            break;
        } else if (((poolPositions[i] - 1 == birdY)) && (poolHeight[i][1][0] < birdX)) { // Bottom pool // Explanation: 4
            console.log("GameOver - By hitting bottom Pool's body")
            gameOver = true;
            collided = true;
            break;
        }

    }

    return collided;

}

// Give an Animation of bird landing to the ground when game over
function birdGameOverAnimation() {
    document.querySelector(".wings").style.animation = "none";
    bird.style.transform = "rotate(60deg)";

    /* Avoiding use of ToTheTop animation to Avoid Fricking Error
    if (screenWidth > 500) {
        birdAnimationInterval = setInterval(() => {
            if (birdX > 1) {
                birdX -= 1;
                bird.style.gridArea = `${birdX} / ${birdY} / auto / auto`
            }
        }, 80);
    }
    */

    setTimeout(() => {
        // clearInterval(birdAnimationInterval)
        dieAudio.play();
        birdAnimationInterval = setInterval(() => {
            if (birdX < 14) {
                birdX += 1;
                bird.style.gridArea = `${birdX} / ${birdY} / auto / auto`
            } else {
                clearInterval(birdAnimationInterval);
            }
        }, 80);
    }, 800);
}

/*
Check Game Over 
Possibilities:
  Bird hits the top
  Bird hits the bottom
  Bird hits bottm of top pool
  Bird hits top of bottom pool
  Bird hits any side of any Pools
*/
function checkGameOver() {
    if (gameOver) {
        return true;
    }
    if ((birdX == 1) || (birdX == 14) || (birdWithPool())) {
        console.log("GameOver")
        gameOver = true;
        hitAudio.play();
        clearInterval(birdMovementInterval);
        clearInterval(gameInterval);
        birdGameOverAnimation();
        // setTimeout(birdGameOverAnimation, 500);
        setTimeout(() => {
            clearInterval(birdAnimationInterval);
            alert("Game Over");
            setupGame();
        }, 2000);

        return true;
    }

    return false;
}


// Game Initializer
function initGame() {
    updatePoolPosition();
    checkAndSetPool();
    if (checkGameOver() || gameOver) {
        return
    }
}

// Setting up game for FIrst time
setupGame();