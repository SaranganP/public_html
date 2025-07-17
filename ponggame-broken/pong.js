let model = new Model();

function onTick() {
    switch (model.state) {
        case STATE.STARTUP:
            model.state = STATE.PLAYING;
            break;
        case STATE.PLAYING:
            model.state = play();
            break;
        case STATE.PAUSED:
            // Do nothing, just redraw the paused screen
            break;
        case STATE.GAMEOVER:
            // Stop the game loop
            clearTimeout(model.intervalID);
            break;
    }
    draw_game(model);
    if (model.state !== STATE.GAMEOVER) {
        model.intervalID = setTimeout(onTick, 10);
    }
}

function play() {
    model.paddleL.move(false, model.ball);
    model.paddleR.move(model.is_cpu, model.ball);
    let scoreSide = model.ball.bounce([model.paddleL, model.paddleR]);
    if (scoreSide != SIDE.NONE) {
        if (scoreSide == SIDE.LEFT) model.scoreR++; // Right player scores
        if (scoreSide == SIDE.RIGHT) model.scoreL++; // Left player scores
        updateScore(model);
        model.resetBall();
        if (model.scoreL >= 10 || model.scoreR >= 10) return STATE.GAMEOVER;
    }
    model.ball.move();
    // Add serving the ball?
    // If a player wins, stop the game...
    return STATE.PLAYING;
}

onTick();
