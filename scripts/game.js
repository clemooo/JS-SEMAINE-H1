let settings={
  speed:12.5,
  speedMedium:20,
  speedHigh:25,
  width:1200,
  height:900,
  margin:150,
  gravity: 1,
  friction:0.92,
  jump:2.5,
  gap:200,
  obsWidth:180,
  obsHeight:900,
  obsIntval:900
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
  score:0
}

// Obstacle stockage
let tabObs=[]
let pipe=[]
pipe[0]={
  x:settings.width,
  y:-600,
}

// Images import
let playerImg = new Image()
let bgImg = new Image()
let pipeTopImg = new Image()
let pipeBottomImg = new Image()
let sandImg = new Image()
playerImg.src = "./images/player.png"
bgImg.src = "./images/wave.png"
pipeTopImg.src = "./images/pipetop.png"
pipeBottomImg.src = "./images/pipebottom.png"
sandImg.src = "./images/sand.png"

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
    ctx.drawImage(bgImg,0,0);
    // up
    if(controller.up==true){
      player.velY-=settings.jump
      player.jumping=true
    }
    //down
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
        player.score=player.score+1
        pipe.unshift({
           x : settings.width,
           y : Math.floor(Math.random() * (-850 - -350 + 1)) + -350,
       })
      }

    }

    // Building player
    ctx.drawImage(playerImg,player.x,player.y);

    // Building landscape
    ctx.drawImage(sandImg,0,settings.height-settings.margin+player.height);

    // Score
    ctx.beginPath()
    ctx.fillStyle="orange"
    ctx.font = "60px Arial"
    ctx.fillText(player.score, 10, 60)
    ctx.closePath

    // Loose conditions
    let pipeTop = pipe[0].y + settings.obsHeight
    let pipeBottom = pipe[0].y+settings.obsHeight+settings.gap-player.height
    if (player.x+player.width>=pipe[0].x && player.y <= pipeTop){
      player.loose = true;
    }
    else if (player.x+player.width>=pipe[0].x && player.y >= pipeBottom){
      player.loose = true;
    }


    if (player.loose){
        return
    }
    window.requestAnimationFrame(refresh);
}

window.addEventListener("keyup", controller.keyListener)
window.addEventListener("keydown", controller.keyListener)
window.requestAnimationFrame(refresh);
