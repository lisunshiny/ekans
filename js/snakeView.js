(function() {
  if (typeof window.Game === "undefined") {
    window.Game = {};
  }

  var View = Game.View = function($el) {
    this.$el = $el;
    this.board = new Game.Board();
    this.setupGrid();

    this.intervalId = window.setInterval(this.move.bind(this), 200);

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

      if (index === 0) {
        $segment.addClass("trainer")
      } else {
        $segment.addClass("pikachu")
      }
    }.bind(this));
  };

  View.prototype.renderCherry = function() {
    var $cherry = this.$el.find("#" + this.board.cherry);
    $cherry.addClass("cherry");
  };

  View.prototype.move = function() {

    // record old stuff
    var oldSegments = _.clone(this.board.snake.segments);
    var oldCherry = _.clone(this.board.cherry);

    this.board.snake.move();

    if (this.board.snake._gameOver) {
      this.endGame;
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
    var heads = _.last(newArr, 2)

    //remove trainer from old head and put on new
    this.toggleClasses(heads, "trainer")

    //add pikachu class to old head
    this.$el.find("#" + heads[0]).toggleClass("pikachu")

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
      $segment.removeClass("pikachu trainer");
    }.bind(this))
  }

  View.prototype.handlePress = function(event) {
    var button = event.keyCode;
    var key = keys[button];

    if (key) {
      console.log(key)
      this.board.snake.turn(key);
    }
  };

  View.prototype.endGame = function() {
    window.clearInterval(this.intervalId);
  }



})();
