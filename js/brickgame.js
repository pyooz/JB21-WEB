const canvas = document.querySelector("#canvas");
const canvas1 = document.querySelector("#canvas1");
const ctx = canvas.getContext('2d');
const ctx1 = canvas1.getContext('2d');
let X, Y; //움직이는 판의 위치
let LOC = [] // 모든 장애물의 위치
let BALL_RADIUS = 15;
let BALL_VX = 8;
let BALL_VY = 3;
let PADDLE_WIDTH = 150;
let PADDLE_HEIGHT = 10;
let PADDLE_SHIFT = PADDLE_WIDTH/2;
let CANVAS_WIDTH = 0;
let CANVAS_HEIGHT = 0;
let OBSTACLE_ROW_COUNT = 6
let OBSTACLE_COL_COUNT = 10
let OBSTACLE_START_X = 2
let OBSTACLE_START_Y = 2
let OBSTACLE_PADDING = 5
let OBSTACLE_HEIGHT = 30
let CURRENT_SCORE = 0
let HIGH_SCORE = 0
let FLAG = 0
let PLAYGAME = 0
if(window.screen.width < 800){
	CANVAS_WIDTH = window.screen.width*0.9;
	CANVAS_HEIGHT = window.screen.height*0.6;
	OBSTACLE_ROW_COUNT = 6
	OBSTACLE_COL_COUNT = 6
	OBSTACLE_HEIGHT = 15
	BALL_RADIUS = 10
	PADDLE_WIDTH = 100
	canvas1.style.display = "block";
	canvas1.width = window.screen.width*0.95;
	canvas1.height = 50;
	BALL_VX = 3;
	BALL_VY = 2;
}
else{
	CANVAS_WIDTH = 800;
	CANVAS_HEIGHT = 560;
}
canvas.width = CANVAS_WIDTH
canvas.height = CANVAS_HEIGHT
let OBSTACLE_WIDTH = Math.floor((CANVAS_WIDTH-(OBSTACLE_COL_COUNT*4))/OBSTACLE_COL_COUNT)

const Text = {
	text: '시작하려면 클릭하세요',
	draw: function(str=''){
		ctx.clearRect(0, (CANVAS_HEIGHT/2)+20, canvas.width, 100);
  ctx.font = '2em Roboto sans-serif';
		ctx.fillStyle = '#e57373';
		if(str == '')
			ctx.fillText(`${this.text}`, (CANVAS_WIDTH/2)-150, CANVAS_HEIGHT/2+60);
		else
			ctx.fillText(str, (CANVAS_WIDTH/2)-150, CANVAS_HEIGHT/2+60);
	},
}
const controller = {
	x: canvas1.width/2,
	y : canvas1.height/2,
	radius: BALL_RADIUS,
	draw: function(){
		ctx1.fillStyle = "#e57373";
		ctx1.beginPath();
		ctx1.arc(this.x, this.y, this.radius, 0, Math.PI*2, true);
		ctx1.fill();
		ctx1.closePath();
		ctx1.beginPath();
		ctx1.moveTo(this.x-this.radius-20, this.y);
		ctx1.lineTo(this.x-this.radius-10, this.y+this.radius);
		ctx1.lineTo(this.x-this.radius-10, this.y-this.radius);
		ctx1.fill();
		ctx1.closePath();
		
		ctx1.beginPath();
		ctx1.moveTo(this.x+this.radius+20, this.y);
		ctx1.lineTo(this.x+this.radius+10, this.y+this.radius);
		ctx1.lineTo(this.x+this.radius+10, this.y-this.radius);
		ctx1.fill();
		ctx1.closePath();
		
	},
	move: function(e){
		if(e.touches[0].clientX < canvas1.width && e.touches[0].clientX >0)
		this.x = e.touches[0].clientX;
		else if(e.touches[0].clientX >= canvas1.width)
			this.x = canvas1.width-20-this.radius
		else if(e.touches[0].clientX <= 0)
			this.x = 20+this.radius
		paddle.move({"offsetX":this.x});
	}
}
const obstacle = {
	height: OBSTACLE_HEIGHT,
	width: OBSTACLE_WIDTH,
	x : OBSTACLE_START_X,
	y : OBSTACLE_START_Y,
	draw: function(x, y){
		ctx.fillStyle = "#e57373";
		ctx.beginPath();
		ctx.fillRect(x, y, this.width, this.height)
		ctx.closePath();
	},
	create: function(){
		for(let i=0; i<LOC.length; i++)
			this.draw(LOC[i][0], LOC[i][1])
	},
	destroy: function(x, y){
		ctx.clearRect(x, y, OBSTACLE_WIDTH, OBSTACLE_HEIGHT);
	},
	createGrid: function(){
		for(let i =0 ; i<OBSTACLE_ROW_COUNT ; i++){
			this.x = OBSTACLE_START_X
			for(let i =0 ; i<OBSTACLE_COL_COUNT ; i++){
				LOC.push([this.x, this.y])
				this.x = this.x+this.width+OBSTACLE_PADDING
			}
			this.y = this.y+this.height+OBSTACLE_PADDING
		}
		this.y = OBSTACLE_START_Y
	}
}
const ball = {
	x : canvas.width/2,
	y : canvas.height/2,
	radius : BALL_RADIUS,
	vx : BALL_VX,
	vy : BALL_VY,
	draw: function(){
		ctx.beginPath();
		ctx.fillStyle = "#e57373";
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
		ctx.fill();
		ctx.closePath();
	},
	move: function(){
		this.x += this.vx;
		this.y += this.vy;
		
		// 캔버스 왼쪽 오른쪽을 제한
		if(this.x+this.radius >= CANVAS_WIDTH || this.x-this.radius <= 0)
		   this.vx = -this.vx;
		
		// 캔버스 아래 설정
		if(this.y+this.radius >= CANVAS_HEIGHT){
			this.vx = 0;
			this.vy = 0;
			FLAG = 1
		}
		
		// 캔버스 위 설정
		if(this.y-this.radius <= 0)
		   this.vy = -this.vy;
		
		// 충돌 감지 (움직이는 판)
		if((this.x >= X ) && (this.x <= X+PADDLE_WIDTH) && this.y+this.radius < CANVAS_HEIGHT && this.y+this.radius >= CANVAS_HEIGHT-PADDLE_HEIGHT)
			this.vy = -this.vy
		
		// 충돌 감지 (공과 장애물)
		for(let i =0 ; i<LOC.length ; i++){
				if(this.x >= LOC[i][0] && this.x <= LOC[i][0]+OBSTACLE_WIDTH && this.y-this.radius >= LOC[i][1] && this.y-this.radius <= LOC[i][1]+OBSTACLE_HEIGHT){
					obstacle.destroy(LOC[i][0], LOC[i][1]);
					LOC.splice(i, 1);
					this.vy = -this.vy
					CURRENT_SCORE += 5;
	document.getElementById("curr_score").innerText = `현재 점수 : ${CURRENT_SCORE}`
					this.vy *= 1.005
					this.vx *= 1.005
				}
		}

		//-----------------------------------------------
	}
}
const paddle = {
	x: (canvas.width/2)-(PADDLE_WIDTH/2),
	y: canvas.height-PADDLE_HEIGHT,
	width: PADDLE_WIDTH,
	height: PADDLE_HEIGHT,
	draw: function(){
		ctx.fillStyle = "#e57373";
		ctx.beginPath();
		ctx.fillRect( this.x, this.y, this.width, this.height);
		ctx.closePath();
	},
	move: function(e){
		X = this.x;
		Y = this.y;
		if(e.offsetX <= 0)
			this.x = 0
		else if(e.offsetX >= canvas.width)
			this.x = canvas.width-PADDLE_WIDTH
		else
			this.x = e.offsetX-(PADDLE_WIDTH/2)
	}
}
function clear() {	
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}
function draw_on_canvas(){
	if(LOC.length == 0 || FLAG == 1){
		//처음으로 초기화
		FLAG = 0;
		LOC = [];
		ball.x = CANVAS_WIDTH/2;
		ball.y = CANVAS_HEIGHT/2;
		ball.vx = BALL_VX;
		ball.vy = BALL_VY;
		clearInterval(PLAYGAME);
		if(CURRENT_SCORE > HIGH_SCORE)
			HIGH_SCORE = CURRENT_SCORE
		CURRENT_SCORE = 0
		init();
	}
	else{
		document.get
		clear();
		ball.draw();
		paddle.draw();
		obstacle.create();
		ball.move();
	}
}
function init(){
	clear();
	Text.draw();
	canvas.addEventListener('click', x);
	document.getElementById("curr_score").innerText = `현재 점수 : ${CURRENT_SCORE}`
	document.getElementById("high_score").innerText = `최고 점수 : ${HIGH_SCORE}`
	ball.draw();
	paddle.draw();
	obstacle.createGrid();
	obstacle.create();
	if(window.screen.width < 800){
		controller.draw();
	};
}
function drawController(){
	ctx1.clearRect(0,0, canvas1.width, canvas1.height);
	controller.draw();
};
if(window.screen.width < 800){
	canvas1.addEventListener('touchmove', e => {
	controller.move(e);
});
}
function x(){
	setTimeout(() => {
	PLAYGAME = setInterval(draw_on_canvas, 10);
	setInterval(drawController, 10);}, 3000);
	Text.draw('게임이 곧 시작됩니다.');
	canvas.removeEventListener('click', x);
}
canvas.addEventListener('click', x);
canvas.addEventListener('mousemove', e => {
	paddle.move(e);
});

init();

