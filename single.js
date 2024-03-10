const canvas = document.getElementById("canvas");
console.log(canvas);
const context = canvas.getContext("2d");
const width = 400;
const height = 500;

const paddleWidth = 50;
const paddleHeight = 10;
canvas.width = width;
canvas.height = height;

function drawRect(x, y, w, h, color) {
  context.fillStyle = color;
  context.fillRect(x, y, w, h);
}

//create paddle top
const comp = {
  x: width / 2 - 50 / 2,
  y: 10,
  width: paddleWidth,
  height: paddleHeight,
  color: "white",
  score: 0,
};

//create paddle bottom
const user = {
  x: width / 2 - 50 / 2,
  y: height - 20,
  width: paddleWidth,
  height: paddleHeight,
  color: "white",
  score: 0,
};

// center line
function centerLine() {
  context.beginPath();
  context.setLineDash([6]);
  context.strokeStyle = "gray";
  context.moveTo(0, height / 2);
  context.lineTo(400, height / 2);
  context.stroke();
}

// center ball
function drawCircle(x, y, r, color) {
  context.beginPath();
  context.arc(x, y, r, 0, 2 * Math.PI, false);
  context.fillStyle = color;
  context.closePath();
  context.fill();
}
const ball = {
  x: width / 2,
  y: height / 2,
  radius: 10,
  speed: 1,
  velocityX: 5,
  velocityY: 5,
  color: "white",
};

// score
function drawText(text, x, y) {
  context.font = "32px Josefin Sans";
  context.fillText(text, x, y);
  // context.fillText(0, 20, height / 2 - 30);
  // context.fillText(0, 20, height / 2 + 50);
}

function showContent() {
  // draw rectangle
  drawRect(0, 0, width, height, "black");
  // paddle top
  drawRect(comp.x, comp.y, comp.width, comp.height, comp.color);
  // paddle bottom
  drawRect(user.x, user.y, user.width, user.height, user.color);
  // center line
  centerLine();
  // draw circle
  drawCircle(ball.x, ball.y, ball.radius, ball.color);
  // score
  drawText(comp.score, 20, height / 2 - 30);
  drawText(user.score, 20, height / 2 + 50);
}
// move the user paddle

let movePaddle = (e) => {
  let rect = canvas.getBoundingClientRect();
  user.x = e.clientX - rect.left - user.width / 2;
};
canvas.addEventListener("mousemove", movePaddle);




let handleCollision = (b, p) => {
  b.top = b.y - b.radius;
  b.bottom = b.y + b.radius;
  b.left = b.x - b.radius;
  b.right = b.x + b.radius;

  p.top = p.y;
  p.bottom = p.y + p.height;
  p.left = p.x;
  p.right = p.x + p.width;
  return (
    p.right > b.left && p.left < b.right && b.bottom > p.top && b.top < p.bottom
  );
};
let resetBall = () => {
  ball.x = width / 2;
  ball.y = height / 2;

  ball.speed = 1;
  ball.velocityY = -ball.velocityY;
};
let gameOver = () => {
  document.querySelector(".container").style.display = "none";
  document.querySelector(".result").style.display = "block";
};
function update() {

 // move the comp paddle

 let computerLevel = 0.1;
 comp.x += ball.x - (comp.x + comp.width / 2) + computerLevel;
 if (ball.speed > 2) {
   comp.x += ball.x + 100;
 }

  ball.x += ball.velocityX * ball.speed;
  ball.y += ball.velocityY * ball.speed;

  // reflect from wall
  if (ball.x + ball.radius > width || ball.x - ball.radius < 0) {
    ball.velocityX = -ball.velocityX;
  }

 
  // if collision happens
  let player = ball.y < canvas.height / 2 ? comp : user;
  if (handleCollision(ball, player)) {
    ball.velocityY = -ball.velocityY;
    ball.speed += 0.1;
  }
  if (ball.y - ball.radius < 0) {
    user.score++;
    resetBall();
  } else if (ball.y + ball.radius > height) {
    comp.score++;
    resetBall();
  }
  if (user.score > 4 || comp.score > 4) {
    clearInterval(setIntervalId);
    gameOver();
  }
}

function startGame() {
  showContent();
  update();
}
let setIntervalId = setInterval(startGame, 20);
