// https://www.youtube.com/watch?v=4q2vvZn5aoo&ab_channel=ChrisCourses 1:08
import platform from '../img/platform.png'
import hills from '../img/hills.png'
import background from '../img/background.png'

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

const gravity = 0.25

class Player {
    constructor() {
        this.position = {
            x: 100,
            y: 100
        }
        this.velocity = {
            x: 0,
            y: 1
        }
        this.width = 20
        this.height = 20
    }

    draw() {
        c.fillStyle ='red'
        c.fillRect(this.position.x,
            this.position.y,
            this.width,
            this.height
        )
    }

    update() {
        this.draw()
        this.position.y += this.velocity.y
        this.position.x += this.velocity.x
        if (this.position.y + this.height + this.velocity.y <= canvas.height ){
            this.velocity.y += gravity
        }
    }
}

class Platform {
    constructor({ x,y, image }) {
        this.position = {
            x,
            y
        }
        this.image = image
        this.width = image.width
        this.height = image.height
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
    }
}

class GenericObject {
    constructor({ x,y, image }) {
        this.position = {
            x,
            y
        }
        this.image = image
        this.width = image.width
        this.height = image.height
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
    }
}

function createImage(imageSrc) {
    const image = new Image()
    image.src = imageSrc
    return image
}


let platformImage = createImage(platform)
let genericObjects = [new GenericObject({x:-1,y:-1,image:createImage(background)}), new GenericObject({x:-1,y:-1,image:createImage(hills)})]
let player = new Player()
let platforms = [new Platform({x:-1, y: 470, image:platformImage}), new Platform({x:platformImage.width - 3, y:470, image:platformImage })]
let scrollOffset = 0


function init(){
    platformImage = createImage(platform)
    genericObjects = [new GenericObject({x:-1,y:-1,image:createImage(background)}), new GenericObject({x:-1,y:-1,image:createImage(hills)})]
    player = new Player()
    platforms = [new Platform({x:-1, y: 470, image:platformImage}), new Platform({x:platformImage.width - 3, y:470, image:platformImage })]
    scrollOffset = 0
}
const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    }
}


function animate() {
    requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height)
    genericObjects.forEach(genericObject => {
        genericObject.draw()
    })
    platforms.forEach((platform) => {
        platform.draw()
    })
    player.update()

    if (keys.right.pressed && player.position.x < 400) {
        player.velocity.x = 5
    } else if (keys.left.pressed && player.position.x > 100)  {
        player.velocity.x = -5
    } else {
        player.velocity.x = 0

        if(keys.right.pressed){
            scrollOffset += 5
            platforms.forEach((platform) => {
                platform.position.x -= 5
            })
            genericObjects.forEach(genericObject =>{
                genericObject.position.x -= 3
            })        
        } else if (keys.left.pressed){
            scrollOffset -= 5
            platforms.forEach((platform) => {
                platform.position.x += 5
            })
            genericObjects.forEach(genericObject =>{
                genericObject.position.x += 3
            })           
        }
    }
    
    // Platform Collision detection
    platforms.forEach((platform) => {
        if (player.position.y + player.height <= platform.position.y &&
            player.position.y + player.height + player.velocity.y >= platform.position.y &&
            player.position.x + player.width >= platform.position.x &&
            player.position.x <= platform.position.x + platform.width){
            player.velocity.y = 0
        }
    })
    // Win condition
    if (scrollOffset > 2000) {
        console.log('you win')
    }
    if (player.position.y > canvas.height ){
        console.log('you lose')
        init()
    }
}

animate()

window.addEventListener('keydown', ({ keyCode }) => {
    switch(keyCode) {
    case 65:
        console.log('left')
        keys.left.pressed = true
        break
    case 83:
        console.log('down')
        break
    case 68:
        console.log('right')
        keys.right.pressed = true
        break
    case 87:
        console.log('up')
        player.velocity.y -= 20
        break
    }
})

window.addEventListener('keyup', ({ keyCode }) => {
    switch(keyCode) {
    case 65:
        console.log('left')
        keys.left.pressed = false
        break
    case 83:
        console.log('down')
        break
    case 68:
        console.log('right')
        keys.right.pressed = false
        break
    case 87:
        console.log('up')
        player.velocity.y += 20
        break
    }
})