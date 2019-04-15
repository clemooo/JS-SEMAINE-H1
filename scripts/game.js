let settings={
  speed:3,
  width:900,
  height:700,
  margin:150,
  gravity:1.5,
  friction:0.92,
  jump:5,
  gap:150,
  obsWidth:125,
  obsHeight:300
}
settings.obsHeight=(settings.height-settings.gap)/2

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
// Obstacles xy storage
let pipe=[]
pipe[0]={
  x:settings.width,
  y:0
}

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
    else if (player.y<0){
      player.y = 0
      player.velY = 0
    }

    // Obstacles
    for(let i=0; i < pipe.length; i++){
      ctx.clearRect(pipe[i].x+settings.speed, pipe[i].y, settings.obsWidth, settings.obsHeight)
      ctx.beginPath()
      ctx.rect(pipe[i].x, pipe[i].y, settings.obsWidth, settings.obsHeight)
      ctx.fillStyle = "green"
      ctx.fill()
      ctx.closePath()

      let constant = settings.obsHeight+settings.gap

      ctx.clearRect(pipe[i].x+settings.speed, pipe[i].y+constant-1, settings.obsWidth, settings.obsHeight)
      ctx.beginPath()
      ctx.rect(pipe[i].x, pipe[i].y+constant, settings.obsWidth, settings.obsHeight)
      ctx.fillStyle = "green"
      ctx.fill()
      ctx.closePath()

      if(player.x>pipe[i].x && (player.y <= pipe[i].y + settings.obsHeight)){
        console.log("perdu")
      }

      pipe[i].x-=settings.speed
    }



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

    window.requestAnimationFrame(refresh);
}

window.addEventListener("keyup", controller.keyListener)
window.addEventListener("keydown", controller.keyListener)
window.requestAnimationFrame(refresh)
