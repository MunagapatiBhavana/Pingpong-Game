let can = document.getElementById("table");
let draw_ = can.getContext('2d');

const ball = {
    x: can.width / 2,
    y: can.height / 2,
    radius: 10,
    velX: 5,
    velY: 5,
    speed: 5,
    color: "green"
};

const Separator = {
    x: (can.width - 2) / 2,
    y: 0,
    height: 10,
    width: 2,
    color: "white"
};

const User_Bar = {
    x: 0,
    y: (can.height - 100) / 2,
    width: 10,
    height: 100,
    score: 0,
    color: "white"
};

const CPU_Bar = {
    x: can.width - 10,
    y: (can.height - 100) / 2,
    width: 10,
    height: 100,
    score: 0,
    color: "white"
};

function drawRectangle(x, y, w, h, color) {
    draw_.fillStyle = color;
    draw_.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
    draw_.fillStyle = color;
    draw_.beginPath();
    draw_.arc(x, y, r, 0, Math.PI * 2, true);
    draw_.closePath();
    draw_.fill();
}

function drawScore(text, x, y) {
    draw_.fillStyle = "white";
    draw_.font = "60px Arial";
    draw_.fillText(text, x, y);
}

function drawSeparator() {
    for (let i = 0; i <= can.height; i += 20) {
        drawRectangle(Separator.x, Separator.y + i, Separator.width, Separator.height, Separator.color);
    }
}

function helper() {
    // Clear the canvas
    draw_.clearRect(0, 0, can.width, can.height);

    // Draw the separator
    drawSeparator();

    // Draw the user bar and CPU bar
    drawRectangle(User_Bar.x, User_Bar.y, User_Bar.width, User_Bar.height, User_Bar.color);
    drawRectangle(CPU_Bar.x, CPU_Bar.y, CPU_Bar.width, CPU_Bar.height, CPU_Bar.color);

    // Draw the ball
    drawCircle(ball.x, ball.y, ball.radius, ball.color);

    // Draw the scores
    drawScore(User_Bar.score, can.width / 4, can.height / 5);
    drawScore(CPU_Bar.score, 3 * can.width / 4, can.height / 5);

    // Move the ball
    ball.x += ball.velX;
    ball.y += ball.velY;

    // Ball collision with top and bottom
    if (ball.y + ball.radius > can.height || ball.y - ball.radius < 0) {
        ball.velY = -ball.velY;
    }

    // Ball collision with paddles
    let player = (ball.x < can.width / 2) ? User_Bar : CPU_Bar;
    if (detect_collision(ball, player)) {
        let collidePoint = (ball.y - (player.y + player.height / 2));
        collidePoint = collidePoint / (player.height / 2);
        let angleRad = (Math.PI / 4) * collidePoint;

        let direction = (ball.x < can.width / 2) ? 1 : -1;
        ball.velX = direction * ball.speed * Math.cos(angleRad);
        ball.velY = ball.speed * Math.sin(angleRad);

        ball.speed += 0.5;
    }

    // Ball goes to the left or right
    if (ball.x - ball.radius < 0) {
        CPU_Bar.score++;
        restart();
    } else if (ball.x + ball.radius > can.width) {
        User_Bar.score++;
        restart();
    }

    // CPU movement
    cpu_movement();
}

function call_back() {
    helper();
}

let fps = 50;
let looper = setInterval(call_back, 1000 / fps);

function restart() {
    ball.x = can.width / 2;
    ball.y = can.height / 2;
    ball.velX = -ball.velX;
    ball.speed = 5;
}

can.addEventListener("mousemove", getMousePos);

function getMousePos(evt) {
    let rect = can.getBoundingClientRect();
    let root = document.documentElement;
    let mouseY = evt.clientY - rect.top - root.scrollTop;
    User_Bar.y = mouseY - User_Bar.height / 2;
}

function detect_collision(ball, player) {
    player.top = player.y;
    player.bottom = player.y + player.height;
    player.left = player.x;
    player.right = player.x + player.width;

    ball.top = ball.y - ball.radius;
    ball.bottom = ball.y + ball.radius;
    ball.left = ball.x - ball.radius;
    ball.right = ball.x + ball.radius;

    return player.left < ball.right && player.top < ball.bottom && player.right > ball.left && player.bottom > ball.top;
}

function cpu_movement() {
    cpu.y += ((ball.y - (cpu.y + cpu.height / 2))) * 0.1; // Adjust the factor to make it easier/harder
}
