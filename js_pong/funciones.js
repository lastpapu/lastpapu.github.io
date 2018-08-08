
  var canvas = document.getElementById("myCanvas");
  var ctx = canvas.getContext("2d");
    // cargando sonidos 1 a 1  como forma sencilla
  var risa = document.createElement("audio");
     risa.src= "risa.mp3";
  var boing = document.createElement("audio")
      boing.src= "boing.mp3";  
	 
	
	
  
  
  var lives = 3;
  var x = canvas.width/2;
  var y = canvas.height-30;
  var dx = 2;
  var dy = -2;
  var ballRadius = 10;
  var i=0;
  var paddleHeight = 14;
  var paddleWidth = 85;
  var paddleX = (canvas.width-paddleWidth)/2;
  
  var rightPressed = false;
  var leftPressed = false;
  var ballSpeed = 0;
  
  var color= new Array(
  "#0000FF",
  "#D0F000",
  "#ff45gg",
  "#C50075",
  "#FFFFFF",
  )
  
var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 10;
var brickOffsetLeft = 30;
  
var bricks = [];
  for(var c = 0; c <brickColumnCount; c++){
	  bricks[c] = [];
	  for(var r =0; r<brickRowCount; r++){
		  bricks[c][r] = {x:0, y:0, status: 1};
	  }
  }  
  
  var score = 0;
  
  
  
function drawBricks() {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
		  if(bricks [c][r].status == 1){
            var brickX = (c * (brickWidth+brickPadding))+brickOffsetLeft;
            var brickY = (r * (brickHeight+brickPadding))+brickOffsetTop;
            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;
            ctx.beginPath();
            ctx.rect(brickX, brickY, brickWidth, brickHeight);
            ctx.fillStyle = "#0095DD";
            ctx.fill();
		    ctx.closePath();
		  }
        }
    }
}  
  
  
  

function drawBall(){
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI*2);
  ctx.fillStyle = color[i];
  ctx.fill();
  ctx.closePath();
	
}	
 
function drawPaddle(){
	ctx.beginPath();
	ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
	ctx.fillStyle= "#97CD00";
	ctx.fill();
	ctx.closePath();
} 
	
	
function draw(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);	 // borra la bola
       drawBricks();
	   drawBall();
	   drawPaddle();
	   collisionDetection();
	   drawScore();
	   drawLives();
    	   
	   //movimiento de la bola
	    if( y + dy < ballRadius) {
	        dy = -dy;
			i= Math.floor((Math.random()*5) + 1);
        } else if(y + dy > canvas.height - ballRadius){   //colision con paddle
			 if(x > paddleX && x < paddleX + paddleWidth){
				
				 // velocidad primero se aumenta, luego se cambia el sentido de la bola
				 ballSpeed+=0.025;
				 dy += ballSpeed;
				 dx += ballSpeed;
				 dy= -dy;
			 }
			 else {
				lives--;
                 if(!lives) {
					 risa.play()
                   alert("GAME OVER");
                   document.location.reload();
                 }
                 else {
                    x = canvas.width/2;
                    y = canvas.height-30;
                    dx = 2;
                    dy = -2;
                 paddleX = (canvas.width-paddleWidth)/2;
                 }
		    }
			
		  }
			
		
		if( x + dx > canvas.width-ballRadius || x + dx < ballRadius){
			i= Math.floor((Math.random()*5) + 1);
	        dx = -dx
        } 
		
		// movimiento  del paddle
       if(rightPressed && paddleX < canvas.width-paddleWidth) {
          paddleX += 8;
       }
       else if(leftPressed && paddleX > 0) {
         paddleX -= 8;
       }
	    x += dx;
	    y += dy ;
		requestAnimationFrame(draw);
	   
}

document.addEventListener("keydown", keyDownHandler, false);// los nombres de los eventos ya son propios del lenguaje
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX> (0 +paddleWidth/2) && relativeX  <(canvas.width - paddleWidth/2) ) {
        paddleX = relativeX - paddleWidth/2 ;
    }
}


function keyDownHandler(e){
	if(e.keyCode == 39){
		rightPressed = true;
	} 
	else if(e.keyCode == 37) {
		leftPressed = true;
	}
	
}

function keyUpHandler(e){
	if(e.keyCode == 39){
		rightPressed = false;
	}
	else if(e.keyCode == 37){
		leftPressed = false;
	}
	
}


function collisionDetection() {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
			if(b.status == 1){
               if( x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight){
				  boing.play();
				  dy = -dy;
			      b.status = 0;
			      score++;
			      i= Math.floor((Math.random()*5) + 1); // cambio de color de la bola
			      if(score == brickRowCount * brickColumnCount){
				    alert("FELICITACIONES, GANASTE!!. tu puntaje fue: "+ score) ;
					document.location.reload();
			     }
			   }
			}
        }
    }
}

function drawScore() {
    ctx.font = "18px Arial";
    ctx.fillStyle = "#C00079";
    ctx.fillText("Score: "+ score, 8, 18);
}

function drawLives() {
    ctx.font = "18px Arial";
    ctx.fillStyle = "#000000";
    ctx.fillText("Vidas: "+lives, canvas.width-65, 20);
}


draw();
