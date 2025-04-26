const bird = document.getElementById('bird');
const game = document.getElementById('game');
let birdY = 200;
let gravity = 0.5;
let velocity = 0;
let pipes = [];
let score = 0;
let gameRunning = true;

// Инициализация Telegram Web App
if (window.Telegram && Telegram.WebApp) {
    Telegram.WebApp.expand(); // На весь экран
    Telegram.WebApp.MainButton.setText("Restart").hide();
}

// Прыжок по клику
game.addEventListener('click', () => {
    velocity = -10;
});

function gameLoop() {
    if (!gameRunning) return;

    // Движение птички
    velocity += gravity;
    birdY += velocity;
    bird.style.top = birdY + 'px';

    // Генерация труб
    if (Math.random() < 0.02) {
        const pipeHeight = Math.random() * 200 + 50;
        const pipe = document.createElement('div');
        pipe.className = 'pipe';
        pipe.style.left = '100%';
        pipe.style.height = pipeHeight + 'px';
        pipe.style.top = '0';
        game.appendChild(pipe);
        pipes.push(pipe);
    }

    // Движение труб
    pipes.forEach((pipe, index) => {
        const pipeX = parseFloat(pipe.style.left);
        pipe.style.left = (pipeX - 2) + 'px';

        // Проверка столкновений
        if (
            birdY < 0 || birdY > 400 ||
            (pipeX < 60 && pipeX > 0 && (birdY < parseFloat(pipe.style.height) || birdY > parseFloat(pipe.style.height) + 100))
        ) {
            endGame();
        }

        // Удаление труб и подсчет очков
        if (pipeX < -60) {
            pipe.remove();
            pipes.splice(index, 1);
            score++;
        }
    });

    requestAnimationFrame(gameLoop);
}

function endGame() {
    gameRunning = false;
    if (Telegram.WebApp) {
        Telegram.WebApp.MainButton.setText("Restart (Score: " + score + ")").show();
        Telegram.WebApp.MainButton.onClick = () => {
            location.reload();
        };
    }
    alert("Game Over! Score: " + score);
}

gameLoop();
