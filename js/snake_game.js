let canvas = document.getElementById('canvas');
let canvas_ctx = canvas.getContext('2d');
let score_ele = document.getElementById('score');
let best_score_ele = document.getElementById('best-score');
let cur_score = 0;
let dir = '';

const config = {
  sizeCell: 24,
  sizeFood: 24,
  step: 0,
  stepMax: 7,
};

const snake = {
  x: config.sizeCell,
  y: config.sizeCell,
  dirX: 0,
  dirY: 0,
  body: [],
  maxBodySize: 1,
};

const snake_images = [new Image()];

snake_images[0].src = './img/snake/head.svg';

const food_object = {
  x: randomInt(0, canvas.width / config.sizeCell) * config.sizeCell,
  y: randomInt(0, canvas.height / config.sizeCell) * config.sizeCell,
};

let food_img = new Image();
food_img.src = './img/point/circle.svg';

window.addEventListener('load', (e) => {
  canvas.width = 600;
  canvas.height = 480;
  canvas_ctx.fillStyle = '#000000';
  canvas_ctx.fillRect(0, 0, canvas.width, canvas.height);
  config.sizeCell = 24;
  config.sizeFood = 24;
  canvas.style.backgroundImage =
    'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSJibGFjayIvPgo8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSI0IiBmaWxsPSIjNTE0OTQ5Ii8+Cjwvc3ZnPgo=")';
  restart();
});


function score() {
  cur_score++;
  update_best_score();
  draw_score();
}

function draw_score() {
  score_ele.innerHTML = cur_score;
}

function update_best_score() {
  if (!localStorage.getItem('best')) {
    localStorage.setItem('best', 0);
  }

  if (cur_score > localStorage.getItem('best')) {
    localStorage.setItem('best', cur_score);
  }
  best_score_ele.innerHTML = localStorage.getItem('best score');
}

function gameLoop() {
  requestAnimationFrame(gameLoop);

  if (++config.step < config.stepMax) return;
  config.step = 0;

  canvas_ctx.clearRect(0, 0, canvas.width, canvas.height);
  draw_food();
  draw_snake();
}

gameLoop();

function check_border() {
  if (snake.x < 0) {
    snake.x = canvas.width - config.sizeCell;
  } else if (snake.x >= canvas.width) {
    snake.x = 0;
  }

  if (snake.y < 0) {
    snake.y = canvas.height - config.sizeCell;
  } else if (snake.y >= canvas.height) {
    snake.y = 0;
  }
}


function restart() {
  config.stepMax = 6;
  cur_score = 0;
  draw_score();

  snake.x = config.sizeCell;
  snake.y = config.sizeCell;
  snake.body = [];
  snake.maxBodySize = 1;
  snake.dirX = 0;
  snake.dirY = 0;
  dir = '';

  random_food();
}


function draw_snake() {
  snake.x += snake.dirX;
  snake.y += snake.dirY;

  check_border();

  snake.body.unshift({
    x: snake.x,
    y: snake.y
  });
  if (snake.body.length > snake.maxBodySize) {
    snake.body.pop();
  }

  snake.body.forEach((e, index) => {
    snake_style(e, index);

    if (e.x == food_object.x && e.y == food_object.y) {
      score();
      random_food();
      snake.maxBodySize++;

    }

    for (let i = index + 1; i < snake.body.length; i++) {
      if (e.x === snake.body[i].x && e.y === snake.body[i].y) {
        restart();
      }
    }
  });
}

function snake_style(e, index) {
  if (index === 0) {
    canvas_ctx.drawImage(snake_images[0], e.x, e.y, config.sizeCell, config
      .sizeCell);
  } else {
    canvas_ctx.fillStyle = '#3f51b5';
    canvas_ctx.strokeStyle = '#071510';
    canvas_ctx.lineWidth = 1;
    canvas_ctx.fillRect(e.x, e.y, config.sizeCell, config.sizeCell);
    canvas_ctx.strokeRect(e.x, e.y, config.sizeCell - 1, config.sizeCell - 1);
  }
}

function draw_food() {
  canvas_ctx.drawImage(food_img, food_object.x, food_object.y, config.sizeFood,
    config.sizeFood);
}

document.addEventListener('load', update_best_score());

function turn_up() {
  if (dir != 'down') {
    dir = 'up';
    snake.dirY = -config.sizeCell;
    snake.dirX = 0;
  }
}

function turn_left() {
  if (dir != 'right') {
    dir = 'left';
    snake.dirX = -config.sizeCell;
    snake.dirY = 0;
  }
}

function turn_down() {
  if (dir != 'up') {
    dir = 'down';
    snake.dirY = config.sizeCell;
    snake.dirX = 0;
  }
}

function turn_right() {
  if (dir != 'left') {
    dir = 'right';
    snake.dirX = config.sizeCell;
    snake.dirY = 0;
  }
}

document.addEventListener('keydown', (e) => {
  if (e.keyCode == 87 || e.keyCode == 38) {
    turn_up();
  } else if (e.keyCode == 65 || e.keyCode == 37) {
    turn_left();
  } else if (e.keyCode == 83 || e.keyCode == 40) {
    turn_down();
  } else if (e.keyCode == 68 || e.keyCode == 39) {
    turn_right();
  }
});


function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function random_food() {
  canvas_ctx.drawImage(food_img, food_object.x, food_object.y, config.sizeFood,
    config.sizeFood);
  food_object.x = randomInt(0, canvas.width / config.sizeCell) * config
  .sizeCell;
  food_object.y = randomInt(0, canvas.height / config.sizeCell) * config
    .sizeCell;
  draw_food();
}