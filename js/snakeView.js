(function() {
  if (typeof window.Game === "undefined") {
    window.Game = {};
  }

  var View = Game.View = function($el) {
    this.$el = $el;
    this.board = new Game.Board();
    this.setupGrid();
  };

  View.prototype.bindKeys = function() {

  };

  View.prototype.setupGrid = function() {
    _.each(this.board.grid, function(item, index) {
      debugger;
    }
    this.$el.html("hi")
  };


})();
