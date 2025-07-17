const SIDE = { NONE: 0, LEFT: 1, RIGHT: 2 };

class Paddle {
    posx;
    posy;
    width;
    height;
    color;
    constructor(posx, posy, width, height, side, color) {
        this.posx = posx;
        this.posy = posy;
        this.width = width;
        this.height = height;
        this.color = color;
        this.side = side;
        this.vely = 0;
    }

    move(is_cpu, ball) {
        if (is_cpu) {
            // A simple AI to follow the ball
            const paddle_center = this.posy + this.height / 2;
            if (paddle_center < ball.posy - 20) { // -20 is a dead zone to prevent jittering
                this.vely = PADDLE_VELOCITY;
            } else if (paddle_center > ball.posy + 20) {
                this.vely = -PADDLE_VELOCITY;
            } else {
                this.vely = 0;
            }
        }
        this.height = PADDLE_HEIGHT;
        this.posy = Math.min(BOARD_HEIGHT - PADDLE_HEIGHT, Math.max(0, this.posy + this.vely));
    }

    bounce(ball) {
        // Check if ball is within paddle's y-range
        if (ball.posy + BALL_RADIUS > this.posy && ball.posy - BALL_RADIUS < this.posy + this.height) {
            // Check for left paddle collision
            if (this.side === SIDE.LEFT && ball.velx < 0 && ball.posx - BALL_RADIUS < this.posx + this.width) {
                ball.velx *= -PADDLE_FORCE;
                ball.vely = (ball.posy - (this.posy + this.height / 2)) * 0.2;
            }
            // Check for right paddle collision
            else if (this.side === SIDE.RIGHT && ball.velx > 0 && ball.posx + BALL_RADIUS > this.posx) {
                ball.velx *= -PADDLE_FORCE;
                ball.vely = (ball.posy - (this.posy + this.height / 2)) * 0.2;
            }
        }
        return SIDE.NONE;
    }
}

// function bounceRightPaddle(paddle) {
//     if (this.posx + BALL_RADIUS < paddle.posx) return SIDE.NONE;
//     if (this.posx + BALL_RADIUS > paddle.posx + paddle.width) return SIDE.LEFT; // Someone got a point...
//     if (this.posy < paddle.posy) return SIDE.NONE;
//     if (this.posy > paddle.posy + paddle.height) return SIDE.NONE;
//     if (this.velx > 0) {
//         this.velx = -PADDLE_FORCE * Math.abs(this.velx);
//         // add other spin, etc.
//         // add sound?
//     }
//     return SIDE.NONE;
// }
