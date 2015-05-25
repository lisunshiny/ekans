(function() {
  if (typeof window.Game === "undefined") {
    var Game = window.Game = {};
  }

  var gridsize = Game.GRIDSIZE = 16

  var Snake = Game.Snake = function(board) {
    this.dir = "N";
    this.board = board;
    this.segments = [ gridsize * gridsize / 2];
  }

  Snake.DIRS = {
    "N": -gridsize,
    "S": gridsize,
    "E": 1,
    "W": -1
  };

  Snake.prototype.move = function() {
    // updates moves.
    var dir = Snake.DIRS[this.dir];
    var newHead = _.last(this.segments) + dir;

    if (this.illegalMove(newHead)) {
      alert("ilelgal move!!!");
      return;
    }

    this.segments.push(newHead);

    // unless they're eating a cherry, delete the last segment.
    if (!this.eatingCherry(newHead)) {
      this.segments.shift();
    }
    // if they're eating a cherry, move the cherry.
    else {
      this.board.resetCherry();
    }
  };

  Snake.prototype.illegalMove = function(newHead) {
    //check for hitting self, hitting sides.
    return (this.hitsSelf(newHead) || this.hitsWall(newHead));
  };

  Snake.prototype.hitsSelf = function(newHead) {
    return _.contains(this.segments, newHead);
  };

  Snake.prototype.hitsWall = function (newHead){
    // hits right hand wall
    if (newHead % gridsize === 0 && this.dir === "E"){
      return true;
    }
    // hits left hand wall
    if (newHead % gridsize === gridsize - 1 && this.dir === "W") {
      return true;
    }
    // hits top or bottom wall
    if (newHead < 0 || newHead > (gridsize * gridsize - 1)) {
      return true;
    }

    return false;
  };


  Snake.prototype.turn = function(newDir) {
    this.dir = newDir;
  };

  Snake.prototype.eatingCherry = function(head) {
    if (this.board.cherry === head) {
      return true;
    }
    else {
      return false;
    }
  };




  //now for the board

  var Board = Game.Board = function() {
    this.snake = new Game.Snake(this);
    this.grid = this.generateGrid();
    // this.cherry = random number between 0 and grid size ** 2
    this.resetCherry();
    debugger;
  };

  Board.prototype.generateGrid = function() {
    var grid = new Array( Math.pow( gridsize, 2 ) );

    return grid;
  };


  Board.prototype.resetCherry = function() {
    // todo: make sure cherries don't render on the snake
    this.cherry = this.generateLocation();
  };

  Board.prototype.generateLocation = function() {
    var randNum;

    while (!randNum || _.contains(this.snake.segments, randNum)) {
      randNum = _.random(0, this.grid.length - 1);
    }

    return randNum;

  };





})();
