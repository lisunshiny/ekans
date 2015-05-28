(function() {
  if (typeof window.Game === "undefined") {
    window.Game = {};
  }

  var View = Game.View = function($el) {

    // calculate the board height and width.
    this.boardSize();

    this.$el = $el;
    this.board = new Game.Board(this.boardWidth, this.boardHeight);
    this.setupGrid();

    $(window).one("keydown", this.startGame.bind(this));


    // this.intervalId = window.setInterval(this.move.bind(this), 180);
    //
    // $(window).on("keydown", this.handlePress.bind(this))

  };

  View.prototype.startGame = function() {
    $(".starting").addClass("hidden");
    this.bestScore = 0;
    this.$bestScore = $(".best-score");

    this.startSequence();

  };

  View.prototype.startSequence = function() {


    this.score = 0;
    this.$score = $(".score");
    this.$score.html(this.score);

    this.intervalId = window.setInterval(this.move.bind(this), 180);
    $(window).on("keydown", this.handlePress.bind(this));


  };



  var keys = View.KEYS = {
    38: "N",
    39: "E",
    40: "S",
    37: "W"
  };

  View.prototype.boardSize = function() {
    var height = $(window).height();
    var width = $(window).width();

    this.boardHeight = Math.floor(height / 60) - 1;
    this.boardWidth = Math.floor(width / 60);

  };

  View.prototype.setupGrid = function() {
    var $ul = $("<ul>").addClass("squares-container clearfix")
    $ul.css("width", this.boardWidth * 60);

    _.each(this.board.grid, function(index) {
      //hardcode to remove old classes
      var $li = $("<li>").attr("class","square");
      $li.attr("id", index);
      $ul.append($li)
    })

    this.$el.html($ul);

    this.renderSnake();
    this.renderCherry();
  };

  View.prototype.renderSnake = function() {
    _.each(this.board.snake.segments, function(id, index) {

      var $segment = this.$el.find("#" + id);
      $segment.addClass("trainer " + this.board.snake.dir)
    }.bind(this));
  };

  View.prototype.renderCherry = function() {
    var $cherry = this.$el.find("#" + this.board.cherry);
    $cherry.addClass("cherry");
  };

  View.prototype.animate1 = function() {
    _.each(this.board.snake.segments, function(id, index) {
      var $segment = this.$el.find("#" + id)
      $segment.removeClass("sprite-3");
    }.bind(this))
  };

  View.prototype.animate2 = function() {
    _.each(this.board.snake.segments, function(id, index) {
      var $segment = this.$el.find("#" + id)

      $segment.removeClass("sprite-1");
      $segment.addClass("sprite-2");
    }.bind(this))
  };

  View.prototype.animate3 = function() {
    _.each(this.board.snake.segments, function(id, index) {
      var $segment = this.$el.find("#" + id)
      $segment.removeClass("sprite-2");
      $segment.addClass("sprite-3");
    }.bind(this))
  };



  View.prototype.move = function() {

    // record old stuff
    var oldSegments = _.clone(this.board.snake.segments);
    var oldCherry = _.clone(this.board.cherry);

    this.board.snake.move();

    if (this.board.snake._gameOver) {
      this.endGame();
    }

    //get new stuff
    var newSegments = this.board.snake.segments;
    var newCherry = this.board.cherry;

    //update snake location
    this.updateClasses(oldSegments, newSegments);


    //update cherry location
    if (newCherry !== oldCherry) {
      this.toggleClasses([oldCherry, newCherry], "cherry");
      this.updateScore();
    }

    this.animate2Id = window.setTimeout(this.animate2.bind(this), 60);
    this.animate3Id = window.setTimeout(this.animate3.bind(this), 120);
    this.animate1Id = window.setTimeout(this.animate1.bind(this), 180);


  };

  View.prototype.updateScore = function() {
    this.score = this.score + 100;
    this.$score.html(this.score);

    // replace high score
    if (this.bestScore < this.score) {
      this.bestScore = this.score;
      this.$bestScore.html(this.bestScore);
    }

  };

  View.prototype.updateClasses = function(oldArr, newArr) {
    var toDelete = _.difference(oldArr, newArr);

    var toAdd = _.difference(newArr, oldArr);

    // delete all references to old class
    this.deleteClasses(toDelete);

    //update image rendering
    this.updateBackground(oldArr, newArr);

  };

  View.prototype.updateBackground = function(oldArr, newArr) {
    var oldHead = _.last(oldArr)
    var newHead = _.last(newArr)

    //put trainer and direction on new head
    this.$el.find("#" + newHead).addClass("trainer " + this.board.snake.dir)

    //if old head is becoming a pikachu...
    if (newArr.length > 1) {
      this.$el.find("#" + oldHead).removeClass("trainer");
      this.$el.find("#" + oldHead).addClass("pikachu")
    }

  };

  View.prototype.toggleClasses = function(arr, cssClass) {
    _.each(arr, function(id) {
      var $segment = this.$el.find("#" + id);
      $segment.toggleClass(cssClass);
    }.bind(this))
  };

  View.prototype.deleteClasses = function(arr) {
    _.each(arr, function(id) {
      var $segment = this.$el.find("#" + id);
      $segment.removeClass("pikachu trainer N S E W");
    }.bind(this))
  };

  View.prototype.handlePress = function(event) {
    var button = event.keyCode;
    var key = keys[button];
    var head = _.last(this.board.snake.segments)
    debugger;

    if (key && this.validPress(head) && this.validDir(key, this.board.snake.dir)) {
      this.headAtPress = head;
      this.board.snake.turn(key);
    }
  };

  View.prototype.validPress = function(head) {
    if (typeof this.headAtPress === "undefined") {
      return true;
    }

    return this.headAtPress !== head;
  };

  View.prototype.validDir = function(dir, otherDir) {

    if ((dir === "N" && otherDir === "S") || dir === "S" && otherDir === "N") {
      return false;
    }
    if ((dir === "E" && otherDir === "W") || dir === "W" && otherDir === "E") {
      return false;
    }
    return true;
  };

  View.prototype.clearBoard = function() {
    _.each(this.board.grid, function(id) {
      var $segment = this.$el.find("#" + id);
      $segment.attr("class", "square");
    }.bind(this))
  };

  View.prototype.endGame = function() {
    window.clearInterval(this.intervalId);

    $(window).off();

    $(".ending").removeClass("hidden");
    $(window).one("keydown", this.restartGame.bind(this));
    //
  };

  View.prototype.restartGame = function() {
    $(".ending").addClass("hidden");

    this.board = new Game.Board(this.boardWidth, this.boardHeight);
    this.setupGrid();

    this.startSequence();
  }





})();
