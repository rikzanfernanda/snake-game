const CELL_SIZE = 20;
const CANVAS_SIZE_X = 1200;
const CANVAS_SIZE_Y = 500;
const REDRAW_INTERVAL = 50;
const WIDTH = CANVAS_SIZE_X / CELL_SIZE;
const HEIGHT = CANVAS_SIZE_Y / CELL_SIZE;
const DIRECTION = {
    LEFT: 0,
    RIGHT: 1,
    UP: 2,
    DOWN: 3,
}
let MOVE_INTERVAL = 140;

let snake1 = initSnake();
let apple1 = initApple();
let apple2 = initApple();
let love = initLove();

function initGame() {
    move(snake1);
}

initGame();

function initPosition() {
    return {
        x: Math.floor(Math.random() * WIDTH),
        y: Math.floor(Math.random() * HEIGHT),
    }
}

function initHeadAndBody() {
    let head = initPosition();
    let body = [{x: head.x, y: head.y}];
    return {
        head: head,
        body: body,
    }
}

function initDirection() {
    return Math.floor(Math.random() * 4);
}

function initSnake() {
    return {
        ...initHeadAndBody(),
        direction: initDirection(),
        score: 0,
        level: 1,
        love: 3
    }
}

function initApple() {
    return {
        position: initPosition()
    }
}

function initLove() {
    return {
        position: initPosition()
    }
}

function drawScore() {
    let scoreCanvas = document.getElementById("score");
    let scoreCtx = scoreCanvas.getContext("2d");

    scoreCtx.clearRect(0, 0, CANVAS_SIZE_X, 50);

    scoreCtx.fillStyle = '#78c244';
    scoreCtx.fillRect(0, 0, CANVAS_SIZE_X, 50);

    scoreCtx.fillStyle = '#000000';
    scoreCtx.font = "20px Courier";
    scoreCtx.fillText("Score: " + snake1.score, 700, 20);
    scoreCtx.fillText("Level: " + snake1.level, 1000, 20);
    scoreCtx.fillText("Speed: " + MOVE_INTERVAL + " ms", 10, 20);

    let img = new Image();
    img.src = 'assets/img/heart.png';

    for (let i = 0; i < snake1.love; i++) {
        scoreCtx.drawImage(img, 30*i+300, 0, 30, 30);
    }
}

function drawApple(ctx, apple) {
    let img = new Image();
    img.src = 'assets/img/apple.png';
    ctx.drawImage(img, apple.position.x * CELL_SIZE, apple.position.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function drawHead(ctx, snake) {
    let img = new Image();
    img.src = 'assets/img/head.png';
    ctx.drawImage(img, snake.head.x * CELL_SIZE, snake.head.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function drawBody(ctx, x, y) {
    let img = new Image();
    img.src = 'assets/img/body.png';
    ctx.drawImage(img, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function drawLove(ctx, love) {
    let img = new Image();
    img.src = 'assets/img/heart.png';
    ctx.drawImage(img, love.position.x * CELL_SIZE, love.position.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function isPrima(n) {
    let divider = 0;
    for (let i = 1; i <= n; i++) {
        if (n % i == 0) {
            divider++;
        }
    }

    if (divider == 2) {
        return true;
    } else {
        return false;
    }
}

function draw() {
    let snakeCanvas = document.getElementById("snakeBoard");
    let ctx = snakeCanvas.getContext("2d");

    setInterval(function() {
        ctx.clearRect(0, 0, CANVAS_SIZE_X, CANVAS_SIZE_Y);

        for (let i = 0; i < WIDTH; i++) {
            for (let j = 0; j < WIDTH; j++) {
                if (i % 2 == 0) {
                    if (j % 2 == 0) {
                        ctx.fillStyle = '#ffca57';
                    } else {
                        ctx.fillStyle = '#ffd16b';
                    }
                } else {
                    if (j % 2 == 0) {
                        ctx.fillStyle = '#ffd16b';
                    } else {
                        ctx.fillStyle = '#ffca57';
                    }
                }
                ctx.fillRect(i*CELL_SIZE, j*CELL_SIZE, CELL_SIZE, CELL_SIZE);
            }
        }

        drawHead(ctx, snake1);
        for (let i = 1; i < snake1.body.length; i++) {
            drawBody(ctx, snake1.body[i].x, snake1.body[i].y);
        }

        ctx.fillStyle = '#000000';
        if (snake1.level == 2) {
            ctx.fillRect(10*CELL_SIZE, 12*CELL_SIZE, 40*CELL_SIZE, CELL_SIZE);
        } else if (snake1.level == 3) {
            ctx.fillRect(10*CELL_SIZE, 10*CELL_SIZE, 40*CELL_SIZE, CELL_SIZE);
            ctx.fillRect(10*CELL_SIZE, 15*CELL_SIZE, 40*CELL_SIZE, CELL_SIZE);
        } else if (snake1.level == 4) {
            ctx.fillRect(10*CELL_SIZE, 6*CELL_SIZE, 40*CELL_SIZE, CELL_SIZE);
            ctx.fillRect(30*CELL_SIZE, 10*CELL_SIZE, CELL_SIZE, 10*CELL_SIZE);
        } else if (snake1.level == 5) {
            ctx.fillRect(10*CELL_SIZE, 6*CELL_SIZE, 40*CELL_SIZE, CELL_SIZE);
            ctx.fillRect(12*CELL_SIZE, 10*CELL_SIZE, CELL_SIZE, 10*CELL_SIZE);
            ctx.fillRect(47*CELL_SIZE, 10*CELL_SIZE, CELL_SIZE, 10*CELL_SIZE);
        }
        
        drawApple(ctx, apple1);
        drawApple(ctx, apple2);
        drawScore();
    }, REDRAW_INTERVAL);

    setInterval(function() {
        if (isPrima(snake1.score)) {
            drawLove(ctx, love);
        }
    }, 100);
}

function teleport(snake) {
    if (snake.head.x < 0) {
        snake.head.x = CANVAS_SIZE_X / CELL_SIZE - 1;
    }
    if (snake.head.x >= WIDTH) {
        snake.head.x = 0;
    }
    if (snake.head.y < 0) {
        snake.head.y = CANVAS_SIZE_Y / CELL_SIZE - 1;
    }
    if (snake.head.y >= HEIGHT) {
        snake.head.y = 0;
    }
}

function levelUp(snake) {
    if (snake.score % 5 == 0) {
        snake.level++;

        var level =  new Audio();
        level.src="./assets/sound/level-up.mp3";
        level.play();

        if (snake.level <= 5) {
            alert("Level " + snake.level);
            MOVE_INTERVAL -= 20;
        } else if (snake.level > 5) {
            alert("Congratulation!");
            MOVE_INTERVAL = 140;
            snake1 = initSnake();
            initGame();
        }
    }
}

function eat(snake) {
    var eat =  new Audio();
    eat.src="./assets/sound/eat.mp3";

    if (snake.head.x == apple1.position.x && snake.head.y == apple1.position.y) {
        eat.play();
        snake.score++;
        levelUp(snake);
        apple1.position = initPosition();
        snake.body.push({x: snake.head.x, y: snake.head.y});
    }

    if (snake.head.x == apple2.position.x && snake.head.y == apple2.position.y) {
        eat.play();
        snake.score++;
        levelUp(snake);
        apple2.position = initPosition();
        snake.body.push({x: snake.head.x, y: snake.head.y});
    }

    if (snake.head.x == love.position.x && snake.head.y == love.position.y) {
        var eatLove =  new Audio();
        eatLove.src="./assets/sound/eatLove.mp3";
        eatLove.play();

        snake.love++;
        snake.score++;
        levelUp(snake);
        love.position = initPosition();
        snake.body.push({x: snake.head.x, y: snake.head.y});
    }
}

function moveLeft(snake) {
    snake.head.x--;
    teleport(snake);
    eat(snake);
}

function moveRight(snake) {
    snake.head.x++;
    teleport(snake);
    eat(snake);
}

function moveDown(snake) {
    snake.head.y++;
    teleport(snake);
    eat(snake);
}

function moveUp(snake) {
    snake.head.y--;
    teleport(snake);
    eat(snake);
}

function checkCollision(snakes) {
    var die =  new Audio();
    die.src="./assets/sound/die.mp3";
    let isCollide = false;
    
    for (let i = 0; i < snakes.length; i++) {
        if (snakes[i].level == 2) {
            if (snakes[i].head.x >= 10 && snakes[i].head.x < 50 && snakes[i].head.y == 12 ) {
                if (snakes[i].love > 0) {
                    snakes[i].love--;
                    die.play();
                    alert("Be careful!");
                    snake1 = {
                        ...snake1, 
                        ...initHeadAndBody()
                    };
                    initGame();
                } else {
                    isCollide = true;
                }
            }
        } else if (snakes[i].level == 3) {
            if (snakes[i].head.x >= 10 && snakes[i].head.x < 50 && snakes[i].head.y == 10 || snakes[i].head.x >= 10 && snakes[i].head.x < 50 && snakes[i].head.y == 15) {
                if (snakes[i].love > 0) {
                    snakes[i].love--;
                    die.play();
                    alert("Be careful!");
                    snake1 = {
                        ...snake1, 
                        ...initHeadAndBody()
                    };
                    initGame();
                } else {
                    isCollide = true;
                }
            }
        } else if (snakes[i].level == 4) {
            if (snakes[i].head.x >= 10 && snakes[i].head.x < 50 && snakes[i].head.y == 6 || snakes[i].head.x == 30 && snakes[i].head.y >= 10 && snakes[i].head.y < 20) {
                if (snakes[i].love > 0) {
                    snakes[i].love--;
                    die.play();
                    alert("Be careful!");
                    snake1 = {
                        ...snake1, 
                        ...initHeadAndBody()
                    };
                    initGame();
                } else {
                    isCollide = true;
                }
            }
        } else if (snakes[i].level == 5) {
            if (snakes[i].head.x >= 10 && snakes[i].head.x < 50 && snakes[i].head.y == 6 || snakes[i].head.x == 12 && snakes[i].head.y >= 10 && snakes[i].head.y < 20 || snakes[i].head.x == 47 && snakes[i].head.y >= 10 && snakes[i].head.y < 20) {
                if (snakes[i].love > 0) {
                    snakes[i].love--;
                    die.play();
                    alert("Be careful!");
                    snake1 = {
                        ...snake1, 
                        ...initHeadAndBody()
                    };
                    initGame();
                } else {
                    isCollide = true;
                }
            }
        }
        
        for (let j = 0; j < snakes.length; j++) {
            for (let k = 1; k < snakes[j].body.length; k++) {
                if (snakes[i].head.x == snakes[j].body[k].x && snakes[i].head.y == snakes[j].body[k].y) {
                    if (snakes[i].love > 0) {
                        snakes[i].love--;
                        die.play();
                        alert("Be careful!");
                        snake1 = {
                            ...snake1, 
                            ...initHeadAndBody()
                        };
                        initGame();
                    } else {
                        isCollide = true;
                    }
                }
            }
        }
    }
    if (isCollide) {
        var gameOver =  new Audio();
        gameOver.src="./assets/sound/game-over.mp3";
        gameOver.play();

        alert("Game over");
        MOVE_INTERVAL = 140;
        snake1 = initSnake();
    }
    return isCollide;
}

function move(snake) {
    switch (snake.direction) {
        case DIRECTION.LEFT:
            moveLeft(snake);
            break;
        case DIRECTION.RIGHT:
            moveRight(snake);
            break;
        case DIRECTION.DOWN:
            moveDown(snake);
            break;
        case DIRECTION.UP:
            moveUp(snake);
            break;
    }
    moveBody(snake);
    if (!checkCollision([snake1])) {
        setTimeout(function() {
            move(snake);
        }, MOVE_INTERVAL);
    } else {
        initGame();
    }
}

function moveBody(snake) {
    snake.body.unshift({ x: snake.head.x, y: snake.head.y });
    snake.body.pop();
}

function turn(snake, direction) {
    const oppositeDirections = {
        [DIRECTION.LEFT]: DIRECTION.RIGHT,
        [DIRECTION.RIGHT]: DIRECTION.LEFT,
        [DIRECTION.DOWN]: DIRECTION.UP,
        [DIRECTION.UP]: DIRECTION.DOWN,
    }

    if (direction !== oppositeDirections[snake.direction]) {
        snake.direction = direction;
    }
}

document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") {
        turn(snake1, DIRECTION.LEFT);
    } else if (event.key === "ArrowRight") {
        turn(snake1, DIRECTION.RIGHT);
    } else if (event.key === "ArrowUp") {
        turn(snake1, DIRECTION.UP);
    } else if (event.key === "ArrowDown") {
        turn(snake1, DIRECTION.DOWN);
    }
})
