// import utils from '../utils.js'

var canvas = document.querySelector('canvas')

canvas.width = innerWidth
canvas.height = innerHeight

var c = canvas.getContext('2d')

addEventListener('resize', () => {
  canvas.width = innerWidth
  canvas.height = innerHeight
})

// -----------------------------------------------------------
// STAR ======================================================
// -----------------------------------------------------------

function Star(x, y, radius, color) {
  this.x = x
  this.y = y
  this.radius = radius
  this.color = color
  this.velocity = {
    x: this.x > canvas.width / 2 ? randomIntFromRange(-5, -1) : randomIntFromRange(1, 5) ,
    y: 3
  }
  this.gravity = 1
  this.friction = 0.8
}

Star.prototype.draw = function() {
  c.save()
  c.beginPath()
  c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
  c.fillStyle = this.color
  c.shadowColor = '#e3eaef'
  c.shadowBlur = 20
  c.fill()
  c.closePath()
  c.restore()
}

Star.prototype.update = function() {
  this.draw()

  // HORIZONAL

  if (this.y + this.radius + this.velocity.y > canvas.height - groundHeight) {
    this.velocity.y = -this.velocity.y * this.friction
    this.shatter()
  } else {
    this.velocity.y += this.gravity
  }

  if (this.x + this.radius + this.velocity.x > canvas.width) {
    this.velocity.x = -this.velocity.x
  }

  if (this.x + this.radius + this.velocity.x < 0) {
    this.velocity.x = -this.velocity.x
  }

  this.x += this.velocity.x
  this.y += this.velocity.y
}

Star.prototype.shatter = function() {
  this.radius -= 3
  for (let i = 0; i < 8; i++) {
    miniStars.push(new MiniStar(this.x, this.y, 2))
  }
}

// -----------------------------------------------------------
// MINISTAR ==================================================
// -----------------------------------------------------------

function MiniStar(x, y, radius, color) {
  Star.call(this, x, y, radius, color)
  this.velocity = {
    x: randomIntFromRange(-5, 5),
    y: randomIntFromRange(-15, 15)
  }
  this.friction = 0.8
  this.gravity = 0.2
  this.ttl = 100
  this.opacity = 1
}

MiniStar.prototype.draw = function() {
  c.save()
  c.beginPath()
  c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
  c.fillStyle = `rgba(227, 234, 239, ${this.opacity})`
  c.shadowColor = '#e3eaef'
  c.shadowBlur = 20
  c.fill()
  c.closePath()
  c.restore()
}

MiniStar.prototype.update = function() {
  this.draw()

  // HORIZONAL

  if (this.y + this.radius + this.velocity.y > canvas.height - groundHeight) {
    this.velocity.y = -this.velocity.y * this.friction
  } else {
    this.velocity.y += this.gravity
  }
  this.x += this.velocity.x
  this.y += this.velocity.y
  this.ttl--
  this.opacity -= 1/this.ttl
}

// -----------------------------------------------------------
// Backgorund ================================================
// -----------------------------------------------------------

function createMountainRange(mountainAmount, height, color) {
  const mountainWidth = canvas.width/mountainAmount
  for (let i = 0; i < mountainAmount; i++) {
    c.beginPath()
    c.moveTo(i * mountainWidth, canvas.height)
    c.lineTo(i * mountainWidth + mountainWidth + 325, canvas.height)
    c.lineTo(i * mountainWidth + mountainWidth/2, canvas.height - height)
    c.lineTo(i * mountainWidth - 325, canvas.height)
    c.fillStyle = color
    c.fill()
    c.closePath()
  }
}

// -----------------------------------------------------------
// Implementation ============================================
// -----------------------------------------------------------

const backgroundGradient = c.createLinearGradient(0, 0, 0, canvas.height)
backgroundGradient.addColorStop(0, '#171e26')
backgroundGradient.addColorStop(1, '#3f586b')
let stars
let miniStars
let ticker = 0
let randomSpawnRate = 75
let groundHeight = 100

function init() {
  stars = []
  miniStars = []
  backgroundStars = []
  for (let i = 0; i < 150; i++) {
    const x = Math.random() * canvas.width
    const y = Math.random() * canvas.height
    const radius = Math.random() * 3
    backgroundStars.push(new Star(x, y, radius, 'white'))
  }
}

// -----------------------------------------------------------
// Animation Loop ============================================
// -----------------------------------------------------------

function animate() {
  requestAnimationFrame(animate)
  c.fillStyle = backgroundGradient
  c.fillRect(0, 0, canvas.width, canvas.height)

  backgroundStars.forEach(backgroundStar => {
    backgroundStar.draw()
  })

  createMountainRange(1, canvas.height - 50, '#384551')
  createMountainRange(2, canvas.height - 100, '#283843')
  createMountainRange(3, canvas.height - 300, '#26333E')
  c.fillStyle = '#182028'
  c.fillRect(0, canvas.height - groundHeight, canvas.width, groundHeight)

  stars.forEach((star, index) => {
    star.update()
    if (star.radius - 3 <= 0) {
      stars.splice(index, 1)
    }
  })

  miniStars.forEach((miniStar, index) => {
    miniStar.update()
    if (miniStar.ttl === 0) {
      miniStars.splice(index, 1)
    }
  })

  ticker++

  if (ticker === randomSpawnRate) {
    const radius = 14
    const x = Math.random() * (canvas.width - radius * 2) + radius
    stars.push(new Star(x, -100, randomIntFromRange(7, radius), 'white'))
    randomSpawnRate = randomIntFromRange(75, 150)
    ticker = 0
  }

}

init()
animate()