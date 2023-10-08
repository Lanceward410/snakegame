const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const box = 20;
const canvasSize = 20;

let score = 0;
let snake = [];
snake[0] = { x: 10 * box, y: 10 * box };

let food = {
    x: Math.floor(Math.random() * canvasSize) * box,
    y: Math.floor(Math.random() * canvasSize) * box
};

let d;
document.addEventListener('keydown', direction);

function direction(event) {
    if (event.keyCode == 37 && d != 'RIGHT') {
        d = 'LEFT';
    } else if (event.keyCode == 38 && d != 'DOWN') {
        d = 'UP';
    } else if (event.keyCode == 39 && d != 'LEFT') {
        d = 'RIGHT';
    } else if (event.keyCode == 40 && d != 'UP') {
        d = 'DOWN';
    }
}

let highScores = JSON.parse(localStorage.getItem("highScores")) || [];

function updateHighScores() {
    if(score > 0) {
        highScores.push(score);
        highScores.sort((a, b) => b - a); // Sort in descending order
        highScores = highScores.slice(0, 5); // Keep the top 5 scores only

        localStorage.setItem("highScores", JSON.stringify(highScores));

        let scoreList = document.getElementById("scoreList");
        scoreList.innerHTML = "";
        highScores.forEach(score => {
            scoreList.innerHTML += `<li>${score}</li>`;
        });
    }
}

document.getElementById("restartButton").addEventListener("click", function() {
    document.location.reload();
});

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i === 0) ? 'green' : 'white';
        ctx.fillRect(snake[i].x, snake[i].y, box, box);

        ctx.strokeStyle = 'black';
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, box, box);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (d === 'LEFT') snakeX -= box;
    if (d === 'UP') snakeY -= box;
    if (d === 'RIGHT') snakeX += box;
    if (d === 'DOWN') snakeY += box;

    if (snakeX === food.x && snakeY === food.y) {
        score++;
        food = {
            x: Math.floor(Math.random() * canvasSize) * box,
            y: Math.floor(Math.random() * canvasSize) * box
        };
    } else {
        snake.pop();
    }

    let newHead = {
        x: snakeX,
        y: snakeY
    };

    function collision(head, array) {
        for (let i = 0; i < array.length; i++) {
            if (head.x === array[i].x && head.y === array[i].y) {
                return true;
            }
        }
        return false;
    }

    if (snakeX < 0 || snakeY < 0 || snakeX >= canvas.width || snakeY >= canvas.height || collision(newHead, snake)) {
        clearInterval(game);
        updateHighScores();
        document.getElementById("restartButton").style.display = "block";
    }

    snake.unshift(newHead);

    ctx.fillStyle = 'black';
    ctx.font = '20px Changa one';
    ctx.fillText('Score: ' + score, box, box);
}

let game = setInterval(draw, 100);

highScores.forEach(score => {
    document.getElementById("scoreList").innerHTML += `<li>${score}</li>`;
});

