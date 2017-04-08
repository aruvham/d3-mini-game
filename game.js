/* Game Variables */

var svg = d3.select("svg"),
    w = +svg.attr("width"),
    h = +svg.attr("height"),
    size = 30,
    radius = (size/2),
    rows = h / size,
    cols = w / size;

/* Game Setup */

var mouseX;
var mouseY;
document.onmousemove = function(e){
    mouseX = e.pageX;
    mouseY = e.pageY;
}

/*
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
  .style("stroke", "#4d4d4d");
*/

/* Game Class */

Game = {
  fps: 60,
  fCounter: 0,
  circles: [],
  nBalls: 3,
  cat: null,
  bg: [
    {x: 0,    y: -400, w: 1500, h: 1250, dx: -1, src: 'img/mountain.png'},
    {x: 1500, y: -400, w: 1500, h: 1250, dx: -1, src: 'img/mountain.png'},
    {x: 0,    y: -100, w: 1750, h: 875,  dx: -3, src: 'img/city.png'},
    {x: 1750, y: -100, w: 1750, h: 875,  dx: -3, src: 'img/city.png'}
  ],

  init: () => {
    //Game.createBG();

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
    Game.createBG();
    Game.cat = new Cat();
    Game.cat.create();
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
    Game.updateBG();
    Game.cat.update();
    Game.cat.render();
    Game.updateCircles();
    Game.renderCircles();
  },

  updateCircles: () => {
    Game.circles.forEach((circle) => circle.update());
  },

  renderCircles: () => {
    svg.selectAll("circle")
      .data(Game.circles)
      .attr("cx", (d) => d.pos.x)
      .attr("cy", (d) => d.pos.y);
  },

  createCircles: () => {
    svg.selectAll("circle")
      .data(Game.circles)
      .enter().append("circle")
      .attr("cx", (d) => d.pos.x)
      .attr("cy", (d) => d.pos.y)
      .attr("r", radius)
      .style("fill", "red")
      .on("mouseover", function() {
        d3.select(this).style("fill", "green");
      }).on("mouseout", function() {
        d3.select(this).style("fill", "red");
      });
  },

  /* City BG */
  createBG: () => {
    svg.selectAll("image")
      .data(Game.bg)
      .enter().append("image")
      .attr("xlink:href", (d) => d.src)
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y)
      .attr("width", (d) => d.w)
      .attr("height", (d) => d.h);
  },

  updateBG: () => {
    Game.bg.forEach((bg) => {
      bg.x += bg.dx;
      if(bg.x <= -bg.w) {
        bg.x = bg.w;
      }
    });
    svg.selectAll("image")
      .data(Game.bg)
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y);
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

/* Cat */

var Cat = function() {
  this.x = w / 2;
  this.y = h / 2;
}

Cat.prototype.create = function() {
  svg.append("svg:image")
    .classed("cat", true)
    .attr("xlink:href", "img/cat.png")
    .attr("x", Game.cat.x)
    .attr("y", Game.cat.y)
    .attr("width", size * 3)
    .attr("height", size * 3);
}

Cat.prototype.update = function() {
  this.x = mouseX - (size * 3/2) || 0;
  this.y = mouseY - (size * 3/2) || 0;
}

Cat.prototype.render = function() {
  svg.selectAll(".cat")
    .attr("x", () => Game.cat.x)
    .attr("y", () => Game.cat.y);
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
