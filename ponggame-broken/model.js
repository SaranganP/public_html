const STATE = { STARTUP: 0, PLAYING: 1, GAMEOVER: 2, PAUSED: 3 };

const BOARD_WIDTH = 500;
const BOARD_HEIGHT = 500;
const PADDLE_WiDTH = 25;
let PADDLE_HEIGHT = 100;
const BALL_RADIUS = 12.5;
let PADDLE_VELOCITY = 5;
const PADDLE_FORCE = 1.1; // 110% of speed before

class Model {
    ball;
    paddleL;
    paddleR;
    scoreL = 0;
    scoreR = 0;
    is_cpu = false;
    hard_mode = false;
    state = STATE.STARTUP;
    intervalID = -1;

    constructor() {
        this.resetGame();
    }

    resetGame() {
        this.state = STATE.STARTUP;
        clearTimeout(this.intervalID);
        this.resetBall();
        this.paddleL = new Paddle(0, (BOARD_HEIGHT - PADDLE_HEIGHT)/2, PADDLE_WiDTH, PADDLE_HEIGHT, SIDE.LEFT, "red");
        this.paddleR = new Paddle(BOARD_WIDTH - PADDLE_WiDTH, (BOARD_HEIGHT - PADDLE_HEIGHT)/2, PADDLE_WiDTH, PADDLE_HEIGHT, SIDE.RIGHT, "green"); // Green
    }

    resetBall() {
        this.ball = new Ball(BOARD_WIDTH / 2, BOARD_HEIGHT / 2, 1, -1);
    }

}
