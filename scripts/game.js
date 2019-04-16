let settings={
  speed:10 ,
  speedMedium:12.5,
  speedHigh:25,
  width:1200,
  height:900,
  margin:150,
  gravity: 1,
  friction:0.92,
  jump:2.5,
  gap:200,
  obsWidth:180,
  obsHeight:900
}

let player={
  height:63,
  width:85,
  x:200,
  y:settings.height/2,
  velX:0,
  velY:0,
  jumping:false,
  loose:false,
  score:0,
  coins:500
}

// Coins stockage
let coin=[]
coin[0]={
  x:settings.width,
  y:400,
}

// Obstacle stockage
let tabObs=[]
let pipe=[]
pipe[0]={
  x:settings.width,
  y:-600,
}

// Images import
let loopImgX = [
  [bg]="0",
  [fg]="0"
]
let playerImg = new Image()
let bgImg = new Image()
let pipeTopImg = new Image()
let pipeBottomImg = new Image()
let sandImg = new Image()
let scorePlankImg = new Image()
let coinImg = new Image()
playerImg.src = "./images/player.png"
bgImg.src = "./images/bg.png"
pipeTopImg.src = "./images/pipetop.png"
pipeBottomImg.src = "./images/pipebottom.png"
sandImg.src = "./images/sand.png"
scorePlankImg.src = "./images/plank.png"
coinImg.src = "./images/coin.png"

// Canvas setup
let body = document.querySelector("body")
let canvas = document.createElement("canvas")
canvas.setAttribute("width",settings.width)
canvas.setAttribute("height",settings.height)
body.appendChild(canvas)
let ctx = canvas.getContext("2d")

// Keys controller
let controller={
  up:false,
  down:false,
  keyListener(event){
    let keyState=(event.type=="keydown")?true:false;
    switch (event.keyCode){
      case 38: // Up
        controller.up = keyState
      break;
      case 40:
        controller.down = keyState
      break;
    }
  }
}

function refresh()
{
    // Background
    ctx.drawImage(bgImg,loopImgX[0],0);

    // Player up
    if(controller.up==true){
      player.velY-=settings.jump
      player.jumping=true
    }
    // Player down
    if(controller.down==true){
      player.velY+=settings.jump
      player.jumping=true
    }
    // Player Physics
    player.velY+=settings.gravity
    player.y+=player.velY
    player.velY*=settings.friction

    // Player limits
    if(player.y>settings.height-settings.margin-20){
      player.loose=true
      player.y = settings.height-settings.margin-20
      player.velY = 0

    }
    else if (player.y<0){
      player.loose=true
      player.y = 0
      player.velY = 0
    }

    // Obstacles
    for(let i=0; i < pipe.length; i++){
      ctx.drawImage(pipeTopImg,pipe[i].x,pipe[i].y+10);
      let constant = settings.obsHeight+settings.gap
      ctx.drawImage(pipeBottomImg,pipe[i].x,pipe[i].y+constant);
      ctx.drawImage(coinImg,pipe[i].x+50,pipe[i].y+settings.obsHeight+60);

      // Increasing speed
      switch(player.score){
        case 10:
          settings.speed = settings.speedMedium
        break;
        case 20:
          settings.speed = settings.speedHigh
        break;
      }
      pipe[i].x-=settings.speed

      // New pipe if success
      if(pipe[i].x == player.x){
        player.score+=1
        player.coins+=1
        pipe.unshift({
           x : settings.width,
           y : Math.floor(Math.random() * (-850 - -350 + 1)) + -350
       })
      }
      // Loose conditions
      if (player.x < pipe[i].x + settings.obsWidth &&
         player.x + player.width > pipe[i].x &&
         player.y < pipe[i].y + settings.obsHeight &&
         player.height + player.y > pipe[i].y)
      {
        player.loose=true
      }
      if (player.x < pipe[i].x + settings.obsWidth &&
         player.x + player.width > pipe[i].x &&
         player.y < pipe[i].y+constant + settings.obsHeight &&
         player.height + player.y > pipe[i].y+constant-20)
      {
        player.loose=true
      }

    }

    // Building player
    ctx.drawImage(playerImg,player.x,player.y);

    // Building Foreground
    ctx.drawImage(sandImg,loopImgX[1],settings.height-settings.margin+player.height);

    // Coin Count
    ctx.drawImage(coinImg,settings.width-100,20)
    ctx.beginPath()
    ctx.fillStyle="orange"
    ctx.font = "60px Arial"
    ctx.fillText(player.coins, settings.width-200, 80)
    ctx.closePath

    // Loop images
    for(let i =0; i<=loopImgX.length;i++){
      if(loopImgX[i]< -settings.width){
        loopImgX[i]=0
      }
    }
    loopImgX[0]-=1
    loopImgX[1]-=settings.speed

    // Score
    ctx.drawImage(scorePlankImg,0,0);
    ctx.beginPath()
    ctx.fillStyle="white"
    ctx.font = "60px Arial"
    ctx.fillText(player.score, 50, 70)
    ctx.closePath

    if (player.loose){
        return
    }
    window.requestAnimationFrame(refresh);
}

// Pay 20 coins to get at score 20
function payToWin(){
  if(player.coins>=20){
    player.score=20
    player.coins-=20
    settings.speed=settings.speedHigh
  }
  play()
}

// Play
function play(){
  window.addEventListener("keyup", controller.keyListener)
  window.addEventListener("keydown", controller.keyListener)
  window.requestAnimationFrame(refresh);
}

play()
