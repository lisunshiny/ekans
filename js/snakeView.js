(function() {
  if (typeof window.Game === "undefined") {
    window.Game = {};
  }

  var View = Game.View = function($el) {
    this.$el = $el;
    this.board = new Game.Board();
    this.setupGrid();

    this.intervalId = window.setInterval(this.move.bind(this), 180);

    $(window).on("keydown", this.handlePress.bind(this))

  };

  var keys = View.KEYS = {
    38: "N",
    39: "E",
    40: "S",
    37: "W"
  };

  View.prototype.setupGrid = function() {
    var $ul = $("<ul>").addClass("squares-container clearfix")

    _.each(this.board.grid, function(item, index) {
      var $li = $("<li>").addClass("square");
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
    }

    this.animate2Id = window.setTimeout(this.animate2.bind(this), 60);
    this.animate3Id = window.setTimeout(this.animate3.bind(this), 120);
    this.animate1Id = window.setTimeout(this.animate1.bind(this), 180);


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
  }

  View.prototype.handlePress = function(event) {
    var button = event.keyCode;
    var key = keys[button];

    if (key) {
      this.board.snake.turn(key);
    }
  };

  View.prototype.endGame = function() {
    window.clearInterval(this.intervalId);
    $(window).off();
    View.prototype.deleteClasses(this.board.snake);
    alert("You lose :(. Refresh to try again!");

  };



})();
