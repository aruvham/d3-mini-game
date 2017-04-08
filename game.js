/* Game Variables */

var svg = d3.select("svg");
var resetButton = d3.select(".reset")
    .on("click", () => Game.reset());

var w = +svg.attr("width"),
    h = +svg.attr("height"),
    size = 30,
    radius = (size/2),
    rows = h / size,
    cols = w / size;

/* Game Setup */

var mouseX;
var mouseY;
document.onmousemove = function(e){
    mouseX = e.pageX - 105;
    mouseY = e.pageY - 55;
}

svg.style('background', '#7185ad');

/* Game Class */

Game = {
  fps: 30,
  nBalls: 1,
  hitbox: false,

  init: () => {
    Game.resetValues();
    for(var i = 0; i < Game.nBalls; i++) {
      Game.spawnShuriken();
    }
    Game.createBG();
    Game.cat = new Cat();
    Game.cat.create();
    Game.createCheese();
    Game.createCircles();
    Game._interval = setInterval(Game.update, 1000/Game.fps);
  },

  pause: () => {
    clearInterval(Game._interval);
  },

  reset: () => {
    Game.init();
  },

  update: () => {
    Game.fCounter++;

    // each 5 sec
    if(Game.fCounter % 150 === 0) {
      Game.spawnShuriken();
    }

    // each sec
    if(Game.fCounter % 30 === 0) {
      Game.spawnBurger();
      d3.select(".time").text("TIME: " + Math.floor(Game.fCounter / 60));
    }

    Game.updateBG();
    Game.cat.update();
    Game.updateCheese();
    Game.updateCircles();
    Game.cat.render();
    Game.renderCheese();
    Game.renderCircles();
  },

  updateCircles: () => {
    Game.circles.forEach((circle) => circle.update());
  },

  renderCircles: () => {
    if(Game.hitbox) {
    svg.selectAll(".shurikenhitbox")
      .data(Game.circles)
      .attr("cx", (d) => d.pos.x)
      .attr("cy", (d) => d.pos.y);
    }

    svg.selectAll(".ninja")
      .data(Game.circles)
      .attr("x", (d) => d.pos.x - size)
      .attr("y", (d) => d.pos.y - size)
  },

  createCircles: () => {
    if(Game.hitbox) {
    svg.selectAll(".shurikenhitbox")
      .data(Game.circles)
      .enter().append("circle")
      .classed("shurikenhitbox", true)
      .attr("cx", (d) => d.pos.x)
      .attr("cy", (d) => d.pos.y)
      .attr("r", size)
      .attr("fill", "red");
    }

    svg.selectAll(".ninja")
      .data(Game.circles)
      .enter().append("svg:image")
      .classed("ninja", true)
      .attr("xlink:href", "img/ninja.png")
      .attr("x", (d) => d.pos.x - size)
      .attr("y", (d) => d.pos.y - size)
      .attr("width", size * 2)
      .attr("height", size * 2);
  },

  spawnShuriken: () => {
    var y    = size;
    var x    = w - size;
    var v    = random(6, 12)
    var teta = random(0, 360);
    Game.circles.push(new Circle(
      x,
      y,
      v * Math.sin(teta),
      v * Math.cos(teta)
    ));
    Game.createBG();
    Game.createCircles();
  },

  /* Cheese */

  updateCheese: () => {
    Game.cheese.forEach((cheese) => cheese.update());
  },

  renderCheese: () => {
    if(Game.hitbox) {
    svg.selectAll(".cheesehitbox")
      .data(Game.cheese)
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y);
  }

  svg.selectAll(".cheese")
      .data(Game.cheese)
      .attr("x", (d) => d.x - size)
      .attr("y", (d) => d.y - size)
  },

  createCheese: () => {
    if(Game.hitbox) {
      svg.selectAll(".cheesehitbox")
        .data(Game.cheese)
        .enter().append("circle")
        .classed("cheesehitbox", true)
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y)
        .attr("r", size)
        .attr("fill", "blue");
    }

    svg.selectAll(".cheese")
      .data(Game.cheese)
      .enter().append("svg:image")
      .classed("cheese", true)
      .attr("xlink:href", "img/cheese.png")
      .attr("x", (d) => d.x - size)
      .attr("y", (d) => d.y - size)
      .attr("width", size * 2)
      .attr("height", size * 2)
      /*.transition()
      .duration(2000)
      //.ease('linear')
      .attrTween("transform", tween);*/
  },

  spawnBurger: () => {
    Game.cheese.push(new Cheese());
    Game.createBG();
    Game.createCheese();
  },

  /* City BG */
  createBG: () => {
    svg.selectAll("image")
      .data(Game.bg)
      .enter().append("image")
      .attr("xlink:href", (d) => d.src)
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y)
      .attr("width",  (d) => d.w)
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
  },

  resetValues: () => {
    Game.fCounter = 0;
    Game.score = 0;
    Game.cat = null;
    Game.circles = [];
    Game.cheese = [];
    Game.bg = [
      {x: 0,    y: -400, w: 1500, h: 1250, dx: -1, src: 'img/mountain.png'},
      {x: 1500, y: -400, w: 1500, h: 1250, dx: -1, src: 'img/mountain.png'},
      {x: 0,    y: -100, w: 1750, h: 875,  dx: -3, src: 'img/city.png'},
      {x: 1750, y: -100, w: 1750, h: 875,  dx: -3, src: 'img/city.png'}
    ];

    svg.selectAll(".ninja")
      .data(Game.circles)
      .exit().remove();

    svg.selectAll(".shurikenhitbox")
      .data(Game.circles)
      .exit().remove();

    svg.selectAll(".cheese")
      .data(Game.circles)
      .exit().remove();

    svg.selectAll(".cheesehitbox")
      .data(Game.circles)
      .exit().remove();

    d3.select(".time").text("TIME: 0");
    d3.select(".score").text("SCORE: 0");
  }
}

/* Circle Class */

// ninja shurikens
var Circle = function(x, y, dx, dy) {
  this.pos = { x: x, y: y };
  this.vel = { x: dx, y: dy };
}

Circle.prototype.update = function() {
  // collision detection with wall
  if(this.pos.x + this.vel.x > w - (size) || this.pos.x + this.vel.x < (size)) {
    this.vel.x *= -1;
  } else
  if(this.pos.y + this.vel.y > h - (size) || this.pos.y + this.vel.y < (size)) {
    this.vel.y *= -1;
  } else {
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
  }
}

/* Cat */

var Cat = function() {
  this.x = 0;
  this.y = 0;
}

Cat.prototype.create = function() {
  if(Game.hitbox) {
  svg.append("circle")
    .classed("cathitbox", true)
    .attr("fill", "red")
    .attr("cx", Game.cat.x)
    .attr("cy", Game.cat.y)
    .attr("r", 1.35 * size);
  }

  svg.append("svg:image")
    .classed("cat", true)
    .attr("xlink:href", "img/cat.png")
    .attr("x", Game.cat.x - (1.5 * size))
    .attr("y", Game.cat.y - (1.5 * size))
    .attr("width",  3 * size)
    .attr("height", 3 * size);
}

Cat.prototype.update = function() {
  this.x = mouseX || 150;
  this.y = mouseY || 150;

  //border detection
  if(this.x < 1.5 * size) this.x = 1.5 * size;
  if(this.x > w - 1.5 * size) this.x = w - 1.5 * size;
  if(this.y < 1.5 * size) this.y = 1.5 * size;
  if(this.y > h - 1.5 * size) this.y = h - 1.5 * size;

  // collision with shurikens
  Game.circles.forEach((circle) => {
    var d = dist(this.x,
                 this.y,
                 circle.pos.x,
                 circle.pos.y);
    if(d < 2*size) {
      Game.pause();
    }
  });

  // collision with burger
  for(var i = Game.cheese.length - 1; i >= 0; i--) {
    var d = dist(this.x,
                 this.y,
                 Game.cheese[i].x,
                 Game.cheese[i].y);
    if(d < 2*size) {
      Game.score++;
      d3.select(".score").text("SCORE: " + Game.score);
      Game.cheese[i].y = -1000;
    }
    // recycle burger
    if(Game.cheese[i] < 0) {
      Game.cheese[i].x = w + 1000;
    }
  }
}

Cat.prototype.render = function() {
  if(Game.hitbox) {
  svg.selectAll(".cathitbox")
    .attr("cx", () => Game.cat.x)
    .attr("cy", () => Game.cat.y);
  }

  svg.selectAll(".cat")
    .attr("x", () => Game.cat.x - (1.5 * size))
    .attr("y", () => Game.cat.y - (1.5 * size));
}

/* cheese */

var Cheese = function() {
  this.x = w + 200;
  this.y = random(size, h - size);
  this.dx = random(6, 12);
}

Cheese.prototype.update = function() {
  this.x += -this.dx;
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

function tween(d, i, a) {
  return d3.interpolateString("rotate(0, 0, 0)", "rotate(360, 0, 0)");
}
