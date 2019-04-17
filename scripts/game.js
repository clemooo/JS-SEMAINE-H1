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
  obsVelY:-0.5,
  frame:0,
  medusaVelY:5,
  medusaWidth:105,
  medusaHeight:60,
  ballVelX:22,
  ballWidth:50,
  ballHeight:50
}

let player={
  height:63,
  width:85,
  x:200,
  y:100,
  velX:0,
  velY:0,
  jumping:false,
  loose:false,
  score:0,
  coins:parseInt(localStorage.getItem('coins')),
  isBestScore:localStorage.getItem('bestScore'),
  isPayToWin:localStorage.getItem('payToWin'),
  skinChoice:parseInt(localStorage.getItem('skinChoice')),
  isSkinTwoUnlocked:localStorage.getItem('isSkinTwoUnlocked'),
  isSkinGoldUnlocked:localStorage.getItem('isSkinGoldUnlocked'),
}
checkStorage("coins")
checkStorage("skinChoice")
checkStorage("isSkinTwoUnlocked")
checkStorage("isSkinGoldUnlocked")

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
  y:0
}

// Ball
let ball = []
ball[0]={
  x:-200,
  y:0,
  velY: 0
}

// Obstacles
let obs=[]
obs[0]={
  x:1200,
  y: Math.floor(Math.random() * (-850 - -350 + 1)) + -350
}

// Images import
let loopImgX = [
  [bg]="0",
  [fg]="0",
  [ps]="0"
]
let playerDefImg = new Image()
let playerDefUpImg = new Image
let playerDefDownImg = new Image()
let playerTwoImg = new Image()
let playerTwoUpImg = new Image
let playerTwoDownImg = new Image()
let playerGoldImg = new Image()
let playerGoldUpImg = new Image
let playerGoldDownImg = new Image()
let bgImg = new Image()
let pipeTopImg = new Image()
let pipeBottomImg = new Image()
let sandImg = new Image()
let scorePlankImg = new Image()
let coinImg = new Image()
let medusaImg = new Image()
let ballImg = new Image()
let particlesImg = new Image()
playerDefImg.src = "./images/0/player.png"
playerDefUpImg.src = "./images/0/playerUp.png"
playerDefDownImg.src = "./images/0/playerDown.png"
playerTwoImg.src = "./images/1/player.png"
playerTwoUpImg.src = "./images/1/playerUp.png"
playerTwoDownImg.src = "./images/1/playerDown.png"
playerGoldImg.src = "./images/2/player.png"
playerGoldUpImg.src = "./images/2/playerUp.png"
playerGoldDownImg.src = "./images/2/playerDown.png"

bgImg.src = "./images/bg.png"
pipeTopImg.src = "./images/pipetop.png"
pipeBottomImg.src = "./images/pipebottom.png"
sandImg.src = "./images/sand.png"
scorePlankImg.src = "./images/plank.png"
coinImg.src = "./images/coin.png"
medusaImg.src = "./images/medusa.png"
ballImg.src = "./images/ball.png"
particlesImg.src = "./images/particles.png"

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
      case 32: // Up
        controller.up = keyState
      break;
      case 38: // Up
        controller.up = keyState
      break;
      case 13: //Enter
        replay()
      break;
      case 87: // Pay to win (W)
        replay(true)
      break;
      case 65: // Skin default (A)
        skinChange(0)
      break;
      case 90: // Skin 2 (Z)
        skinChange(1)
      break;
      case 69: // Skin 3 ()
        skinChange(2)
      break;
    }
  }
}

function refresh()
{
    // Frame refresh
    settings.frame+=1

    // Loop images
    for(let i =0; i<=loopImgX.length;i++){
      if(loopImgX[i]< -settings.width){
        loopImgX[i]=0
      }
    }
    loopImgX[0]-=1
    loopImgX[1]-=settings.speed
    loopImgX[2]-=2

    // Background
    ctx.drawImage(bgImg,loopImgX[0],0);

    // Building particles
    ctx.drawImage(particlesImg,loopImgX[2],0);

    // Player up
    if(controller.up==true){
      player.velY-=settings.jump
      player.jumping=true
    }
    // Player Physics
    player.velY+=settings.gravity
    player.y+=player.velY
    player.velY*=settings.friction

    // Increasing speed
    switch(player.score){
      case 10:
        settings.speed = settings.speedMedium
        settings.medusaVelY=8
      break;
    }

    // Player limits
    if(player.y>settings.height-settings.margin-20){
      loose()
    }
    else if (player.y<0){
      loose()
    }

    // Building player
    if(player.velY>5){
      switch (player.skinChoice){
        case 0:
          ctx.drawImage(playerDefDownImg,player.x,player.y);
        break;
        case 1:
          ctx.drawImage(playerTwoDownImg,player.x,player.y);
        break;
        case 2:
          ctx.drawImage(playerGoldDownImg,player.x,player.y);
        break;
      }
    }
    else if (player.velY <= 5 && player.velY >= -5){
      switch (player.skinChoice){
        case 0:
          ctx.drawImage(playerDefImg,player.x,player.y);
        break;
        case 1:
          ctx.drawImage(playerTwoImg,player.x,player.y);
        break;
        case 2:
          ctx.drawImage(playerGoldImg,player.x,player.y);
        break;
      }
    }
    else if (player.velY < -5){
      switch (player.skinChoice){
        case 0:
          ctx.drawImage(playerDefUpImg,player.x,player.y);
        break;
        case 1:
          ctx.drawImage(playerTwoUpImg,player.x,player.y);
        break;
        case 2:
          ctx.drawImage(playerGoldUpImg,player.x,player.y);
        break;
      }
    }

    // Building Obstacles
    if(settings.frame%140==0){
      obs[0].x=settings.width
      obs[0].y=Math.floor(Math.random() * (-850 - -350 + 1)) + -350
    }
    obs[0].x-=settings.speed
    obs[0].y-=settings.obsVelY
    ctx.drawImage(pipeTopImg,obs[0].x,obs[0].y+10);
    let constant = settings.obsHeight+settings.gap
    ctx.drawImage(pipeBottomImg,obs[0].x,obs[0].y+constant);
    ctx.drawImage(coinImg,obs[0].x+50,obs[0].y+settings.obsHeight+60);
    if(obs[0].x == player.x){
      player.score+=1
      player.coins+=1
      localStorage.setItem("coins",player.coins)
    }

    // Building medusa
    if(settings.frame%210==0){
      medusa[0].x=settings.width
      if(medusa[0].x > obs[0].x && medusa[0].x+settings.medusaWidth < obs[0].x+settings.obsWidth){
        while(medusa[0].x > obs[0].x && medusa[0].x+settings.medusaWidth < obs[0].x+settings.obsWidth){
          medusa[0].x+=600
        }
      }
      medusa[0].y=Math.floor(Math.random() * (0 - (settings.height-settings.margin-20) + 1)) + (settings.height-settings.margin-20)
    }
    medusa[0].x-=settings.speed
    medusa[0].y-=settings.medusaVelY
    if(medusa[0].y<0 || medusa[0].y > settings.height-settings.margin-20){
      settings.medusaVelY = -settings.medusaVelY
    }
    ctx.drawImage(medusaImg,medusa[0].x,medusa[0].y);

    // Building ball
    if(settings.frame%140==0){
      ball[0].x=settings.width
      ball[0].y=Math.floor(Math.random() * (0 - (settings.height-settings.margin-20) + 1)) + (settings.height-settings.margin-20)
      ball[0].velY= Math.floor(Math.random() * (-15 - 15 + 1)) + 15
    }
    if(ball[0].y<0 || ball[0].y > settings.height-settings.margin-20){
      ball[0].velY = -ball[0].velY
    }
    ball[0].x-=settings.ballVelX
    ball[0].y+=ball[0].velY
    ctx.drawImage(ballImg,ball[0].x,ball[0].y);

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

    // Loose conditions
    if (player.x < obs[0].x + settings.obsWidth &&
       player.x + player.width > obs[0].x+25 &&
       player.y < obs[0].y + settings.obsHeight &&
       player.height + player.y > obs[0].y)
    {
      loose()
    }
    if (player.x < obs[0].x + settings.obsWidth &&
       player.x + player.width > obs[0].x+25 &&
       player.y < obs[0].y+constant + settings.obsHeight &&
       player.height + player.y > obs[0].y+constant-20)
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
    if (player.x < ball[0].x + settings.ballWidth &&
       player.x + player.width > ball[0].x+25 &&
       player.y < ball[0].y + settings.ballHeight &&
       player.height + player.y > ball[0].y-20)
    {
      loose()
    }
    // Building Game over if loose
    if (player.loose){
        if(player.isBestScore == null || player.isBestScore < player.score){
          localStorage.setItem("bestScore",player.score)
        }
        // Background
        ctx.beginPath()
        ctx.fillStyle="black"
        ctx.fillRect(350,150,500,700)
        ctx.closePath()
        // Skin default
        ctx.drawImage(playerDefImg,400,200 );
        if(player.skinChoice==0){
          ctx.fillStyle="white"
          ctx.font = "20px Arial"
          ctx.fillText("SELECTED", 380,310)
          ctx.closePath()
        }
        else{
          ctx.fillStyle="white"
          ctx.font = "20px Arial"
          ctx.fillText("PRESS A", 400,310)
          ctx.closePath()
        }
        // Skin 2
        ctx.drawImage(playerTwoImg,570,200 );
        if(player.skinChoice==1){
          ctx.fillStyle="white"
          ctx.font = "20px Arial"
          ctx.fillText("SELECTED", 550,310)
          ctx.closePath()
        }
        else if (player.isSkinTwoUnlocked==0){
          ctx.fillStyle="white"
          ctx.font = "20px Arial"
          ctx.fillText("Z TO BUY 100", 540,310)
          ctx.closePath()
        }
        else {
          ctx.fillStyle="white"
          ctx.font = "20px Arial"
          ctx.fillText("PRESS Z", 560,310)
          ctx.closePath()
        }
        // Skin 3
        ctx.drawImage(playerGoldImg,720,200 );
        if(player.skinChoice==2){
          ctx.fillStyle="white"
          ctx.font = "20px Arial"
          ctx.fillText("SELECTED", 700,310)
          ctx.closePath()
        }
        else if (player.isSkinGoldUnlocked==0){
          ctx.fillStyle="white"
          ctx.font = "20px Arial"
          ctx.fillText("E TO BUY 200", 700,310)
          ctx.closePath()
        }
        else {
          ctx.fillStyle="white"
          ctx.font = "20px Arial"
          ctx.fillText("PRESS E", 700,310)
          ctx.closePath()
        }
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

// Check if key exist in storage, if not set it at 0
function checkStorage(key){
  if (localStorage.getItem(key) == null){
    localStorage.setItem(key,0)
    player.key = parseInt(localStorage.getItem(key))
  }
}

// SkinChange
function skinChange(skinKey){
  switch (skinKey){
    case 0:
      player.skinChoice=skinKey
      localStorage.setItem("skinChoice",skinKey)
    break;
    case 1:
      if(parseInt(player.isSkinTwoUnlocked) == 1){
        player.skinChoice=skinKey
        localStorage.setItem("skinChoice",skinKey)
      }
      else if (parseInt(player.isSkinTwoUnlocked) == 0 && player.coins>=100){
        player.skinChoice=skinKey
        localStorage.setItem("skinChoice",skinKey)
        player.coins-=100
        localStorage.setItem("coins",player.coins)
        player.isSkinTwoUnlocked=1;
        localStorage.setItem("isSkinTwoUnlocked",player.isSkinTwoUnlocked)
      }
    break;
    case 2:
      if(parseInt(player.isSkinGoldUnlocked) == 1){
        player.skinChoice=skinKey
        localStorage.setItem("skinChoice",skinKey)
      }
      else if (parseInt(player.isSkinGoldUnlocked) == 0 && player.coins>=200){
        player.skinChoice=skinKey
        localStorage.setItem("skinChoice",skinKey)
        player.coins-=200
        localStorage.setItem("coins",player.coins)
        player.isSkinGoldUnlocked=1;
        localStorage.setItem("isSkinTwoUnlocked",player.isSkinGoldUnlocked)
      }
    break;
  }
}

// Pay 20 coins to get at score 20
function payToWin(){
  if(player.coins>=20 && player.isPayToWin == "true"){
    player.score=20
    player.coins-=20
    localStorage.setItem("coins",player.coins)
    settings.speed=settings.speedMedium
    settings.medusaVelY=-8
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
