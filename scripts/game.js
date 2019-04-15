let settings={
  width:900,
  height:700,
  margin:150,
  gravity:1,
  friction:0.92,
  jump:4,
}

let player={
  height:32,
  width:32,
  x:200,
  y:settings.height/2,
  velX:0,
  velY:0,
  jumping:false
}

let tabObs=[]
let body = document.querySelector("body")
let canvas = document.createElement("canvas")
canvas.setAttribute("width",settings.width)
canvas.setAttribute("height",settings.height)
body.appendChild(canvas)
let ctx = canvas.getContext("2d")


function init(){
    window.requestAnimationFrame(refresh)
  }
init()

let controller={
  up:false,
  down:false,
  keyListener(event){
    let keyState=(event.type=="keydown")?true:false;
    switch (event.keyCode){
      case 38: // Up
        controller.up= keyState
      break;
    }
  }
}

function refresh()
{
    ctx.clearRect(player.x, player.y-1, player.width, player.height-1)
    ctx.clearRect(player.x, player.y+1, player.width, player.height+1)
    // Jump
    if(controller.up==true){
      player.velY-=settings.jump
      player.jumping=true
    }
    // Player Physics
    player.velY+=settings.gravity
    player.y+=player.velY
    player.velY*=settings.friction

    // Player limits
    if(player.y>settings.height-settings.margin){
      player.y = settings.height-settings.margin
      player.velY = 0
    }
    else if (player.y<settings.margin-player.height){
      player.y = settings.margin-player.height
      player.velY = 0
    }

    // Obstacles

    // Building player
    ctx.beginPath()
    ctx.rect(player.x, player.y, player.width, player.height)
    ctx.fillStyle = "red"
    ctx.fill()
    ctx.closePath()

    // Building landscape
    ctx.beginPath()
    ctx.rect(0, settings.height-settings.margin+player.height, settings.width, settings.margin)
    ctx.fillStyle="blue"
    ctx.fill()
    ctx.closePath()

    ctx.beginPath()
    ctx.rect(0, 0-player.height, settings.width, settings.margin)
    ctx.fillStyle="blue"
    ctx.fill()
    ctx.closePath()

    window.requestAnimationFrame(refresh);
}

window.addEventListener("keyup", controller.keyListener)
window.addEventListener("keydown", controller.keyListener)
