const canvas = document.getElementById("gameboard");
const ctx = canvas.getContext("2d");
const cpucheck = document.getElementById("cpucheck");
const scoreboard = document.getElementById("scoreboard");

function updateScore(model) {
    scoreboard.innerHTML = `${model.scoreL} : ${model.scoreR}`;
}

function draw_game(model) {
    ctx.fillStyle = "grey";
    ctx.fillRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);

    // Draw the center line
    ctx.strokeStyle = "#FFD700"; // Gold
    ctx.lineWidth = 5;
    ctx.setLineDash([10, 10]); // Creates a dashed line effect
    ctx.beginPath();
    ctx.moveTo(BOARD_WIDTH / 2, 0);
    ctx.lineTo(BOARD_WIDTH / 2, BOARD_HEIGHT);
    ctx.stroke();
    ctx.setLineDash([]); // Reset line dash for other drawings

    draw_ball(ctx, model.ball);
    draw_paddle(ctx, model.paddleL);
    draw_paddle(ctx, model.paddleR);

    if (model.state === STATE.GAMEOVER) {
        ctx.fillStyle = "#FFD700"; // Gold
        ctx.font = "40px 'Press Start 2P', cursive";
        ctx.textAlign = "center";
        let winner = model.scoreL >= 10 ? "Left Player" : "Right Player";
        ctx.fillText("Game Over", BOARD_WIDTH / 2, BOARD_HEIGHT / 2 - 40);
        ctx.fillText(`${winner} Wins!`, BOARD_WIDTH / 2, BOARD_HEIGHT / 2);
        ctx.font = "20px 'Press Start 2P', cursive";
        ctx.fillText("Press 'End' to Reset", BOARD_WIDTH / 2, BOARD_HEIGHT / 2 + 40);
    } else if (model.state === STATE.PAUSED) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);
        ctx.fillStyle = "#FFD700"; // Gold
        ctx.font = "40px 'Press Start 2P', cursive";
        ctx.textAlign = "center";
        ctx.fillText("PAUSED", BOARD_WIDTH / 2, BOARD_HEIGHT / 2);
    }
}

function draw_ball(ctx, ball) {
    ctx.fillStyle = "#FFD700"; // Gold
    ctx.beginPath();
    ctx.arc(ball.posx, ball.posy, BALL_RADIUS, 0, 2 * Math.PI);
    ctx.fill();
}
let image = new Image();
function get_image() {
    // Set a cross-origin attribute to avoid canvas tainting if the image host supports CORS
    image.crossOrigin = "Anonymous";
    fetch("https://m.media-amazon.com/images/I/61+U2YWlkUL._AC_SL1500_.jpg")
    .then(res => res.blob())
    .then(blob => {
        image.src = URL.createObjectURL(blob);
    }).catch(err => console.error("Failed to load paddle image:", err));
}
get_image();

function draw_paddle(ctx, paddle) {
    // First, draw the solid color of the paddle. This acts as a base layer.
    ctx.fillStyle = paddle.color;
    ctx.fillRect(paddle.posx, paddle.posy, paddle.width, paddle.height);

    // Set the composite operation to 'multiply'. This blends the pixels of
    // the image with the pixels of the colored rectangle already on the canvas.
    // White areas of the image will take on the paddle's color, and the dark
    // wood grain will create a nice texture.
    ctx.globalCompositeOperation = 'multiply';
    ctx.drawImage(image, paddle.posx, paddle.posy, paddle.width, paddle.height);

    // IMPORTANT: Reset the composite operation to its default value so that
    // it doesn't affect subsequent drawings (like the ball).
    ctx.globalCompositeOperation = 'source-over';
}