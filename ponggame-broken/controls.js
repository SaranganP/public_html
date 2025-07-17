window.addEventListener("keydown", keyDown);
const pause_button = document.getElementById("pause");

function keyDown(event) {
    const key = event.code;
    // console.log(`KEYDOWN: ${key}`);

    switch (key) {
        case "KeyW":
            model.paddleL.vely = -PADDLE_VELOCITY;
            break;
        case "KeyS":
            model.paddleL.vely = PADDLE_VELOCITY;
            break;
        case "ArrowUp":
            model.paddleR.vely = -PADDLE_VELOCITY;
            break;
        case "ArrowDown":
            model.paddleR.vely = PADDLE_VELOCITY;
            break;
        case "Space":
            togglePause();
            break;
        case "End":
            model.resetGame();
            break;
    }
}

window.addEventListener("keyup", keyUp);
function keyUp(event) {
    const key = event.code;
    // console.log(`KEYUP: ${key}`);

    switch (key) {
        case "KeyW":
        case "KeyS":
            model.paddleL.vely = 0;
            break;
        case "ArrowUp":
        case "ArrowDown":
            model.paddleR.vely = 0;
            break;
    }
}

function resetGame() {
    model.scoreR = 0;
    model.scoreL = 0;
    model.resetGame();
    onTick();
}

function set_cpu(event) {
    model.is_cpu = event.target.checked;
}

function togglePause() {
    if (model.state === STATE.PLAYING) {
        model.state = STATE.PAUSED;
        pause_button.textContent = "RESUME";
    } else if (model.state === STATE.PAUSED) {
        model.state = STATE.PLAYING;
        pause_button.textContent = "PAUSE";
    }
}

pause_button.onclick = togglePause;

function set_hard_mode(event) {
    model.hard_mode = event.target.checked;
    if (model.hard_mode) {
        PADDLE_HEIGHT = 75;
        PADDLE_VELOCITY = 8;
    } else {
        PADDLE_HEIGHT = 100;
        PADDLE_VELOCITY = 5;
    }
    resetGame();
}