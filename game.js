/* Game Variables */

var svg = d3.select("svg"),
    w = +svg.attr("width"),
    h = +svg.attr("height"),
    radius = 32;

/* Game Setup */

svg.style('background', 'black');

/* Game Class */

Game = {
  fps: 60,
  fCounter: 0,
  circles: [],
  nBalls: 2,

  init: () => {
    for(var i = 0; i < Game.nBalls; i++) {
      var randomPosX = Math.floor(Math.random() * w);
      var randomPosY = Math.floor(Math.random() * h);
      //var randomVelX = Math.floor(Math.random() * w);
      //var randomVelY = Math.floor(Math.random() * w);

      Game.circles.push(new Circle(randomPosX, randomPosY));
    }
    Game.createCircles();
    Game._interval = setInterval(Game.update, 1000/Game.fps);
  },

  pause: () => {

  },

  stop: () => {

  },

  update: () => {
    Game.fCounter++;
    console.log(Game.fCounter);

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
      .style("fill", (d) => d.color);
  }
}

/* Circle Class */

var Circle = function(x, y) {
  this.pos = { x: x, y: y };
  this.vel = { x: 5, y: 5 };
  this.color = 'red';
}

Circle.prototype.update = function() {
  this.pos.x += this.vel.x;
  this.pos.y += this.vel.y;

  // collision detection with wall
  if(this.pos.x + radius > w || this.pos.x - radius < 0) {
    this.vel.x *= -1;
  }
  if(this.pos.y + radius > h || this.pos.y - radius < 0) {
    this.vel.y *= -1;
  }

  // collision detection with other balls

}

/* Helper functions */

var dist = function(x1, y1, x2, y2) {
  var a = x1 - x2
  var b = y1 - y2
  return Math.sqrt(a * a + b * b);
}
