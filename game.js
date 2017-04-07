/* Game Variables */

var svg = d3.select("svg"),
    w = +svg.attr("width"),
    h = +svg.attr("height"),
    size = 30,
    radius = (size/2),
    rows = h / size,
    cols = w / size;

/* Game Setup */

// create grid data
var cells = d3.range(0, rows * cols).map(d => {
  var col = d % cols;
  var row = (d - col) / cols;
  return {
    r: row,
    c: col,
    x: col * size,
    y: row * size
  };
});

// render grid
var cell = svg.selectAll(".cell")
  .data(cells)
  .enter().append("rect")
  .attr("x", (d) => d.x)
  .attr("y", (d) => d.y)
  .attr("width", size)
  .attr("height", size)
  .style("fill", "#333333")
  .style("stroke", "#cccccc");

/* Game Class */

Game = {
  fps: 60,
  fCounter: 0,
  circles: [],
  nBalls: 50,

  init: () => {
    for(var i = 0; i < Game.nBalls; i++) {
      var y    = Math.floor(Math.random() * (h - 2 * size)) + size;
      var x    = Math.floor(Math.random() * (w - 2 * size)) + size;
      var v    = Math.floor(Math.random() * 5) + 5;
      var teta = Math.floor(Math.random() * 360);
      Game.circles.push(new Circle(
        x,
        y,
        v * Math.sin(teta),
        v * Math.cos(teta)
      ));
    }
    Game.createCircles();
    Game._interval = setInterval(Game.update, 1000/Game.fps);
  },

  pause: () => {
    clearInterval(Game._interval);
  },

  stop: () => {

  },

  update: () => {
    Game.fCounter++;
    d3.select(".frameCounter").text("Frame " + Game.fCounter);
    Game.updateCircles();
    Game.renderCircles();
  },

  updateCircles: () => {
    //debugger;
    Game.circles.forEach((circle) => circle.update());
  },

  renderCircles: () => {
    svg.selectAll("circle")
      .data(Game.circles)
      .attr("cx", (d) => d.pos.x)
      .attr("cy", (d) => d.pos.y)
      .style("fill", (d) => d.color);
  },

  createCircles: () => {
    svg.selectAll("circle")
      .data(Game.circles)
      .enter().append("circle")
      .attr("cx", (d) => d.pos.x)
      .attr("cy", (d) => d.pos.y)
      .attr("r", radius)
      .style("fill", (d) => d.color);
  }
}

/* Circle Class */

var Circle = function(x, y, dx, dy) {
  this.pos = { x: x, y: y };
  this.vel = { x: dx, y: dy };
  this.color = randomColor();
}

Circle.prototype.update = function() {
  // collision detection with wall
  if(this.pos.x + this.vel.x > w - (radius) || this.pos.x + this.vel.x < (radius)) {
    this.vel.x *= -1;
    this.color = randomColor();
  } else
  if(this.pos.y + this.vel.y > h - (radius) || this.pos.y + this.vel.y < (radius)) {
    this.vel.y *= -1;
    this.color = randomColor();
  } else {
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
  }
}

/* Helper functions */

var dist = (x1, y1, x2, y2) => {
  var a = x1 - x2
  var b = y1 - y2
  return Math.sqrt(a * a + b * b);
}

var random = (min, max) => {
  return Math.floor(Math.random() * max) + min;
}

var randomColor = () => {
  var g = random(0, 255);
  var r = random(0, 255);
  var b = random(0, 255);
  return `rgb(${g},${r},${b})`;
}
