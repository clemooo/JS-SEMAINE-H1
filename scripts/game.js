let settings={
  speed:10 ,
  speedMedium:12.5,
  width:1200,
  height:900,
  margin:150,
  gravity: 1,
  friction:0.92,
  jump:2.5,
  gap:180,
  obsWidth:180,
  obsHeight:900,
  frame:0,
  medusaVelY:-3,
  medusaWidth:31,
  medusaHeight:60,
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
  coins:parseInt(localStorage.getItem('coins')),
  isBestScore:localStorage.getItem('bestScore'),
  isPayToWin:localStorage.getItem('payToWin')
}
  if (localStorage.getItem('coins') == null){
    localStorage.setItem('coins',0)
    settings.coins = parseInt(localStorage.getItem('coins'))
  }

// Coins stockage
let coin=[]
coin[0]={
  x:settings.width,
  y:400,
}

// Medusa
let medusa=[]
medusa[0]={
  x:-200,
  y:Math.floor(Math.random() * (0 - 600 + 1)) + 600
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
let playerUpImg = new Image
let playerDownImg = new Image()
let bgImg = new Image()
let pipeTopImg = new Image()
let pipeBottomImg = new Image()
let sandImg = new Image()
let scorePlankImg = new Image()
let coinImg = new Image()
let medusaImg = new Image()
playerImg.src = "./images/player.png"
bgImg.src = "./images/bg.png"
pipeTopImg.src = "./images/pipetop.png"
pipeBottomImg.src = "./images/pipebottom.png"
sandImg.src = "./images/sand.png"
scorePlankImg.src = "./images/plank.png"
coinImg.src = "./images/coin.png"
playerUpImg.src = "./images/playerUp.png"
playerDownImg.src = "./images/playerDown.png"
medusaImg.src = "./images/medusa.png"

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
      case 40: //Down
        controller.down = keyState
      break;
      case 13: //Enter
        replay()
      break;
      case 87: // Pay to win (W)
        replay(true)
      break;
      // GhostMode
      // Slow
    }
  }
}

function refresh()
{
    // Frame refresh
    settings.frame+=1

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
      loose()
    }
    else if (player.y<0){
      loose()
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
      }
      pipe[i].x-=settings.speed

      // New pipe if success
      if(pipe[i].x == player.x){
        player.score+=1
        player.coins+=1
        localStorage.setItem('coins',player.coins)
        pipe.unshift({
           x : settings.width,
           y : Math.floor(Math.random() * (-850 - -350 + 1)) + -350
       })
      }
      // Loose conditions
      if (player.x < pipe[i].x + settings.obsWidth &&
         player.x + player.width > pipe[i].x+25 &&
         player.y < pipe[i].y + settings.obsHeight &&
         player.height + player.y > pipe[i].y)
      {
        loose()
      }
      if (player.x < pipe[i].x + settings.obsWidth &&
         player.x + player.width > pipe[i].x+25 &&
         player.y < pipe[i].y+constant + settings.obsHeight &&
         player.height + player.y > pipe[i].y+constant-20)
      {
        loose()
      }
      if (player.x < medusa[0].x + settings.medusaWidth &&
         player.x + player.width > medusa[0].x+25 &&
         player.y < medusa[0].y + settings.medusaHeight &&
         player.height + player.y > medusa[0].y-20)
      {
        loose()
      }

    }

    // Loop images
    for(let i =0; i<=loopImgX.length;i++){
      if(loopImgX[i]< -settings.width){
        loopImgX[i]=0
      }
    }
    loopImgX[0]-=1
    loopImgX[1]-=settings.speed

    // Building player
    if(player.velY>5){
      ctx.drawImage(playerDownImg,player.x,player.y);
    }
    else if (player.velY <= 5 && player.velY >= -5){
      ctx.drawImage(playerImg,player.x,player.y);
    }
    else if (player.velY < -5){
      ctx.drawImage(playerUpImg,player.x,player.y);
    }


    // Building medusa
    if(settings.frame%200==0){
      medusa[0].x=settings.speed*160
      medusa[0].y=Math.floor(Math.random() * (0 - 600 + 1)) + 600
    }
    medusa[0].x-=settings.speed
    medusa[0].y-=settings.medusaVelY
    if(medusa[0].y<0 || medusa[0].y > settings.height-settings.margin-20){
      console.log("bye")
      settings.medusaVelY = -settings.medusaVelY
    }
    ctx.drawImage(medusaImg,medusa[0].x,medusa[0].y);

    // Building Foreground
    ctx.drawImage(sandImg,loopImgX[1],settings.height-settings.margin+player.height);

    // Building Coin Count
    ctx.drawImage(coinImg,settings.width-100,20)
    ctx.beginPath()
    ctx.fillStyle="orange"
    ctx.font = "60px Arial"
    ctx.fillText(player.coins, settings.width-200, 80)
    ctx.closePath

    // Building Score Count
    ctx.drawImage(scorePlankImg,0,0);
    ctx.beginPath()
    ctx.fillStyle="white"
    ctx.font = "60px Arial"
    ctx.fillText(player.score, 50, 70)
    ctx.closePath()

    // Building Game over if loose
    if (player.loose){
        if(player.isBestScore == null || player.isBestScore < player.score){
          localStorage.setItem("bestScore",player.score)
        }
        // Background
        ctx.beginPath()
        ctx.fillStyle="black"
        ctx.fillRect(350,300,500,550)
        ctx.closePath()
        // Replay
        ctx.beginPath()
        ctx.fillStyle="green"
        ctx.fillRect(350,600,500,100)
        ctx.closePath()
        ctx.beginPath()
        ctx.fillStyle="white"
        ctx.font = "35px Arial"
        ctx.fillText("PRESS ENTER TO REPLAY", 370,660)
        ctx.closePath()
        // Pay To Win
        ctx.beginPath()
        ctx.fillStyle="orange"
        ctx.fillRect(350,700,500,80)
        ctx.closePath()
        ctx.beginPath()
        ctx.fillStyle="white"
        ctx.font = "25px Arial"
        ctx.fillText("PRESS W: START AT 20 FOR 20 COINS", 370,730)
        ctx.closePath()
        // Best Score
        ctx.beginPath()
        ctx.fillStyle="white"
        ctx.font = "35px Arial"
        ctx.fillText("BEST SCORE : "+localStorage.getItem('bestScore'), 370,820)
        ctx.closePath()
        // Title
        ctx.beginPath()
        ctx.fillStyle="white"
        ctx.font = "60px Arial"
        ctx.fillText("GAME OVER", 400, 400)
        ctx.closePath()
        // Score
        ctx.drawImage(scorePlankImg,400, settings.height/2+10);
        ctx.beginPath()
        ctx.fillStyle="white"
        ctx.font = "60px Arial"
        ctx.fillText(player.score, 460, settings.height/2+80)
        ctx.closePath()
        // Coins
        ctx.drawImage(coinImg,700,480)
        ctx.beginPath()
        ctx.fillStyle="orange"
        ctx.font = "60px Arial"
        ctx.fillText(player.coins,580,540)
        ctx.closePath

        return
    }
    window.requestAnimationFrame(refresh);
}

// Pay 20 coins to get at score 20
function payToWin(){
  if(player.coins>=20 && player.isPayToWin == "true"){
    player.score=20
    player.coins-=20
    localStorage.setItem("coins",player.coins)
    settings.speed=settings.speedMedium
  }
  play()
}

// Play
function play(){
  window.addEventListener("keyup", controller.keyListener)
  window.addEventListener("keydown", controller.keyListener)
  window.requestAnimationFrame(refresh);

}

// RePlay
function replay(isPayToWin){
  if(player.loose){
    if (isPayToWin){
      localStorage.setItem("payToWin",true)
    }
    else {
      localStorage.setItem("payToWin",false)
    }
    document.location.reload(true);
  }
}

//loose
function loose(){
  player.loose=true
}

  payToWin()
