var canvas = document.querySelector('canvas')

canvas.width = innerWidth
canvas.height = innerHeight

var c = canvas.getContext('2d')

var maxPollenSize = 4
var minPollenSize = 1
var mouseRadius = 50

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
})

// -----------------------------------------------------------
// STAR ======================================================
// -----------------------------------------------------------

function Pollen(x, y, radius, rgb) {
  this.trueX = x
  this.velocity = (2.5 ** radius) * 0.01 * [-1, 1][Math.round(Math.random())]
  this.radius = radius
  this.rgb = rgb

  // sin wave
  this.a = randomFromRange(20, 40)
  this.b = randomFromRange(0.2, 0.3) / 10
  this.c = randomFromRange(5, 15)
  this.d = y

  this.trueY = this.a * Math.sin(this.b * (this.trueX + this.c)) + this.d

  this.x = this.trueX
  this.y = this.trueY
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
    this.trueX = -10
    this.x = this.trueX
  }

  if (this.x + this.radius + this.velocity < -20) {
    this.trueX = canvas.width + 10
    this.x = this.trueX
  }

  this.trueX += this.velocity
  this.trueY = this.a * Math.sin(this.b * (this.trueX + this.c)) + this.d

  this.x = this.trueX
  this.y = this.trueY

  var opposite = this.y - mouse.y
  var adjacent = this.x -  mouse.x
  var theta = Math.atan2(opposite, adjacent)

  // if (this.y + this.radius > canvas.height || this.y + this.radius < 0) {
  //   this.d = randomFromRange(this.radius * 2, canvas.height-(this.radius * 2))
  //   this.trueY = this.a * Math.sin(this.b * (this.trueX + this.c)) + this.d
  //   this.y = this.trueY
  //   if (this.velocity < 1) {
  //     this.trueX = canvas.width + maxPollenSize
  //     this.x = this.trueX
  //   } else {
  //     this.trueX = -maxPollenSize
  //     this.x = this.trueX
  //   }
  // }

  if (Math.abs(Math.hypot(mouse.x - this.trueX, mouse.y - this.trueY)) < mouseRadius * this.radius) {
    this.previousY = mouse.y
    this.x = mouse.x + Math.cos(theta) * mouseRadius * this.radius
    this.y = mouse.y + Math.sin(theta) * mouseRadius * this.radius

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
backgroundGradient.addColorStop(0, '#54beff')
backgroundGradient.addColorStop(0.4, '#a1dbff')
backgroundGradient.addColorStop(1, '#a1dbff')
let pollen
let groundHeight = 100

function init(grassAmt, treeAmt, weedAmt) {
  pollen = []

  var area = canvas.height * canvas.width
  var grassDensity = grassAmt * 75
  var treeDensity = treeAmt * 10
  var weedDensity = weedAmt * 50

  var density = 18000

  // for (let i = 0; i < 1; i++) {
  //   const x = Math.random() * canvas.width
  //   const y = Math.random() * canvas.height
  //   const radius = 5
  //   pollen.push(new Pollen(x, y, radius, '133, 176, 53'))
  // }




  for (let i = 0; i < area/density * pollenDensity[grassAmt]; i++) {
    const x = Math.random() * canvas.width
    const y = Math.random() * canvas.height
    const radius = randomFromRange(minPollenSize, maxPollenSize)
    pollen.push(new Pollen(x, y, radius, '191, 255, 166'))
  }

  for (let i = 0; i < area/density * pollenDensity[treeAmt]; i++) {
    const x = Math.random() * canvas.width
    const y = Math.random() * canvas.height
    const radius = randomFromRange(minPollenSize, maxPollenSize)
    pollen.push(new Pollen(x, y, radius, '255, 222, 166'))
  }

  for (let i = 0; i < area/density * pollenDensity[weedAmt]; i++) {
    const x = Math.random() * canvas.width
    const y = Math.random() * canvas.height
    const radius = randomFromRange(minPollenSize, maxPollenSize)
    pollen.push(new Pollen(x, y, radius, '255, 204, 250'))
  }
}

// -----------------------------------------------------------
// Animation Loop ============================================
// -----------------------------------------------------------

function animate() {
  requestAnimationFrame(animate)

  // c.clearRect(0, 0, canvas.width, canvas.height)
  c.fillStyle = backgroundGradient
  c.fillRect(0, 0, canvas.width, canvas.height)

  createMountainRange(1, canvas.height - 50, '#635949')
  createMountainRange(2, canvas.height - 100, '#5e4e33')
  createMountainRange(3, canvas.height - 300, '#544224')
  c.fillStyle = '#437d2c'
  c.fillRect(0, canvas.height - groundHeight, canvas.width, groundHeight)

  pollen.forEach((pollen, index) => {
    pollen.update()
  })

}

init(grassAmt, treeAmt, weedAmt)
animate()