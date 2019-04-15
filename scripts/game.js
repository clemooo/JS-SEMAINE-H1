let settings={
  speed:9,
  speedDefault:9,
  speedBoost:20,
  width:1200,
  height:900,
  margin:150,
  gravity: 0.3,
  friction:0.92,
  jump:2.5,
  gapMax:200,
  gapMin: 120,
  gapDifficulty:3,
  obsWidth:10,
  obsHeight:900,
  obsIntval:900
}

let player={
  height:50,
  width:68,
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
  gap:settings.gapMax
}

// Images import
let playerImg = new Image()
let bgImg = new Image()
playerImg.src = "./images/player.png"
bgImg.src = "./images/bg.png"

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
    // Down
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
      player.y = settings.height-settings.margin-20
      player.velY = 0
    }
    else if (player.y<0){
      player.y = 0
      player.velY = 0
    }

    // Obstacles
    for(let i=0; i < pipe.length; i++){
      ctx.clearRect(pipe[i].x, pipe[i].y, settings.obsWidth, settings.obsHeight)
      ctx.beginPath()
      ctx.rect(pipe[i].x, pipe[i].y, settings.obsWidth, settings.obsHeight)
      ctx.fillStyle = "green"
      ctx.fill()
      ctx.closePath()

      let constant = settings.obsHeight+pipe[i].gap

      ctx.clearRect(pipe[i].x+settings.speed, pipe[i].y+constant, settings.obsWidth, settings.obsHeight)
      ctx.beginPath()
      ctx.rect(pipe[i].x, pipe[i].y+constant, settings.obsWidth, settings.obsHeight)
      ctx.fillStyle = "green"
      ctx.fill()
      ctx.closePath()
      if(pipe[i].x == player.x+1){
        player.score=player.score+1
        if(pipe[i].gap<=settings.gapMin){
          pipe.push({
             x : settings.width,
             y : Math.floor(Math.random() * (-850 - -350 + 1)) + -350,
             gap : settings.gapMin
         })
        }else{
          pipe.push({
             x : settings.width,
             y : Math.floor(Math.random() * (-850 - -350 + 1)) + -350,
             gap : settings.gapMax-1*settings.gapDifficulty
         })
        }

      }
      pipe[i].x-=settings.speed
    }

    // Building player
    ctx.drawImage(playerImg,player.x,player.y);

    // Building landscape
    ctx.beginPath()
    ctx.rect(0, settings.height-settings.margin+player.height, settings.width, settings.margin)
    ctx.fillStyle="orange"
    ctx.fill()
    ctx.closePath()

    // Score
    ctx.beginPath()
    ctx.fillStyle="orange"
    ctx.font = "60px Arial"
    ctx.fillText(player.score, 10, 60)
    ctx.closePath()
    // Loose conditions

    if (player.loose){
        return
    }
    window.requestAnimationFrame(refresh);
}

window.addEventListener("keyup", controller.keyListener)
window.addEventListener("keydown", controller.keyListener)
window.requestAnimationFrame(refresh);
