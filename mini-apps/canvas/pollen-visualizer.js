// import utils from '../utils.js'

var canvas = document.querySelector('canvas')

canvas.width = innerWidth
canvas.height = innerHeight

var c = canvas.getContext('2d')

var maxPollenSize = 4
var minPollenSize = 1
var mouseRadius = 100

var treeAmt = 'High'
var grassAmt = 'Very High'
var weedAmt = 'Low'

var pollenDensity = {
  'Low': 1,
  'Moderate': 2,
  'High': 3,
  'Very High': 4
}

mouse = {
  x: undefined,
  y: undefined
}
addEventListener('resize', () => {
  canvas.width = innerWidth
  canvas.height = innerHeight
  init(grassAmt, treeAmt, weedAmt)
})


addEventListener('mousemove', (e) => {
  mouse.x = e.x
  mouse.y = e.y
  // console.log(mouse)
})

addEventListener('touchmove', (e) => {
  mouse.x = e.x
  mouse.y = e.y
  // console.log(mouse)
})

// -----------------------------------------------------------
// STAR ======================================================
// -----------------------------------------------------------

function Pollen(x, y, radius, rgb) {
  this.x = x
  this.velocity = (2 ** radius) * 0.01 * [-1, 1][Math.round(Math.random())]
  this.radius = radius
  this.rgb = rgb

  // sin wave
  this.a = randomFromRange(20, 40)
  this.b = randomFromRange(0.2, 0.3) / 10
  this.c = randomFromRange(5, 15)
  this.d = y

  this.y = this.a * Math.sin(this.b * (this.x + this.c)) + this.d
}

Pollen.prototype.draw = function() {
  c.save()
  c.beginPath()
  c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
  c.fillStyle = `rgba(${this.rgb}, ${this.radius/maxPollenSize})`//this.color
  c.shadowColor = `rgba(${this.rgb}, 0.7)`
  c.shadowBlur = 5
  c.fill()
  c.closePath()
  c.restore()
}

Pollen.prototype.update = function() {
  this.draw()

  if (this.x + this.radius + this.velocity > canvas.width + 20) {
    this.x = -10
  }

  if (this.x + this.radius + this.velocity < -20) {
    this.x = canvas.width + 10
  }

  this.x += this.velocity
  this.y = this.a * Math.sin(this.b * (this.x + this.c)) + this.d

  var opposite = this.y - mouse.y
  var adjacent = this.x -  mouse.x
  var theta = Math.atan2(opposite, adjacent)

  if (this.y + this.radius > canvas.height || this.y + this.radius < 0) {
    this.d = randomFromRange(this.radius * 2, canvas.height-(this.radius * 2))
    this.y = this.a * Math.sin(this.b * (this.x + this.c)) + this.d
    if (this.velocity < 1) {
      this.x = canvas.width + maxPollenSize
    } else {
      this.x = -maxPollenSize
    }
  }

  if (Math.abs(Math.hypot(mouse.x - this.x, mouse.y - this.y)) < mouseRadius) {
    this.previousY = mouse.y
    this.x = mouse.x + Math.cos(theta) * mouseRadius
    this.y = mouse.y + Math.sin(theta) * mouseRadius
    this.d = this.y - this.a * Math.sin(this.b * (this.x + this.c))
  }
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
let pollen
let groundHeight = 100

function init(grassAmt, treeAmt, weedAmt) {
  pollen = []

  var area = canvas.height * canvas.width
  var grassDensity = grassAmt * 75
  var treeDensity = treeAmt * 10
  var weedDensity = weedAmt * 50

  var density = 18000
  for (let i = 0; i < area/density * pollenDensity[grassAmt]; i++) {
    const x = Math.random() * canvas.width
    const y = Math.random() * canvas.height
    const radius = randomFromRange(minPollenSize, maxPollenSize)
    pollen.push(new Pollen(x, y, radius, '133, 176, 53'))
  }

  for (let i = 0; i < area/density * pollenDensity[treeAmt]; i++) {
    const x = Math.random() * canvas.width
    const y = Math.random() * canvas.height
    const radius = randomFromRange(minPollenSize, maxPollenSize)
    pollen.push(new Pollen(x, y, radius, '237, 85, 209'))
  }

  for (let i = 0; i < area/density * pollenDensity[weedAmt]; i++) {
    const x = Math.random() * canvas.width
    const y = Math.random() * canvas.height
    const radius = randomFromRange(minPollenSize, maxPollenSize)
    pollen.push(new Pollen(x, y, radius, '255, 142, 56'))
  }
}

// -----------------------------------------------------------
// Animation Loop ============================================
// -----------------------------------------------------------

function animate() {
  requestAnimationFrame(animate)

  c.clearRect(0, 0, canvas.width, canvas.height)

  pollen.forEach((pollen, index) => {
    pollen.update()
  })

}

init(grassAmt, treeAmt, weedAmt)
animate()